import React from 'react';

interface TestSidebarProps {
    isVisible: boolean;
    onTriggerCase: (caseId: string) => void;
}

export const TestSidebar: React.FC<TestSidebarProps> = ({ isVisible, onTriggerCase }) => {
    if (!isVisible) return null;

    const testCases = [
        { id: 'dapp_mode', label: 'DApp Browser Mode' },
    ];

    return (
        <div className="fixed left-6 top-1/2 -translate-y-1/2 w-48 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-200 z-40 hidden xl:flex flex-col gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
            <div>
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full">Test Cases</span>
                <h3 className="text-sm font-bold text-gray-900 mt-2">Edge Scenarios</h3>
            </div>

            <div className="space-y-2">
                {testCases.map((tc) => (
                    <button
                        key={tc.id}
                        onClick={() => onTriggerCase(tc.id)}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors border border-transparent hover:border-red-100"
                    >
                        {tc.label}
                    </button>
                ))}
            </div>

            <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    System Normal
                </div>
            </div>
        </div>
    );
};
