import { useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, CheckCircle, XCircle, ChevronRight } from 'lucide-react';

interface RevisionCard {
  id: number;
  question: string;
  answer: string;
  folder: string;
}

const revisionCards: RevisionCard[] = [
  {
    id: 1,
    question: 'What is a Wave Function in Quantum Mechanics?',
    answer: 'A wave function (ψ) is a mathematical description of the quantum state of a particle or system. It contains all the information about the system and its square gives the probability density of finding a particle in a particular state.',
    folder: 'Physics',
  },
  {
    id: 2,
    question: 'Explain Binary Search Tree properties',
    answer: 'A Binary Search Tree (BST) is a tree data structure where:\n1. Each node has at most two children\n2. Left subtree contains only nodes with keys less than the parent\n3. Right subtree contains only nodes with keys greater than the parent\n4. Both left and right subtrees are also BSTs',
    folder: 'Computer Science',
  },
  {
    id: 3,
    question: 'Conjugate "Hablar" in present tense',
    answer: 'Yo hablo\nTú hablas\nÉl/Ella habla\nNosotros hablamos\nVosotros habláis\nEllos hablan',
    folder: 'Spanish',
  },
];

export default function Revision() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState<{ remembered: number; forgot: number }>({
    remembered: 0,
    forgot: 0,
  });

  const currentCard = revisionCards[currentIndex];
  const isLastCard = currentIndex === revisionCards.length - 1;
  const isCompleted = currentIndex >= revisionCards.length;

  const handleResponse = (remembered: boolean) => {
    setResults({
      remembered: results.remembered + (remembered ? 1 : 0),
      forgot: results.forgot + (remembered ? 0 : 1),
    });

    if (!isLastCard) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      }, 300);
    } else {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 300);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setResults({ remembered: 0, forgot: 0 });
  };

  if (isCompleted) {
    const total = results.remembered + results.forgot;
    const percentage = Math.round((results.remembered / total) * 100);

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

            <button
              onClick={handleRestart}
              className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Restart Revision
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pb-20 lg:pb-8">
      <div className="max-w-3xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{currentIndex + 1} / {revisionCards.length}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / revisionCards.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="perspective-1000">
          <motion.div
            key={currentIndex}
            initial={{ rotateY: isFlipped ? 180 : 0 }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-full"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl border border-border p-8 md:p-12 min-h-[400px] flex flex-col justify-center"
              style={{ backfaceVisibility: 'hidden' }}
            >
              {!isFlipped ? (
                <>
                  <div className="mb-6">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {currentCard.folder}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                    {currentCard.question}
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
                <div className="transform rotate-y-180">
                  <div className="mb-6">
                    <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">
                      Answer
                    </span>
                  </div>
                  <div className="text-lg text-foreground mb-8 whitespace-pre-line">
                    {currentCard.answer}
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
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="mt-8 flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span className="text-muted-foreground">Remembered: {results.remembered}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-destructive rounded-full"></div>
            <span className="text-muted-foreground">Forgot: {results.forgot}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
