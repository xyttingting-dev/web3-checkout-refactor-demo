
import { useState } from 'react';
import { AlertTriangle, Smartphone } from 'lucide-react';

interface FallbackConsoleProps {
    onRetry: () => void;
    onDappPay?: () => void;
}


import { AddressTransferPanel } from './AddressTransferPanel';

export const FallbackConsole = ({ onRetry, onDappPay }: FallbackConsoleProps) => {
    const [activeTab, setActiveTab] = useState<'dapp' | 'address'>('dapp');

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 font-sans antialiased">
            {/* 1. Compact Error Header */}
            <div className="bg-orange-50 p-6 flex flex-col items-center justify-center border-b border-orange-100">
                <div className="flex items-center gap-2 text-orange-600 mb-1">
                    <AlertTriangle size={20} />
                    <span className="font-bold text-sm">Connection Interrupted</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-orange-400 bg-orange-100/50 px-2 py-0.5 rounded">Error 410</span>
                    <button onClick={onRetry} className="text-[10px] font-bold text-orange-600 underline hover:text-orange-700">Retry</button>
                </div>
            </div>

            {/* 2. Thin Divider & Tabs */}
            <div className="border-b border-gray-100">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab('dapp')}
                        className={`flex-1 py-3 text-xs font-bold transition-colors border-b-2 ${activeTab === 'dapp' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                        DApp Pay
                    </button>
                    <button
                        onClick={() => setActiveTab('address')}
                        className={`flex-1 py-3 text-xs font-bold transition-colors border-b-2 ${activeTab === 'address' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                        Address Transfer
                    </button>
                </div>
            </div>

            <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">
                {activeTab === 'dapp' ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-2">
                            <Smartphone size={32} />
                        </div>
                        <p className="text-xs text-gray-500 text-center px-4">
                            Use your wallet's internal browser to scan or navigate to complete payment.
                        </p>
                        <button
                            onClick={onDappPay}
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 mt-2"
                        >
                            Open DApp Browser
                        </button>
                    </div>
                ) : (
                    <AddressTransferPanel />
                )}
            </div>
        </div>
    );
};
