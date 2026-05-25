import { useEffect } from "react"
import type { WebsocketService } from "@/api/websocket/service/websocketService.ts"
import useWebSocketContext from "@/api/websocket/hooks/useWebSocketContext.ts"

export default function useWebSocket(code: number): WebsocketService {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws"
    const { host } = window.location
    const wsUrl = `${protocol}://${host}/sessions/${code}/ws`

    const websocketService = useWebSocketContext()

    useEffect(() => {
        websocketService.connect(wsUrl)
        return () => websocketService.disconnect()
    }, [wsUrl, websocketService])

    return websocketService
}
