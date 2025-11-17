import { motion } from "framer-motion";
import { Trophy, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ResultsProps {
  correctAnswers: number;
  totalQuestions: number;
  onRestart: () => void;
  moduleName?: string;
}

export default function Results({ correctAnswers, totalQuestions, onRestart, moduleName }: ResultsProps) {
  const incorrectAnswers = totalQuestions - correctAnswers;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
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
                <Trophy className="w-24 h-24 md:w-32 md:h-32 text-primary relative" data-testid="icon-trophy" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground" data-testid="text-results-title">
                Módulo Concluído!
              </h1>
              {moduleName && (
                <p className="text-lg text-muted-foreground font-medium" data-testid="text-module-name">
                  {moduleName}
                </p>
              )}
              <p className="text-2xl text-muted-foreground font-semibold" data-testid="text-percentage">
                {percentage}% de acerto
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-green-100 border-2 border-green-500">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                  <span className="text-4xl font-bold text-green-900" data-testid="text-correct">{correctAnswers}</span>
                  <span className="text-sm font-semibold text-green-800">Acertos</span>
                </div>
                <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-red-100 border-2 border-red-500">
                  <XCircle className="w-12 h-12 text-red-600" />
                  <span className="text-4xl font-bold text-red-900" data-testid="text-incorrect">{incorrectAnswers}</span>
                  <span className="text-sm font-semibold text-red-800">Erros</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-4 pt-4"
            >
              <Button
                size="lg"
                onClick={onRestart}
                className="w-full px-8 py-6 text-xl font-bold rounded-2xl shadow-lg hover:shadow-xl"
                data-testid="button-restart"
              >
                <RotateCcw className="w-6 h-6 mr-2" />
                Reiniciar Módulo
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
