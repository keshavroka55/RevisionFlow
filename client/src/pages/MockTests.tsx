import { useEffect, useMemo, useState } from "react";
import {
  Play,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  ChevronRight,
  Loader,
  FileText,
} from "lucide-react";
import { useMockTestStore } from "../store/mocktest.store";
import { useNoteStore } from "../store/note.store";

export default function MockTests() {
  const { notes, fetchNotes } = useNoteStore();
  const {
    currentTest,
    result,
    isGenerating,
    isSubmitting,
    error,
    generateTest,
    submitTest,
    reset,
    clearError,
  } = useMockTestStore();

  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [questionCount, setQuestionCount] = useState(8);
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD" | "MIXED">("MIXED");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [writtenAnswers, setWrittenAnswers] = useState<Record<string, string>>({});
  const [answerMode, setAnswerMode] = useState<"objective" | "exam">("objective");

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (!selectedNoteId && notes.length > 0) {
      setSelectedNoteId(notes[0].id);
    }
  }, [notes, selectedNoteId]);

  const question = currentTest?.questions?.[currentQuestion];
  const totalQuestions = currentTest?.questions?.length ?? 0;
  const progress = totalQuestions > 0 ? ((currentQuestion + 1) / totalQuestions) * 100 : 0;

  const score = useMemo(() => {
    if (!result) return 0;
    return Math.round(result.score);
  }, [result]);

  const handleGenerateTest = async () => {
    if (!selectedNoteId) return;
    clearError();
    await generateTest(selectedNoteId, { questionCount, difficulty });
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setWrittenAnswers({});
  };

  const handleSelectAnswer = (optionId: string) => {
    if (!question) return;
    setSelectedAnswers((prev) => ({ ...prev, [question.id]: optionId }));
  };

  const handleNext = async () => {
    if (!currentTest || !question) return;

    if (currentQuestion < currentTest.questions.length - 1) {
      setCurrentQuestion((q) => q + 1);
      return;
    }

    const answers = currentTest.questions
      .map((q) => ({ questionId: q.id, selectedOption: selectedAnswers[q.id] }))
      .filter((a) => !!a.selectedOption);

    await submitTest(currentTest.id, answers);
  };

  const handleRestart = () => {
    reset();
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setWrittenAnswers({});
  };

  if (!currentTest && !result) {
    return (
      <div className="p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Mock Tests</h1>
            <p className="text-muted-foreground">Test your knowledge with AI-generated questions</p>
          </div>

          <div className="bg-white rounded-xl border border-border p-8">
            <div className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                  <p className="text-sm text-red-600">{error}</p>
                  <button onClick={clearError} className="text-red-400">✕</button>
                </div>
              )}

              {notes.length === 0 ? (
                <div className="bg-muted rounded-lg p-4 text-center">
                  <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Create a note first to generate a mock test.</p>
                </div>
              ) : (
                <>
                  <div>
                    <label htmlFor="note" className="block text-sm mb-2 text-foreground">
                      Select Note
                    </label>
                    <select
                      id="note"
                      value={selectedNoteId}
                      onChange={(e) => setSelectedNoteId(e.target.value)}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {notes.map((note) => (
                        <option key={note.id} value={note.id}>
                          {note.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="questionCount" className="block text-sm mb-2 text-foreground">
                      Number of Questions
                    </label>
                    <select
                      id="questionCount"
                      value={questionCount}
                      onChange={(e) => setQuestionCount(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value={5}>5 Questions</option>
                      <option value={8}>8 Questions</option>
                      <option value={10}>10 Questions</option>
                      <option value={15}>15 Questions</option>
                      <option value={20}>20 Questions</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="difficulty" className="block text-sm mb-2 text-foreground">
                      Difficulty Level
                    </label>
                    <select
                      id="difficulty"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as "EASY" | "MEDIUM" | "HARD" | "MIXED")}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                      <option value="MIXED">Mixed</option>
                    </select>
                  </div>
                </>
              )}

              <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">📝 Test Details</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Multiple choice and true/false questions from your note</li>
                  <li>• Configurable question count and difficulty</li>
                  <li>• Optional exam mode: write your own answer for each question</li>
                  <li>• Questions are AI-generated based on your note content</li>
                  <li>• Submit and review correct vs wrong + better answer guidance</li>
                </ul>
              </div>

              <button
                onClick={handleGenerateTest}
                disabled={!selectedNoteId || notes.length === 0 || isGenerating}
                className="w-full bg-primary text-white px-8 py-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader className="w-6 h-6 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6" />
                    Generate Mock Test
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (result && currentTest) {
    return (
      <div className="p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl border border-border p-8 mb-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-accent" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Test Complete!</h1>
              <p className="text-muted-foreground">Here are your results</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-background rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-foreground mb-1">{result.total}</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
              <div className="bg-accent/10 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-accent mb-1">{result.correct}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="bg-destructive/10 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-destructive mb-1">{result.total - result.correct}</div>
                <div className="text-sm text-muted-foreground">Wrong</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white mb-8 text-center">
              <div className="text-5xl font-bold mb-2">{score}%</div>
              <div>Your Score</div>
            </div>

            <button
              onClick={handleRestart}
              className="w-full bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Take Another Test
            </button>
          </div>

          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Review Answers</h2>
            <div className="space-y-6">
              {currentTest.questions.map((q, qIndex) => {
                const answerEntry = result.attempt.answers.find((a) => a.questionId === q.id);
                const userAnswer = answerEntry?.selectedOption;
                const isCorrect = !!answerEntry?.isCorrect;

                return (
                  <div key={q.id} className="border-b border-border pb-6 last:border-b-0">
                    <div className="flex items-start gap-3 mb-3">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-accent shrink-0 mt-1" />
                      ) : (
                        <XCircle className="w-6 h-6 text-destructive shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-3">
                          {qIndex + 1}. {q.questionText}
                        </h3>
                        <div className="space-y-2">
                          {q.options.map((option) => (
                            <div
                              key={option.id}
                              className={`p-3 rounded-lg border ${
                                option.isCorrect
                                  ? "bg-accent/10 border-accent"
                                  : option.id === userAnswer && !isCorrect
                                    ? "bg-destructive/10 border-destructive"
                                    : "bg-background border-border"
                              }`}
                            >
                              {option.text}
                              {option.isCorrect && (
                                <span className="ml-2 text-xs text-accent">✓ Correct</span>
                              )}
                              {option.id === userAnswer && !isCorrect && (
                                <span className="ml-2 text-xs text-destructive">✗ Your answer</span>
                              )}
                            </div>
                          ))}
                        </div>

                        {(writtenAnswers[q.id] || q.explanation) && (
                          <div className="mt-4 space-y-2">
                            <div className="p-3 rounded-lg bg-muted/60 border border-border">
                              <p className="text-xs text-muted-foreground mb-1">Your written answer</p>
                              <p className="text-sm text-foreground whitespace-pre-wrap">
                                {writtenAnswers[q.id]?.trim() || "— Not provided —"}
                              </p>
                            </div>

                            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                              <p className="text-xs text-primary mb-1">Better way to answer</p>
                              <p className="text-sm text-foreground whitespace-pre-wrap">
                                {q.explanation || "Focus on the core concept and mention why the correct option is valid."}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentTest || !question) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
            <span>
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-8 mb-6">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setAnswerMode("objective")}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                answerMode === "objective"
                  ? "bg-primary text-white border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary/40"
              }`}
            >
              Objective Mode
            </button>
            <button
              onClick={() => setAnswerMode("exam")}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                answerMode === "exam"
                  ? "bg-primary text-white border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary/40"
              }`}
            >
              Exam Writing Mode
            </button>
          </div>

          <h2 className="text-2xl font-semibold text-foreground mb-8">{question.questionText}</h2>

          {answerMode === "exam" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Write your own answer (exam format)
              </label>
              <textarea
                value={writtenAnswers[question.id] || ""}
                onChange={(e) =>
                  setWrittenAnswers((prev) => ({
                    ...prev,
                    [question.id]: e.target.value,
                  }))
                }
                placeholder="Write the complete answer in your own words..."
                rows={5}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Tip: Also select an option below for automatic scoring.
              </p>
            </div>
          )}

          <div className="space-y-3 mb-8">
            {question.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelectAnswer(option.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedAnswers[question.id] === option.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-primary/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswers[question.id] === option.id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {selectedAnswers[question.id] === option.id && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-foreground">{option.text}</span>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={
              isSubmitting ||
              (!selectedAnswers[question.id] && !(writtenAnswers[question.id] || "").trim())
            }
            className="w-full bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : currentQuestion < totalQuestions - 1 ? (
              <>
                Next Question
                <ChevronRight className="w-5 h-5" />
              </>
            ) : (
              "Finish Test"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
