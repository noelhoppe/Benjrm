// frontend/src/hooks/useQuestion.ts

import { useState, useEffect, useRef, useCallback } from "react"
import { toast } from "sonner"
import type { Question, DisplayQuestionMessage } from "@/context/GameSessionContext"
import type GameSocketService from "@/services/GameSocketService"

export interface UseQuestionReturn {
    question: Question | null
    remainingTime: number | null
    selectedAnswer: string | null
    sendAnswer: (answerId: string) => void
}

export interface QuestionResultMessage {
    payload: {
        points: number
    }
}

export default function useQuestion(socketService: GameSocketService | null): UseQuestionReturn {
    const [question, setQuestion] = useState<Question | null>(null)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [remainingTime, setRemainingTime] = useState<number | null>(null)
    const timerRef = useRef<number | null>(null)

    useEffect(() => {
        if (!socketService) return undefined

        const handleDisplayQuestion = (message: unknown) => {
            const data = message as DisplayQuestionMessage
            setQuestion(data.payload)
            setSelectedAnswer(null)

            if (timerRef.current) window.clearInterval(timerRef.current)

            if (data.timing) {
                const end = new Date(data.timing).getTime()
                const updateTimer = () => {
                    const left = Math.max(0, Math.floor((end - Date.now()) / 1000))
                    setRemainingTime(left)
                    if (left === 0 && timerRef.current) window.clearInterval(timerRef.current)
                }
                updateTimer()
                timerRef.current = window.setInterval(updateTimer, 1000)
            } else {
                setRemainingTime(null)
            }
        }

        const handleQuestionResult = (message: unknown) => {
            const data = message as QuestionResultMessage
            toast.success(`+${data.payload.points} points`)
        }

        const unsubDisplay = socketService.subscribe("displayQuestion", handleDisplayQuestion)
        const unsubResult = socketService.subscribe("questionResult", handleQuestionResult)

        return () => {
            unsubDisplay()
            unsubResult()
            if (timerRef.current) window.clearInterval(timerRef.current)
        }
    }, [socketService])

    const sendAnswer = useCallback(
        (answerId: string) => {
            if (!question || !socketService) return
            setSelectedAnswer(answerId)
            socketService.send({
                command: "answerQuestion",
                payload: { answers: [answerId] },
            })
        },
        [question, socketService]
    )

    return { question, remainingTime, selectedAnswer, sendAnswer }
}
