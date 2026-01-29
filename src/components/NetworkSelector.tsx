import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { getNetworkIcon } from './IconLibrary';

interface NetworkSelectorProps {
    onGenerate: (chain: string) => void;
    networks: Array<{ id: string; name: string; icon: string; }>;
}

export const NetworkSelector: React.FC<NetworkSelectorProps> = ({ onGenerate, networks }) => {
    const [selected, setSelected] = useState(networks[0]);

    return (
        <div className="w-full space-y-5 animate-in fade-in duration-300">
            {/* 1. Network Icons Grid */}
            <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Network</span>
                </div>

                <div className="flex justify-between items-center px-2">
                    {networks.map((net) => {
                        const isSelected = selected.id === net.id;
                        return (
                            <button
                                key={net.id}
                                onClick={() => setSelected(net)}
                                className={`
                                    relative group flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300
                                    ${isSelected
                                        ? 'bg-white shadow-lg shadow-indigo-500/10 scale-110 ring-2 ring-indigo-500 z-10'
                                        : 'bg-gray-50 hover:bg-white hover:shadow-md grayscale hover:grayscale-0 opacity-70 hover:opacity-100 border border-transparent hover:border-gray-100'}
                                `}
                            >
                                <div className="w-7 h-7 flex items-center justify-center">
                                    {getNetworkIcon(net.id)}
                                </div>

                                {/* Selected Ring/Glow */}
                                {isSelected && (
                                    <span className="absolute inset-0 rounded-2xl animate-pulse opacity-10 bg-indigo-500"></span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 2. Selected Name Indicator */}
            <div className="flex justify-center -mt-1 h-5">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-0.5 rounded-full animate-in fade-in slide-in-from-bottom-1 key={selected.id}">
                    {selected.name}
                </span>
            </div>

            {/* 3. Confirm Button */}
            <button
                onClick={() => onGenerate(selected.id)}
                className="
                    group w-full relative overflow-hidden mt-2
                    bg-[#0F172A] hover:bg-[#1E293B] text-white
                    py-4 rounded-xl font-bold text-sm
                    transition-all duration-300 active:scale-[0.98]
                    shadow-xl shadow-gray-200
                    flex items-center justify-center gap-2
                "
            >
                <span>Confirm to generate address</span>
                <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-1 group-hover:text-white transition-all" />
            </button>
        </div>
    );
};
