import type { JSX } from "react"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router"
import { toast } from "sonner"

import { QuestionHeader } from "../components/QuestionHeader"
import { QuestionContainer } from "../components/QuestionContainer"
import { AnswerOption } from "@/components/AnswerOption"

interface QuestionOption {
    id: string
    text: string
}

interface Question {
    id: string
    question: string
    type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE"
    options: QuestionOption[]
}

interface DisplayQuestionMessage {
    command: "displayQuestion"
    payload: Question
    timing?: string
}

const ICONS = ["▲", "◆", "●", "■", "◯", "◆"]
const COLORS = ["#2d4cc9", "#ffa602", "#11c8d4", "#ff4949", "#28c28b", "#8b5cf6"]

// Mock data for development
const MOCK_QUESTION: Question = {
    id: "mock-123",
    question: "What is the airspeed velocity of an unladen swallow?",
    type: "SINGLE_CHOICE",
    options: [
        { id: "opt-1", text: "12 mph" },
        { id: "opt-2", text: "24 mph" },
        { id: "opt-3", text: "African or European?" },
        { id: "opt-4", text: "42 mph" },
    ],
}

export default function SingleChoiceQuestion(): JSX.Element {
    const { code } = useParams()

    const [question, setQuestion] = useState<Question | null>(MOCK_QUESTION)
    const [selected, setSelected] = useState<string | null>(null)

    const [remainingTime, setRemainingTime] = useState<number | null>(30)

    const socketRef = useRef<WebSocket | null>(null)
    const timerRef = useRef<number | null>(null)

    useEffect(() => {
        if (!code) return undefined

        const socket = new WebSocket(`ws://localhost:8080/api/v1/sessions/${code}/ws`)
        socketRef.current = socket

        socket.onopen = () => {
            socket.send(
                JSON.stringify({
                    command: "join",
                    payload: {
                        name: "Funny Crocodile", // Eventually pull this from user state
                    },
                })
            )
        }

        socket.onmessage = (event: MessageEvent) => {
            try {
                const message = JSON.parse(event.data)

                // Handle server pings
                if (message.id !== undefined) {
                    socket.send(
                        JSON.stringify({
                            id: message.id,
                            timestamp: Date.now(),
                        })
                    )

                    // Only return if it's purely a ping message without a command
                    if (!message.command) return
                }

                switch (message.command) {
                    case "displayQuestion": {
                        const data = message as DisplayQuestionMessage
                        setQuestion(data.payload)
                        setSelected(null)

                        if (timerRef.current) {
                            window.clearInterval(timerRef.current)
                        }

                        if (data.timing) {
                            const end = new Date(data.timing).getTime()

                            const updateTimer = () => {
                                const left = Math.max(0, Math.floor((end - Date.now()) / 1000))
                                setRemainingTime(left)

                                if (left === 0 && timerRef.current) {
                                    window.clearInterval(timerRef.current)
                                }
                            }

                            updateTimer()
                            timerRef.current = window.setInterval(updateTimer, 1000)
                        } else {
                            // Set to null if no time limit
                            setRemainingTime(null)
                        }
                        break
                    }

                    case "questionResult":
                        toast.success(`+${message.payload.points} points`)
                        break

                    case "updateLeaderboard":
                        // TODO: Build leaderboard UI
                        break

                    default:
                        // Silently ignore unknown commands
                        break
                }
            } catch {
                toast.error("Error processing server message")
            }
        }

        socket.onerror = () => {
            toast.error("WebSocket connection failed")
        }

        socket.onclose = () => {
            // Handle normal disconnects silently (e.g. user navigating away)
        }

        return () => {
            if (timerRef.current) {
                window.clearInterval(timerRef.current)
            }
            if (
                socket.readyState === WebSocket.OPEN ||
                socket.readyState === WebSocket.CONNECTING
            ) {
                socket.close()
            }
        }
    }, [code])

    const handleSelect = (index: number) => {
        if (!question) return

        const answerId = question.options[index].id
        setSelected(answerId)

        socketRef.current?.send(
            JSON.stringify({
                command: "answerQuestion",
                payload: {
                    answers: [answerId],
                },
            })
        )
    }

    return (
        <div className="bg-background text-foreground min-h-screen px-4 py-8">
            <div className="mx-auto max-w-md">
                <QuestionHeader
                    currentQuestion={1}
                    playerName="Funny Crocodile"
                    remainingTime={remainingTime}
                    totalQuestions={10}
                />

                <QuestionContainer question={question?.question} />

                <div className="mt-6 grid grid-cols-2 gap-4">
                    {question?.options?.map((option, i) => (
                        <AnswerOption
                            key={option.id}
                            color={COLORS[i % COLORS.length]}
                            icon={ICONS[i % ICONS.length]}
                            index={i}
                            isSelected={selected === option.id}
                            onSelect={handleSelect}
                            text={option.text}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
