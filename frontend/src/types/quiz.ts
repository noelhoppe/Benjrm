export interface QuestionOption {
    id: string
    answer: string
    correct: boolean
}

export interface Question {
    id: string
    question: string
    type: "MULTIPLE_CHOICE" | "SINGLE_CHOICE"
    hidden: boolean
    options: QuestionOption[]
}
