// frontend/src/components/SettingsPanel.tsx

import type { JSX } from "react"
import getAnswerVisuals from "./answerVisuals"
import { Label } from "@/shadcn/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shadcn/components/ui/select"
import { ScrollArea } from "@/shadcn/components/ui/scroll-area"
import type { Question } from "@/types/quiz"

interface SettingsPanelProps {
    question: Question
}

export default function SettingsPanel({ question }: SettingsPanelProps): JSX.Element {
    return (
        <aside className="flex flex-col gap-8">
            {/* Header */}
            <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#FF8A00]/20 bg-[#FF8A00]/10 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-[#FF8A00] uppercase">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#FF8A00]" />
                    Settings
                </div>

                {/* Controls */}
                <div className="space-y-5">
                    {/* Time Limit */}
                    <div className="space-y-2">
                        <Label
                            className="text-muted-foreground block text-[10px] font-bold tracking-widest uppercase"
                            htmlFor="timeLimit"
                        >
                            Question Time Limit
                        </Label>

                        <Select defaultValue="10 seconds">
                            <SelectTrigger
                                className="bg-background/70 border-border w-full rounded-xl backdrop-blur-sm transition-all focus:ring-2 focus:ring-[#00F2FF]/30"
                                id="timeLimit"
                            >
                                <SelectValue placeholder="Select time limit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10 seconds">10 seconds</SelectItem>
                                <SelectItem value="20 seconds">20 seconds</SelectItem>
                                <SelectItem value="30 seconds">30 seconds</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Points */}
                    <div className="space-y-2">
                        <Label
                            className="text-muted-foreground block text-[10px] font-bold tracking-widest uppercase"
                            htmlFor="points"
                        >
                            Points
                        </Label>

                        <Select defaultValue="1000">
                            <SelectTrigger
                                className="bg-background/70 border-border w-full rounded-xl backdrop-blur-sm transition-all focus:ring-2 focus:ring-[#00F2FF]/30"
                                id="points"
                            >
                                <SelectValue placeholder="Select points" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1000">1000</SelectItem>
                                <SelectItem value="2000">2000</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Preview */}
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#00F2FF]/20 bg-[#00F2FF]/10 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-[#00F2FF] uppercase">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#00F2FF]" />
                    Preview
                </div>

                {/* Phone Mockup */}
                <div className="bg-muted/30 border-border relative overflow-hidden rounded-[2rem] border p-4 shadow-2xl backdrop-blur-sm">
                    {/* Glow */}
                    <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#00F2FF]/10 blur-3xl" />

                    <div className="relative flex aspect-9/16 flex-col rounded-[1.5rem] border border-white/5 bg-black/20 p-3 shadow-inner">
                        {/* Question */}
                        <div className="bg-background/60 border-border mb-3 flex min-h-14 items-center justify-center rounded-2xl border p-3 text-center text-xs font-bold backdrop-blur-sm">
                            {question.question ?? "Type your question..."}
                        </div>

                        {/* Answers */}
                        <ScrollArea className="min-h-0 flex-1 pr-1">
                            <div className="grid grid-cols-2 gap-2">
                                {question.options.map((option, index) => {
                                    const visuals = getAnswerVisuals(index)

                                    return (
                                        <div
                                            key={option.id}
                                            className={`group relative flex min-h-24 flex-col items-center justify-center overflow-hidden rounded-xl border p-2 text-center shadow-lg transition-transform hover:scale-[1.02] ${
                                                option.correct
                                                    ? "border-emerald-400/60 bg-emerald-500/10"
                                                    : "bg-muted/40 border-border"
                                            }`}
                                        >
                                            {/* Background Glow */}
                                            <div
                                                className={`absolute inset-0 blur-xl transition-opacity duration-300 group-hover:opacity-40 ${
                                                    option.correct ? "opacity-35" : "opacity-20"
                                                }`}
                                                style={{
                                                    background: option.correct
                                                        ? "radial-gradient(circle, #22c55e 0%, transparent 70%)"
                                                        : visuals.glow,
                                                }}
                                            />

                                            <span
                                                className="relative z-10 mb-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-black text-white shadow-lg"
                                                style={{
                                                    background: option.correct
                                                        ? "#22c55e"
                                                        : visuals.accent,
                                                }}
                                            >
                                                {visuals.icon}
                                            </span>

                                            <span className="relative z-10 line-clamp-2 text-[9px] font-semibold text-white">
                                                {option.answer || "Answer"}
                                            </span>

                                            {option.correct ? (
                                                <span className="relative z-10 mt-2 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2 py-0.5 text-[8px] font-bold tracking-widest text-emerald-200 uppercase">
                                                    Correct
                                                </span>
                                            ) : null}
                                        </div>
                                    )
                                })}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </aside>
    )
}
