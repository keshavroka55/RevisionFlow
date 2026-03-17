import { prisma } from "../config/db.js";
import { generateJSON } from "../utils/gemini.js";
import { createError } from "../middleware/errorHandler.js";
import { trackActivity } from "./activity.service.js";

const extractTextFromContent = (node) => {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractTextFromContent).join(" ");
  if (typeof node === "object") {
    const selfText = typeof node.text === "string" ? node.text : "";
    const childText = extractTextFromContent(node.content);
    return [selfText, childText].filter(Boolean).join(" ");
  }
  return "";
};


// ---------------------------------------------------------------------------
// AI Generate
// ---------------------------------------------------------------------------
export const generateMockTest = async (noteId, userId, options = {}) => {
  const note = await prisma.note.findFirst({
    where: { id: noteId, userId, deletedAt: null },
  });
  if (!note) throw createError("Note not found", 404);

  const sourceText =
    (note.contentText ?? "").trim() ||
    extractTextFromContent(note.content).replace(/\s+/g, " ").trim();

  if (!sourceText) throw createError("Note has no content", 400);

  if (!note.contentText && sourceText) {
    await prisma.note.update({
      where: { id: noteId },
      data: { contentText: sourceText },
    });
  }

  const allowedDifficulties = ["EASY", "MEDIUM", "HARD", "MIXED"];
  const rawCount = Number(options.questionCount ?? 8);
  const questionCount = Number.isFinite(rawCount)
    ? Math.min(20, Math.max(3, Math.trunc(rawCount)))
    : 8;
  const difficulty = allowedDifficulties.includes(options.difficulty)
    ? options.difficulty
    : "MIXED";

  const tfCount = Math.max(1, Math.round(questionCount * 0.3));
  const mcqCount = Math.max(1, questionCount - tfCount);

  const prompt = `
    You are a study assistant.
    Based on the following notes, generate exactly ${questionCount} questions in total:
    - ${mcqCount} MCQ questions
    - ${tfCount} TRUE_FALSE questions
    Difficulty level: ${difficulty}
    
    Notes:
    "${sourceText}"
    
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

  const generated = await generateJSON(prompt);
  const questions = Array.isArray(generated) ? generated.slice(0, questionCount) : [];
  if (questions.length === 0) throw createError("Failed to generate mock test questions", 500);

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