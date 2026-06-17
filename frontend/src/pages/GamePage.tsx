import type { JSX } from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { Toaster, toast } from "sonner"
import { useSocketEvent, useWebSocketContext } from "@/api/websocket"
import GameScreen from "@/components/GameScreen"
import { GameStateEnum } from "@/hooks/useGameSession"
import type {
    GameState,
    GameQuestion,
    QuestionResult,
    LeaderboardEntry,
} from "@/hooks/useGameSession"

export default function GamePage(): JSX.Element {
    const codeParam = useParams().code
    const code = codeParam !== null ? Number(codeParam) || undefined : undefined
    const navigate = useNavigate()
    const ws = useWebSocketContext()

    const gameActive = code !== undefined && sessionStorage.getItem(`gameActive:${code}`) === "1"
    useEffect(() => {
        if (!gameActive) {
            navigate(`/play/${codeParam ?? ""}`, { replace: true })
        }
    }, [gameActive, navigate, codeParam])

    const storageKey = code !== undefined ? `waitingRoom:${code}` : null
    const playerName = useMemo(() => {
        if (!storageKey) return undefined
        try {
            const raw = sessionStorage.getItem(storageKey)
            return raw ? (JSON.parse(raw) as { name: string }).name : undefined
        } catch {
            return undefined
        }
    }, [storageKey])

    const [gameState, setGameState] = useState<GameState>(GameStateEnum.PLAYING)
    const [currentQuestion, setCurrentQuestion] = useState<GameQuestion | null>(null)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1)
    const [totalQuestions, setTotalQuestions] = useState(0)
    const [questionExpiresAt, setQuestionExpiresAt] = useState<number | null>(null)
    const [questionResult, setQuestionResult] = useState<QuestionResult | null>(null)
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[] | null>(null)
    const [isFinalLeaderboard, setIsFinalLeaderboard] = useState(false)

    useSocketEvent("displayQuestion", (payload, timing) => {
        setGameState(GameStateEnum.QUESTION)
        setCurrentQuestion({
            id: payload.id,
            type: payload.type,
            text: payload.question,
            options: (payload.options ?? []).map((opt: { id: string; answer: string }) => ({
                id: opt.id,
                text: opt.answer,
            })),
            seconds: payload.seconds ?? null,
        })
        const startedAt = timing ? new Date(timing).getTime() : Date.now()
        setQuestionExpiresAt(payload.seconds ? startedAt + payload.seconds * 1000 : null)
        setTotalQuestions(payload.totalQuestions)
        setCurrentQuestionIndex((prev) => prev + 1)
        setQuestionResult(null)
    })

    useSocketEvent("questionResult", (payload) => {
        setQuestionResult(payload)
        setGameState(GameStateEnum.RESULT)
    })

    // handlerRef pattern in useSocketEvent ensures leaderboard/totalQuestions/currentQuestionIndex
    // are always the latest values — no stale closure risk
    useSocketEvent("displayLeaderboard", (payload) => {
        setLeaderboard(payload.leaderboard)
        const isLastByIndex = totalQuestions > 0 && currentQuestionIndex >= totalQuestions - 1
        setIsFinalLeaderboard(payload.isFinal || isLastByIndex)
        // Delay transition if the result screen is visible so the player can read their score
        if (gameState === GameStateEnum.RESULT) {
            setTimeout(() => setGameState(GameStateEnum.LEADERBOARD), 3000)
        } else {
            setGameState(GameStateEnum.LEADERBOARD)
        }
    })

    const [hostEndedGame, setHostEndedGame] = useState(false)

    useSocketEvent("gameEnded", () => {
        setHostEndedGame(true)
    })

    useEffect(() => {
        if (!hostEndedGame) return undefined
        toast.error("Host has closed the lobby")
        const t = setTimeout(() => {
            if (storageKey) sessionStorage.removeItem(storageKey)
            if (code !== undefined) sessionStorage.removeItem(`gameActive:${code}`)
            navigate("/")
        }, 3000)
        return () => clearTimeout(t)
    }, [hostEndedGame, navigate, storageKey, code])

    const sendAnswer = useCallback(
        (answer: string | string[]): void => {
            const answerArray = Array.isArray(answer) ? answer : [answer]
            ws.send({ command: "answerQuestion", payload: { answer: answerArray } })
        },
        [ws]
    )

    if (hostEndedGame) {
        return (
            <>
                <Toaster richColors />
                <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center gap-4 text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-[#00D4E8]" />
                    <p className="text-muted-foreground">Host has closed the lobby...</p>
                </div>
            </>
        )
    }

    return (
        <>
            <Toaster richColors />
            <GameScreen
                currentQuestion={currentQuestion}
                currentQuestionIndex={currentQuestionIndex}
                gameState={gameState}
                isFinalLeaderboard={isFinalLeaderboard}
                leaderboard={leaderboard}
                onNextQuestion={() => undefined}
                onSendAnswer={sendAnswer}
                playerName={playerName}
                questionExpiresAt={questionExpiresAt}
                questionResult={questionResult}
                totalQuestions={totalQuestions}
            />
        </>
    )
}
