import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  progress: number;
  label?: string;
  /** Clase de fondo del indicador. Por defecto, degradado naranja→magenta (§3). */
  color?: string;
  className?: string;
}

export const ProgressBar = ({
  progress,
  label,
  color = "bg-gradient-progress",
  className = "",
}: ProgressBarProps) => {
  const clampedProgress = useMemo(
    () => Math.min(Math.max(progress, 0), 100),
    [progress]
  );

  return (
    <div className={cn("flex w-full flex-col gap-1", className)}>
      {label && (
        <div className="flex justify-between gap-2 text-xs text-muted-foreground">
          <span>{label}</span>
          <span className="font-display font-bold text-primary-text">
            {Math.round(clampedProgress)}%
          </span>
        </div>
      )}
      <Progress
        value={clampedProgress}
        aria-label={label}
        className="h-1.5 bg-muted"
        indicatorClassName={color}
      />
    </div>
  );
};
