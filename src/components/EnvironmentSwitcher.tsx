import React from 'react';
import { Monitor, Smartphone } from 'lucide-react';

export type EnvironmentMode = 'desktop' | 'ios' | 'android';

interface EnvironmentSwitcherProps {
    currentMode: EnvironmentMode;
    onSwitch: (mode: EnvironmentMode) => void;
}

export const EnvironmentSwitcher: React.FC<EnvironmentSwitcherProps> = ({ currentMode, onSwitch }) => {
    return (
        <div className="fixed left-6 bottom-6 flex flex-col gap-2 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-gray-200 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1">Simulator</span>

            <button
                onClick={() => onSwitch('desktop')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${currentMode === 'desktop'
                    ? 'bg-gray-900 text-white shadow-md scale-105'
                    : 'text-gray-500 hover:bg-gray-100'
                    }`}
            >
                <Monitor size={14} />
                <span>Desktop</span>
            </button>

            <button
                onClick={() => onSwitch('ios')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${currentMode === 'ios'
                    ? 'bg-gray-900 text-white shadow-md scale-105'
                    : 'text-gray-500 hover:bg-gray-100'
                    }`}
            >
                <Smartphone size={14} />
                <span>Mobile (iOS)</span>
            </button>

            <button
                onClick={() => onSwitch('android')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${currentMode === 'android'
                    ? 'bg-gray-900 text-white shadow-md scale-105'
                    : 'text-gray-500 hover:bg-gray-100'
                    }`}
            >
                <Smartphone size={14} />
                <span>Mobile (Android)</span>
            </button>
        </div>
    );
};
