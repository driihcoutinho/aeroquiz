import { motion } from "framer-motion";
import { Plane, Sparkles, Trophy, Target, RotateCcw, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MODULES, MODULE_INFO, type QuizModule } from "@shared/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface SavedProgress {
  module: QuizModule;
  sessionId: string;
  currentQuestionIndex: number;
  correctAnswers: number;
  timestamp: number;
}

interface HomeProps {
  onStartQuiz: (module: QuizModule, continueProgress?: boolean) => void;
  isLoading?: boolean;
  savedProgress?: SavedProgress | null;
  onClearProgress: () => void;
}

export default function Home({ onStartQuiz, isLoading = false, savedProgress, onClearProgress }: HomeProps) {
  const modules: QuizModule[] = ["ess", "rpa", "pss", "cga"];
  const [showDialog, setShowDialog] = useState(false);
  const [selectedModuleForStart, setSelectedModuleForStart] = useState<QuizModule | null>(null);

  const handleModuleClick = (module: QuizModule) => {
    // Verificar se há progresso salvo para este módulo
    if (savedProgress && savedProgress.module === module) {
      setSelectedModuleForStart(module);
      setShowDialog(true);
    } else {
      onStartQuiz(module, false);
    }
  };

  const handleContinue = () => {
    if (selectedModuleForStart) {
      onStartQuiz(selectedModuleForStart, true);
      setShowDialog(false);
    }
  };

  const handleStartNew = () => {
    if (selectedModuleForStart) {
      onClearProgress();
      onStartQuiz(selectedModuleForStart, false);
      setShowDialog(false);
    }
  };
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-8 md:p-12 shadow-2xl border-2">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <Plane className="w-24 h-24 md:w-32 md:h-32 text-primary relative" data-testid="icon-plane" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h1 className="text-5xl md:text-6xl font-extrabold text-foreground tracking-tight" data-testid="text-app-title">
                AeroQuiz
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium" data-testid="text-app-subtitle">
                Quiz de Aviação Interativo
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6"
            >
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-accent/50">
                <Sparkles className="w-8 h-8 text-primary" />
                <span className="text-sm font-semibold text-foreground">1.270 Perguntas</span>
                <span className="text-xs text-muted-foreground">Banco completo ANAC</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-accent/50">
                <Target className="w-8 h-8 text-primary" />
                <span className="text-sm font-semibold text-foreground">Múltipla Escolha</span>
                <span className="text-xs text-muted-foreground">4 alternativas</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-accent/50">
                <Trophy className="w-8 h-8 text-primary" />
                <span className="text-sm font-semibold text-foreground">Sistema de Pontos</span>
                <span className="text-xs text-muted-foreground">Baseado no tempo</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-4 pt-4"
            >
              <div className="space-y-3">
                <p className="text-lg font-semibold text-foreground">Escolha um módulo:</p>
                {modules.map((module, index) => {
                  const hasProgress = savedProgress && savedProgress.module === module;
                  return (
                    <motion.div
                      key={module}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <Button
                        size="lg"
                        onClick={() => handleModuleClick(module)}
                        disabled={isLoading}
                        className="w-full px-8 py-6 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl relative"
                        data-testid={`button-module-${module}`}
                      >
                        <div className="flex flex-col items-start w-full">
                          <div className="flex items-center gap-2 w-full justify-between">
                            <span>{MODULE_INFO[module].name}</span>
                            {hasProgress && (
                              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-md">
                                Em progresso
                              </span>
                            )}
                          </div>
                          <span className="text-sm font-normal opacity-80">
                            {MODULE_INFO[module].questionCount} questões
                            {hasProgress && ` • Questão ${savedProgress.currentQuestionIndex + 1}`}
                          </span>
                        </div>
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
              <p className="text-sm text-muted-foreground pt-2">
                Teste seus conhecimentos em aviação!
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-6 border-t"
            >
              <p className="text-xs text-muted-foreground">
                Conteúdo exclusivo para Comissários de Bordo
              </p>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Continuar de onde parou?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Você tem progresso salvo neste módulo. Deseja continuar ou começar um novo quiz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDialog(false)} className="bg-secondary">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleStartNew} className="bg-secondary hover:bg-secondary/80">
              <RotateCcw className="w-4 h-4 mr-2" />
              Começar Novo
            </AlertDialogAction>
            <AlertDialogAction onClick={handleContinue} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Play className="w-4 h-4 mr-2" />
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
