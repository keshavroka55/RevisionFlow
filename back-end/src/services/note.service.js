import { prisma } from "../config/db.js";
import { createError } from "../middleware/errorHandler.js";
import { createRevisionSchedules } from "./revision.service.js";
import { trackActivity } from "./activity.service.js";



// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
const assertOwnership = async (noteId, userId) => {
  const note = await prisma.note.findFirst({
    where: { id: noteId, userId, deletedAt: null },
  });
  if (!note) throw createError("Note not found", 404);
  return note;
};

const countWords = (text = "") =>
  text.trim().split(/\s+/).filter(Boolean).length;

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------
export const createNote = async (userId, data) => {
  // verify folder belongs to user
  const folder = await prisma.folder.findFirst({
    where: { id: data.folderId, userId, deletedAt: null },
  });
  if (!folder) throw createError("Folder not found", 404);

  const wordCount = countWords(data.contentText);

  const note = await prisma.note.create({
    data: {
      userId,
      folderId: data.folderId,
      title: data.title,
      content: data.content,
      contentText: data.contentText,
      tags: data.tags ?? [],
      isEmailEnabled: data.isEmailEnabled ?? true,
      wordCount,
    },
  });

  // update folder note count in progress stats
  await trackActivity(userId, "notesCreated");


  // call the hooks for auto-revision shedules as per the rule. 
  await createRevisionSchedules(note.id, userId);


  return note;
};

// ---------------------------------------------------------------------------
// Get all — with search, filter, pagination
// ---------------------------------------------------------------------------
export const getNotes = async (userId, query) => {
  const { q, folderId, tags, mastery, status, page, limit } = query;

  const where = {
    userId,
    deletedAt: null,
    ...(folderId && { folderId }),
    ...(mastery && { mastery }),
    ...(status ? { status } : { status: "ACTIVE" }),
    ...(tags && {
      tags: { hasSome: tags.split(",").map((t) => t.trim()) },
    }),
    ...(q && {
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { contentText: { contains: q, mode: "insensitive" } },
        { tags: { has: q } },
      ],
    }),
  };

  const [notes, total] = await Promise.all([
    prisma.note.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        tags: true,
        mastery: true,
        status: true,
        wordCount: true,
        isEmailEnabled: true,
        lastRevisedAt: true,
        createdAt: true,
        updatedAt: true,
        folderId: true,
        folder: { select: { id: true, name: true, color: true } },
        _count: { select: { flashcards: true, mockTests: true } },
      },
    }),
    prisma.note.count({ where }),
  ]);

  return {
    notes,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ---------------------------------------------------------------------------
// Get single
// ---------------------------------------------------------------------------
export const getNoteById = async (noteId, userId) => {
  const note = await prisma.note.findFirst({
    where: { id: noteId, userId, deletedAt: null },
    include: {
      folder: { select: { id: true, name: true, color: true } },
      _count: { select: { flashcards: true, mockTests: true, revisionSchedules: true } },
    },
  });
  if (!note) throw createError("Note not found", 404);
  return note;
};

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------
export const updateNote = async (noteId, userId, data) => {
  await assertOwnership(noteId, userId);

  if (Object.keys(data).length === 0) throw createError("No fields to update", 400);

  // verify new folder belongs to user if folderId is changing
  if (data.folderId) {
    const folder = await prisma.folder.findFirst({
      where: { id: data.folderId, userId, deletedAt: null },
    });
    if (!folder) throw createError("Folder not found", 404);
  }

  const updateData = { ...data };
  if (data.contentText !== undefined) {
    updateData.wordCount = countWords(data.contentText);
  }

  return prisma.note.update({
    where: { id: noteId },
    data: updateData,
  });
};

// ---------------------------------------------------------------------------
// Delete — soft
// ---------------------------------------------------------------------------
export const deleteNote = async (noteId, userId) => {
  await assertOwnership(noteId, userId);

  await prisma.note.update({
    where: { id: noteId },
    data: { deletedAt: new Date() },
  });

  await prisma.userProgressStats.upsert({
    where: { userId },
    update: { totalNotes: { decrement: 1 } },
    create: { userId, totalNotes: 0 },
  });

  return { deleted: true, noteId };
};

// ---------------------------------------------------------------------------
// Update mastery level
// ---------------------------------------------------------------------------
export const updateMastery = async (noteId, userId, mastery) => {
  await assertOwnership(noteId, userId);

  const note = await prisma.note.update({
    where: { id: noteId },
    data: { mastery },
    select: { id: true, mastery: true },
  });

  // sync masteredNotes count
  if (mastery === "MASTERED") {
    await prisma.userProgressStats.update({
      where: { userId },
      data: { masteredNotes: { increment: 1 } },
    });
  }

  return note;
};

// ---------------------------------------------------------------------------
// Get all unique tags for a user
// ---------------------------------------------------------------------------
export const getUserTags = async (userId) => {
  const notes = await prisma.note.findMany({
    where: { userId, deletedAt: null },
    select: { tags: true },
  });

  const allTags = notes.flatMap((n) => n.tags);
  const unique = [...new Set(allTags)].sort();

  return { tags: unique, total: unique.length };
};