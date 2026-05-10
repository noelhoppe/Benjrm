import { Input } from "@/shadcn/components/ui/input";
import { Button } from "@/shadcn/components/ui/button";
import { PlusSquare } from "lucide-react";

export default function GameHeroSection() {
    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
            {/* Container */}
            <div className="flex flex-col lg:flex-row bg-white dark:bg-[#111318] text-slate-900 dark:text-foreground rounded-2xl border border-slate-200 dark:border-white/8 shadow-xl overflow-hidden min-h-[320px]">

                {/* Left Side: Controls */}
                <div className="flex-1 p-8 lg:p-10 flex flex-col justify-center gap-8 z-10">

                    {/* Code Input */}
                    <div className="space-y-2 max-w-xs">
                        <Input
                            type="text"
                            placeholder="Code"
                            className="bg-slate-50 dark:bg-[#1C2028] border-slate-200 dark:border-white/10 text-slate-900 dark:text-foreground placeholder:text-slate-500 dark:placeholder:text-muted-foreground rounded-xl px-4 py-5 text-base font-medium focus-visible:ring-2 focus-visible:ring-[#00F2FF] focus-visible:border-transparent transition-all"
                        />
                        <p className="text-sm text-slate-500 dark:text-muted-foreground pl-1">
                            Join via Code
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Start Game Button remains mostly identical as it's a primary brand button */}
                        <Button className="bg-[#00D4E8] hover:bg-[#00BDD0] text-black font-bold rounded-xl px-6 py-5 text-sm uppercase tracking-wide flex items-center gap-2 transition-all border-0 shadow-[0_0_20px_-5px_rgba(0,212,232,0.5)]">
                            START GAME
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M5 3L19 12L5 21V3Z" />
                            </svg>
                        </Button>

                        {/* Outline Button adjusts borders and hover states based on theme */}
                        <Button
                            variant="outline"
                            className="bg-transparent border-slate-200 dark:border-white/10 text-slate-700 dark:text-foreground hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl px-5 py-5 text-sm font-medium flex items-center gap-2 transition-colors"
                        >
                            Add Quiz
                            <PlusSquare className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Right Side: Image */}
                <div className="flex-1 relative min-h-[220px] lg:min-h-auto">
                    <img
                        src="/pictures/happy_people.jpg"
                        alt="People celebrating"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 dark:from-[#111318] dark:via-[#111318]/40 to-transparent w-full md:w-1/3" />
                </div>

            </div>
        </section>
    );
}
