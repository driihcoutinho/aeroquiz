import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full space-y-2" data-testid="progress-bar">
      <div className="flex justify-between items-center px-1">
        <span className="text-sm font-semibold text-muted-foreground">
          Pergunta {current} de {total}
        </span>
        <motion.span
          className="text-sm font-bold text-primary"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.3 }}
          key={current}
        >
          {Math.round(percentage)}%
        </motion.span>
      </div>
      <Progress 
        value={percentage} 
        className="h-3 bg-muted shadow-inner"
        data-testid="progress-value"
      />
    </div>
  );
}
