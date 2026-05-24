// frontend/src/compontents/QuestionCardContent.tsx

import type { JSX } from "react"
// import { useContext } from "react"

import { toast } from "sonner"
import QuestionHeader from "@/components/QuestionHeader"
import QuestionContainer from "@/components/QuestionContainer"
import AnswerOption from "@/components/AnswerOption"

// import { GameSessionContext } from "@/context/GameSessionContext" // COMMENTED OUT FOR TESTING
// import useQuestion from "@/hooks/useQuestion" // COMMENTED OUT FOR TESTING

const ICONS = ["▲", "◆", "●", "■", "◯", "◆"]
const COLORS = ["#2d4cc9", "#ffa602", "#11c8d4", "#ff4949", "#28c28b", "#8b5cf6"]

export default function QuestionCardContent(): JSX.Element {
    // const sessionContext = useContext(GameSessionContext) // COMMENTED OUT FOR TESTING
    // const socketService = sessionContext?.socketService ?? null // COMMENTED OUT FOR TESTING

    // const { question, remainingTime, selectedAnswer, sendAnswer } = useQuestion(socketService) // COMMENTED OUT FOR TESTING

    // TODO: REMOVE MOCK DATA AFTER TESTING
    const remainingTime = 12
    const selectedAnswer = "0"
    const sendAnswer = (id: string) => {
        toast.success("Answer Submitted", {
            description: `Mock data recorded for: ${id}`,

            duration: 2000,
        })
    }

    const question = {
        question: "Why did the developer go broke?",

        options: [
            { id: "opt_1", text: "Because they used up all their cache" },

            { id: "opt_2", text: "Because Docker ate their wallet" },

            { id: "opt_3", text: "Too many unhandled promises" },

            { id: "opt_4", text: "They bought a mechanical keyboard" },
        ],
    }

    // MOCK DATA END

    return (
        <div className="bg-background text-foreground min-h-screen px-4 py-8">
            <div className="mx-auto flex max-w-md flex-col gap-6">
                <QuestionHeader
                    currentQuestion={1}
                    playerName="Funny Crocodile"
                    remainingTime={remainingTime}
                    totalQuestions={10}
                />

                <QuestionContainer question={question?.question} />

                <div className="grid grid-cols-2 gap-4">
                    {question?.options?.map((option, i) => (
                        <AnswerOption
                            key={option.id}
                            color={COLORS[i % COLORS.length]}
                            icon={ICONS[i % ICONS.length]}
                            index={i}
                            isSelected={selectedAnswer === option.id}
                            onSelect={() => sendAnswer(option.id)}
                            text={option.text}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
