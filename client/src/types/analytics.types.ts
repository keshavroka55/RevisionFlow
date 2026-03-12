export type ProgressStats = {
  totalNotes: number;
  masteredNotes: number;
  totalRevisions: number;
  totalFlashcards: number;
  totalTestsTaken: number;
  avgTestScore: number;
};

export type Streak = {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  isAlive: boolean;
};

export type WeeklySummary = {
  totalRevisions: number;
  totalNotes: number;
  totalTests: number;
  totalFlashcards: number;
  activeDays: number;
};

export type MasteryBreakdown = {
  NEW:         { count: number; percent: number };
  IN_PROGRESS: { count: number; percent: number };
  MASTERED:    { count: number; percent: number };
  total: number;
};

export type RevisionCompletion = {
  stage: string;
  COMPLETED: number;
  SKIPPED: number;
  OVERDUE: number;
  PENDING: number;
  completionRate: number;
};

export type TestScore = {
  date: string;
  score: number;
  correct: number;
  total: number;
  testTitle: string;
};

export type UpcomingRevisions = {
  next7Days: number;
  byStage: { stage: string; count: number }[];
};

export type TodayRevision = {
  id: string;
  stage: string;
  status: string;
  scheduledAt: string;
  sessionSlot: number;
  sessionOrder: number;
  note: {
    id: string;
    title: string;
    mastery: string;
    folder: { name: string; color: string };
  };
};

export type FolderInsight = {
  folderId: string;
  folderName: string;
  color: string;
  totalNotes: number;
  mastered: number;
  inProgress: number;
  newNotes: number;
  masteryPercent: number;
};

export type DashboardData = {
  progressStats: ProgressStats;
  streak: Streak;
  weeklySummary: WeeklySummary;
  masteryBreakdown: MasteryBreakdown;
  revisionCompletion: RevisionCompletion[];
  recentTestScores: TestScore[];
  upcomingRevisions: UpcomingRevisions;
};