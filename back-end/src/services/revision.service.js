// src/services/revision.service.js
import { prisma } from "../config/db.js";
import { createError } from "../middleware/errorHandler.js";
import {
    addDays,
    addMinutes,
    startOfDay,
    endOfDay,
    setTime,
} from "../utils/dateTime.js";

import { trackActivity } from "./activity.service.js";


const MAX_PER_SESSION = 5;

// ---------------------------------------------------------------------------
// Count revisions on a specific day for a user
// ---------------------------------------------------------------------------
const countRevisionsOnDate = async (userId, date) => {
    return prisma.revisionSchedule.count({
        where: {
            userId,
            status: "PENDING",
            scheduledAt: {
                gte: startOfDay(date),
                lte: endOfDay(date),
            },
        },
    });
};

// ---------------------------------------------------------------------------
// Resolve collisions for a single schedule
// ---------------------------------------------------------------------------
const resolveCollision = async (userId, schedule, depth = 0) => {
    // prevent infinite recursion
    if (depth > 7) return schedule;

    const count = await countRevisionsOnDate(userId, schedule.scheduledAt);

    if (count < MAX_PER_SESSION) {
        // session 1 fits fine
        schedule.sessionSlot = 1;
        schedule.sessionOrder = count + 1;

    } else if (count < MAX_PER_SESSION * 2) {
        // split into session 2 same day +30 min
        schedule.sessionSlot = 2;
        schedule.sessionOrder = count - MAX_PER_SESSION + 1;
        schedule.scheduledAt = addMinutes(schedule.scheduledAt, 30);

    } else {
        // too full — shift only DAY_14 and DAY_28
        if (["DAY_14", "DAY_28"].includes(schedule.stage)) {
            schedule.scheduledAt = addDays(schedule.scheduledAt, 1);
            // keep same time on next day
            return resolveCollision(userId, schedule, depth + 1);
        } else {
            // DAY_3 and DAY_7 — never shift, force session 2
            schedule.sessionSlot = 2;
            schedule.sessionOrder = count - MAX_PER_SESSION + 1;
            schedule.scheduledAt = addMinutes(schedule.scheduledAt, 30);
        }
    }

    return schedule;
};

// ---------------------------------------------------------------------------
// Auto-create 4 schedules when a note is created
// ---------------------------------------------------------------------------
export const createRevisionSchedules = async (noteId, userId) => {
    // get user's reminder time preference
    const prefs = await prisma.notificationPreference.findUnique({
        where: { userId },
    });

    const hour = prefs?.reminderTimeHour ?? 20;
    const minute = prefs?.reminderTimeMinute ?? 0;
    const now = new Date();

    const stages = [
        { stage: "DAY_3", days: 3 },
        { stage: "DAY_7", days: 7 },
        { stage: "DAY_14", days: 14 },
        { stage: "DAY_28", days: 28 },
    ];

    const schedules = [];

    for (const { stage, days } of stages) {
        // set date at user's revision time
        let scheduledAt = addDays(now, days);
        scheduledAt = setTime(scheduledAt, hour, minute);

        let schedule = {
            userId,
            noteId,
            stage,
            status: "PENDING",
            scheduledAt,
            sessionSlot: 1,
            sessionOrder: 1,
        };

        // resolve any collisions
        schedule = await resolveCollision(userId, schedule);
        schedules.push(schedule);
    }

    await prisma.revisionSchedule.createMany({ data: schedules });

    return schedules;
};

// ---------------------------------------------------------------------------
// Get all revision schedules for a user
// ---------------------------------------------------------------------------
export const getRevisionSchedules = async (userId, filter = {}) => {
    const { status, from, to } = filter;

    const where = {
        userId,
        ...(status && { status }),
        ...((from || to) && {
            scheduledAt: {
                ...(from && { gte: new Date(from) }),
                ...(to && { lte: new Date(to) }),
            },
        }),
    };

    return prisma.revisionSchedule.findMany({
        where,
        orderBy: [{ scheduledAt: "asc" }, { sessionSlot: "asc" }, { sessionOrder: "asc" }],
        include: {
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
};

// ---------------------------------------------------------------------------
// Get today's revisions grouped by session
// ---------------------------------------------------------------------------
export const getTodayRevisions = async (userId) => {
    const now = new Date();

    const schedules = await prisma.revisionSchedule.findMany({
        where: {
            userId,
            status: { in: ["PENDING", "OVERDUE"] },
            scheduledAt: {
                gte: startOfDay(now),
                lte: endOfDay(now),
            },
        },
        orderBy: [{ sessionSlot: "asc" }, { sessionOrder: "asc" }],
        include: {
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

    // group by session slot
    const session1 = schedules.filter((s) => s.sessionSlot === 1);
    const session2 = schedules.filter((s) => s.sessionSlot === 2);

    return {
        total: schedules.length,
        session1: { count: session1.length, schedules: session1 },
        session2: { count: session2.length, schedules: session2 },
    };
};

// ---------------------------------------------------------------------------
// Get upcoming revisions (next 7 days)
// ---------------------------------------------------------------------------
export const getUpcomingRevisions = async (userId) => {
    const now = new Date();
    const next7days = addDays(now, 7);

    const schedules = await prisma.revisionSchedule.findMany({
        where: {
            userId,
            status: "PENDING",
            scheduledAt: {
                gte: now,
                lte: next7days,
            },
        },
        orderBy: { scheduledAt: "asc" },
        include: {
            note: {
                select: { id: true, title: true, mastery: true },
            },
        },
    });

    // group by date
    const grouped = schedules.reduce((acc, schedule) => {
        const dateKey = schedule.scheduledAt.toDateString();
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(schedule);
        return acc;
    }, {});

    return grouped;
};

// ---------------------------------------------------------------------------
// Complete revision
// ---------------------------------------------------------------------------
export const completeRevision = async (scheduleId, userId) => {
    const schedule = await prisma.revisionSchedule.findFirst({
        where: { id: scheduleId, userId },
    });
    if (!schedule) throw createError("Schedule not found", 404);
    if (schedule.status === "COMPLETED") {
        throw createError("Already completed", 400);
    }

    const updated = await prisma.revisionSchedule.update({
        where: { id: scheduleId },
        data: { status: "COMPLETED", completedAt: new Date() },
    });

    // update note lastRevisedAt
    await prisma.note.update({
        where: { id: schedule.noteId },
        data: { lastRevisedAt: new Date() },
    });

    // update progress stats
    await prisma.userProgressStats.upsert({
        where: { userId },
        update: { totalRevisions: { increment: 1 } },
        create: { userId, totalRevisions: 1 },
    });
    await trackActivity(userId, "revisionsCount");
    return updated;
};

// ---------------------------------------------------------------------------
// Skip revision
// ---------------------------------------------------------------------------
export const skipRevision = async (scheduleId, userId) => {
    const schedule = await prisma.revisionSchedule.findFirst({
        where: { id: scheduleId, userId },
    });
    if (!schedule) throw createError("Schedule not found", 404);

    return prisma.revisionSchedule.update({
        where: { id: scheduleId },
        data: { status: "SKIPPED", skippedAt: new Date() },
    });
};

// ---------------------------------------------------------------------------
// Update revision time — reschedule all PENDING revisions
// ---------------------------------------------------------------------------
export const updateRevisionTime = async (userId, hour, minute) => {
    const pending = await prisma.revisionSchedule.findMany({
        where: { userId, status: "PENDING" },
    });

    // update each to new time keeping same date
    await prisma.$transaction(
        pending.map((s) => {
            const newTime = setTime(s.scheduledAt, hour, minute);
            return prisma.revisionSchedule.update({
                where: { id: s.id },
                data: { scheduledAt: newTime },
            });
        })
    );

    // save new preference
    await prisma.notificationPreference.upsert({
        where: { userId },
        update: { reminderTimeHour: hour, reminderTimeMinute: minute },
        create: {
            userId,
            emailRevisionReminders: true,
            emailStreakAlerts: true,
            reminderTimeHour: hour,
            reminderTimeMinute: minute,
            reminderTimezone: "UTC",
        },
    });

    return { updated: pending.length };
};

// ---------------------------------------------------------------------------
// Mark overdue — run by cron midnight
// ---------------------------------------------------------------------------
export const markOverdueRevisions = async () => {
    const now = new Date();
    const result = await prisma.revisionSchedule.updateMany({
        where: { status: "PENDING", scheduledAt: { lt: now } },
        data: { status: "OVERDUE" },
    });
    console.log(`[CRON] Marked ${result.count} revisions as overdue`);
    return result;
};