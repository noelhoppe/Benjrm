// frontend/src/context/GameSessionContext.ts

import { createContext } from "react"
import type GameSocketService from "@/services/GameSocketService"

// --- TYPES ---
export interface QuestionOption {
    id: string
    text: string
}

export interface Question {
    id: string
    question: string
    type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE"
    options: QuestionOption[]
}

export interface DisplayQuestionMessage {
    command: "displayQuestion"
    payload: Question
    timing?: string
}

export interface GameSessionContextType {
    socketService: GameSocketService | null
    isConnected: boolean
}

export const GameSessionContext = createContext<GameSessionContextType | undefined>(undefined)
