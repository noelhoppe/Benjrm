// frontend/src/components/QuestionAnswerOptions.tsx

import type { JSX } from "react"
import OrderOptions from "./OrderOptions"
import StandardOptions from "./StandardOptions"
import type { QuestionOption, Question } from "@/types/question"

interface QuestionAnswerOptionsProps {
    onAddOption: () => void
    onDeleteOption: (index: number) => void
    onChange: (index: number, value: string) => void
    onToggleCorrect: (index: number) => void
    onReorderOptions: (activeId: string, overId: string) => void
    options: QuestionOption[]
    type?: Question["type"]
    errorAffectedAnswers: number[]
}

export default function QuestionAnswerOptions({
    onAddOption,
    onDeleteOption,
    onChange,
    onToggleCorrect,
    onReorderOptions,
    options,
    type,
    errorAffectedAnswers,
}: QuestionAnswerOptionsProps): JSX.Element {
    if (type === "ORDER") {
        return (
            <OrderOptions
                errorAffectedAnswers={errorAffectedAnswers}
                onAddOption={onAddOption}
                onChange={onChange}
                onDeleteOption={onDeleteOption}
                onReorderOptions={onReorderOptions}
                options={options}
            />
        )
    }

    return (
        <StandardOptions
            errorAffectedAnswers={errorAffectedAnswers}
            onAddOption={onAddOption}
            onChange={onChange}
            onDeleteOption={onDeleteOption}
            onToggleCorrect={onToggleCorrect}
            options={options}
        />
    )
}
