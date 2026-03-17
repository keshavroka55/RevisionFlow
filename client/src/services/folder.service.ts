import api from "../api/axiosInstance";
import {
  Folder,
  CreateFolderInput,
  UpdateFolderInput,
  ReorderFoldersInput,
} from "../types/folder.types";

export const folderService = {

  // GET /api/folders
  getAll: async (): Promise<Folder[]> => {
    const response = await api.get("/folders");
    return response.data.folders;
  },

  // GET /api/folders/:id
  getById: async (id: string): Promise<Folder> => {
    const response = await api.get(`/folders/${id}`);
    return response.data.folder;
  },

  // POST /api/folders
  create: async (data: CreateFolderInput): Promise<Folder> => {
    const response = await api.post("/folders", data);
    return response.data.folder;
  },

  // PATCH /api/folders/:id
  update: async (id: string, data: UpdateFolderInput): Promise<Folder> => {
    const response = await api.patch(`/folders/${id}`, data);
    return response.data.folder;
  },

  // DELETE /api/folders/:id
  delete: async (id: string): Promise<void> => {
    await api.delete(`/folders/${id}`);
  },

  // PATCH /api/folders/reorder
  reorder: async (data: ReorderFoldersInput): Promise<void> => {
    await api.patch("/folders/reorder", data);
  },
};