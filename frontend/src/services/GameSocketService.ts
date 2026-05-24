// frontend/src/services/GameSocketService.ts

import { toast } from "sonner"

type Listener = (payload: unknown) => void

export default class GameSocketService {
    private socket: WebSocket | null = null

    private listeners = new Map<string, Set<Listener>>()

    private onConnectionChange?: (isConnected: boolean) => void

    connect(
        code: string,
        playerName: string,
        onConnectionChange: (connected: boolean) => void
    ): void {
        if (this.socket?.readyState === WebSocket.OPEN) return

        this.onConnectionChange = onConnectionChange
        this.socket = new WebSocket(`ws://localhost:8080/api/v1/sessions/${code}/ws`)

        this.socket.onopen = () => {
            this.onConnectionChange?.(true)
            this.send({ command: "join", payload: { name: playerName } })
        }

        this.socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data)

                if (message.id !== undefined) {
                    this.send({ id: message.id, timestamp: Date.now() })
                    if (!message.command) return
                }

                this.notifyListeners(message.command, message)
            } catch {
                toast("Error processing server message")
            }
        }

        this.socket.onclose = () => this.onConnectionChange?.(false)
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.close()
            this.socket = null
        }
    }

    send(data: object): void {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data))
        }
    }

    subscribe(command: string, listener: Listener): () => void {
        if (!this.listeners.has(command)) {
            this.listeners.set(command, new Set())
        }
        this.listeners.get(command)?.add(listener)

        return (): void => {
            this.listeners.get(command)?.delete(listener)
        }
    }

    private notifyListeners(command: string, data: unknown): void {
        this.listeners.get(command)?.forEach((listener) => listener(data))
    }
}
