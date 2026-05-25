import { createContext } from "react"
import type { WebsocketService } from "@/api/websocket/service/websocketService.ts"

export default createContext<WebsocketService | null>(null)
