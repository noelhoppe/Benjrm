// frontend/src/components/QuestionCard.tsx

import { useState } from "react";
import { Building2, Users, Zap, Target, Edit2, Trash2, GripVertical, Check, X } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface QuestionCardProps {
    question: {
        id: number;
        number: number;
        title: string;
        description: string;
        icon: "building" | "users" | "bomb" | "target";
    };
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

const iconMap = {
    building: Building2,
    users: Users,
    bomb: Zap,
    target: Target,
};

export default function QuestionCard({ question, onEdit, onDelete }: QuestionCardProps) {
    const [isEditing, setIsEditing] = useState(false);

    // local state for live-editing the text fields
    const [editData, setEditData] = useState({
        title: question.title,
        description: question.description
    });

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: question.id, disabled: isEditing }); // Disable drag while editing

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : "auto",
        opacity: isDragging ? 0.6 : 1,
    };

    const IconComponent = iconMap[question.icon];
    const iconColors = {
        building: "text-[#00F2FF]",
        users: "text-[#FF8A00]",
        bomb: "text-[#00F2FF]",
        target: "text-[#00F2FF]",
    };

    const handleToggleEdit = () => {
        setIsEditing(!isEditing);
        onEdit(question.id);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group bg-muted/30 border-l-4 border-l-[#00F2FF] p-4 sm:p-6 rounded-xl transition-all border border-border/50 ${
                isDragging ? "shadow-lg scale-[1.02] border-[#00F2FF]" : ""
            } ${isEditing ? "bg-muted/60 ring-1 ring-[#00F2FF]/30" : "hover:bg-muted/50"}`}
        >
            <div className="flex items-start gap-3 sm:gap-4">

                {/* Drag Handle - Hidden during edit */}
                {!isEditing && (
                    <div
                        {...attributes}
                        {...listeners}
                        aria-label="Drag Handle"
                        className="flex items-center self-stretch cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-foreground transition-colors pr-1"
                    >
                        <GripVertical className="h-5 w-5" />
                    </div>
                )}

                {/* Question Icon */}
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-muted shrink-0">
                    <IconComponent className={`h-5 w-5 sm:h-6 sm:w-6 ${iconColors[question.icon]}`} />
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase">
                            QUESTION {String(question.number).padStart(2, "0")}
                        </span>
                    </div>

                    {isEditing ? (
                        <div className="space-y-3 mt-2 animate-in fade-in slide-in-from-top-1">
                            <input
                                type="text"
                                value={editData.title}
                                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                className="w-full bg-background border border-border rounded px-3 py-1.5 font-bold focus:outline-none focus:ring-1 focus:ring-[#00F2FF]"
                                placeholder="Question Title"
                            />
                            <textarea
                                value={editData.description}
                                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                className="w-full bg-background border border-border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#00F2FF]"
                                rows={2}
                                placeholder="Question Description"
                            />

                            {/* Answer Options Placeholder as requested by NiborDev */}
                            <div className="pt-2 border-t border-border/50">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Answer Options</p>
                                <div className="grid grid-cols-1 gap-2">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="flex gap-2 items-center">
                                            <div className="h-4 w-4 rounded-full border border-border shrink-0" />
                                            <input
                                                type="text"
                                                disabled
                                                placeholder={`Option ${i} placeholder...`}
                                                className="bg-transparent text-sm w-full outline-none italic text-muted-foreground"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-base sm:text-lg font-bold tracking-tight mb-1 truncate">
                                {question.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                                {question.description}
                            </p>
                        </>
                    )}
                </div>

                {/* Action Buttons */}
                <div className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 shrink-0 transition-opacity ${isEditing ? "opacity-100" : "sm:opacity-0 sm:group-hover:opacity-100"}`}>
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-2 hover:bg-[#00F2FF]/10 rounded-lg transition-colors text-[#00F2FF]"
                                title="Save changes"
                            >
                                <Check className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-2 hover:bg-background rounded-lg transition-colors text-muted-foreground"
                                title="Cancel"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleToggleEdit}
                                className="p-2 hover:bg-background rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                                title="Edit question"
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => onDelete(question.id)}
                                className="p-2 hover:bg-background rounded-lg transition-colors text-muted-foreground hover:text-destructive"
                                title="Delete question"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}