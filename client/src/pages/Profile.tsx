import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Clock,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  TrendingUp,
  FileText,
  Flame,
  Trophy,
  Edit2,
  Save,
  X,
  AlertCircle,
} from "lucide-react";
import { useUserStore, useUserLoading } from "../store/user.store";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const planColors: Record<string, string> = {
  FREE: "bg-gray-100 text-gray-600",
  PREMIUM: "bg-primary/10 text-primary",
  STUDENT_PREMIUM: "bg-accent/10 text-accent",
};

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  EXPIRED: "bg-red-100 text-red-700",
  TRIALING: "bg-yellow-100 text-yellow-700",
  PAST_DUE: "bg-orange-100 text-orange-700",
};

const timezones = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Profile() {
  const { profile, error, fetchProfile, updateProfile, clearError } = useUserStore();
  const isFetching = useUserLoading("user.fetchProfile");
  const isSaving = useUserLoading("user.updateProfile");

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    avatarUrl: "",
    timezone: "",
  });

  // Load profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name,
        avatarUrl: profile.avatarUrl ?? "",
        timezone: profile.timezone,
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile({
        name: form.name,
        avatarUrl: form.avatarUrl || undefined,
        timezone: form.timezone,
      });
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      // error is in store
    }
  };

  const handleCancel = () => {
    if (profile) {
      setForm({
        name: profile.name,
        avatarUrl: profile.avatarUrl ?? "",
        timezone: profile.timezone,
      });
    }
    setIsEditing(false);
    clearError();
  };

  // ─── Loading skeleton ────────────────────────────────────────────────────

  if (isFetching && !profile) {
    return (
      <div className="p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
        <div className="max-w-4xl mx-auto animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="h-4 bg-muted rounded w-72" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-xl" />
            ))}
          </div>
          <div className="h-64 bg-muted rounded-xl mt-4" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
          <p className="text-muted-foreground">Failed to load profile.</p>
          <button
            onClick={fetchProfile}
            className="mt-4 bg-primary text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = profile.progressStats;
  const streak = profile.streaks;
  const sub = profile.subscription;

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
      <div className="max-w-4xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground mt-1">Your account information and learning stats</p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        {/* ── Success Banner ── */}
        {saveSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700 text-sm">
            <CheckCircle className="w-4 h-4" />
            Profile updated successfully!
          </div>
        )}

        {/* ── Error Banner ── */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between text-red-700 text-sm">
            <span className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </span>
            <button onClick={clearError}><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Total Notes</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats?.totalNotes ?? 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-accent" />
              <span className="text-xs text-muted-foreground">Mastered</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats?.masteredNotes ?? 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-secondary" />
              <span className="text-xs text-muted-foreground">Revisions</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats?.totalRevisions ?? 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-muted-foreground">Day Streak</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{streak?.currentStreak ?? 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left — Profile Card ── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-5">Account Details</h2>

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {(isEditing ? form.avatarUrl : profile.avatarUrl) ? (
                    <img
                      src={isEditing ? form.avatarUrl : profile.avatarUrl!}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <User className="w-8 h-8 text-primary" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-lg">{profile.name}</p>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      profile.role === "ADMIN"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      <Shield className="w-3 h-3 inline mr-1" />
                      {profile.role}
                    </span>
                    {profile.emailVerified ? (
                      <span className="text-xs flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="text-xs flex items-center gap-1 text-orange-500">
                        <XCircle className="w-3 h-3" /> Unverified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Fields */}
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                  ) : (
                    <p className="px-4 py-2.5 bg-background rounded-lg text-foreground border border-border">
                      {profile.name}
                    </p>
                  )}
                </div>

                {/* Email — always read-only */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </label>
                  <p className="px-4 py-2.5 bg-muted/50 rounded-lg text-muted-foreground border border-border text-sm">
                    {profile.email}
                    <span className="ml-2 text-xs">(cannot be changed)</span>
                  </p>
                </div>

                {/* Timezone */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Timezone
                  </label>
                  {isEditing ? (
                    <select
                      value={form.timezone}
                      onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    >
                      {timezones.map((tz) => (
                        <option key={tz} value={tz}>{tz}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="px-4 py-2.5 bg-background rounded-lg text-foreground border border-border">
                      {profile.timezone}
                    </p>
                  )}
                </div>

                {/* Avatar URL */}
                {isEditing && (
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1.5">
                      Avatar URL (optional)
                    </label>
                    <input
                      type="text"
                      value={form.avatarUrl}
                      onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-3 mt-6 pt-4 border-t border-border">
                  <button
                    onClick={handleSave}
                    disabled={isSaving || !form.name.trim()}
                    className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 bg-muted text-foreground px-5 py-2.5 rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Right — Meta ── */}
          <div className="space-y-4">

            {/* Subscription */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="font-semibold text-foreground mb-3">Subscription</h3>
              {sub ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Plan</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${planColors[sub.plan] ?? "bg-gray-100 text-gray-600"}`}>
                      {sub.plan.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[sub.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {sub.status}
                    </span>
                  </div>
                  {sub.currentPeriodEnd && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Renews</span>
                      <span className="text-xs text-foreground">
                        {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No subscription</p>
              )}
            </div>

            {/* Streak */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" /> Streaks
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current</span>
                  <span className="font-bold text-orange-500">{streak?.currentStreak ?? 0} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Longest</span>
                  <span className="font-semibold text-foreground">{streak?.longestStreak ?? 0} days</span>
                </div>
                {streak?.lastActivityDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last active</span>
                    <span className="text-xs text-foreground">
                      {new Date(streak.lastActivityDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Account Meta */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="font-semibold text-foreground mb-3">Account</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Joined</span>
                  <span className="ml-auto text-xs text-foreground">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {profile.lastLoginAt && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Last login</span>
                    <span className="ml-auto text-xs text-foreground">
                      {new Date(profile.lastLoginAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Folders</span>
                  <span className="ml-auto text-xs text-foreground">{profile.folders.length}</span>
                </div>
              </div>
            </div>

            {/* Avg test score */}
            {stats && stats.avgTestScore > 0 && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                <h3 className="font-semibold text-foreground mb-1">Avg Test Score</h3>
                <p className="text-3xl font-bold text-primary">{stats.avgTestScore.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-1">across {stats.totalRevisions} revisions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
