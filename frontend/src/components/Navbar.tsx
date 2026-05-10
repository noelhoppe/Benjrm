// src/components/Navbar.tsx
import { useState } from "react";
import { NavLink } from "react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/shadcn/components/ui/button";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="max-w-360 mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">

                {/* Left: Logo */}
                <NavLink to="/" end className="text-2xl sm:text-3xl font-extrabold tracking-tighter text-[#00F2FF] shrink-0">
                    Benjrm
                </NavLink>

                {/* Center/Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    <NavLink
                        to="/about"
                        className={({ isActive }) =>
                            `text-sm transition-colors ${
                                isActive
                                    ? "text-[#00F2FF] font-bold"
                                    : "text-muted-foreground hover:text-foreground font-medium"
                            }`
                        }
                    >
                        ABOUT US
                    </NavLink>
                </nav>

                {/* Right: Buttons & Theme (Desktop & Tablet) */}
                <div className="hidden md:flex items-center gap-2 sm:gap-3">
                    <Button
                        variant="outline"
                        className="text-sm font-medium border-muted/50 hover:bg-accent hover:text-foreground"
                    >
                        LOGIN
                    </Button>
                    <Button
                        className="text-sm font-medium bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 cursor-pointer transition-colors"
                    >
                        SIGN UP
                    </Button>
                    <ThemeToggle />
                </div>

                {/* Mobile Controls (Theme Toggle & Hamburger Menu) */}
                <div className="flex md:hidden items-center gap-2">
                    <ThemeToggle />
                    <button
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-border bg-background px-4 py-6 space-y-6 shadow-lg">
                    {/* Mobile Links - Mittig */}
                    <nav className="flex flex-col items-center gap-5">
                        <NavLink
                            to="/about"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `text-base transition-colors ${
                                    isActive
                                        ? "text-[#00F2FF] font-bold"
                                        : "text-muted-foreground hover:text-foreground font-medium"
                                }`
                            }
                        >
                            ABOUT US
                        </NavLink>
                    </nav>

                    {/* Mobile Buttons */}
                    <div className="flex flex-col gap-3 pt-6 border-t border-border/50">
                        <Button
                            variant="outline"
                            className="w-full justify-center text-sm font-medium border-muted/50 hover:bg-accent hover:text-foreground"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            LOGIN
                        </Button>
                        <Button
                            className="w-full justify-center text-sm font-medium bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            SIGN UP
                        </Button>
                    </div>
                </div>
            )}
        </header>
    );
}
