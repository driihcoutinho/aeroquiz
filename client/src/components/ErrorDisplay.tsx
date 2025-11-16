import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ message = "Algo deu errado", onRetry }: ErrorDisplayProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-destructive/10 via-background to-accent/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 shadow-xl border-2">
          <div className="text-center space-y-6">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <AlertTriangle className="w-20 h-20 text-destructive mx-auto" />
            </motion.div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Ops!</h2>
              <p className="text-muted-foreground">{message}</p>
            </div>

            {onRetry && (
              <Button
                onClick={onRetry}
                size="lg"
                className="w-full rounded-xl"
                data-testid="button-retry"
              >
                Tentar Novamente
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
