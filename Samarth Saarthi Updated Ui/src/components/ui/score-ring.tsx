import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ScoreRingProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const sizes = {
  sm: { container: "w-12 h-12", text: "text-xs", stroke: 3 },
  md: { container: "w-20 h-20", text: "text-lg", stroke: 4 },
  lg: { container: "w-32 h-32", text: "text-2xl", stroke: 6 },
};

export function ScoreRing({ score, size = "md", showLabel = true, className }: ScoreRingProps) {
  const { container, text, stroke } = sizes[size];
  const radius = 50 - stroke;
  const circumference = 2 * Math.PI * radius;
  const progress = ((100 - score) / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success stroke-success";
    if (score >= 60) return "text-warning stroke-warning";
    return "text-destructive stroke-destructive";
  };

  return (
    <div className={cn("relative", container, className)}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-[hsl(var(--on-surface-variant))]/20"
        />
        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          className={getScoreColor(score)}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: progress }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className={cn("font-bold", text)}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            {score}%
          </motion.span>
        </div>
      )}
    </div>
  );
}