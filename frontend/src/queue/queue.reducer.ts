import type { Action, QueueItem } from "@/queue/queue.types.ts"
import { upsertCreate, upsertReorder, upsertUpdate } from "@/queue/queue.builder.ts"

export default function reducer(state: QueueItem[], action: Action): QueueItem[] {
    switch (action.type) {
        case "enqueue":
            return [...state, action.item]
        case "clear":
            return []
        case "replace":
            return action.items
        case "removeQuestion":
            return state.filter(
                (item) =>
                    !(
                        item.op !== "reorder" &&
                        item.questionId === action.questionId &&
                        item.op !== "delete"
                    )
            )
        case "upsertCreate":
            return upsertCreate(state, action.questionId, action.payload, action.quizId)
        case "upsertReorder":
            return upsertReorder(state, { order: action.order }, action.quizId)
        case "upsertUpdate":
            return upsertUpdate(state, action.questionId, action.payload, action.quizId)
        default:
            return state
    }
}
