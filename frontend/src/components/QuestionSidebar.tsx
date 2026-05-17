// frontend/src/components/QuestionsSidebar.tsx

import { Button } from "@/shadcn/components/ui/button";
import {Plus, Trash2} from "lucide-react";
import type { Question } from "../pages/QuizCreator";

interface QuestionSidebarProps {
    questions: Question[];
    activeIndex: number;
    onSelect: (index: number) => void;
    onAdd: () => void;
}

export default function QuestionSidebar({
                                            questions,
                                            activeIndex,
                                            onSelect,
                                            onAdd
                                        }: QuestionSidebarProps) {
    return (
        <aside className="w-64 bg-[#1a2234] border-r border-white/10 flex flex-col p-4">
            <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">
                Questions List
            </h2>
            <div className="flex-1 space-y-4 overflow-y-auto">
                {questions.map((q, i) => (
                    <div
                        key={q.id}
                        onClick={() => onSelect(i)}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all relative ${
                            activeIndex === i
                                ? "border-[#00F2FF] bg-[#252f44]"
                                : "border-transparent bg-[#121926] hover:bg-[#252f44]"
                        }`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold text-gray-400">Q{i + 1}</span>
                            <Trash2 className="w-3 h-3 text-gray-500 hover:text-red-400" />
                        </div>
                        {/* TypeScript now knows q.title exists and is a string */}
                        <p className="text-[10px] text-gray-400 line-clamp-1 mb-2">
                            {q.title || "Untitled question"}
                        </p>
                        <div className="grid grid-cols-2 gap-1 opacity-60">
                            <div className="h-2 rounded-sm bg-[#2d4cc9]" />
                            <div className="h-2 rounded-sm bg-[#ffa602]" />
                            <div className="h-2 rounded-sm bg-[#11c8d4]" />
                            <div className="h-2 rounded-sm bg-[#ff4949]" />
                        </div>
                    </div>
                ))}
            </div>
            <Button
                onClick={onAdd}
                className="mt-4 bg-[#00F2FF] hover:bg-[#00d8e4] text-black font-bold w-full gap-2"
            >
                <Plus className="w-4 h-4" /> Add New Question
            </Button>
        </aside>
    );
}