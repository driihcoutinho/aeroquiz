import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CircularTimer } from "@/components/CircularTimer";
import { AnswerButton } from "@/components/AnswerButton";
import { ProgressBar } from "@/components/ProgressBar";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { Badge } from "@/components/ui/badge";
import type { Question, QuizResult } from "@shared/schema";

interface QuizProps {
  questions: Question[];
  onAnswer: (questionIndex: number, selectedAnswer: number, timeSpent: number) => Promise<QuizResult>;
  onComplete: () => void;
  currentScore: number;
}

export default function Quiz({ questions, onAnswer, onComplete, currentScore }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    setStartTime(Date.now());
    setTimeSpent(0);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (!showResult) {
      const interval = setInterval(() => {
        setTimeSpent((Date.now() - startTime) / 1000);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [showResult, startTime]);

  const handleAnswer = async (answerIndex: number) => {
    if (selectedAnswer !== null || showResult) return;

    const finalTimeSpent = (Date.now() - startTime) / 1000;
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const quizResult = await onAnswer(currentQuestionIndex, answerIndex, finalTimeSpent);
    setResult(quizResult);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setResult(null);
      } else {
        onComplete();
      }
    }, 3000);
  };

  const handleTimeUp = () => {
    if (selectedAnswer === null && !showResult) {
      setSelectedAnswer(-1);
      setShowResult(true);
      setResult({
        isCorrect: false,
        correctAnswer: -1,
        pointsEarned: 0,
        currentScore: currentScore,
        explanation: "Tempo esgotado!",
      });

      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedAnswer(null);
          setShowResult(false);
          setResult(null);
        } else {
          onComplete();
        }
      }, 3000);
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="max-w-4xl mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Badge variant="secondary" className="text-sm font-semibold px-4 py-2" data-testid="badge-category">
            {currentQuestion.category}
          </Badge>
          
          <div className="flex items-center gap-4">
            <ScoreDisplay score={currentScore} animate={showResult && result?.isCorrect} />
            <CircularTimer
              duration={currentQuestion.timeLimit}
              onTimeUp={handleTimeUp}
              isPaused={showResult}
            />
          </div>
        </div>

        <ProgressBar
          current={currentQuestionIndex + 1}
          total={questions.length}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-2xl p-8 shadow-lg border-2">
              <h2 className="text-2xl md:text-4xl font-bold text-center text-card-foreground leading-tight" data-testid="text-question">
                {currentQuestion.question}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => (
                <AnswerButton
                  key={index}
                  index={index}
                  text={option}
                  onSelect={() => handleAnswer(index)}
                  isSelected={selectedAnswer === index}
                  isCorrect={showResult && result && index === result.correctAnswer}
                  isIncorrect={showResult && selectedAnswer === index && result && !result.isCorrect}
                  disabled={selectedAnswer !== null || showResult}
                  showResult={showResult}
                />
              ))}
            </div>

            {showResult && result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-6 text-center space-y-3 ${
                  result.isCorrect
                    ? "bg-[hsl(var(--quiz-correct))]/10 border-2 border-[hsl(var(--quiz-correct))]"
                    : "bg-[hsl(var(--quiz-incorrect))]/10 border-2 border-[hsl(var(--quiz-incorrect))]"
                }`}
                data-testid="feedback-result"
              >
                <h3 className={`text-3xl font-bold ${
                  result.isCorrect ? "text-[hsl(var(--quiz-correct))]" : "text-[hsl(var(--quiz-incorrect))]"
                }` } data-testid="text-result-message">
                  {result.isCorrect ? "Correto!" : "Incorreto"}
                </h3>
                <p className="text-lg font-semibold text-foreground" data-testid="text-points-earned">
                  +{result.pointsEarned} pontos
                </p>
                {result.explanation && (
                  <p className="text-sm text-muted-foreground max-w-2xl mx-auto" data-testid="text-explanation">
                    {result.explanation}
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
