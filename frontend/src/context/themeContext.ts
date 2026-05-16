import { createContext } from "react"

export type Theme = "dark" | "light" | "auto"

export interface ThemeProviderState {
    theme: Theme
    setTheme: (theme: Theme) => void
}

export const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)
