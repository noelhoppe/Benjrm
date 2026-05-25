export default function getRankingClassName(ranking: number): string {
    const baseClasses =
        "transition-all duration-300 ease-out hover:scale-[1.01] hover:shadow-lg cursor-pointer"
    if (ranking === 1) {
        return `${baseClasses} bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700 hover:shadow-cyan-500/30`
    }
    if (ranking === 2) {
        return `${baseClasses} bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border-orange-300 dark:border-orange-700 hover:shadow-orange-500/30`
    }
    if (ranking === 3) {
        return `${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-300 dark:border-purple-700 hover:shadow-purple-500/30`
    }
    return `${baseClasses} bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-800 hover:shadow-gray-500/20`
}
