import { useState } from "react";
import { motion } from "framer-motion";
import { Plane, Sparkles, Trophy, Target, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MODULES, MODULE_INFO, type QuizModule } from "@shared/schema";

interface HomeProps {
  onStartQuiz: (module: QuizModule) => void;
  isLoading?: boolean;
}

export default function Home({ onStartQuiz, isLoading = false }: HomeProps) {
  const [selectedModule, setSelectedModule] = useState<QuizModule>("misto");
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
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
                <span className="text-sm font-semibold text-foreground">1600 Perguntas</span>
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm font-semibold text-foreground">
                  <BookOpen className="w-4 h-4" />
                  <span>Escolha o Módulo</span>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-2 px-2">
                  {MODULES.map((module) => (
                    <button
                      key={module}
                      onClick={() => setSelectedModule(module)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                        selectedModule === module
                          ? "border-primary bg-primary/10 shadow-md"
                          : "border-border bg-card hover-elevate active-elevate-2"
                      }`}
                      data-testid={`button-module-${module}`}
                    >
                      <div className="font-semibold text-sm text-foreground">
                        {MODULE_INFO[module].name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {MODULE_INFO[module].description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <Button
                size="lg"
                onClick={() => onStartQuiz(selectedModule)}
                disabled={isLoading}
                className="w-full md:w-auto px-12 py-6 text-2xl font-bold rounded-2xl shadow-lg hover:shadow-xl"
                data-testid="button-start-quiz"
              >
                {isLoading ? "Carregando..." : "Iniciar Quiz"}
              </Button>
              <p className="text-sm text-muted-foreground">
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
