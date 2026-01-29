import React, { useState } from 'react';
import { Unplug, RefreshCw } from 'lucide-react';

interface ErrorCardProps {
    code?: string;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({ code = "00410" }) => {
    const [isRetrying, setIsRetrying] = useState(false);

    const handleRetry = () => {
        setIsRetrying(true);
        setTimeout(() => setIsRetrying(false), 1500);
    };

    return (
        <div className="w-full bg-orange-50 border border-orange-100 rounded-lg pl-3 pr-4 py-3 flex items-start justify-between shadow-sm mb-4 overflow-hidden">
            <div className="flex items-start gap-2.5 flex-1 pr-2">
                <div className="p-1 px-[5px] bg-white/80 rounded-full text-orange-500 shadow-sm mt-[1px] shrink-0">
                    <Unplug size={14} />
                </div>
                <div className="flex flex-col min-w-0">
                    <div className="flex items-start gap-1.5 mb-0.5">
                        <span className="text-sm font-bold text-gray-900 leading-none whitespace-nowrap">Connection Interrupted</span>
                        <span className="text-[10px] bg-white border border-orange-100 px-[3px] py-[1px] rounded-sm text-gray-400 font-mono leading-none shrink-0">{code}</span>
                    </div>
                    <span className="text-[11px] text-gray-500 leading-tight truncate">Wallet connect timeout.</span>
                </div>
            </div>

            <button
                onClick={handleRetry}
                disabled={isRetrying}
                className={`
                    flex items-center justify-center gap-1.5 px-2 py-1 rounded text-[11px] font-bold transition-all shrink-0 mt-[1px] min-w-[70px]
                    ${isRetrying
                        ? 'bg-orange-100 text-orange-400 cursor-not-allowed'
                        : 'bg-white border border-orange-200 text-orange-600 hover:bg-orange-50 shadow-sm active:scale-95'}
                `}
            >
                <RefreshCw size={10} className={isRetrying ? "animate-spin" : ""} />
                {isRetrying ? 'Retrying' : 'Retry'}
            </button>
        </div>
    );
};
