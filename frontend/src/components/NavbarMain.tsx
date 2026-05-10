// frontend/src/components/NavbarMain.tsx
import { useState } from "react"
import { NavLink } from "react-router"
import { Search, Menu, X } from "lucide-react"
import ThemeToggle from "./ThemeToggle"

export default function NavbarMain() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="max-w-360 mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
                {/* Logo */}
                <NavLink
                    to="/"
                    className="text-2xl sm:text-3xl font-extrabold tracking-tighter text-[#00F2FF] shrink-0"
                >
                    Benjrm
                </NavLink>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    <NavLink
                        to="/dashboard"
                        end
                        className={({ isActive }) =>
                            isActive
                                ? "text-[#00F2FF] font-bold text-sm transition-colors"
                                : "text-muted-foreground hover:text-foreground font-medium text-sm transition-colors"
                        }
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/favourites"
                        className={({ isActive }) =>
                            isActive
                                ? "text-[#00F2FF] font-bold text-sm transition-colors"
                                : "text-muted-foreground hover:text-foreground font-medium text-sm transition-colors"
                        }
                    >
                        Favourites
                    </NavLink>

                    <NavLink
                        to="/quizzes"
                        className={({ isActive }) =>
                            isActive
                                ? "text-[#00F2FF] font-bold text-sm transition-colors"
                                : "text-muted-foreground hover:text-foreground font-medium text-sm transition-colors"
                        }
                    >
                        My Quizzes
                    </NavLink>
                </nav>

                {/* Right side (Search, Theme, Profile, Mobile Menu Toggle) */}
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    {/* Desktop Search */}
                    <div className="hidden md:flex items-center rounded-full border border-border bg-background px-3 py-1.5 text-muted-foreground focus-within:border-[#00F2FF] transition-colors">
                        <input
                            type="text"
                            placeholder="Search Quiz..."
                            className="w-40 sm:w-52 bg-transparent outline-none placeholder:text-muted-foreground text-sm"
                        />
                        <Search className="ml-2 h-4 w-4 shrink-0" />
                    </div>

                    <ThemeToggle />

                    <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200"
                        alt="Profile"
                        className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover shrink-0"
                    />

                    {/* Hamburger Menu Toggle (Mobile) */}
                    <button
                        className="md:hidden p-1 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-border bg-background px-4 py-6 space-y-6 shadow-lg">
                    {/* Mobile Search */}
                    <div className="flex items-center rounded-full border border-border bg-background px-3 py-2 text-muted-foreground focus-within:border-[#00F2FF] transition-colors">
                        <input
                            type="text"
                            placeholder="Search Quiz..."
                            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground text-sm"
                        />
                        <Search className="ml-2 h-4 w-4 shrink-0" />
                    </div>

                    {/* Mobile Links - Mittig */}
                    <nav className="flex flex-col items-center gap-5">
                        <NavLink
                            to="/dashboard"
                            end
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                isActive
                                    ? "text-[#00F2FF] font-bold text-base transition-colors"
                                    : "text-muted-foreground hover:text-foreground font-medium text-base transition-colors"
                            }
                        >
                            Home
                        </NavLink>

                        <NavLink
                            to="/favourites"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                isActive
                                    ? "text-[#00F2FF] font-bold text-base transition-colors"
                                    : "text-muted-foreground hover:text-foreground font-medium text-base transition-colors"
                            }
                        >
                            Favourites
                        </NavLink>

                        <NavLink
                            to="/quizzes"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                isActive
                                    ? "text-[#00F2FF] font-bold text-base transition-colors"
                                    : "text-muted-foreground hover:text-foreground font-medium text-base transition-colors"
                            }
                        >
                            My Quizzes
                        </NavLink>
                    </nav>
                </div>
            )}
        </header>
    )
}
