import type { LeaderboardItem } from "@/quiz/leaderboard/api/leaderboardItem.ts"
import type { LeaderboardItemProps } from "@/quiz/leaderboard/components/LeaderboardItem.tsx"

export default function getLeaderboardItemPropsList(
    items: LeaderboardItem[]
): LeaderboardItemProps[] {
    const sorted = [...items].sort((a, b) => b.points - a.points)

    let rank = 0
    let prevPoints: number | null = null
    return sorted.map((item, index) => {
        if (item.points !== prevPoints) {
            rank = index + 1
            prevPoints = item.points
        }

        return {
            ranking: rank,
            avatar: item.avatar,
            name: item.name,
            points: item.points,
        }
    })
}
