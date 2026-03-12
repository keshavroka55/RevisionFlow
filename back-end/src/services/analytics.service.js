import { prisma } from "../config/db.js";
import { startOfDay } from "../utils/dateTime.js";
import { getStreak } from "./streak.service.js";
import { getActivityHistory, getWeeklySummary } from "./activity.service.js";

// ---------------------------------------------------------------------------
// Main dashboard — everything in one call
// ---------------------------------------------------------------------------
export const getDashboardStats = async (userId) => {
  const [
    progressStats,
    streak,
    weeklySummary,
    masteryBreakdown,
    revisionCompletion,
    recentTestScores,
    upcomingRevisions,
  ] = await Promise.all([
    getProgressStats(userId),
    getStreak(userId),
    getWeeklySummary(userId),
    getMasteryBreakdown(userId),
    getRevisionCompletion(userId),
    getRecentTestScores(userId),
    getUpcomingCount(userId),
  ]);

  return {
    progressStats,
    streak,
    weeklySummary,
    masteryBreakdown,
    revisionCompletion,
    recentTestScores,
    upcomingRevisions,
  };
};

// ---------------------------------------------------------------------------
// Progress stats — totals
// ---------------------------------------------------------------------------
const getProgressStats = async (userId) => {
  return prisma.userProgressStats.findUnique({
    where: { userId },
    select: {
      totalNotes: true,
      masteredNotes: true,
      totalRevisions: true,
      totalFlashcards: true,
      totalTestsTaken: true,
      avgTestScore: true,
    },
  });
};

// ---------------------------------------------------------------------------
// Mastery breakdown — pie chart data
// ---------------------------------------------------------------------------
const getMasteryBreakdown = async (userId) => {
  const notes = await prisma.note.groupBy({
    by: ["mastery"],
    where: { userId, deletedAt: null },
    _count: { mastery: true },
  });

  // ensure all 3 levels always present
  const map = { NEW: 0, IN_PROGRESS: 0, MASTERED: 0 };
  notes.forEach((n) => { map[n.mastery] = n._count.mastery; });

  const total = Object.values(map).reduce((s, v) => s + v, 0);

  return {
    NEW:         { count: map.NEW,         percent: total ? Math.round((map.NEW / total) * 100) : 0 },
    IN_PROGRESS: { count: map.IN_PROGRESS, percent: total ? Math.round((map.IN_PROGRESS / total) * 100) : 0 },
    MASTERED:    { count: map.MASTERED,    percent: total ? Math.round((map.MASTERED / total) * 100) : 0 },
    total,
  };
};

// ---------------------------------------------------------------------------
// Revision completion rate — bar chart data
// ---------------------------------------------------------------------------
const getRevisionCompletion = async (userId) => {
  const schedules = await prisma.revisionSchedule.groupBy({
    by: ["stage", "status"],
    where: { userId },
    _count: { status: true },
  });

  const stages = ["DAY_3", "DAY_7", "DAY_14", "DAY_28"];
  const statuses = ["PENDING", "COMPLETED", "SKIPPED", "OVERDUE"];

  const result = stages.map((stage) => {
    const row = { stage };
    statuses.forEach((status) => {
      const found = schedules.find(
        (s) => s.stage === stage && s.status === status
      );
      row[status] = found?._count.status ?? 0;
    });

    const total = statuses.reduce((s, st) => s + (row[st] ?? 0), 0);
    row.completionRate = total
      ? Math.round((row.COMPLETED / total) * 100)
      : 0;

    return row;
  });

  return result;
};

// ---------------------------------------------------------------------------
// Recent test scores — line chart data
// ---------------------------------------------------------------------------
const getRecentTestScores = async (userId, limit = 10) => {
  const attempts = await prisma.mockTestAttempt.findMany({
    where: { userId, completedAt: { not: null } },
    orderBy: { completedAt: "desc" },
    take: limit,
    select: {
      score: true,
      correctAnswers: true,
      totalQuestions: true,
      completedAt: true,
      test: { select: { title: true } },
    },
  });

  return attempts.reverse().map((a) => ({
    date: a.completedAt?.toISOString().split("T")[0],
    score: Math.round(a.score),
    correct: a.correctAnswers,
    total: a.totalQuestions,
    testTitle: a.test.title,
  }));
};

// ---------------------------------------------------------------------------
// Upcoming revision count
// ---------------------------------------------------------------------------
const getUpcomingCount = async (userId) => {
  const today = startOfDay(new Date());
  const next7 = new Date(today);
  next7.setDate(next7.getDate() + 7);

  const counts = await prisma.revisionSchedule.groupBy({
    by: ["stage"],
    where: {
      userId,
      status: "PENDING",
      scheduledAt: { gte: today, lte: next7 },
    },
    _count: { stage: true },
  });

  return {
    next7Days: counts.reduce((s, c) => s + c._count.stage, 0),
    byStage: counts.map((c) => ({ stage: c.stage, count: c._count.stage })),
  };
};

// ---------------------------------------------------------------------------
// Activity heatmap — last 90 days
// ---------------------------------------------------------------------------
export const getActivityHeatmap = async (userId) => {
  return getActivityHistory(userId, 90);
};

// ---------------------------------------------------------------------------
// Folder insights — notes + mastery per folder
// ---------------------------------------------------------------------------
export const getFolderInsights = async (userId) => {
  const folders = await prisma.folder.findMany({
    where: { userId, deletedAt: null },
    include: {
      notes: {
        where: { deletedAt: null },
        select: { mastery: true },
      },
    },
  });

  return folders.map((f) => {
    const total = f.notes.length;
    const mastered = f.notes.filter((n) => n.mastery === "MASTERED").length;
    const inProgress = f.notes.filter((n) => n.mastery === "IN_PROGRESS").length;

    return {
      folderId: f.id,
      folderName: f.name,
      color: f.color,
      totalNotes: total,
      mastered,
      inProgress,
      newNotes: total - mastered - inProgress,
      masteryPercent: total ? Math.round((mastered / total) * 100) : 0,
    };
  });
};