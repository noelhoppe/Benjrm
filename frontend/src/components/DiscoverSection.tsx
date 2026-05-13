import CategoryHeader from "@/components/CategoryHeader";

export default function DiscoverSection() {
    return (
        <section className="w-full space-y-10">
            <p className="text-md font-bold tracking-widest text-[#FF8A00] uppercase">
                Discover
            </p>

            <CategoryHeader
                title="Firefighting training"
                description="All quizzes to help you prepare for firefighter training courses."
                to="/categories/firefighting"
            />

            <CategoryHeader
                title="IT-Security"
                description="Learn everything you need to know about IT security."
                to="/categories/it-security"
            />
        </section>
    )
}
