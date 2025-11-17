import { motion } from "framer-motion";
import { Plane, Sparkles, Trophy, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MODULES, MODULE_INFO, type QuizModule } from "@shared/schema";

interface HomeProps {
  onStartQuiz: (module: QuizModule) => void;
  isLoading?: boolean;
}

export default function Home({ onStartQuiz, isLoading = false }: HomeProps) {
  const modules: QuizModule[] = ["ess", "rpa", "pss", "cga"];
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
                {modules.map((module, index) => (
                  <motion.div
                    key={module}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <Button
                      size="lg"
                      onClick={() => onStartQuiz(module)}
                      disabled={isLoading}
                      className="w-full px-8 py-6 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl"
                      data-testid={`button-module-${module}`}
                    >
                      <div className="flex flex-col items-start w-full">
                        <span>{MODULE_INFO[module].name}</span>
                        <span className="text-sm font-normal opacity-80">
                          {MODULE_INFO[module].questionCount} questões
                        </span>
                      </div>
                    </Button>
                  </motion.div>
                ))}
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
    </div>
  );
}
