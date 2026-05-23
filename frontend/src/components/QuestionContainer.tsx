import type { JSX } from "react"

export interface QuestionContainerProps {
    question: string | undefined
}

export function QuestionContainer({ question }: QuestionContainerProps): JSX.Element {
    return (
        <div className="bg-muted/30 relative mt-2 overflow-hidden rounded-2xl p-5 shadow-xl backdrop-blur-sm">
            <h2 className="text-center text-xl font-extrabold">
                {question ?? "Loading question..."}
            </h2>
        </div>
    )
}
