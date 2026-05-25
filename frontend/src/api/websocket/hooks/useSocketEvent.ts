import { useEffect } from "react"
import type { ServerEvents } from "@/api/websocket/types/serverEvents.ts"
import type { ServerEventHandler } from "@/api/websocket/types/serverEventHandler.ts"
import useWebSocketContext from "@/api/websocket/hooks/useWebSocketContext.ts"

export default function useSocketEvent<K extends keyof ServerEvents>(
    command: K,
    handler: ServerEventHandler<K>
): void {
    const websocketService = useWebSocketContext()

    useEffect(
        () => websocketService.subscribe(command, handler),
        [command, handler, websocketService]
    )
}
