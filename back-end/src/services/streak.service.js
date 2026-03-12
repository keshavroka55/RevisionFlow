import { prisma } from "../config/db.js";
import { startOfDay } from "../utils/dateTime.js";

// ---------------------------------------------------------------------------
// Update streak — call this whenever user completes any activity
// ---------------------------------------------------------------------------
export const updateStreak = async (userId) => {
  const today = startOfDay(new Date());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const streak = await prisma.userStreak.findUnique({
    where: { userId },
  });

  if (!streak) {
    // first ever activity
    return prisma.userStreak.create({
      data: {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: today,
      },
    });
  }

  const lastActivity = streak.lastActivityDate
    ? startOfDay(new Date(streak.lastActivityDate))
    : null;

  // already updated today — skip
  if (lastActivity && lastActivity.getTime() === today.getTime()) {
    return streak;
  }

  // continued streak — last activity was yesterday
  const isContinued =
    lastActivity && lastActivity.getTime() === yesterday.getTime();

  const newStreak = isContinued ? streak.currentStreak + 1 : 1;
  const longestStreak = Math.max(newStreak, streak.longestStreak);

  return prisma.userStreak.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      longestStreak,
      lastActivityDate: today,
    },
  });
};

// ---------------------------------------------------------------------------
// Get streak info
// ---------------------------------------------------------------------------
export const getStreak = async (userId) => {
  const streak = await prisma.userStreak.findUnique({
    where: { userId },
  });

  if (!streak) return { currentStreak: 0, longestStreak: 0, lastActivityDate: null };

  // check if streak is still alive
  const today = startOfDay(new Date());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastActivity = streak.lastActivityDate
    ? startOfDay(new Date(streak.lastActivityDate))
    : null;

  const isAlive =
    lastActivity &&
    (lastActivity.getTime() === today.getTime() ||
      lastActivity.getTime() === yesterday.getTime());

  return {
    currentStreak: isAlive ? streak.currentStreak : 0,
    longestStreak: streak.longestStreak,
    lastActivityDate: streak.lastActivityDate,
    isAlive: !!isAlive,
  };
};