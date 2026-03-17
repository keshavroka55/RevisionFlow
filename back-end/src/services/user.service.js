import prisma from "../prisma.js";

/**
 * Get current user's full profile with related data
 */
export const getMyProfile = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      avatarUrl: true,
      role: true,
      timezone: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
      // Relations
      subscription: {
        select: {
          id: true,
          plan: true,
          status: true,
          currentPeriodEnd: true,
        },
      },
      folders: {
        where: { deletedAt: null },
        select: {
          id: true,
          name: true,
          color: true,
          icon: true,
          description: true,
          sortOrder: true,
          createdAt: true,
        },
      },
      notes: {
        where: { deletedAt: null },
        select: {
          id: true,
          title: true,
          status: true,
          mastery: true,
          wordCount: true,
          createdAt: true,
          folder: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      progressStats: {
        select: {
          totalNotes: true,
          masteredNotes: true,
          totalRevisions: true,
          avgTestScore: true,
        },
      },
      streaks: {
        select: {
          currentStreak: true,
          longestStreak: true,
          lastActivityDate: true,
        },
      },
      notificationPrefs: {
        select: {
          emailRevisionReminders: true,
          emailStreakAlerts: true,
          reminderTimeHour: true,
          reminderTimeMinute: true,
          reminderTimezone: true,
        },
      },
    },
  });
};

/**
 * Get any user's public profile by ID
 */
export const getUserById = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      role: true,
      createdAt: true,
      // Public relations
      folders: {
        where: { deletedAt: null },
        select: {
          id: true,
          name: true,
          color: true,
          icon: true,
          description: true,
        },
      },
      notes: {
        where: { 
          deletedAt: null,
          status: "ACTIVE", // Only show active notes publicly
        },
        select: {
          id: true,
          title: true,
          mastery: true,
          wordCount: true,
          createdAt: true,
        },
      },
      progressStats: {
        select: {
          totalNotes: true,
          masteredNotes: true,
          totalRevisions: true,
          avgTestScore: true,
        },
      },
      streaks: {
        select: {
          currentStreak: true,
          longestStreak: true,
        },
      },
    },
  });
};

/**
 * Update user profile
 */
export const updateMyProfile = async (userId, data) => {
  const updateData = {};

  // Only update fields that are provided
  if (data.name !== undefined) updateData.name = data.name;
  if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;
  if (data.timezone !== undefined) updateData.timezone = data.timezone;

  return prisma.user.update({
    where: { id: userId },
    data: {
      ...updateData,
      updatedAt: new Date(),
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      timezone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

/**
 * Update current user's notification preferences
 */
export const updateMyNotificationPreferences = async (userId, data) => {
  const updateData = {};

  if (data.emailRevisionReminders !== undefined) {
    updateData.emailRevisionReminders = data.emailRevisionReminders;
  }
  if (data.emailStreakAlerts !== undefined) {
    updateData.emailStreakAlerts = data.emailStreakAlerts;
  }
  if (data.reminderTimezone !== undefined) {
    updateData.reminderTimezone = data.reminderTimezone;
  }
  if (data.reminderTimeHour !== undefined) {
    updateData.reminderTimeHour = data.reminderTimeHour;
  }
  if (data.reminderTimeMinute !== undefined) {
    updateData.reminderTimeMinute = data.reminderTimeMinute;
  }

  return prisma.notificationPreference.upsert({
    where: { userId },
    update: updateData,
    create: {
      userId,
      emailRevisionReminders: data.emailRevisionReminders ?? true,
      emailStreakAlerts: data.emailStreakAlerts ?? true,
      reminderTimeHour: data.reminderTimeHour ?? 9,
      reminderTimeMinute: data.reminderTimeMinute ?? 0,
      reminderTimezone: data.reminderTimezone ?? "UTC",
    },
    select: {
      emailRevisionReminders: true,
      emailStreakAlerts: true,
      reminderTimeHour: true,
      reminderTimeMinute: true,
      reminderTimezone: true,
    },
  });
};

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (skip = 0, take = 10) => {
  return prisma.user.findMany({
    where: { deletedAt: null },
    skip,
    take,
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      role: true,
      avatarUrl: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
      subscription: {
        select: {
          plan: true,
          status: true,
        },
      },
      progressStats: {
        select: {
          totalNotes: true,
          totalRevisions: true,
        },
      },
    },
  });
};

/**
 * Update user role (admin only)
 */
export const updateUserRole = async (userId, role) => {
  if (!["USER", "ADMIN"].includes(role)) {
    throw new Error("Invalid role");
  }

  return prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};

/**
 * Soft delete user (admin only)
 */
export const deleteUser = async (userId) => {
  return prisma.user.update({
    where: { id: userId },
    data: { deletedAt: new Date() },
    select: {
      id: true,
      name: true,
      email: true,
      deletedAt: true,
    },
  });
};

/**
 * Update last login timestamp
 */
export const updateLastLogin = async (userId) => {
  return prisma.user.update({
    where: { id: userId },
    data: { lastLoginAt: new Date() },
    select: { id: true, lastLoginAt: true },
  });
};
