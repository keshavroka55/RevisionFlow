// =============================================================================
// USER PROFILE TYPES — matches user.service.js getMyProfile select
// =============================================================================

export type UserRole = "USER" | "ADMIN";
export type SubscriptionPlan = "FREE" | "PREMIUM" | "STUDENT_PREMIUM";
export type SubscriptionStatus = "ACTIVE" | "CANCELLED" | "EXPIRED" | "TRIALING" | "PAST_DUE";

// ─── Sub-shapes returned inside getMyProfile ─────────────────────────────────

export interface UserSubscription {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
}

export interface UserProgressStats {
  totalNotes: number;
  masteredNotes: number;
  totalRevisions: number;
  avgTestScore: number;
}

export interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
}

export interface UserNotificationPreferences {
  emailRevisionReminders: boolean;
  emailStreakAlerts: boolean;
  reminderTimeHour: number;
  reminderTimeMinute: number;
  reminderTimezone: string;
}

export interface ProfileFolder {
  id: string;
  name: string;
  color: string;
  icon: string | null;
  description: string | null;
  sortOrder: number;
  createdAt: string;
}

export interface ProfileNote {
  id: string;
  title: string;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  mastery: "NEW" | "IN_PROGRESS" | "MASTERED";
  wordCount: number;
  createdAt: string;
  folder: { id: string; name: string };
}

// ─── Full profile — GET /api/users/me ────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  avatarUrl: string | null;
  role: UserRole;
  timezone: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;

  // relations (nullable — not set until data exists)
  subscription: UserSubscription | null;
  progressStats: UserProgressStats | null;
  streaks: UserStreak | null;
  notificationPrefs: UserNotificationPreferences | null;
  folders: ProfileFolder[];
  notes: ProfileNote[];
}

// ─── What PUT /api/users/me accepts ──────────────────────────────────────────

export interface UpdateProfileInput {
  name?: string;
  avatarUrl?: string;
  timezone?: string;
}

// ─── What PUT /api/users/me returns ──────────────────────────────────────────

export interface UpdatedProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  timezone: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateNotificationPreferencesInput {
  emailRevisionReminders?: boolean;
  emailStreakAlerts?: boolean;
  reminderTimeHour?: number;
  reminderTimeMinute?: number;
  reminderTimezone?: string;
}

// ─── API response wrappers ────────────────────────────────────────────────────

export interface ProfileResponse {
  profile: UserProfile;
}
