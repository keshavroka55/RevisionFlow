// src/jobs/reminder.cron.js
import cron from "node-cron";
import { prisma } from "../config/db.js";
import { markOverdueRevisions } from "../services/revision.service.js";
import { sendMorningDigest, sendUpcomingReminder } from "../services/email.service.js";
import { startOfDay, endOfDay, isWithinMinutes } from "../utils/dateTime.js";

// ---------------------------------------------------------------------------
// Helper — get users with revisions today
// ---------------------------------------------------------------------------
const getUsersWithTodayRevisions = async () => {
  const now = new Date();

  const schedules = await prisma.revisionSchedule.findMany({
    where: {
      status: { in: ["PENDING", "OVERDUE"] },
      scheduledAt: {
        gte: startOfDay(now),
        lte: endOfDay(now),
      },
      note: { deletedAt: null },
      user: { isActive: true, deletedAt: null },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          notificationPrefs: true,
        },
      },
      note: {
        select: {
          id: true,
          title: true,
          mastery: true,
          folder: { select: { name: true, color: true } },
        },
      },
    },
  });

  // group by user
  return schedules.reduce((acc, s) => {
    const uid = s.user.id;
    if (!acc[uid]) acc[uid] = { user: s.user, schedules: [] };
    acc[uid].schedules.push(s);
    return acc;
  }, {});
};

// ---------------------------------------------------------------------------
// Job 1 — Morning digest at 9:00 AM every day
// ---------------------------------------------------------------------------
const runMorningDigest = async () => {
  console.log("[CRON] Running morning digest job...");

  const grouped = await getUsersWithTodayRevisions();

  for (const { user, schedules } of Object.values(grouped)) {
    if (!user.notificationPrefs?.emailRevisionReminders) continue;

    try {
      await sendMorningDigest({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        schedules,
        hour: user.notificationPrefs.reminderTimeHour,
        minute: user.notificationPrefs.reminderTimeMinute ?? 0,
      });
    } catch (err) {
      console.error(`[CRON] Morning digest failed for ${user.email}:`, err.message);
    }
  }

  console.log(`[CRON] Morning digest done — ${Object.keys(grouped).length} users`);
};

// ---------------------------------------------------------------------------
// Job 2 — 15 min warning — runs every minute, checks time
// ---------------------------------------------------------------------------
const runUpcomingReminder = async () => {
  const now = new Date();

  // find all users whose revision time is 15 minutes from now
  const prefs = await prisma.notificationPreference.findMany({
    where: { emailRevisionReminders: true },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          isActive: true,
          deletedAt: true,
        },
      },
    },
  });

  for (const pref of prefs) {
    if (!pref.user.isActive || pref.user.deletedAt) continue;

    // build today's revision time for this user
    const revisionTime = new Date();
    revisionTime.setHours(pref.reminderTimeHour, pref.reminderTimeMinute ?? 0, 0, 0);

    // check if revision time is within next 15 minutes
    if (!isWithinMinutes(revisionTime, 15)) continue;

    // check already sent reminder today (avoid duplicate)
    const alreadySent = await prisma.emailLog.findFirst({
      where: {
        userId: pref.userId,
        type: "REVISION_REMINDER",
        subject: { contains: "15 minutes" },
        sentAt: { gte: startOfDay(now) },
      },
    });

    if (alreadySent) continue;

    // get today's pending revisions
    const schedules = await prisma.revisionSchedule.findMany({
      where: {
        userId: pref.userId,
        status: { in: ["PENDING", "OVERDUE"] },
        scheduledAt: {
          gte: startOfDay(now),
          lte: endOfDay(now),
        },
      },
      include: {
        note: { select: { id: true, title: true } },
      },
    });

    if (schedules.length === 0) continue;

    try {
      await sendUpcomingReminder({
        userId: pref.userId,
        userName: pref.user.name,
        userEmail: pref.user.email,
        schedules,
        hour: pref.reminderTimeHour,
        minute: pref.reminderTimeMinute ?? 0,
      });
    } catch (err) {
      console.error(`[CRON] 15-min reminder failed for ${pref.user.email}:`, err.message);
    }
  }
};

// ---------------------------------------------------------------------------
// Job 3 — Midnight cleanup
// ---------------------------------------------------------------------------
const runMidnightCleanup = async () => {
  console.log("[CRON] Running midnight cleanup...");
  await markOverdueRevisions();
  console.log("[CRON] Midnight cleanup done");
};

// ---------------------------------------------------------------------------
// Start all cron jobs
// ---------------------------------------------------------------------------
export const startReminderCron = () => {
  // Job 1 — 9:00 AM daily
  cron.schedule("0 9 * * *", runMorningDigest);

  // Job 2 — every minute (checks for 15-min warning)
  cron.schedule("* * * * *", runUpcomingReminder);

  // Job 3 — midnight cleanup
  cron.schedule("0 0 * * *", runMidnightCleanup);

  console.log("✅ All cron jobs started");
};