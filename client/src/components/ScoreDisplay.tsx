import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

interface ScoreDisplayProps {
  score: number;
  animate?: boolean;
}

export function ScoreDisplay({ score, animate = false }: ScoreDisplayProps) {
  return (
    <motion.div
      className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-xl border border-primary/20"
      initial={animate ? { scale: 0.8, opacity: 0 } : {}}
      animate={animate ? { scale: 1, opacity: 1 } : {}}
      transition={{ type: "spring", stiffness: 200 }}
      data-testid="score-display"
    >
      <Trophy className="w-5 h-5 text-primary" />
      <div className="flex flex-col">
        <span className="text-xs font-medium text-muted-foreground">Pontos</span>
        <motion.span
          className="text-xl font-bold text-primary"
          key={score}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          data-testid="text-score-value"
        >
          {score}
        </motion.span>
      </div>
    </motion.div>
  );
}
