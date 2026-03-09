import { useState } from 'react';
import { Play, CheckCircle, XCircle, Trophy, RotateCcw, ChevronRight } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const mockQuestions: Question[] = [
  {
    id: 1,
    question: 'What is the principle of superposition in Quantum Mechanics?',
    options: [
      'A particle can only be in one state at a time',
      'A quantum system can exist in multiple states simultaneously',
      'Particles always have definite positions',
      'Energy is always conserved',
    ],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: 'What is the time complexity of searching in a balanced Binary Search Tree?',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: 'Which of these is the correct conjugation of "estar" for "nosotros"?',
    options: ['estamos', 'están', 'estoy', 'está'],
    correctAnswer: 0,
  },
];

export default function MockTests() {
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(mockQuestions.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState('Physics');
  const [numQuestions, setNumQuestions] = useState(5);

  const handleStartTest = () => {
    setTestStarted(true);
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(mockQuestions.length).fill(null));
    setShowResults(false);
  };

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setTestStarted(false);
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(mockQuestions.length).fill(null));
    setShowResults(false);
  };

  const calculateScore = () => {
    let correct = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === mockQuestions[index].correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  if (!testStarted) {
    return (
      <div className="p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Mock Tests</h1>
            <p className="text-muted-foreground">Test your knowledge with AI-generated questions</p>
          </div>

          <div className="bg-white rounded-xl border border-border p-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="folder" className="block text-sm mb-2 text-foreground">
                  Select Folder
                </label>
                <select
                  id="folder"
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Physics">Physics</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Spanish">Spanish</option>
                  <option value="All Folders">All Folders</option>
                </select>
              </div>

              <div>
                <label htmlFor="numQuestions" className="block text-sm mb-2 text-foreground">
                  Number of Questions
                </label>
                <select
                  id="numQuestions"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="5">5 Questions</option>
                  <option value="10">10 Questions</option>
                  <option value="15">15 Questions</option>
                  <option value="20">20 Questions</option>
                </select>
              </div>

              <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">📝 Test Details</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Multiple choice questions from your notes</li>
                  <li>• Estimated time: {numQuestions * 2} minutes</li>
                  <li>• Questions are AI-generated based on your folder content</li>
                  <li>• Track your performance and identify weak areas</li>
                </ul>
              </div>

              <button
                onClick={handleStartTest}
                className="w-full bg-primary text-white px-8 py-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-lg"
              >
                <Play className="w-6 h-6" />
                Generate Mock Test
              </button>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Premium Feature</h3>
                <p className="text-sm text-white/90">
                  AI-generated mock tests are available for Premium users. Upgrade now to access
                  unlimited tests and detailed analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / mockQuestions.length) * 100);

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
                <div className="text-3xl font-bold text-foreground mb-1">{mockQuestions.length}</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
              <div className="bg-accent/10 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-accent mb-1">{score}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="bg-destructive/10 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-destructive mb-1">{mockQuestions.length - score}</div>
                <div className="text-sm text-muted-foreground">Wrong</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white mb-8 text-center">
              <div className="text-5xl font-bold mb-2">{percentage}%</div>
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

          {/* Review Answers */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Review Answers</h2>
            <div className="space-y-6">
              {mockQuestions.map((question, qIndex) => {
                const userAnswer = selectedAnswers[qIndex];
                const isCorrect = userAnswer === question.correctAnswer;

                return (
                  <div key={question.id} className="border-b border-border pb-6 last:border-b-0">
                    <div className="flex items-start gap-3 mb-3">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-3">
                          {qIndex + 1}. {question.question}
                        </h3>
                        <div className="space-y-2">
                          {question.options.map((option, oIndex) => (
                            <div
                              key={oIndex}
                              className={`p-3 rounded-lg border ${
                                oIndex === question.correctAnswer
                                  ? 'bg-accent/10 border-accent'
                                  : oIndex === userAnswer && !isCorrect
                                  ? 'bg-destructive/10 border-destructive'
                                  : 'bg-background border-border'
                              }`}
                            >
                              {option}
                              {oIndex === question.correctAnswer && (
                                <span className="ml-2 text-xs text-accent">✓ Correct</span>
                              )}
                              {oIndex === userAnswer && !isCorrect && (
                                <span className="ml-2 text-xs text-destructive">✗ Your answer</span>
                              )}
                            </div>
                          ))}
                        </div>
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

  const question = mockQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / mockQuestions.length) * 100;

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
            <span>Question {currentQuestion + 1} of {mockQuestions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl border border-border p-8 mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-8">
            {question.question}
          </h2>

          <div className="space-y-3 mb-8">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-primary/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground'
                    }`}
                  >
                    {selectedAnswers[currentQuestion] === index && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-foreground">{option}</span>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestion] === null}
            className="w-full bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {currentQuestion < mockQuestions.length - 1 ? (
              <>
                Next Question
                <ChevronRight className="w-5 h-5" />
              </>
            ) : (
              'Finish Test'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
