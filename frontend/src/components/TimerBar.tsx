import type { JSX } from "react"
import ProgressBar from "@/shadcn/components/ui/progress"
import { cn } from "@/shadcn/lib/utils"

interface TimerBarProps {
    timeLeft: number | null
    totalSeconds: number | null
    className?: string
}

export default function TimerBar({
    timeLeft,
    totalSeconds,
    className,
}: TimerBarProps): JSX.Element | null {
    if (timeLeft === null || totalSeconds === null || totalSeconds <= 0) return null

    const progress = Math.max(0, Math.min(100, (timeLeft / totalSeconds) * 100))
    let indicatorClassName: string
    if (progress > 60) {
        indicatorClassName = "bg-[#00D4E8]"
    } else if (progress > 30) {
        indicatorClassName = "bg-amber-400"
    } else {
        indicatorClassName = "bg-red-500"
    }

    return (
        <ProgressBar
            className={cn("h-3", className)}
            indicatorClassName={indicatorClassName}
            value={progress}
        />
    )
}
