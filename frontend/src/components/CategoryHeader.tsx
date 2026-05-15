// frontend/src/components/CategoryHeader.tsx

import { ChevronRight } from "lucide-react";
import { Link } from "react-router"

interface Props {
    title: string;
    description: string;
    to: string;
}

export default function CategoryHeader({ title, description, to }: Props) {
    return (
        <div className="flex items-end justify-between">
            <div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
                    {title}
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
            </div>
            <Link
                to={to}
                className="group flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-[#00F2FF] transition-colors tracking-widest uppercase whitespace-nowrap ml-4"
            >
                View All
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
        </div>
    )
}
