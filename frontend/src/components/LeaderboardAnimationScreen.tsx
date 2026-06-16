import type { JSX } from "react"
import { useState, useEffect, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/shadcn/components/ui/button"
import { Avatar, AvatarFallback } from "@shadcn/components/ui/avatar"
import type { LeaderboardEntry } from "@/hooks/useGameSession"

function getRankColor(ranking: number): string {
    if (ranking === 1)
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700"
    if (ranking === 2)
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border-orange-300 dark:border-orange-700"
    if (ranking === 3)
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-300 dark:border-purple-700"
    return "bg-card text-card-foreground border-border"
}

function getMedal(rank: number): string | null {
    if (rank === 1) return "🥇"
    if (rank === 2) return "🥈"
    if (rank === 3) return "🥉"
    return null
}

function RankChangeBadge({
    settled,
    change,
}: {
    settled: boolean
    change: number
}): JSX.Element | null {
    if (!settled) return null
    if (change === 0) return <span className="text-muted-foreground">—</span>
    const color = change > 0 ? "text-green-500" : "text-red-500"
    const label = change > 0 ? `▲${change}` : `▼${Math.abs(change)}`
    return <span className={color}>{label}</span>
}

interface LeaderboardAnimationScreenProps {
    leaderboard: LeaderboardEntry[]
    previousLeaderboard: LeaderboardEntry[] | null
    isFinal: boolean
    onLeave: () => void
}

export default function LeaderboardAnimationScreen({
    leaderboard,
    previousLeaderboard,
    isFinal,
    onLeave,
}: LeaderboardAnimationScreenProps): JSX.Element {
    const sorted = useMemo(
        () => [...leaderboard].sort((a, b) => b.totalPoints - a.totalPoints),
        [leaderboard]
    )

    const prevSorted = useMemo(
        () =>
            previousLeaderboard
                ? [...previousLeaderboard].sort((a, b) => b.totalPoints - a.totalPoints)
                : null,
        [previousLeaderboard]
    )

    // useState initializers run only once on mount — safe to use prevSorted/sorted directly
    const [displayed, setDisplayed] = useState<LeaderboardEntry[]>(prevSorted ?? sorted)
    const [settled, setSettled] = useState(!prevSorted)

    // hasRunRef prevents the animation from re-triggering if prevSorted/sorted references change
    const hasRunRef = useRef(false)
    useEffect((): (() => void) | undefined => {
        if (hasRunRef.current || !prevSorted) return undefined
        hasRunRef.current = true
        const t = setTimeout(() => {
            setDisplayed(sorted)
            setSettled(true)
        }, 1200)
        return () => clearTimeout(t)
    }, [prevSorted, sorted])

    // Rank change per player id: positive = moved up, negative = moved down
    const rankChanges = useMemo<Record<string, number>>(() => {
        if (!prevSorted) return {}
        const prevRank = Object.fromEntries(prevSorted.map((e, i) => [e.id, i + 1]))
        const newRank = Object.fromEntries(sorted.map((e, i) => [e.id, i + 1]))
        return Object.fromEntries(
            sorted.map((e) => [e.id, (prevRank[e.id] ?? newRank[e.id]) - newRank[e.id]])
        )
    }, [sorted, prevSorted])

    return (
        <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-12">
            <motion.h1
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-extrabold tracking-tight uppercase sm:text-5xl"
                initial={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
            >
                {isFinal ? "Final Podium" : "Leaderboard"}
            </motion.h1>

            <div className="w-full max-w-lg">
                <AnimatePresence>
                    {displayed.map((entry, i) => {
                        const rank = sorted.findIndex((e) => e.id === entry.id) + 1
                        const change = rankChanges[entry.id] ?? 0
                        const medal = getMedal(rank)
                        const initials = entry.name.substring(0, 2).toUpperCase()

                        return (
                            <motion.div
                                key={entry.id}
                                layout
                                animate={{ opacity: 1, x: 0 }}
                                className={`mb-3 grid grid-cols-[2.5rem_3rem_1fr_auto_4rem] items-center gap-3 rounded-2xl border p-4 text-base font-semibold shadow-sm ${getRankColor(rank)}`}
                                initial={{ opacity: 0, x: -60 }}
                                layoutId={`lb-${entry.id}`}
                                transition={{
                                    layout: { type: "spring", stiffness: 250, damping: 28 },
                                    opacity: { delay: i * 0.08, duration: 0.35 },
                                    x: { delay: i * 0.08, duration: 0.35 },
                                }}
                            >
                                <div className="text-center text-xl">
                                    {medal ?? (
                                        <span className="text-muted-foreground text-sm font-bold">
                                            #{rank}
                                        </span>
                                    )}
                                </div>
                                <Avatar>
                                    <AvatarFallback>{initials}</AvatarFallback>
                                </Avatar>
                                <span className="truncate font-bold">
                                    {entry.name}
                                    {entry.emoji ? ` ${entry.emoji}` : ""}
                                </span>
                                <span className="font-bold tabular-nums">
                                    {entry.totalPoints} pts
                                </span>
                                <div className="text-right text-sm font-black">
                                    <RankChangeBadge change={change} settled={settled} />
                                </div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>

            {isFinal ? (
                <motion.div
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                    initial={{ opacity: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <p className="text-xl font-bold text-yellow-500">🏆 The quiz is finished! 🏆</p>
                    <Button
                        className="bg-red-500 px-8 py-6 text-lg font-bold text-white hover:bg-red-600"
                        onClick={onLeave}
                    >
                        Leave Game
                    </Button>
                </motion.div>
            ) : null}
        </div>
    )
}
