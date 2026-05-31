import type { Modifier } from "@dnd-kit/core"
import type { Question } from "@/types/quiz"
import type { QuestionApiRequest } from "@/api/questions/types/question.api"

export interface QuestionApiResponse {
    id: string
    question: string
    type: Question["type"]
    hidden: boolean
    options: {
        id: string
        answer?: string
        correct: boolean
    }[]
}

export function createEmptyQuestion(): Question {
    return {
        id: crypto.randomUUID(),
        question: "",
        options: [
            { id: crypto.randomUUID(), answer: "", correct: false },
            { id: crypto.randomUUID(), answer: "", correct: false },
        ],
        type: "MULTIPLE_CHOICE",
        hidden: false,
    }
}

export function questionToRequest(question: Question): QuestionApiRequest {
    return {
        question: question.question,
        type: question.type,
        hidden: question.hidden,
        options: question.options.map(({ answer, correct }) => ({ answer, correct })),
    }
}

export function responseToQuestion(response: unknown): Question {
    const resp = (response as Partial<QuestionApiResponse>) ?? {}

    const optionsRaw = Array.isArray(resp.options) ? resp.options : []

    const options = optionsRaw.map((opt) => {
        const o = opt as Record<string, unknown>
        const id = typeof o.id === "string" ? o.id : String(o.id ?? crypto.randomUUID())
        const answer = typeof o.answer === "string" ? o.answer : String(o.answer ?? "")
        const correct = typeof o.correct === "boolean" ? o.correct : Boolean(o.correct)
        return { id, answer, correct }
    })

    const id = typeof resp.id === "string" ? resp.id : String(resp.id ?? crypto.randomUUID())
    const questionText =
        typeof resp.question === "string" ? resp.question : String(resp.question ?? "")
    const type = (resp.type as Question["type"]) ?? "MULTIPLE_CHOICE"
    const hidden = typeof resp.hidden === "boolean" ? resp.hidden : Boolean(resp.hidden)

    return {
        id,
        question: questionText,
        type,
        hidden,
        options,
    }
}

export interface QuizDraftStorage {
    questions: Question[]
    currentQuestionIndex: number
    savedAt: string
}

export const restrictToVerticalAxis: Modifier = ({ transform }) => ({
    ...transform,
    x: 0,
})
