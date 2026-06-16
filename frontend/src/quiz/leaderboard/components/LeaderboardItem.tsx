import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarImage, AvatarFallback } from "@shadcn/components/ui/avatar"
import getRankingClassName from "@/quiz/leaderboard/utils/getRankingClassName.ts"

export interface LeaderboardItemProps {
    ranking: number
    avatar?: string | undefined
    name: string
    points: number
}

export default function LeaderboardItem(leaderboardItemProps: LeaderboardItemProps): ReactNode {
    const { ranking, avatar, name, points } = leaderboardItemProps
    const rankingClassName = getRankingClassName(ranking)
    const initials = name.substring(0, 2).toUpperCase()

    let medal: string | null = null
    if (ranking === 1) medal = "🥇"
    else if (ranking === 2) medal = "🥈"
    else if (ranking === 3) medal = "🥉"

    return (
        <motion.div
            layout
            animate={{ opacity: 1, y: 0 }}
            className={`grid grid-cols-[2rem_2.5rem_1fr_auto] items-center gap-4 rounded-xl border p-4 ${rankingClassName}`}
            exit={{ opacity: 0, y: -20 }}
            initial={{ opacity: 0, y: 20 }}
            layoutId={name}
            transition={{ layout: { type: "spring", stiffness: 300, damping: 30 }, duration: 0.3 }}
        >
            <div className="text-center text-lg font-black">
                {medal ?? <span className="text-muted-foreground text-sm">#{ranking}</span>}
            </div>
            <Avatar>
                <AvatarImage alt={name} src={avatar} />
                <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="font-semibold">{name}</div>
            <div className="font-bold tabular-nums">{points} pts</div>
        </motion.div>
    )
}
