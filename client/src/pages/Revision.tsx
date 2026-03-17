import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { RotateCcw, CheckCircle, XCircle, ChevronRight, Sparkles, Loader } from "lucide-react";
import { useFlashcardStore } from "../store/flashcard.store";
import { useSearchParams } from "react-router";
import { useNoteStore } from "../store/note.store";
import { useRevisionLoading, useRevisionStore } from "../store/revision.store";

export default function Revision() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryNoteId = searchParams.get("noteId") ?? "";

  const { flashcards, isLoading, isGenerating, error, fetchFlashcards, generateFlashcards } =
    useFlashcardStore();
  const { notes, fetchNotes } = useNoteStore();
  const {
    todayRevisions,
    fetchTodayRevisions,
    completeRevision,
    error: revisionError,
  } = useRevisionStore();
  const isCompleting = useRevisionLoading("revision.complete");

  const [activeNoteId, setActiveNoteId] = useState(queryNoteId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState({ remembered: 0, forgot: 0 });

  const activeRevision = todayRevisions.find(
    (r) => r.note?.id === activeNoteId && (r.status === "PENDING" || r.status === "OVERDUE")
  );

  useEffect(() => {
    fetchTodayRevisions();

    if (queryNoteId) {
      setActiveNoteId(queryNoteId);
      return;
    }

    // Opened /dashboard/revision directly: load notes and pick one.
    fetchNotes();
  }, [queryNoteId]);

  useEffect(() => {
    if (!activeNoteId && notes.length > 0) {
      const fallbackNoteId = notes[0].id;
      setActiveNoteId(fallbackNoteId);
      setSearchParams({ noteId: fallbackNoteId });
    }
  }, [notes, activeNoteId, setSearchParams]);

  useEffect(() => {
    if (!activeNoteId) return;
    setCurrentIndex(0);
    setIsFlipped(false);
    setResults({ remembered: 0, forgot: 0 });
    fetchFlashcards(activeNoteId);
  }, [activeNoteId]);

  const currentCard = flashcards[currentIndex];
  const isLastCard = currentIndex === flashcards.length - 1;
  const isCompleted = currentIndex >= flashcards.length && flashcards.length > 0;

  const handleResponse = (remembered: boolean) => {
    setResults((prev) => ({
      remembered: prev.remembered + (remembered ? 1 : 0),
      forgot: prev.forgot + (remembered ? 0 : 1),
    }));

    if (!isLastCard) {
      setTimeout(() => { setCurrentIndex((i) => i + 1); setIsFlipped(false); }, 300);
    } else {
      setTimeout(() => { setCurrentIndex((i) => i + 1); }, 300);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setResults({ remembered: 0, forgot: 0 });
  };

  const handleRegenerate = async () => {
    await generateFlashcards(activeNoteId);
    setCurrentIndex(0);
    setIsFlipped(false);
    setResults({ remembered: 0, forgot: 0 });
  };

  const handleCompleteTodayTask = async () => {
    if (!activeRevision) return;
    await completeRevision(activeRevision.id);
    await fetchTodayRevisions();
  };

  // ---------------------------------------------------------------------------
  // No notes at all
  // ---------------------------------------------------------------------------
  if (!activeNoteId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No notes available for revision.</p>
          <p className="text-sm text-muted-foreground">Create a note first to generate flashcards.</p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // No flashcards yet — generate them
  // ---------------------------------------------------------------------------
  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl border border-border p-10 shadow-xl">
            <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">No Flashcards Yet</h2>
            <p className="text-muted-foreground mb-6">
              Generate AI flashcards from your note content to start revising.
            </p>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              onClick={() => generateFlashcards(activeNoteId)}
              disabled={isGenerating}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <><Loader className="w-5 h-5 animate-spin" /> Generating...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Generate Flashcards</>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Completed
  // ---------------------------------------------------------------------------
  if (isCompleted) {
    const total = results.remembered + results.forgot;
    const percentage = total > 0 ? Math.round((results.remembered / total) * 100) : 0;

    return (
      <div className="min-h-screen flex items-center justify-center p-4 pb-20 lg:pb-8">
        <div className="max-w-2xl w-full">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl border border-border p-8 text-center"
          >
            <div className="mb-8">
              <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-accent" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Revision Complete! 🎉</h1>
              <p className="text-muted-foreground">Great job completing your revision session</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-background rounded-xl p-4">
                <div className="text-3xl font-bold text-foreground mb-1">{total}</div>
                <div className="text-sm text-muted-foreground">Total Cards</div>
              </div>
              <div className="bg-accent/10 rounded-xl p-4">
                <div className="text-3xl font-bold text-accent mb-1">{results.remembered}</div>
                <div className="text-sm text-muted-foreground">Remembered</div>
              </div>
              <div className="bg-destructive/10 rounded-xl p-4">
                <div className="text-3xl font-bold text-destructive mb-1">{results.forgot}</div>
                <div className="text-sm text-muted-foreground">Forgot</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white mb-8">
              <div className="text-5xl font-bold mb-2">{percentage}%</div>
              <div className="text-sm">Retention Rate</div>
            </div>

            {revisionError && (
              <p className="text-sm text-red-600 mb-4">{revisionError}</p>
            )}

            <div className="flex gap-3">
              {activeRevision && (
                <button
                  onClick={handleCompleteTodayTask}
                  disabled={isCompleting}
                  className="flex-1 bg-accent text-white px-8 py-3 rounded-lg hover:bg-accent/90 transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isCompleting ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Complete Today Task
                    </>
                  )}
                </button>
              )}

              <button
                onClick={handleRestart}
                className="flex-1 bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Restart
              </button>
              <button
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="flex-1 border border-primary text-primary px-8 py-3 rounded-lg hover:bg-primary/5 transition-colors inline-flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                Regenerate
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Main card view
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen flex items-center justify-center p-4 pb-20 lg:pb-8">
      <div className="max-w-3xl w-full">

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{currentIndex + 1} / {flashcards.length}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary"
              animate={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Card */}
        <motion.div
          key={`${currentIndex}-${isFlipped ? "answer" : "question"}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="relative w-full"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-border p-8 md:p-12 min-h-[400px] flex flex-col justify-center">
            {!isFlipped ? (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                    Question
                  </span>
                  {currentCard?.hint && (
                    <span className="text-xs text-muted-foreground italic">
                      💡 {currentCard.hint}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                  {currentCard?.question}
                </h2>
                <button
                  onClick={() => setIsFlipped(true)}
                  className="bg-primary text-white px-8 py-4 rounded-xl hover:bg-primary/90 transition-colors text-lg inline-flex items-center justify-center gap-2 w-full md:w-auto"
                >
                  Show Answer
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">
                    Answer
                  </span>
                </div>
                <div className="text-lg text-foreground mb-8 whitespace-pre-line">
                  {currentCard?.answer}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => handleResponse(true)}
                    className="flex-1 bg-accent text-white px-6 py-4 rounded-xl hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    I Remembered
                  </button>
                  <button
                    onClick={() => handleResponse(false)}
                    className="flex-1 bg-destructive text-white px-6 py-4 rounded-xl hover:bg-destructive/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    I Forgot
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Stats */}
        <div className="mt-8 flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-accent rounded-full" />
            <span className="text-muted-foreground">Remembered: {results.remembered}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-destructive rounded-full" />
            <span className="text-muted-foreground">Forgot: {results.forgot}</span>
          </div>
        </div>
      </div>
    </div>
  );
}