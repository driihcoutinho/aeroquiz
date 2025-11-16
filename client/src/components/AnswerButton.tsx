import { motion } from "framer-motion";
import { Circle, Square, Triangle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnswerButtonProps {
  index: number;
  text: string;
  onSelect: () => void;
  isSelected?: boolean;
  isCorrect?: boolean;
  isIncorrect?: boolean;
  disabled?: boolean;
  showResult?: boolean;
}

const SHAPES = [Triangle, Square, Circle, Star];
const COLORS = [
  { bg: "bg-[hsl(var(--quiz-red))]", border: "border-[hsl(var(--quiz-red))]" },
  { bg: "bg-[hsl(var(--quiz-blue))]", border: "border-[hsl(var(--quiz-blue))]" },
  { bg: "bg-[hsl(var(--quiz-yellow))]", border: "border-[hsl(var(--quiz-yellow))]" },
  { bg: "bg-[hsl(var(--quiz-green))]", border: "border-[hsl(var(--quiz-green))]" },
];
const LABELS = ["A", "B", "C", "D"];

export function AnswerButton({
  index,
  text,
  onSelect,
  isSelected = false,
  isCorrect = false,
  isIncorrect = false,
  disabled = false,
  showResult = false,
}: AnswerButtonProps) {
  const Shape = SHAPES[index];
  const colors = COLORS[index];
  const label = LABELS[index];

  const getBackgroundClass = () => {
    if (showResult) {
      if (isCorrect) return "bg-[hsl(var(--quiz-correct))] border-[hsl(var(--quiz-correct))]";
      if (isIncorrect) return "bg-[hsl(var(--quiz-incorrect))] border-[hsl(var(--quiz-incorrect))]";
    }
    return `${colors.bg} ${colors.border}`;
  };

  const getAnimation = () => {
    if (showResult && isIncorrect) return "shake";
    if (showResult && isCorrect) return "bounce-in";
    return undefined;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: isSelected ? 1.02 : 1,
      }}
      transition={{ duration: 0.2 }}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className="w-full"
    >
      <Button
        onClick={onSelect}
        disabled={disabled}
        className={`
          w-full h-full min-h-[140px] sm:min-h-[160px] md:min-h-[180px] p-3 sm:p-4 md:p-6 
          rounded-xl md:rounded-2xl text-white font-bold text-xs sm:text-sm md:text-lg
          shadow-lg hover:shadow-xl
          transition-all duration-200
          flex flex-col items-center justify-center gap-2
          ${getBackgroundClass()}
          ${showResult && isCorrect ? "ring-4 ring-white" : ""}
          ${showResult ? "" : "hover-elevate active-elevate-2"}
          ${disabled ? "cursor-not-allowed opacity-90" : ""}
        `}
        data-testid={`button-answer-${index}`}
        variant="ghost"
      >
        <motion.div
          animate={getAnimation()}
          className="flex flex-col items-center gap-1.5 sm:gap-2 w-full"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 w-full justify-center">
            <Shape className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 flex-shrink-0" data-testid={`icon-shape-${index}`} />
            <span className="text-xs md:text-sm font-semibold bg-white/20 px-2 py-0.5 md:px-3 md:py-1 rounded-full" data-testid={`text-label-${index}`}>
              {label}
            </span>
          </div>
          <p className="text-center leading-tight px-1 sm:px-2 break-words line-clamp-4" data-testid={`text-answer-${index}`}>
            {text}
          </p>
        </motion.div>
      </Button>
    </motion.div>
  );
}
