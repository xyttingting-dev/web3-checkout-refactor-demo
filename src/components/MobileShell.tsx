import React from 'react';
import type { EnvironmentMode } from '../components/EnvironmentSwitcher';

interface MobileShellProps {
    environment: EnvironmentMode;
    children: React.ReactNode;
}

export const MobileShell: React.FC<MobileShellProps> = ({ environment, children }) => {
    if (environment === 'desktop') {
        return (
            <div className="w-full max-w-[380px] min-h-[600px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-indigo-500/10 overflow-hidden flex flex-col relative border border-white/50 ring-1 ring-gray-100 transition-all duration-500 ease-in-out h-fit font-sans">
                {children}
            </div>
        );
    }

    const isIOS = environment === 'ios';

    return (
        <div
            className={`relative w-[375px] h-[812px] bg-black rounded-[50px] border-[8px] border-gray-900 shadow-2xl transition-all duration-500 overflow-hidden flex flex-col ${isIOS ? 'font-sf' : 'font-roboto'}`}
        >
            {/* 
              [Note] Mobile Simulator Structure 
              - Fixed w/h to match generic iPhone dimensions (375x812)
              - Font switching: San Francisco (iOS) vs Roboto (Android) mock
            */}

            {/* --- Status Bar Simulation --- */}
            <div className="w-full h-11 px-6 flex justify-between items-center text-white z-50 absolute top-0 left-0">
                <span className="text-xs font-semibold">{isIOS ? '9:41' : '10:00'}</span>
                <div className="flex gap-1.5 items-center">
                    {/* Signal & Wifi placeholder */}
                    <div className="flex gap-0.5 items-end h-3">
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <div className="w-1 h-2 bg-white rounded-full"></div>
                        <div className="w-1 h-3 bg-white rounded-full"></div>
                    </div>
                    {/* Battery */}
                    <div className={`w-5 h-2.5 border border-white/40 rounded-[4px] relative ${isIOS ? '' : 'bg-white/20'}`}>
                        {isIOS && <div className="absolute inset-0.5 bg-white rounded-[2px] w-[70%]"></div>}
                    </div>
                </div>
            </div>

            {isIOS ? (
                // iOS Dynamic Island / Notch
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-full z-50 flex justify-center items-center pointer-events-none">
                    <div className="w-20 h-full bg-black rounded-b-2xl"></div>
                </div>
            ) : (
                // Android Punch-hole (Center or Left, stick to center for generic)
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-50 pointer-events-none border border-gray-800"></div>
            )}

            {/* Screen Content */}
            <div className="flex-1 bg-gray-50 flex flex-col pt-12 relative overflow-hidden rounded-t-[42px] rounded-b-[42px]">
                {children}
            </div>

            {/* Android Navigation Bar (Static Flow) - Moved Outside for correct layout */}
            {!isIOS && (
                <div className="h-12 bg-black w-full flex justify-between items-center px-12 z-50 shrink-0 text-gray-400 rounded-b-[42px] mt-[-10px] pb-2 relative">
                    <div className="w-4 h-4 border-l-2 border-b-2 border-current transform rotate-45"></div> {/* Back */}
                    <div className="w-4 h-4 rounded-full border-2 border-current"></div> {/* Home */}
                    <div className="w-4 h-4 border-2 border-current rounded-sm"></div> {/* Recent */}
                </div>
            )}

            {/* --- Navigation Bar (iOS Only) --- */}
            {isIOS && (
                <div className="absolute bottom-0 w-full h-[34px] flex justify-center items-end pb-2 z-50 pointer-events-none mix-blend-difference text-white">
                    <div className="w-[130px] h-[5px] bg-white/50 rounded-full mb-1"></div>
                </div>
            )}
        </div>
    );
};
