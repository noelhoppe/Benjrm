import NavbarMain from "@/components/NavbarMain";
import GameHeroSection from "@/components/GameHeroSection";
import DiscoverSection from "@/components/DiscoverSection";

export default function DashboardPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <NavbarMain />
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col gap-10 pt-6 pb-12">
                <GameHeroSection />
                <DiscoverSection />
            </main>
        </div>
    );
}
