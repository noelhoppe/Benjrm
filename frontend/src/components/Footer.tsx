// src/components/Footer.tsx
import { NavLink } from "react-router";

export default function Footer() {
    return (
        <footer className="border-t border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 mt-auto">
            <div className="max-w-360 mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col md:flex-row items-center justify-between gap-4">

                {/* Left side: Logo */}
                <div className="flex-1 flex justify-center md:justify-start">
                    <NavLink to="/" end className="text-xl sm:text-2xl font-extrabold tracking-tighter text-[#00F2FF] shrink-0">
                        Benjrm
                    </NavLink>
                </div>

                {/* Center: Copyright text */}
                <div className="text-sm font-medium text-muted-foreground text-center shrink-0">
                    &copy; 2026 Benjrm. All Rights Reserved.
                </div>

                {/* Right side: Links */}
                <nav className="flex-1 flex flex-wrap justify-center md:justify-end items-center gap-4 sm:gap-6">
                    <NavLink
                        to="/impressum"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Impressum
                    </NavLink>
                    <NavLink
                        to="/privacy-policy"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Privacy Policy
                    </NavLink>
                    <NavLink
                        to="/terms"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Terms and Conditions
                    </NavLink>
                </nav>

            </div>
        </footer>
    );
}
