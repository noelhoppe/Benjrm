// src/components/Navbar.tsx
import { Button } from "@/shadcn/components/ui/button";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
    return (
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-[90rem] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
                {/* Logo */}
                <a href="/" className="text-2xl sm:text-3xl font-extrabold tracking-tighter text-[#00F2FF] shrink-0">
                    Benjrm
                </a>

                {/* Right side */}
                <nav className="flex items-center gap-2 sm:gap-6">
                    {/* Hide "ABOUT US" on small screens */}
                    <a href="/about" className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        ABOUT US
                    </a>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Hide LOGIN on very small screens */}
                        <Button
                            variant="outline"
                            className="hidden xs:flex text-sm font-medium border-muted/50 hover:bg-accent hover:text-foreground"
                        >
                            LOGIN
                        </Button>
                        <Button
                            className="text-sm font-medium
                            bg-black text-white hover:bg-gray-800
                            dark:bg-white dark:text-black dark:hover:bg-gray-200
                            cursor-pointer transition-colors"
                        >
                            SIGN UP
                        </Button>
                    </div>

                    <ThemeToggle />
                </nav>
            </div>
        </header>
    );
}