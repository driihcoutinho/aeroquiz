import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CircularTimerProps {
  duration: number;
  onTimeUp: () => void;
  isPaused?: boolean;
}

export function CircularTimer({ duration, onTimeUp, isPaused = false }: CircularTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    setTimeLeft(duration);
    setIsUrgent(false);
  }, [duration]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 0.1;
        
        if (newTime <= 5 && !isUrgent) {
          setIsUrgent(true);
        }
        
        if (newTime <= 0) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        
        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, onTimeUp, isUrgent]);

  const percentage = (timeLeft / duration) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-24 h-24" data-testid="timer-circular">
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx="48"
          cy="48"
          r="45"
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
          className="text-muted"
        />
        <motion.circle
          cx="48"
          cy="48"
          r="45"
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={isUrgent ? "text-destructive" : "text-primary"}
          animate={isUrgent ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.5, repeat: isUrgent ? Infinity : 0 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className={`text-3xl font-bold ${isUrgent ? "text-destructive animate-pulse-glow" : "text-foreground"}`}
          data-testid="text-timer-value"
          animate={isUrgent ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: isUrgent ? Infinity : 0 }}
        >
          {Math.ceil(timeLeft)}
        </motion.span>
      </div>
    </div>
  );
}
