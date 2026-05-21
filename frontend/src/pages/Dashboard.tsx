// frontend/src/pages/Dashboard.tsx
import type { JSX } from "react"
import { useState } from "react"
import { PlusSquare } from "lucide-react" // <-- Icon importieren
import GameHeroSection from "../components/GameHeroSection"
import DiscoverSection from "../components/DiscoverSection"
import CreateQuizModal from "../components/CreateQuizModal"
import { useQuizzes } from "@/api/queries" // <-- Großes Q!
import { Button } from "@/shadcn/components/ui/button" // <-- Button importieren

export default function Dashboard(): JSX.Element {
    const [isCreateQuizOpen, setIsCreateQuizOpen] = useState(false)

    const { data: quizzes = [], isLoading: loadingQuizzes, error } = useQuizzes()
    const quizLoadError = error?.message ?? null

    const handleCreateSuccess = (): void => {
        setIsCreateQuizOpen(false)
    }

    return (
        <div className="flex w-full flex-col gap-12 py-8">
            {/* HIER IST DAS NEUE LAYOUT: flex-row für große Screens, flex-col für Handys */}
            <div className="mx-auto flex w-full max-w-7xl flex-col items-stretch gap-6 px-4 sm:px-6 lg:flex-row lg:items-center">
                {/* Die Hero Section nimmt den restlichen Platz ein (flex-1) */}
                <div className="flex-1">
                    <GameHeroSection />
                </div>

                {/* Der Button direkt daneben */}
                <Button
                    className="flex h-full min-h-[80px] items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-[#00D4E8] to-[#00AFC0] px-8 py-8 text-lg font-extrabold text-black shadow-[0_8px_30px_-8px_rgba(0,212,232,0.6)] transition-transform hover:scale-105 active:scale-100 lg:min-h-[320px] lg:flex-col lg:gap-4"
                    onClick={() => setIsCreateQuizOpen(true)}
                >
                    <PlusSquare className="mb-0 h-8 w-8 lg:mb-4" />
                    <span className="tracking-wide">Add Quiz</span>
                </Button>
            </div>

            <DiscoverSection error={quizLoadError} loading={loadingQuizzes} quizzes={quizzes} />
            <CreateQuizModal
                isOpen={isCreateQuizOpen}
                onClose={() => setIsCreateQuizOpen(false)}
                onSuccess={handleCreateSuccess}
            />
        </div>
    )
}
