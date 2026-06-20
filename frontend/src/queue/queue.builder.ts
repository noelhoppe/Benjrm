import type {
    CreateQuestionQueueItem,
    QueueItem,
    ReorderQueueItem,
    UpdateQuestionQueueItem,
} from "@/queue/queue.types.ts"

function buildCreateQuestionQueueItem(
    questionId: string,
    payload: CreateQuestionQueueItem["payload"],
    quizId?: string
): CreateQuestionQueueItem {
    return {
        id: `create-${questionId}-${Date.now()}`,
        op: "create",
        questionId,
        payload,
        quizId: quizId ?? "",
    }
}

export function upsertCreate(
    state: QueueItem[],
    questionId: string,
    payload: CreateQuestionQueueItem["payload"],
    quizId?: string
): QueueItem[] {
    const filtered = state.filter((i) => !(i.op === "create" && i.questionId === questionId))
    return [...filtered, buildCreateQuestionQueueItem(questionId, payload, quizId)]
}

function buildUpdateQuestionQueueItem(
    questionId: string,
    payload: UpdateQuestionQueueItem["payload"],
    quizId?: string
): UpdateQuestionQueueItem {
    return {
        id: `update-${questionId}-${Date.now()}`,
        op: "update",
        questionId,
        payload,
        quizId: quizId ?? "",
    }
}

export function upsertUpdate(
    state: QueueItem[],
    questionId: string,
    payload: UpdateQuestionQueueItem["payload"],
    quizId?: string
): QueueItem[] {
    const filtered = state.filter((i) => !(i.op === "update" && i.questionId === questionId))
    return [...filtered, buildUpdateQuestionQueueItem(questionId, payload, quizId)]
}

function buildReorderQueueItem(
    payload: ReorderQueueItem["payload"],
    quizId?: string
): ReorderQueueItem {
    return {
        id: `reorder-${Date.now()}`,
        op: "reorder",
        payload,
        quizId: quizId ?? "",
    }
}

export function upsertReorder(
    state: QueueItem[],
    payload: ReorderQueueItem["payload"],
    quizId?: string
): QueueItem[] {
    const filtered = state.filter((i) => i.op !== "reorder")
    return [...filtered, buildReorderQueueItem(payload, quizId)]
}
