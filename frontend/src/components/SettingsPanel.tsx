// frontend/src/components/SettingsPanel.tsx

import type {Question} from "../pages/QuizCreator";

interface SettingsPanelProps {
    question: Question;
}

export default function SettingsPanel({ question }: SettingsPanelProps) {
    const colors = ["bg-[#2d4cc9]", "bg-[#ffa602]", "bg-[#11c8d4]", "bg-[#ff4949]"];
    const icons = ["▲", "◆", "●", "■"];

    return (
        <aside className="w-72 bg-[#1a2234] border-l border-white/10 p-6 flex flex-col gap-8">
            <div>
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Settings & Preview</h2>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Question Time Limit</label>
                        <select className="w-full bg-[#121926] border border-white/10 rounded-md p-2 text-sm text-white">
                            <option>10 seconds</option>
                            <option>20 seconds</option>
                            <option>30 seconds</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Points</label>
                        <select className="w-full bg-[#121926] border border-white/10 rounded-md p-2 text-sm text-white">
                            <option>1000</option>
                            <option>2000</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Mobile Preview Style */}
            <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Answer Preview</label>
                <div className="bg-[#121926] rounded-2xl p-4 border border-white/5 aspect-9/12 flex flex-col shadow-inner">
                    {/* Dynamic Question Title */}
                    <div className="bg-[#252f44] rounded-lg p-3 text-[10px] text-center font-bold mb-4 min-h-10 flex items-center justify-center">
                        {question.title || "Type your question..."}
                    </div>

                    {/* Dynamic Options Grid */}
                    <div className="grid grid-cols-2 gap-2 flex-1">
                        {question.options.map((option, index) => (
                            <div
                                key={index}
                                className={`${colors[index]} rounded-md flex items-center justify-center text-[8px] p-1 text-center font-medium transition-all duration-200`}
                            >
                                {option || icons[index]}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
}