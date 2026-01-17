import { BadgeCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScoreRing } from "./score-ring";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface VerifiedBadgeProps {
  skill: string;
  score: number;
  verifiedAt?: string;
  confidence: "high" | "medium" | "low";
  className?: string;
  animate?: boolean;
}

const confidenceColors = {
  high: "border-success/30 bg-success/5",
  medium: "border-warning/30 bg-warning/5",
  low: "border-destructive/30 bg-destructive/5",
};

const confidenceLabels = {
  high: "High Confidence",
  medium: "Medium Confidence",
  low: "Low Confidence",
};

export function VerifiedBadge({
  skill,
  score,
  verifiedAt,
  confidence,
  className,
  animate = false,
}: VerifiedBadgeProps) {
  return (
    <motion.div
      initial={animate ? { opacity: 0, scale: 0.8, y: 20 } : false}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "relative p-4 rounded-2xl border bg-[hsl(var(--surface)/0.2)] hover:shadow-elevated-2 transition-shadow cursor-pointer gradient-border aurora-glow", // Changed to Aurora tonal card
        confidenceColors[confidence],
        className
      )}
    >
      {/* Verified stamp */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-[#4285F4] to-[#9B72CB] flex items-center justify-center aurora-glow">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Verified by Gemini AI</p>
        </TooltipContent>
      </Tooltip>

      {/* Score ring */}
      <div className="flex justify-center mb-3">
        <ScoreRing score={score} size="sm" />
      </div>

      {/* Skill name */}
      <h4 className="font-semibold text-center text-sm mb-1 truncate">{skill}</h4>

      {/* Confidence & verification */}
      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
        <BadgeCheck className="w-3 h-3 text-primary" />
        <span>{confidenceLabels[confidence]}</span>
      </div>

      {verifiedAt && (
        <p className="text-xs text-muted-foreground text-center mt-1">
          {new Date(verifiedAt).toLocaleDateString()}
        </p>
      )}
    </motion.div>
  );
}