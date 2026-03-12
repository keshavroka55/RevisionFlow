import { useEffect } from "react";
import { FileText, Calendar, TrendingUp, Clock, CheckCircle, BookOpen, Flame, User, Mail } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useDashboardStore } from "../store/dashboard.store";
import { useAuthStore } from "../store/auth.store";
import { useUserStore, useUserLoading } from "../store/user.store";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const stageBadge: Record<string, string> = {
  DAY_3:  "bg-red-100 text-red-600",
  DAY_7:  "bg-orange-100 text-orange-600",
  DAY_14: "bg-yellow-100 text-yellow-600",
  DAY_28: "bg-green-100 text-green-600",
};

const masteryColor: Record<string, string> = {
  NEW:         "bg-gray-200",
  IN_PROGRESS: "bg-yellow-400",
  MASTERED:    "bg-green-500",
};

// ---------------------------------------------------------------------------
// Stat Card
// ---------------------------------------------------------------------------
const StatCard = ({ icon, value, label, bgColor, iconColor }: any) => (
  <div className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`${bgColor} w-12 h-12 rounded-lg flex items-center justify-center`}>
        {icon}
      </div>
      <span className="text-2xl font-bold text-foreground">{value}</span>
    </div>
    <h3 className="text-sm text-muted-foreground">{label}</h3>
  </div>
);

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------
const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
export default function Dashboard() {
  const { user } = useAuthStore();
  const { profile, fetchProfile } = useUserStore();
  const isProfileLoading = useUserLoading("user.fetchProfile");
  const {
    dashboard,
    todayRevisions,
    isLoading,
    fetchDashboard,
    fetchTodayRevisions,
    completeRevision,
    skipRevision,
  } = useDashboardStore();

  useEffect(() => {
    fetchDashboard();
    fetchTodayRevisions();
    fetchProfile();
  }, []);

  const firstName =
    profile?.name?.split(" ")[0] || user?.name?.split(" ")[0] || "there";

  const allTodayRevisions = [
    ...(todayRevisions?.session1?.schedules ?? []),
    ...(todayRevisions?.session2?.schedules ?? []),
  ];

  // build weekly chart from weeklySummary + revisionCompletion
  const weeklyChartData = dashboard?.revisionCompletion?.map((r) => ({
    day: r.stage.replace("_", " "),
    revisions: r.COMPLETED,
    skipped: r.SKIPPED,
  })) ?? [];

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, {firstName} 👋
        </h1>
        <p className="text-muted-foreground">
          {profile?.timezone
            ? `Timezone: ${profile.timezone} · Here's your learning progress for today`
            : "Here's your learning progress for today"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32" />)
        ) : (
          <>
            <StatCard
              icon={<FileText className="w-6 h-6 text-primary" />}
              value={dashboard?.progressStats?.totalNotes ?? 0}
              label="Total Notes"
              bgColor="bg-primary/10"
            />
            <StatCard
              icon={<CheckCircle className="w-6 h-6 text-accent" />}
              value={dashboard?.weeklySummary?.totalRevisions ?? 0}
              label="Revisions This Week"
              bgColor="bg-accent/10"
            />
            <StatCard
              icon={<Calendar className="w-6 h-6 text-warning" />}
              value={dashboard?.upcomingRevisions?.next7Days ?? 0}
              label="Upcoming (7 days)"
              bgColor="bg-warning/10"
            />
            <StatCard
              icon={<TrendingUp className="w-6 h-6 text-secondary" />}
              value={`${Math.round(dashboard?.progressStats?.avgTestScore ?? 0)}%`}
              label="Avg Test Score"
              bgColor="bg-secondary/10"
            />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">

        {/* Left — main content */}
        <div className="lg:col-span-2 space-y-6">

          {/* Today's Revisions */}
          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Today's Revisions</h2>
              <span className="text-sm text-muted-foreground">
                {todayRevisions?.total ?? 0} pending
              </span>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-20" />)}
              </div>
            ) : allTodayRevisions.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">All caught up!</h3>
                <p className="text-sm text-muted-foreground">No revisions due today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allTodayRevisions.map((revision) => (
                  <div
                    key={revision.id}
                    className="border border-border rounded-lg p-4 hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{revision.note.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${stageBadge[revision.stage] ?? "bg-gray-100"}`}>
                            {revision.stage.replace("_", " ")}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {revision.note.folder?.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Session {revision.sessionSlot}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => skipRevision(revision.id)}
                          className="border border-border text-muted-foreground px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                        >
                          Skip
                        </button>
                        <button
                          onClick={() => completeRevision(revision.id)}
                          className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition-colors"
                        >
                          Done ✓
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Weekly Chart */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Revision Completion by Stage</h2>
            {isLoading ? (
              <Skeleton className="h-64" />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="day" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="revisions" name="Completed" fill="#4F46E5" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="skipped" name="Skipped" fill="#E5E7EB" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Mastery Breakdown */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Mastery Breakdown</h2>
            {isLoading ? (
              <Skeleton className="h-24" />
            ) : (
              <div className="space-y-4">
                {Object.entries(dashboard?.masteryBreakdown ?? {})
                  .filter(([key]) => ["NEW", "IN_PROGRESS", "MASTERED"].includes(key))
                  .map(([key, val]: any) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-foreground font-medium">
                          {key.replace("_", " ")}
                        </span>
                        <span className="text-muted-foreground">{val.count} notes ({val.percent}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${masteryColor[key]}`}
                          style={{ width: `${val.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">

          {/* Profile Snapshot */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile Snapshot
            </h3>
            {isProfileLoading && !profile ? (
              <Skeleton className="h-24" />
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{profile?.email ?? user?.email ?? "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role</span>
                  <span className="font-medium text-foreground">{profile?.role ?? user?.role ?? "USER"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium text-foreground">{profile?.subscription?.plan ?? "FREE"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium text-foreground">
                    {profile?.emailVerified ? "Verified" : "Unverified"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Next Revision */}
          <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Upcoming</h3>
                <p className="text-sm text-white/80">Next 7 days</p>
              </div>
            </div>
            <p className="text-sm text-white/90 mb-4">
              You have{" "}
              <strong>{dashboard?.upcomingRevisions?.next7Days ?? 0} revisions</strong>{" "}
              scheduled in the next 7 days
            </p>
            <div className="space-y-1">
              {dashboard?.upcomingRevisions?.byStage?.map((s) => (
                <div key={s.stage} className="flex justify-between text-sm text-white/80">
                  <span>{s.stage.replace("_", " ")}</span>
                  <span>{s.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Streak */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Study Streak
            </h3>
            {isLoading ? (
              <Skeleton className="h-24" />
            ) : (
              <>
                <div className="text-center py-4">
                  <div className="text-5xl font-bold text-primary mb-2">
                    {dashboard?.streak?.currentStreak ?? 0}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {dashboard?.streak?.isAlive ? "Days in a row 🔥" : "Start your streak today!"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Longest: {dashboard?.streak?.longestStreak ?? 0} days
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Weekly Summary */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">This Week</h3>
            {isLoading ? (
              <Skeleton className="h-32" />
            ) : (
              <div className="space-y-3">
                {[
                  { label: "Revisions done",     value: dashboard?.weeklySummary?.totalRevisions ?? 0 },
                  { label: "Notes created",       value: dashboard?.weeklySummary?.totalNotes ?? 0 },
                  { label: "Tests completed",     value: dashboard?.weeklySummary?.totalTests ?? 0 },
                  { label: "Flashcards reviewed", value: dashboard?.weeklySummary?.totalFlashcards ?? 0 },
                  { label: "Active days",         value: `${dashboard?.weeklySummary?.activeDays ?? 0}/7` },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-semibold text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mastered notes count */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Progress</h3>
            {isLoading ? (
              <Skeleton className="h-16" />
            ) : (
              <>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Notes mastered</span>
                  <span className="font-semibold">
                    {dashboard?.progressStats?.masteredNotes ?? 0} / {dashboard?.progressStats?.totalNotes ?? 0}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-green-500 transition-all"
                    style={{
                      width: `${
                        dashboard?.progressStats?.totalNotes
                          ? Math.round(
                              (dashboard.progressStats.masteredNotes /
                                dashboard.progressStats.totalNotes) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}