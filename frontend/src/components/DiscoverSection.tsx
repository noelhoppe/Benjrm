// frontend/src/components/DiscoverSection.tsx

import CategoryHeader from "@/components/CategoryHeader";

export default function DiscoverSection() {
    return (
        <section className="w-full space-y-10">
            <p className="text-md font-bold tracking-widest text-[#FF8A00] uppercase">
                Discover
            </p>

            <CategoryHeader
                title="All Quizzes"
                description="All quizzes for you to discover"
                to="/quizzes"
            />

        </section>
    )
}
