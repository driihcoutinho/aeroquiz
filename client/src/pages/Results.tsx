import { motion } from "framer-motion";
import { Trophy, Award, Medal, Target, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ResultsProps {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  onRestart: () => void;
  moduleName?: string;
}

export default function Results({ score, correctAnswers, totalQuestions, onRestart, moduleName }: ResultsProps) {
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
  
  const getTrophyIcon = () => {
    if (accuracy >= 90) return <Trophy className="w-32 h-32 text-yellow-400" data-testid="icon-trophy" />;
    if (accuracy >= 70) return <Award className="w-32 h-32 text-gray-400" data-testid="icon-award" />;
    return <Medal className="w-32 h-32 text-amber-600" data-testid="icon-medal" />;
  };

  const getPerformanceMessage = () => {
    if (accuracy >= 90) return "Excelente!";
    if (accuracy >= 70) return "Muito Bom!";
    if (accuracy >= 50) return "Bom trabalho!";
    return "Continue praticando!";
  };

  const getPerformanceColor = () => {
    if (accuracy >= 90) return "text-yellow-500";
    if (accuracy >= 70) return "text-blue-500";
    if (accuracy >= 50) return "text-green-500";
    return "text-orange-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <Card className="p-8 md:p-12 shadow-2xl border-2">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full animate-pulse-glow" />
                <div className="relative">
                  {getTrophyIcon()}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <h1 className={`text-4xl md:text-5xl font-extrabold ${getPerformanceColor()}`} data-testid="text-performance-message">
                {getPerformanceMessage()}
              </h1>
              <p className="text-lg text-muted-foreground font-medium" data-testid="text-quiz-complete">
                Quiz Concluído
              </p>
              {moduleName && (
                <Badge variant="default" className="text-sm font-semibold px-4 py-2 mt-2" data-testid="badge-module-result">
                  {moduleName}
                </Badge>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-primary/10 rounded-2xl p-8 space-y-2"
            >
              <p className="text-sm text-muted-foreground font-semibold">Pontuação Final</p>
              <motion.p
                className="text-6xl md:text-7xl font-black text-primary"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                data-testid="text-final-score"
              >
                {score}
              </motion.p>
              <p className="text-sm text-muted-foreground">pontos</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="bg-card rounded-xl p-6 shadow-sm border space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Target className="w-6 h-6 text-primary" data-testid="icon-accuracy" />
                </div>
                <p className="text-3xl font-bold text-foreground" data-testid="text-accuracy">{accuracy}%</p>
                <p className="text-sm text-muted-foreground">Precisão</p>
                <Progress value={accuracy} className="h-2" data-testid="progress-accuracy" />
              </div>

              <div className="bg-card rounded-xl p-6 shadow-sm border space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-6 h-6 text-[hsl(var(--quiz-correct))]" data-testid="icon-correct" />
                </div>
                <p className="text-3xl font-bold text-foreground" data-testid="text-correct-answers">
                  {correctAnswers}
                </p>
                <p className="text-sm text-muted-foreground">Corretas</p>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-sm border space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <XCircle className="w-6 h-6 text-[hsl(var(--quiz-incorrect))]" data-testid="icon-incorrect" />
                </div>
                <p className="text-3xl font-bold text-foreground" data-testid="text-incorrect-answers">
                  {totalQuestions - correctAnswers}
                </p>
                <p className="text-sm text-muted-foreground">Incorretas</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-4 pt-4"
            >
              <Button
                size="lg"
                onClick={onRestart}
                className="w-full md:w-auto px-12 py-6 text-xl font-bold rounded-2xl shadow-lg hover:shadow-xl"
                data-testid="button-restart-quiz"
              >
                Tentar Novamente
              </Button>
              <p className="text-sm text-muted-foreground">
                Continue praticando para melhorar seus conhecimentos!
              </p>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
