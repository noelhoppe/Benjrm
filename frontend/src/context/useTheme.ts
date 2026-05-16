import { useContext } from "react"

import { ThemeProviderContext } from "./themeContext"
import type { ThemeProviderState } from "./themeContext"

export default function useTheme(): ThemeProviderState {
    const context = useContext(ThemeProviderContext)
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context
}
