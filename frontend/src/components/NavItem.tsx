// frontend/src/components/NavItem.tsx

import { NavLink } from "react-router"

interface NavItemProps {
    to: string;
    children: React.ReactNode;
    onClick?: () => void;
    isMobile?: boolean;
}

export default function NavItem({ to, children, onClick, isMobile = false }: NavItemProps) {
    const textSize = isMobile ? "text-base" : "text-sm";

    return (
        <NavLink
            to={to}
            end
            onClick={onClick}
            className={({ isActive }) =>
                isActive
                    ? `text-[#00F2FF] font-bold ${textSize} transition-colors`
                    : `text-muted-foreground hover:text-foreground font-medium ${textSize} transition-colors`
            }
        >
            {children}
        </NavLink>
    );
}
