export type RevisionStatus = "PENDING" | "COMPLETED" | "SKIPPED" | "OVERDUE";

export interface RevisionSchedule {
  id: string;
  noteId: string;
  userId: string;
  scheduledAt: string;
  completedAt?: string;
  skippedAt?: string;
  status: RevisionStatus;
  stage: "DAY_3" | "DAY_7" | "DAY_14" | "DAY_28";
  sessionSlot: number;
  sessionOrder: number;
  note?: {
    id: string;
    title: string;
    mastery: string;
    folder?: {
      name: string;
      color: string;
    };
  };
}

// Query params for GET /api/revisions?status=PENDING
export interface RevisionQueryParams {
  status?: RevisionStatus;
  from?: string;
  to?: string;
}

// What you send to PATCH /api/revisions/time
export interface UpdateRevisionTimeInput {
  hour: number;
  minute?: number;
}

export interface TodayRevisionsResponse {
  total: number;
  session1: { count: number; schedules: RevisionSchedule[] };
  session2: { count: number; schedules: RevisionSchedule[] };
}