// frontend/src/context/GameSessionProvider

import type { ReactNode, JSX } from "react"
import { useEffect, useState, useMemo } from "react"
import { toast } from "sonner"
import { GameSessionContext } from "./GameSessionContext"
import GameSocketService from "@/services/GameSocketService"

export default function GameSessionProvider({
    code,
    children,
}: {
    code: string | undefined
    children: ReactNode
}): JSX.Element {
    const [isConnected, setIsConnected] = useState(false)

    const socketService = useMemo(() => new GameSocketService(), [])

    useEffect(() => {
        if (!code) return undefined

        socketService.connect(code, "Funny Crocodile", (connected) => {
            setIsConnected(connected)
            if (!connected) toast.error("WebSocket connection failed/closed")
        })

        return () => {
            socketService.disconnect()
        }
    }, [code, socketService])

    const contextValue = useMemo(
        () => ({ socketService, isConnected }),
        [socketService, isConnected]
    )

    return (
        <GameSessionContext.Provider value={contextValue}>{children}</GameSessionContext.Provider>
    )
}
