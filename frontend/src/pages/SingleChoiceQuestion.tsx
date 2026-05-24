// frontend/src/pages/SingleChoiceQuestion.tsx

import type { JSX } from "react"
import { useParams } from "react-router"

import QuestionCardContent from "../components/QuestionCardContent"
import GameSessionProvider from "@/context/GameSessionProvider"

export default function SingleChoiceQuestion(): JSX.Element {
    const { code } = useParams()

    return (
        <GameSessionProvider code={code}>
            <QuestionCardContent />
        </GameSessionProvider>
    )
}
