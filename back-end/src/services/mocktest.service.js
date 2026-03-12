import { prisma } from "../config/db.js";
import { generateJSON } from "../utils/gemini.js";
import { createError } from "../middleware/errorHandler.js";
import { trackActivity } from "./activity.service.js";


// ---------------------------------------------------------------------------
// AI Generate
// ---------------------------------------------------------------------------
export const generateMockTest = async (noteId, userId) => {
  const note = await prisma.note.findFirst({
    where: { id: noteId, userId, deletedAt: null },
  });
  if (!note) throw createError("Note not found", 404);
  if (!note.contentText) throw createError("Note has no content", 400);

  const prompt = `
    You are a study assistant. Based on the following notes, generate 5 MCQ and 3 True/False questions.
    
    Notes:
    "${note.contentText}"
    
    Return ONLY a valid JSON array, no extra text:
    [
      {
        "questionText": "What is ...?",
        "questionType": "MCQ",
        "options": [
          { "id": "a", "text": "Option A", "isCorrect": true },
          { "id": "b", "text": "Option B", "isCorrect": false },
          { "id": "c", "text": "Option C", "isCorrect": false },
          { "id": "d", "text": "Option D", "isCorrect": false }
        ],
        "explanation": "Because ..."
      },
      {
        "questionText": "This is true or false?",
        "questionType": "TRUE_FALSE",
        "options": [
          { "id": "true", "text": "True", "isCorrect": true },
          { "id": "false", "text": "False", "isCorrect": false }
        ],
        "explanation": "Because ..."
      }
    ]
  `;

  const questions = await generateJSON(prompt);

  // create the test
  const test = await prisma.mockTest.create({
    data: {
      noteId,
      title: `${note.title} — Mock Test`,
      totalQuestions: questions.length,
      isAiGenerated: true,
      questions: {
        create: questions.map((q, index) => ({
          questionText: q.questionText,
          questionType: q.questionType,
          options: q.options,
          explanation: q.explanation ?? null,
          sortOrder: index,
        })),
      },
    },
    include: { questions: true },
  });

  return test;
};

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------
export const getMockTests = async (noteId, userId) => {
  const note = await prisma.note.findFirst({
    where: { id: noteId, userId, deletedAt: null },
  });
  if (!note) throw createError("Note not found", 404);

  return prisma.mockTest.findMany({
    where: { noteId },
    include: { _count: { select: { questions: true, attempts: true } } },
    orderBy: { createdAt: "desc" },
  });
};

export const getMockTestById = async (testId, userId) => {
  const test = await prisma.mockTest.findFirst({
    where: { id: testId },
    include: { questions: { orderBy: { sortOrder: "asc" } } },
  });
  if (!test) throw createError("Test not found", 404);

  // verify ownership via note
  const note = await prisma.note.findFirst({
    where: { id: test.noteId, userId },
  });
  if (!note) throw createError("Test not found", 404);

  return test;
};

export const submitMockTest = async (testId, userId, answers) => {
  const test = await getMockTestById(testId, userId);

  let correct = 0;

  const answerData = answers.map(({ questionId, selectedOption }) => {
    const question = test.questions.find((q) => q.id === questionId);
    const correctOption = question?.options?.find((o) => o.isCorrect);
    const isCorrect = correctOption?.id === selectedOption;
    if (isCorrect) correct++;

    return { questionId, selectedOption, isCorrect };
  });

  const score = (correct / test.questions.length) * 100;

  const attempt = await prisma.mockTestAttempt.create({
    data: {
      userId,
      testId,
      score,
      totalQuestions: test.questions.length,
      correctAnswers: correct,
      completedAt: new Date(),
      answers: { create: answerData },
    },
    include: { answers: true },
  });

  await trackActivity(userId, "testsCompleted");


  return { attempt, score, correct, total: test.questions.length };
};

export const deleteMockTest = async (testId, userId) => {
  await getMockTestById(testId, userId);
  await prisma.mockTest.delete({ where: { id: testId } });
  return { deleted: true };
};