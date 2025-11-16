import { motion } from "framer-motion";
import { Plane } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-6"
      >
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Plane className="w-16 h-16 text-primary" />
        </motion.div>
        <div className="space-y-2 text-center">
          <h3 className="text-xl font-bold text-foreground">Carregando...</h3>
          <div className="flex gap-2 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-primary rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
