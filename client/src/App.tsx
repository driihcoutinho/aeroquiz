import { useState, useEffect } from "react";
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

interface SavedProgress {
  module: QuizModule;
  sessionId: string;
  currentQuestionIndex: number;
  correctAnswers: number;
  questions: QuestionWithoutAnswer[];
  timestamp: number;
}

function QuizApp() {
  const [appState, setAppState] = useState<AppState>("home");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [questions, setQuestions] = useState<QuestionWithoutAnswer[]>([]);
  const [selectedModule, setSelectedModule] = useState<QuizModule>("misto");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [savedProgress, setSavedProgress] = useState<SavedProgress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Carregar progresso salvo ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem('quiz-progress');
    if (saved) {
      try {
        const progress: SavedProgress = JSON.parse(saved);
        // Verificar se o progresso não expirou (24 horas)
        const now = Date.now();
        if (now - progress.timestamp < 24 * 60 * 60 * 1000) {
          setSavedProgress(progress);
        } else {
          localStorage.removeItem('quiz-progress');
        }
      } catch (e) {
        localStorage.removeItem('quiz-progress');
      }
    }
  }, []);

  // Salvar progresso
  const saveProgress = () => {
    if (sessionId && questions.length > 0 && selectedModule) {
      const progress: SavedProgress = {
        module: selectedModule,
        sessionId,
        currentQuestionIndex,
        correctAnswers,
        questions,
        timestamp: Date.now(),
      };
      localStorage.setItem('quiz-progress', JSON.stringify(progress));
    }
  };

  // Limpar progresso salvo
  const clearProgress = () => {
    localStorage.removeItem('quiz-progress');
    setSavedProgress(null);
  };

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

  const handleStartQuiz = (module: QuizModule, continueProgress = false) => {
    setSelectedModule(module);
    
    // Se está continuando progresso salvo
    if (continueProgress && savedProgress && savedProgress.module === module) {
      setSessionId(savedProgress.sessionId);
      setQuestions(savedProgress.questions);
      setCorrectAnswers(savedProgress.correctAnswers);
      setCurrentQuestionIndex(savedProgress.currentQuestionIndex);
      setAppState("quiz");
      return;
    }
    
    // Começar novo quiz
    clearProgress();
    setCurrentQuestionIndex(0);
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
    clearProgress();
    setAppState("results");
  };

  const handleRestartQuiz = () => {
    if (selectedModule) {
      clearProgress();
      setCurrentQuestionIndex(0);
      startQuizMutation.mutate(selectedModule);
    }
  };

  const handleGoHome = () => {
    saveProgress();
    setAppState("home");
  };

  const handleProgress = (index: number, additionalCorrect: number) => {
    setCurrentQuestionIndex(index);
    setCorrectAnswers(prev => prev + additionalCorrect);
    saveProgress();
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
          savedProgress={savedProgress}
          onClearProgress={clearProgress}
        />
      )}
      
      {appState === "quiz" && questions.length > 0 && (
        <Quiz
          questions={questions as Question[]}
          onAnswer={handleAnswer}
          onComplete={handleComplete}
          onProgress={handleProgress}
          initialQuestionIndex={currentQuestionIndex}
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
          onRestart={handleRestartQuiz}
          onGoHome={handleGoHome}
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
