/**
 * Package for WebSocket-related API hooks.
 * It supports managing WebSocket connection lifecycle and event handling for sending and receiving typed events in a bidirectional way.
 */
import useWebSocket from "@/api/websocket/hooks/useWebSocket.ts"
import useSocketEvent from "@/api/websocket/hooks/useSocketEvent.ts"
import useWebSocketContext from "@/api/websocket/hooks/useWebSocketContext.ts"

export { useWebSocket, useSocketEvent, useWebSocketContext }

// How to import:
// import { useWebSocket } from "@/api/websocket"
// import { useSocketEvent } from "@/api/websocket"
// import { useWebSocketContext } from "@/api/websocket"
// import { useWebSocket, useSocketEvent, usewebSocketContext } from "@/api/websocket"
