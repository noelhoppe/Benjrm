// frontend/src/components/AnswerCard.tsx

import type { JSX } from "react"
import { Check, Trash2 } from "lucide-react"
import { Textarea } from "@/shadcn/components/ui/textarea"
import { Button } from "@/shadcn/components/ui/button"

export interface AnswerCardProps {
    icon: string
    placeholder: string
    value: string
    onChange: (val: string) => void
    onToggleCorrect: () => void
    correct: boolean
    onDelete?: () => void
    accent: string
    glow: string
    canDelete?: boolean
}

export default function AnswerCard({
    icon,
    placeholder,
    value,
    onChange,
    onToggleCorrect,
    correct,
    onDelete,
    accent,
    glow,
    canDelete = false,
}: AnswerCardProps): JSX.Element {
    return (
        <div
            className="bg-muted/40 border-border group relative overflow-hidden rounded-2xl border p-3 shadow-lg backdrop-blur-sm transition-all hover:scale-[1.01] sm:p-5"
            style={{
                boxShadow: `0 0 0 rgba(0,0,0,0)`,
            }}
        >
            {/* Hover Glow */}
            <div
                className="absolute inset-0 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-20"
                style={{
                    background: glow,
                }}
            />

            <div className="relative flex flex-col gap-3">
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-start sm:gap-4">
                    <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-black text-white shadow-lg sm:h-11 sm:w-11 sm:rounded-xl sm:text-lg"
                        style={{
                            background: accent,
                        }}
                    >
                        {icon}
                    </div>

                    <Textarea
                        className="placeholder:text-muted-foreground/60 h-28 w-full resize-none overflow-y-auto border-none bg-transparent p-0 text-lg leading-7 font-semibold shadow-none focus-visible:ring-0 sm:h-24 sm:text-lg"
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        rows={2}
                        style={{ fieldSizing: "fixed" }}
                        value={value}
                    />
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    {canDelete && onDelete ? (
                        <Button
                            aria-label="Delete answer option"
                            className="h-8 w-full gap-2 rounded-full border border-white/10 bg-black/20 px-3 text-[10px] font-bold tracking-widest text-white shadow-none hover:bg-red-500/90 hover:text-white sm:w-auto"
                            onClick={onDelete}
                            type="button"
                            variant="ghost"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                        </Button>
                    ) : (
                        <span />
                    )}

                    <Button
                        aria-pressed={correct}
                        onClick={onToggleCorrect}
                        type="button"
                        variant="ghost"
                        className={`h-8 w-full gap-2 rounded-full px-3 text-[10px] font-bold tracking-widest shadow-none transition-colors sm:w-auto ${
                            correct
                                ? "border-emerald-400/40 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/25"
                                : "border-white/10 bg-black/20 text-white hover:bg-white/10"
                        }`}
                    >
                        <Check className="h-3.5 w-3.5" />
                        Correct
                    </Button>
                </div>
            </div>
        </div>
    )
}
