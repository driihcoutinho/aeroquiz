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
import type { Question, QuizSession, QuizResult, AnswerSubmission, QuizModule } from "@shared/schema";
import { MODULE_INFO } from "@shared/schema";

type AppState = "home" | "quiz" | "results";

type QuestionWithoutAnswer = Omit<Question, 'correctAnswer' | 'explanation'>;

function QuizApp() {
  const [appState, setAppState] = useState<AppState>("home");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [questions, setQuestions] = useState<QuestionWithoutAnswer[]>([]);
  const [selectedModule, setSelectedModule] = useState<QuizModule>("misto");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const startQuizMutation = useMutation({
    mutationFn: async (module: QuizModule) => {
      const response = await apiRequest(
        "POST", 
        "/api/quiz/start", 
        { module }
      );
      return await response.json() as { session: QuizSession; questions: QuestionWithoutAnswer[] };
    },
    onSuccess: (data) => {
      if (data.questions.length === 0) {
        toast({
          title: "Nenhuma questão disponível",
          description: "Este módulo ainda não possui questões. Tente o Quiz Misto.",
          variant: "destructive",
        });
        return;
      }
      setSessionId(data.session.id);
      setQuestions(data.questions);
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
      const response = await apiRequest("POST", "/api/quiz/answer", data);
      return await response.json() as QuizResult;
    },
    onSuccess: (result) => {
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
    const module: QuizModule = "misto";
    setSelectedModule(module);
    startQuizMutation.mutate(module);
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
      
      {appState === "quiz" && questions.length > 0 && (
        <Quiz
          questions={questions as Question[]}
          onAnswer={handleAnswer}
          onComplete={handleComplete}
          moduleName={MODULE_INFO[selectedModule].name}
        />
      )}
      
      {appState === "home" && startQuizMutation.isPending && <LoadingScreen />}
      {appState === "home" && startQuizMutation.isError && (
        <ErrorDisplay
          message="Não foi possível carregar as perguntas."
          onRetry={handleRetry}
        />
      )}
      
      {appState === "results" && (
        <Results
          correctAnswers={correctAnswers}
          totalQuestions={questions.length}
          onRestart={handleRestart}
          moduleName={MODULE_INFO[selectedModule].name}
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
