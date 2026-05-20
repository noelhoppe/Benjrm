import { useContext } from "react"

import { ThemeProviderContext } from "./ThemeContext"
import type { ThemeProviderState } from "./ThemeContext"

export default function useTheme(): ThemeProviderState {
    const context = useContext(ThemeProviderContext)
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context
}
