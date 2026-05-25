import { useEffect, useRef } from "react"
import type { ServerEvents } from "@/api/websocket/types/serverEvents.ts"
import type { ServerEventHandler } from "@/api/websocket/types/serverEventHandler.ts"
import useWebSocketContext from "@/api/websocket/hooks/useWebSocketContext.ts"

export default function useSocketEvent<K extends keyof ServerEvents>(
    command: K,
    handler: ServerEventHandler<K>
): void {
    const websocketService = useWebSocketContext()

    const handlerRef = useRef(handler)
    useEffect(() => {
        handlerRef.current = handler
    }, [handler])

    useEffect(
        () =>
            websocketService.subscribe(command, (payload, timing) => {
                handlerRef.current(payload, timing)
            }),
        [command, websocketService]
    )
}
