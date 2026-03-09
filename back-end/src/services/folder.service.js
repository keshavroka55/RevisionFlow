import { prisma } from "../config/db.js";
import { createError } from "../middleware/errorHandler.js";

const assertOwnership = async (folderId, userId) => {
  const folder = await prisma.folder.findFirst({
    where: { id: folderId, userId, deletedAt: null },
  });
  if (!folder) throw createError("Folder not found", 404);
  return folder;
};

export const createFolder = async (userId, data) => {
  const count = await prisma.folder.count({ where: { userId, deletedAt: null } });
  if (count >= 50) throw createError("Max 50 folders allowed", 400);

  if (!data.sortOrder) {
    const last = await prisma.folder.findFirst({
      where: { userId, deletedAt: null },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });
    data.sortOrder = last ? last.sortOrder + 1 : 0;
  }

  return prisma.folder.create({ data: { userId, ...data } });
};

export const getFolders = async (userId) => {
  return prisma.folder.findMany({
    where: { userId, deletedAt: null },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: {
      _count: { select: { notes: { where: { deletedAt: null } } } },
    },
  });
};

export const getFolderById = async (folderId, userId) => {
  const folder = await prisma.folder.findFirst({
    where: { id: folderId, userId, deletedAt: null },
    include: {
      _count: { select: { notes: { where: { deletedAt: null } } } },
    },
  });
  if (!folder) throw createError("Folder not found", 404);
  return folder;
};

export const updateFolder = async (folderId, userId, data) => {
  await assertOwnership(folderId, userId);
  if (Object.keys(data).length === 0) throw createError("No fields to update", 400);
  return prisma.folder.update({ where: { id: folderId }, data });
};

export const deleteFolder = async (folderId, userId, { cascade = true } = {}) => {
  const folder = await assertOwnership(folderId, userId);
  if (folder.isDefault) throw createError("Cannot delete default folder", 400);

  const now = new Date();
  await prisma.$transaction(async (tx) => {
    await tx.folder.update({ where: { id: folderId }, data: { deletedAt: now } });
    if (cascade) {
      await tx.note.updateMany({
        where: { folderId, deletedAt: null },
        data: { deletedAt: now },
      });
    }
  });

  return { deleted: true, folderId };
};

export const reorderFolders = async (userId, folders) => {
  const ids = folders.map((f) => f.id);
  const owned = await prisma.folder.findMany({
    where: { id: { in: ids }, userId, deletedAt: null },
    select: { id: true },
  });
  if (owned.length !== ids.length) throw createError("One or more folders not found", 404);

  await prisma.$transaction(
    folders.map(({ id, sortOrder }) =>
      prisma.folder.update({ where: { id }, data: { sortOrder } })
    )
  );

  return { reordered: ids.length };
};