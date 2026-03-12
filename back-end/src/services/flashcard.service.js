import { prisma } from "../config/db.js";
import { generateJSON } from "../utils/gemini.js";
import { createError } from "../middleware/errorHandler.js";

// ---------------------------------------------------------------------------
// AI Generate — main feature
// ---------------------------------------------------------------------------
export const generateFlashcards = async (noteId, userId) => {
  // 1. get the note
  const note = await prisma.note.findFirst({
    where: { id: noteId, userId, deletedAt: null },
  });
  if (!note) throw createError("Note not found", 404);
  if (!note.contentText) throw createError("Note has no content to generate from", 400);

  // 2. build prompt
  const prompt = `
    You are a study assistant. Based on the following notes, generate 8 flashcards.
    
    Notes:
    "${note.contentText}"
    
    Return ONLY a valid JSON array like this, no extra text:
    [
      {
        "question": "What is ...?",
        "answer": "It is ...",
        "hint": "Think about ..."
      }
    ]
  `;

  // 3. call Gemini
  const cards = await generateJSON(prompt);

  // 4. delete old AI-generated cards for this note
  await prisma.flashcard.deleteMany({
    where: { noteId, isAiGenerated: true },
  });

  // 5. save new cards
  const flashcards = await prisma.flashcard.createMany({
    data: cards.map((card, index) => ({
      noteId,
      question: card.question,
      answer: card.answer,
      hint: card.hint ?? null,
      sortOrder: index,
      isAiGenerated: true,
    })),
  });

  return prisma.flashcard.findMany({
    where: { noteId },
    orderBy: { sortOrder: "asc" },
  });
};

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------
export const getFlashcards = async (noteId, userId) => {
  const note = await prisma.note.findFirst({
    where: { id: noteId, userId, deletedAt: null },
  });
  if (!note) throw createError("Note not found", 404);

  return prisma.flashcard.findMany({
    where: { noteId },
    orderBy: { sortOrder: "asc" },
  });
};

export const createFlashcard = async (noteId, userId, data) => {
  const note = await prisma.note.findFirst({
    where: { id: noteId, userId, deletedAt: null },
  });
  if (!note) throw createError("Note not found", 404);

  return prisma.flashcard.create({
    data: { noteId, ...data, isAiGenerated: false },
  });
};

export const updateFlashcard = async (cardId, userId, data) => {
  const card = await prisma.flashcard.findFirst({
    where: { id: cardId },
    include: { note: true },
  });
  if (!card || card.note.userId !== userId) throw createError("Flashcard not found", 404);

  return prisma.flashcard.update({ where: { id: cardId }, data });
};

export const deleteFlashcard = async (cardId, userId) => {
  const card = await prisma.flashcard.findFirst({
    where: { id: cardId },
    include: { note: true },
  });
  if (!card || card.note.userId !== userId) throw createError("Flashcard not found", 404);

  await prisma.flashcard.delete({ where: { id: cardId } });
  return { deleted: true };
};

// ---------------------------------------------------------------------------
// Submit Flashcard Session — called when user finishes all cards
// ---------------------------------------------------------------------------
export const submitFlashcardSession = async (noteId, userId, { easyCount, okayCount, hardCount }) => {
  const totalCards = easyCount + okayCount + hardCount;

  // save session to DB
  const session = await prisma.flashcardSession.create({
    data: {
      userId,
      noteId,
      totalCards,
      easyCount,
      okayCount,
      hardCount,
      completedAt: new Date(),
    },
  });

  // update progress stats
  await prisma.userProgressStats.upsert({
    where: { userId },
    update: { totalFlashcards: { increment: totalCards } },
    create: { userId, totalFlashcards: totalCards },
  });

  // track activity + streak
  await trackActivity(userId, "flashcardsReviewed");

  return session;
};