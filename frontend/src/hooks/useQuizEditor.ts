import { useEffect, useMemo, useRef, useState } from "react"
import { arrayMove } from "@dnd-kit/sortable"
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core"
import { useQuiz, useDeleteQuiz } from "@/api/queries"
import { useCreateQuestion, useDeleteQuestion, useQuestions } from "@/api/questions"
import type { Question } from "@/types/quiz"
import { createEmptyQuestion, questionToRequest, responseToQuestion } from "@/pages/quiz/quizUtils"
import useQuestionChangeQueue from "@/hooks/useQuestionChangeQueue"
import type { QueueItem } from "@/hooks/useQuestionChangeQueue"
import type { QuestionApiRequest } from "@/api/questions/types/question.api.ts"

export interface UseQuizEditorResult {
    quiz: unknown
    quizTitle: string
    quizDescription: string
    isLoading: boolean
    error: unknown
    isLoadingQuestions: boolean
    questionLoadError: unknown
    questions: Question[]
    currentQuestionIndex: number
    setCurrentQuestionIndex: (n: number) => void
    currentQuestion: Question
    questionIds: string[]
    activeQuestionId: string | null
    setActiveQuestionId: (id: string | null) => void
    handleDragStart: (e: DragStartEvent) => void
    handleDragEnd: (e: DragEndEvent) => void
    handleDragCancel: () => void
    reorderQuestions: (a: string, b: string) => void
    updateQuestion: (data: Partial<Question>) => void
    updateOption: (index: number, value: string) => void
    toggleOptionCorrect: (index: number) => void
    deleteQuestion: (index: number) => void
    handleAddQuestion: () => void
    handleAddOption: () => void
    handleDeleteOption: (index: number) => void
    handleSaveQuestions: () => Promise<{ ok: boolean; error?: string }>
    isSavingQuestions: boolean
    saveSuccess: string | null
    isSaveSuccessVisible: boolean
    hasUnsavedChanges: boolean
    setHasUnsavedChanges: (b: boolean) => void
    enqueue: (item: QueueItem) => void
    flush: () => Promise<{ items: unknown[]; idMap: Record<string, string> } | null>
    upsertReorder: (order: string[]) => void
    upsertUpdate: (id: string, payload: Partial<QuestionApiRequest>) => void
    deleteQuizMutation: ReturnType<typeof useDeleteQuiz>
    hasInitializedQuestions: boolean
}

export default function useQuizEditor(quizId?: string): UseQuizEditorResult {
    const { data: quiz, isLoading, error } = useQuiz(quizId)
    const deleteQuizMutation = useDeleteQuiz()
    const {
        data: savedQuestions,
        isLoading: isLoadingQuestions,
        error: questionLoadError,
    } = useQuestions(quizId)
    const createQuestionMutation = useCreateQuestion(quizId)
    const deleteQuestionMutation = useDeleteQuestion(quizId)

    const quizTitle = quiz?.title ?? "Untitled"
    const quizDescription = quiz?.description ?? ""

    const [questions, setQuestions] = useState<Question[]>([createEmptyQuestion()])
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
    const [hasInitializedQuestions, setHasInitializedQuestions] = useState(false)
    const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(!quizId)
    const [isSavingQuestions, setIsSavingQuestions] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState<string | null>(null)
    const [isSaveSuccessVisible, setIsSaveSuccessVisible] = useState(false)

    const saveTimeoutRef = useRef<number | null>(null)
    const saveSuccessHideTimeoutRef = useRef<number | null>(null)
    const saveSuccessCleanupTimeoutRef = useRef<number | null>(null)
    const reorderTimeoutRef = useRef<number | null>(null)

    const { enqueue, flush, upsertReorder, upsertUpdate } = useQuestionChangeQueue(quizId)

    useEffect(() => {
        if (!quizId) return
        if (hasInitializedQuestions) return
        if (!savedQuestions) return

        const nextQuestions =
            savedQuestions.length > 0
                ? savedQuestions.map((response) => responseToQuestion(response))
                : [createEmptyQuestion()]

        setTimeout(() => {
            setQuestions(nextQuestions)
            setCurrentQuestionIndex((prev) => Math.min(prev, Math.max(nextQuestions.length - 1, 0)))
            setHasUnsavedChanges(false)
            setHasInitializedQuestions(true)
        }, 0)
    }, [quizId, savedQuestions, hasInitializedQuestions])

    useEffect(
        () => () => {
            if (saveTimeoutRef.current) window.clearTimeout(saveTimeoutRef.current)
            if (saveSuccessHideTimeoutRef.current)
                window.clearTimeout(saveSuccessHideTimeoutRef.current)
            if (saveSuccessCleanupTimeoutRef.current)
                window.clearTimeout(saveSuccessCleanupTimeoutRef.current)
            if (reorderTimeoutRef.current) window.clearTimeout(reorderTimeoutRef.current)
        },
        []
    )

    const markUnsavedChanges = () => {
        setHasUnsavedChanges(true)
        setIsSaveSuccessVisible(false)
        setSaveSuccess(null)

        if (saveSuccessHideTimeoutRef.current) {
            window.clearTimeout(saveSuccessHideTimeoutRef.current)
            saveSuccessHideTimeoutRef.current = null
        }

        if (saveSuccessCleanupTimeoutRef.current) {
            window.clearTimeout(saveSuccessCleanupTimeoutRef.current)
            saveSuccessCleanupTimeoutRef.current = null
        }
    }

    const currentQuestion = questions[currentQuestionIndex] ?? questions[0] ?? createEmptyQuestion()
    const questionIds = useMemo(() => questions.map((q) => q.id), [questions])

    const reorderQuestions = (activeId: string, overId: string) => {
        markUnsavedChanges()

        const selectedQuestionId = questions[currentQuestionIndex]?.id ?? null

        setQuestions((prevQuestions) => {
            const oldIndex = prevQuestions.findIndex((question) => question.id === activeId)
            const newIndex = prevQuestions.findIndex((question) => question.id === overId)

            if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return prevQuestions

            const nextQuestions = arrayMove(prevQuestions, oldIndex, newIndex)

            if (selectedQuestionId) {
                const selectedIndex = nextQuestions.findIndex((q) => q.id === selectedQuestionId)
                setCurrentQuestionIndex(selectedIndex >= 0 ? selectedIndex : 0)
            }

            const newOrder = nextQuestions.map((q) => q.id)
            if (reorderTimeoutRef.current) window.clearTimeout(reorderTimeoutRef.current)
            reorderTimeoutRef.current = window.setTimeout(() => {
                upsertReorder(newOrder)
                reorderTimeoutRef.current = null
            }, 300)

            return nextQuestions
        })
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        setActiveQuestionId(null)
        if (!over || active.id === over.id) return
        reorderQuestions(String(active.id), String(over.id))
    }

    const handleDragStart = (event: DragStartEvent) => setActiveQuestionId(String(event.active.id))
    const handleDragCancel = () => setActiveQuestionId(null)

    const validateQuestions = (): string | null => {
        if (!quizId)
            return "Please create or open a quiz first so the questions can be saved in the adapter."
        if (!questions.length) return "Add at least one question before saving."

        for (let qi = 0; qi < questions.length; qi += 1) {
            const question = questions[qi]
            if (!question.question.trim()) return `Question ${qi + 1} is missing the question text.`
            if (question.options.length < 2)
                return `Question ${qi + 1} needs at least two answer options.`
            for (let oi = 0; oi < question.options.length; oi += 1) {
                if (!question.options[oi].answer.trim())
                    return `Question ${qi + 1}, option ${oi + 1} is empty.`
            }
            if (!question.options.some((o) => o.correct))
                return `Question ${qi + 1} needs at least one correct answer.`
        }

        return null
    }

    const handleSaveQuestions = async () => {
        let flushResult = null
        try {
            flushResult = await flush()
        } catch {
            // ignore
        }

        if (flushResult?.idMap && Object.keys(flushResult.idMap).length > 0) {
            const { idMap } = flushResult
            setQuestions((prev) => prev.map((q) => ({ ...q, id: idMap[q.id] ?? q.id })))
        }

        const validationError = validateQuestions()
        if (validationError) return { ok: false, error: validationError }
        if (!quizId)
            return {
                ok: false,
                error: "Save the quiz first before persisting questions to the adapter.",
            }

        setIsSavingQuestions(true)

        try {
            const existingQuestions = savedQuestions ?? []
            await Promise.all(
                [...existingQuestions]
                    .reverse()
                    .map(async (q) => deleteQuestionMutation.mutateAsync(q.id))
            )

            const createdResponses = await Promise.all(
                questions.map(async (q) => createQuestionMutation.mutateAsync(questionToRequest(q)))
            )

            const createdQuestions = createdResponses.map((r) => responseToQuestion(r))
            setQuestions(createdQuestions)
            setCurrentQuestionIndex((prev) =>
                Math.min(prev, Math.max(createdQuestions.length - 1, 0))
            )
            setHasUnsavedChanges(false)
            setSaveSuccess("Quiz changes saved.")
            setIsSaveSuccessVisible(true)

            if (saveSuccessHideTimeoutRef.current)
                window.clearTimeout(saveSuccessHideTimeoutRef.current)
            if (saveSuccessCleanupTimeoutRef.current)
                window.clearTimeout(saveSuccessCleanupTimeoutRef.current)

            saveSuccessHideTimeoutRef.current = window.setTimeout(() => {
                setIsSaveSuccessVisible(false)
                saveSuccessCleanupTimeoutRef.current = window.setTimeout(
                    () => setSaveSuccess(null),
                    650
                )
            }, 5000)

            if (typeof window !== "undefined") {
                if (saveTimeoutRef.current) window.clearTimeout(saveTimeoutRef.current)
                saveTimeoutRef.current = null
            }

            return { ok: true }
        } catch (err) {
            return { ok: false, error: err instanceof Error ? err.message : String(err) }
        } finally {
            setIsSavingQuestions(false)
        }
    }

    const updateQuestion = (data: Partial<Question>) => {
        markUnsavedChanges()
        setQuestions((prevQuestions) => {
            const updated = [...prevQuestions]
            const next = { ...updated[currentQuestionIndex], ...data }
            updated[currentQuestionIndex] = next
            upsertUpdate(next.id, questionToRequest(next))
            return updated
        })
    }

    const updateOption = (index: number, value: string) => {
        markUnsavedChanges()
        const newOptions = [...currentQuestion.options]
        newOptions[index] = { ...newOptions[index], answer: value }
        updateQuestion({ options: newOptions })
    }

    const toggleOptionCorrect = (index: number) => {
        markUnsavedChanges()
        const newOptions = currentQuestion.options.map((option, optionIndex) =>
            optionIndex === index ? { ...option, correct: !option.correct } : option
        )
        updateQuestion({ options: newOptions })
    }

    const deleteQuestion = (indexToDelete: number) => {
        markUnsavedChanges()
        if (questions.length === 1) {
            setQuestions([createEmptyQuestion()])
            setCurrentQuestionIndex(0)
            return
        }

        const deletingId = questions[indexToDelete]?.id
        setQuestions((prevQuestions) => prevQuestions.filter((_, index) => index !== indexToDelete))

        if (deletingId) {
            enqueue({
                id: crypto.randomUUID(),
                op: "delete",
                quizId: quizId ?? "new",
                questionId: deletingId,
                createdAt: new Date().toISOString(),
            })
        }

        if (currentQuestionIndex >= indexToDelete && currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1)
        }
    }

    const handleAddQuestion = () => {
        markUnsavedChanges()
        const newQ = createEmptyQuestion()
        setQuestions((prev) => [...prev, newQ])
        enqueue({
            id: crypto.randomUUID(),
            op: "create",
            quizId: quizId ?? "new",
            questionId: newQ.id,
            payload: questionToRequest(newQ),
            createdAt: new Date().toISOString(),
        })
    }

    const handleAddOption = () => {
        markUnsavedChanges()
        const newOption = { id: crypto.randomUUID(), answer: "", correct: false }
        const updatedQuestion = {
            ...currentQuestion,
            options: [...currentQuestion.options, newOption],
        }
        updateQuestion({ options: updatedQuestion.options })
    }

    const handleDeleteOption = (indexToDelete: number) => {
        if (currentQuestion.options.length <= 2) return
        markUnsavedChanges()
        updateQuestion({
            options: currentQuestion.options.filter((_, index) => index !== indexToDelete),
        })
    }

    return {
        quiz,
        quizTitle,
        quizDescription,
        isLoading,
        error,
        isLoadingQuestions,
        questionLoadError,
        questions,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        currentQuestion,
        questionIds,
        activeQuestionId,
        setActiveQuestionId,
        handleDragStart,
        handleDragEnd,
        handleDragCancel,
        reorderQuestions,
        updateQuestion,
        updateOption,
        toggleOptionCorrect,
        deleteQuestion,
        handleAddQuestion,
        handleAddOption,
        handleDeleteOption,
        handleSaveQuestions,
        isSavingQuestions,
        saveSuccess,
        isSaveSuccessVisible,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        enqueue,
        flush,
        upsertReorder,
        upsertUpdate,
        deleteQuizMutation,
        hasInitializedQuestions,
    }
}
