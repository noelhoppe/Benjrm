import type { LeaderboardItem } from "@/quiz/leaderboard/api/leaderboardItem.ts"
import type { LeaderboardItemProps } from "@/quiz/leaderboard/components/LeaderboardItem.tsx"

export default function getLeaderboardItemPropsList(
    items: LeaderboardItem[]
): LeaderboardItemProps[] {
    const sorted = [...items].sort((a, b) => b.points - a.points)

    let prevPoints: number | null = null
    let currentRank = 1
    let rank = 1

    return sorted.map((item) => {
        if (item.points !== prevPoints) {
            rank = currentRank
            prevPoints = item.points
            currentRank += 1
        }
        return {
            ranking: rank,
            avatar: item.avatar,
            name: item.name,
            points: item.points,
        }
    })
}
