// Matches your Prisma enums exactly
export type NoteStatus = "ACTIVE" | "ARCHIVED" | "DELETED";
export type MasteryLevel = "NEW" | "LEARNING" | "REVIEWING" | "MASTERED";

export interface Note {
  id: string;
  userId: string;
  folderId: string;
  title: string;
  content: Record<string, any>; // TipTap/ProseMirror JSON
  contentText?: string;
  status: NoteStatus;
  mastery: MasteryLevel;
  tags: string[];
  wordCount: number;
  isEmailEnabled: boolean;
  lastRevisedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// What you send to POST /api/notes
export interface CreateNoteInput {
  folderId: string;
  title: string;
  content: Record<string, any>;
  tags?: string[];
  isEmailEnabled?: boolean;
}

// What you send to PATCH /api/notes/:id
export interface UpdateNoteInput {
  title?: string;
  content?: Record<string, any>;
  tags?: string[];
  folderId?: string;
  isEmailEnabled?: boolean;
}

// What you send to PATCH /api/notes/:id/mastery
export interface UpdateMasteryInput {
  mastery: MasteryLevel;
}

// Query params for GET /api/notes?q=&folderId=&tags=&page=&limit=
export interface NoteQueryParams {
  q?: string;
  folderId?: string;
  tags?: string;
  page?: number;
  limit?: number;
}

// Paginated response from GET /api/notes
export interface PaginatedNotes {
  notes: Note[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}