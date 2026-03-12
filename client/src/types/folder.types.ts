export interface Folder {
  id: string;
  userId: string;
  name: string;
  color: string;
  icon?: string;
  description?: string;
  isDefault: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// What you send to POST /api/folders
export interface CreateFolderInput {
  name: string;
  color?: string;
  icon?: string;
  description?: string;
}

// What you send to PATCH /api/folders/:id
export interface UpdateFolderInput {
  name?: string;
  color?: string;
  icon?: string;
  description?: string;
}

// What you send to PATCH /api/folders/reorder
export interface ReorderFoldersInput {
  folders: { id: string; sortOrder: number }[];
}