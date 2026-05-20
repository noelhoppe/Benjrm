import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import ThemeProvider from "./context/ThemeProvider"
import "./index.css"
import App from "./App.tsx"

const container = document.getElementById("root")
if (!container) throw new Error("Failed to find the root element")
const root = createRoot(container)

const queryClient = new QueryClient()

root.render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ThemeProvider defaultTheme="auto" storageKey="theme">
                    <App />
                </ThemeProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>
)
