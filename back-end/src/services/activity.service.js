import { prisma } from "../config/db.js";
import { startOfDay } from "../utils/dateTime.js";
import { updateStreak } from "./streak.service.js";

// ---------------------------------------------------------------------------
// Core — increment a specific activity count for today
// Call this from other services when user does something
// ---------------------------------------------------------------------------
export const trackActivity = async (userId, field) => {
  const today = startOfDay(new Date());

  await prisma.dailyActivity.upsert({
    where: { userId_date: { userId, date: today } },
    update: { [field]: { increment: 1 } },
    create: { userId, date: today, [field]: 1 },
  });

  // update streak on any activity
  await updateStreak(userId);
};

// ---------------------------------------------------------------------------
// Get activity for last N days (for heatmap/chart)
// ---------------------------------------------------------------------------
export const getActivityHistory = async (userId, days = 30) => {
  const from = new Date();
  from.setDate(from.getDate() - days);

  const activities = await prisma.dailyActivity.findMany({
    where: {
      userId,
      date: { gte: from },
    },
    orderBy: { date: "asc" },
  });

  // fill missing days with zeros
  const result = [];
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = startOfDay(date).toISOString().split("T")[0];

    const found = activities.find(
      (a) => a.date.toISOString().split("T")[0] === dateStr
    );

    result.push({
      date: dateStr,
      revisionsCount: found?.revisionsCount ?? 0,
      notesCreated: found?.notesCreated ?? 0,
      testsCompleted: found?.testsCompleted ?? 0,
      flashcardsReviewed: found?.flashcardsReviewed ?? 0,
      total:
        (found?.revisionsCount ?? 0) +
        (found?.notesCreated ?? 0) +
        (found?.testsCompleted ?? 0) +
        (found?.flashcardsReviewed ?? 0),
    });
  }

  return result;
};

// ---------------------------------------------------------------------------
// Get weekly summary
// ---------------------------------------------------------------------------
export const getWeeklySummary = async (userId) => {
  const from = new Date();
  from.setDate(from.getDate() - 7);

  const activities = await prisma.dailyActivity.findMany({
    where: { userId, date: { gte: from } },
  });

  return {
    totalRevisions: activities.reduce((s, a) => s + a.revisionsCount, 0),
    totalNotes: activities.reduce((s, a) => s + a.notesCreated, 0),
    totalTests: activities.reduce((s, a) => s + a.testsCompleted, 0),
    totalFlashcards: activities.reduce((s, a) => s + a.flashcardsReviewed, 0),
    activeDays: activities.filter((a) => (
      a.revisionsCount + a.notesCreated + a.testsCompleted + a.flashcardsReviewed > 0
    )).length,
  };
};