import { useMemo } from "react";

export interface ProgressBarProps {
    progress: number;
    label?: string;
    color?: string;
    className?: string;
}

export const ProgressBar = ({
    progress,
    label,
    color = "bg-primary",
    className = "",
}: ProgressBarProps) => {
    const clampedProgress = useMemo(() => Math.min(Math.max(progress, 0), 100), [progress]);

    return (
        <div className={`w-full flex flex-col gap-1 ${className}`}>
            {label && (
                <div className="flex text-xs text-neutral-400 gap-2">
                    <span>{label}</span>
                    <span className="text-primary font-bold">{Math.round(clampedProgress)}%</span>
                </div>
            )}
            <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-300 ${color}`}
                    style={{ width: `${clampedProgress}%` }}
                />
            </div>
        </div>
    );
};
