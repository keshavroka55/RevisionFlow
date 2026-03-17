import api from "../api/axiosInstance";
import {
  Note,
  CreateNoteInput,
  UpdateNoteInput,
  UpdateMasteryInput,
  NoteQueryParams,
  PaginatedNotes,
} from "../types/note.types";

export const noteService = {

  // GET /api/notes?q=&folderId=&tags=&page=&limit=
  getAll: async (params?: NoteQueryParams): Promise<PaginatedNotes> => {
    const response = await api.get("/notes", { params });
    return response.data;
  },

  // GET /api/notes/:id
  getById: async (id: string): Promise<Note> => {
    const response = await api.get(`/notes/${id}`);
    return response.data.note ?? response.data;
  },

  // GET /api/notes/tags
  getTags: async (): Promise<string[]> => {
    const response = await api.get("/notes/tags");
    return response.data;
  },

  // POST /api/notes
  create: async (data: CreateNoteInput): Promise<Note> => {
    const response = await api.post("/notes", data);
    return response.data.note ?? response.data;
  },

  // PATCH /api/notes/:id
  update: async (id: string, data: UpdateNoteInput): Promise<Note> => {
    const response = await api.patch(`/notes/${id}`, data);
    return response.data.note ?? response.data;
  },

  // DELETE /api/notes/:id
  delete: async (id: string): Promise<void> => {
    await api.delete(`/notes/${id}`);
  },

  // PATCH /api/notes/:id/mastery
  updateMastery: async (id: string, data: UpdateMasteryInput): Promise<Note> => {
    const response = await api.patch(`/notes/${id}/mastery`, data);
    return response.data;
  },
};