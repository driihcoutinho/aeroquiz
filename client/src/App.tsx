import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Quiz from "@/pages/Quiz";
import Results from "@/pages/Results";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Question, QuizSession, QuizResult, AnswerSubmission } from "@shared/schema";

type AppState = "home" | "quiz" | "results";

type QuestionWithoutAnswer = Omit<Question, 'correctAnswer' | 'explanation'>;

function QuizApp() {
  const [appState, setAppState] = useState<AppState>("home");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [questions, setQuestions] = useState<QuestionWithoutAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const startQuizMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest<{ session: QuizSession; questions: QuestionWithoutAnswer[] }>(
        "POST", 
        "/api/quiz/start", 
        {}
      );
      return response;
    },
    onSuccess: (data) => {
      setSessionId(data.session.id);
      setQuestions(data.questions);
      setCurrentScore(0);
      setCorrectAnswers(0);
      setAppState("quiz");
    },
    onError: () => {
      toast({
        title: "Erro ao iniciar quiz",
        description: "Não foi possível iniciar o quiz. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const answerMutation = useMutation({
    mutationFn: async (data: AnswerSubmission) => {
      const response = await apiRequest<QuizResult>("POST", "/api/quiz/answer", data);
      return response;
    },
    onSuccess: (result) => {
      setCurrentScore(result.currentScore);
      if (result.isCorrect) {
        setCorrectAnswers((prev) => prev + 1);
      }
    },
    onError: () => {
      toast({
        title: "Erro ao enviar resposta",
        description: "Não foi possível processar sua resposta. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleStartQuiz = () => {
    startQuizMutation.mutate();
  };

  const handleAnswer = async (questionIndex: number, selectedAnswer: number, timeSpent: number): Promise<QuizResult> => {
    if (!sessionId) throw new Error("No session ID");
    
    const result = await answerMutation.mutateAsync({
      sessionId,
      questionIndex,
      selectedAnswer,
      timeSpent,
    });
    
    return result;
  };

  const handleComplete = () => {
    setAppState("results");
  };

  const handleRestart = () => {
    setAppState("home");
    setSessionId(null);
    setCurrentScore(0);
    setCorrectAnswers(0);
  };

  const handleRetry = () => {
    setAppState("home");
    startQuizMutation.reset();
  };

  return (
    <div className="min-h-screen">
      {appState === "home" && (
        <Home 
          onStartQuiz={handleStartQuiz} 
          isLoading={startQuizMutation.isPending}
        />
      )}
      
      {appState === "quiz" && (
        <>
          {startQuizMutation.isPending && <LoadingScreen />}
          {startQuizMutation.isError && (
            <ErrorDisplay
              message="Não foi possível carregar as perguntas."
              onRetry={handleRetry}
            />
          )}
          {!startQuizMutation.isPending && !startQuizMutation.isError && questions.length > 0 && (
            <Quiz
              questions={questions as Question[]}
              onAnswer={handleAnswer}
              onComplete={handleComplete}
              currentScore={currentScore}
            />
          )}
        </>
      )}
      
      {appState === "results" && (
        <Results
          score={currentScore}
          correctAnswers={correctAnswers}
          totalQuestions={questions.length}
          onRestart={handleRestart}
        />
      )}
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <QuizApp />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
