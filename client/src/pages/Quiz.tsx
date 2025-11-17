import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Question, QuizResult } from "@shared/schema";

interface QuizProps {
  questions: Question[];
  onAnswer: (questionIndex: number, selectedAnswer: number, timeSpent: number) => Promise<QuizResult>;
  onComplete: () => void;
  currentScore: number;
  moduleName?: string;
}

export default function Quiz({ questions, onAnswer, onComplete, currentScore, moduleName }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const isSubmittingRef = useRef(false);
  const hasSubmittedRef = useRef(false);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  useEffect(() => {
    setStartTime(Date.now());
    setTimeSpent(0);
    // Resetar refs aqui DEPOIS da transição para evitar race conditions
    isSubmittingRef.current = false;
    hasSubmittedRef.current = false;
  }, [currentQuestionIndex]);

  // Timer continua contando sempre
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent((Date.now() - startTime) / 1000);
    }, 100);
    return () => clearInterval(interval);
  }, [startTime]);

  const handleAnswer = async (answerIndex: number) => {
    if (hasSubmittedRef.current || isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    hasSubmittedRef.current = true;
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const finalTimeSpent = (Date.now() - startTime) / 1000;
    
    try {
      const quizResult = await onAnswer(currentQuestionIndex, answerIndex, finalTimeSpent);
      setResult(quizResult);
    } catch (error) {
      console.error("Error submitting answer:", error);
      isSubmittingRef.current = false;
      hasSubmittedRef.current = false;
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleTimeUp = useCallback(async () => {
    if (hasSubmittedRef.current || isSubmittingRef.current) return;

    const questionTimeLimit = questions[currentQuestionIndex]?.timeLimit || 30;
    
    isSubmittingRef.current = true;
    hasSubmittedRef.current = true;
    setSelectedAnswer(-1);
    setShowResult(true);
    
    const finalTimeSpent = questionTimeLimit;
    
    try {
      const quizResult = await onAnswer(currentQuestionIndex, -1, finalTimeSpent);
      setResult(quizResult);
    } catch (error) {
      console.error("Error submitting timeout:", error);
      isSubmittingRef.current = false;
      hasSubmittedRef.current = false;
      setSelectedAnswer(null);
      setShowResult(false);
    }
  }, [currentQuestionIndex, questions, onAnswer]);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Resetar timer ANTES de mudar índice para evitar race
      const now = Date.now();
      setStartTime(now);
      setTimeSpent(0);
      
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setResult(null);
      // Refs resetados no useEffect após mudança de índice
    } else {
      onComplete();
    }
  };

  const timeRemaining = Math.max(0, currentQuestion.timeLimit - timeSpent);
  const timePercent = (timeRemaining / currentQuestion.timeLimit) * 100;

  // Auto-submit quando tempo acabar (só dispara se não mostrou resultado ainda)
  useEffect(() => {
    if (timeRemaining <= 0 && !hasSubmittedRef.current && !showResult) {
      handleTimeUp();
    }
  }, [timeRemaining, handleTimeUp, showResult]);

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-primary/80 backdrop-blur-sm p-4 flex items-center justify-between sticky top-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground hover:bg-primary-foreground/10"
          onClick={onComplete}
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="text-primary-foreground font-semibold text-lg" data-testid="text-progress">
          {String(currentQuestionIndex + 1).padStart(2, '0')} of {String(totalQuestions).padStart(2, '0')}
        </div>

        <div className="flex items-center gap-2 bg-accent/20 backdrop-blur-sm rounded-full px-3 py-1.5" data-testid="timer-display">
          <Clock className="w-4 h-4 text-accent-foreground" />
          <span className="text-accent-foreground font-semibold text-sm">
            {Math.ceil(timeRemaining)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-primary/20 h-2">
        <motion.div
          className="h-full bg-[hsl(var(--success))]"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="w-full max-w-2xl space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Question Card */}
              <div className="bg-card rounded-3xl p-8 shadow-xl">
                <Badge variant="secondary" className="mb-4 text-xs" data-testid="badge-category">
                  {currentQuestion.category}
                </Badge>
                <h2 className="text-2xl md:text-3xl font-semibold text-card-foreground leading-tight" data-testid="text-question">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Answer Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = showResult && result && index === result.correctAnswer;
                  const isIncorrect = showResult && isSelected && result && !result.isCorrect;

                  let bgColor = "bg-card hover:bg-secondary/10";
                  let borderColor = "border-card-border";
                  let textColor = "text-card-foreground";

                  if (isCorrect) {
                    bgColor = "bg-green-100 border-green-500";
                    textColor = "text-green-900";
                  } else if (isIncorrect) {
                    bgColor = "bg-red-100 border-red-500";
                    textColor = "text-red-900";
                  }

                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null || showResult}
                      whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                      whileTap={{ scale: selectedAnswer === null ? 0.98 : 1 }}
                      className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left flex items-center justify-between ${bgColor} ${borderColor} ${textColor} disabled:cursor-not-allowed`}
                      data-testid={`button-answer-${index}`}
                    >
                      <span className="font-medium text-base">{option}</span>
                      
                      {isCorrect && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}
                      
                      {isIncorrect && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                          <X className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Result Feedback */}
              {showResult && result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className={`rounded-2xl p-6 text-center ${
                    result.isCorrect
                      ? "bg-green-100 border-2 border-green-500"
                      : "bg-red-100 border-2 border-red-500"
                  }`} data-testid="feedback-result">
                    <h3 className={`text-2xl font-bold mb-2 ${
                      result.isCorrect ? "text-green-900" : "text-red-900"
                    }`} data-testid="text-result-message">
                      {result.isCorrect ? "Correto!" : "Incorreto"}
                    </h3>
                    <p className={`text-lg font-semibold ${
                      result.isCorrect ? "text-green-800" : "text-red-800"
                    }`} data-testid="text-points-earned">
                      +{result.pointsEarned} pontos
                    </p>
                    <p className={`text-sm mt-2 ${
                      result.isCorrect ? "text-green-700" : "text-red-700"
                    }`} data-testid="text-score-display">
                      Score: {result.previousScore} → {result.previousScore + result.pointsEarned}
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      onClick={handleNext}
                      className="bg-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/90 text-white px-12 py-6 rounded-full text-lg font-semibold shadow-lg"
                      data-testid="button-next"
                    >
                      {currentQuestionIndex < questions.length - 1 ? "Next" : "Ver Resultado"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
