// frontend/src/pages/QuizCreator.tsx

import { useState } from "react";
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Settings, Image as ImageIcon, Video, HelpCircle } from "lucide-react";
import QuestionSidebar from "../components/QuestionSidebar";
import SettingsPanel from "../components/SettingsPanel";

// --- Types ---

export interface Question {
    id: number;
    title: string;
    type: "Multiple Choice" | "True/False";
    options: string[];
}

export default function QuizCreatorPage() {
    const [quizTitle, setQuizTitle] = useState<string>("Untitled");

    const [questions, setQuestions] = useState<Question[]>([
        { id: 1, title: "", type: "Multiple Choice", options: ["", "", "", ""] }
    ]);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

    // Derived state for the currently active question
    const currentQuestion = questions[currentQuestionIndex];

    /**
     * Updates the current question in the state array.
     * Uses Partial<Question> to allow updating only specific fields.
     */
    const updateQuestion = (data: Partial<Question>) => {
        setQuestions((prevQuestions) => {
            const updated = [...prevQuestions];
            updated[currentQuestionIndex] = {
                ...updated[currentQuestionIndex],
                ...data
            };
            return updated;
        });
    };

    /**
     * Updates a specific option string within the current question's options array.
     */
    const updateOption = (index: number, value: string) => {
        const newOptions = [...currentQuestion.options];
        newOptions[index] = value;
        updateQuestion({ options: newOptions });
    };

    return (
        <div className="h-screen flex flex-col bg-[#121926] text-white overflow-hidden">
            {/* Top Navbar */}
            <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#1a2234]">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">New Quiz:</span>
                    <Input
                        value={quizTitle}
                        onChange={(e) => setQuizTitle(e.target.value)}
                        className="bg-transparent border-none text-xl font-bold focus-visible:ring-0 w-64 p-0 h-auto"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" className="gap-2"><Settings className="w-4 h-4"/> Settings</Button>
                    <Button className="bg-[#00F2FF] hover:bg-[#00d8e4] text-black font-bold">Save Quiz</Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left: Questions List - Passing live questions array for real-time sidebar updates */}
                <QuestionSidebar
                    questions={questions}
                    activeIndex={currentQuestionIndex}
                    onSelect={setCurrentQuestionIndex}
                    onAdd={() => setQuestions(prev => [
                        ...prev,
                        {
                            id: Date.now(),
                            title: "",
                            type: "Multiple Choice",
                            options: ["", "", "", ""]
                        }
                    ])}
                />

                {/* Center: Editor Area */}
                <main className="flex-1 overflow-y-auto p-8 flex flex-col items-center gap-6 scrollbar-hide">
                    {/* Question Input */}
                    <div className="w-full max-w-4xl bg-[#1a2234] rounded-xl border border-white/5 p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-medium text-gray-400">
                                Question {currentQuestionIndex + 1} of {questions.length}
                            </span>
                            <select
                                className="bg-[#252f44] border-none rounded-md text-sm p-2 outline-none cursor-pointer"
                                value={currentQuestion.type}
                                onChange={(e) => updateQuestion({ type: e.target.value as Question["type"] })}
                            >
                                <option value="Multiple Choice">Multiple Choice</option>
                                <option value="True/False">True/False</option>
                            </select>
                        </div>
                        <textarea
                            placeholder="Type your question here..."
                            className="w-full bg-transparent text-2xl font-medium text-center resize-none outline-none placeholder:text-gray-600 h-24"
                            value={currentQuestion.title}
                            onChange={(e) => updateQuestion({ title: e.target.value })}
                        />
                    </div>

                    {/* Media Upload Box */}
                    <div className="w-full max-w-4xl grid grid-cols-2 gap-4 h-48">
                        <MediaUploadButton icon={<ImageIcon className="w-8 h-8 text-gray-400" />} label="Upload Image" />
                        <MediaUploadButton icon={<Video className="w-8 h-8 text-gray-400" />} label="Upload Video" />
                    </div>

                    {/* Answer Options Grid */}
                    <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                        <AnswerCard
                            color="bg-[#2d4cc9]"
                            icon="▲"
                            placeholder="Option 1"
                            value={currentQuestion.options[0]}
                            onChange={(val) => updateOption(0, val)}
                        />
                        <AnswerCard
                            color="bg-[#ffa602]"
                            icon="◆"
                            placeholder="Option 2"
                            value={currentQuestion.options[1]}
                            onChange={(val) => updateOption(1, val)}
                        />
                        <AnswerCard
                            color="bg-[#11c8d4]"
                            icon="●"
                            placeholder="Option 3"
                            value={currentQuestion.options[2]}
                            onChange={(val) => updateOption(2, val)}
                        />
                        <AnswerCard
                            color="bg-[#ff4949]"
                            icon="■"
                            placeholder="Option 4"
                            value={currentQuestion.options[3]}
                            onChange={(val) => updateOption(3, val)}
                        />
                    </div>
                </main>

                {/* Right: Settings & Preview - Pass currentQuestion to make preview dynamic */}
                <SettingsPanel question={currentQuestion} />
            </div>

            {/* Help Button */}
            <button className="absolute bottom-6 right-6 w-10 h-10 bg-[#1a2234] border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <HelpCircle className="w-6 h-6" />
            </button>
        </div>
    );
}

// --- Internal Helper Components ---

function MediaUploadButton({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <div className="border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="p-3 bg-white/5 rounded-lg group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <span className="text-sm font-bold text-gray-400">{label}</span>
        </div>
    );
}

interface AnswerCardProps {
    color: string;
    icon: string;
    placeholder: string;
    value: string;
    onChange: (val: string) => void;
}

function AnswerCard({ color, icon, placeholder, value, onChange }: AnswerCardProps) {
    return (
        <div className={`${color} rounded-lg p-1 flex items-center min-h-25 shadow-lg relative group transition-transform hover:scale-[1.01]`}>
            <div className="absolute left-4 top-4 w-6 h-6 border-2 border-white/50 rounded-full" />
            <span className="absolute right-4 top-4 text-white/50 text-xl font-bold">{icon}</span>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-transparent text-white placeholder:text-white/40 text-xl font-bold px-12 focus:outline-none"
            />
        </div>
    );
}
