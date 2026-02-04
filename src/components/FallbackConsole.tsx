import { useState, useEffect } from 'react';
import { AlertTriangle, Smartphone, ShieldAlert } from 'lucide-react';
import { AddressTransferPanel, type TransferStatus } from './AddressTransferPanel';

interface FallbackConsoleProps {
    onRetry: () => void;
    onDappPay?: () => void;
}

export const FallbackConsole = ({ onRetry, onDappPay }: FallbackConsoleProps) => {
    const [activeTab, setActiveTab] = useState<'dapp' | 'address'>('dapp');
    const [transferStatus, setTransferStatus] = useState<TransferStatus>('WAITING');
    const [showExitAlert, setShowExitAlert] = useState(false);

    // Global Navigation Guard (Browser Level)
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            // STRICT MODE: Only intercept if PARTIAL_PAID is explicitly detected.
            // Ignored if status is WAITING, OVER_PAID, or SUCCESS.
            if (transferStatus === 'PARTIAL_PAID') {
                e.preventDefault();
                e.returnValue = ''; // Chrome requires this
            }
        };

        if (transferStatus === 'PARTIAL_PAID') {
            window.addEventListener('beforeunload', handleBeforeUnload);
        }

        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [transferStatus]);

    const handleTabChange = (tab: 'dapp' | 'address') => {
        if (transferStatus === 'PARTIAL_PAID') {
            setShowExitAlert(true);
            return;
        }
        setActiveTab(tab);
    };

    return (
        <>
            {/* 1. Global Interaction Blocker (Guard Overlay) */}
            {/* This overlay intentionally covers the entire viewport to block global navigation (Back, Wallet Switch) */}
            {transferStatus === 'PARTIAL_PAID' && (
                <div
                    className="fixed inset-0 bg-transparent z-[999] cursor-not-allowed"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowExitAlert(true);
                    }}
                    title="Please complete payment first"
                />
            )}

            {/* 2. Exit Alert Modal */}
            {showExitAlert && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[24px] shadow-2xl max-w-sm w-full p-6 text-center animate-in zoom-in-95 duration-200 border border-gray-100 font-sans">
                        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                            <ShieldAlert size={28} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Attention: Partial Payment Detected</h3>
                        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                            We have detected a partial payment of <span className="text-gray-900 font-bold">15.00 USDT</span>. If you leave or close this order now, the transaction will be cancelled and funds may be locked in the contract.
                            <br /><br />
                            Please complete the remaining <span className="text-gray-900 font-bold">5.00 USDT</span> to finish the payment.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => setShowExitAlert(false)}
                                className="w-full bg-indigo-600 text-white rounded-2xl h-[56px] font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                            >
                                Complete Payment
                            </button>
                            <button
                                onClick={() => {
                                    setShowExitAlert(false);
                                    onRetry();
                                }}
                                className="text-gray-400 text-xs font-semibold hover:text-gray-600 transition-colors"
                            >
                                Exit Anyway
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Main Console Content */}
            {/* z-1000 ensures content is clickable/visible above the blocking overlay */}
            <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 font-sans antialiased relative z-[1000]">
                {/* Header (Hidden when PARTIAL_PAID) */}
                {transferStatus !== 'PARTIAL_PAID' && (
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
                )}

                {/* Thin Divider & Tabs */}
                <div className="border-b border-gray-100">
                    <div className="flex">
                        <button
                            onClick={() => handleTabChange('dapp')}
                            className={`flex-1 py-3 text-xs font-bold transition-colors border-b-2 ${activeTab === 'dapp' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                        >
                            DApp Pay
                        </button>
                        <button
                            onClick={() => handleTabChange('address')}
                            className={`flex-1 py-3 text-xs font-bold transition-colors border-b-2 ${activeTab === 'address' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                        >
                            Address Transfer
                        </button>
                    </div>
                </div>

                {/* Content */}
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
                        <AddressTransferPanel onStatusChange={setTransferStatus} />
                    )}
                </div>
            </div>
        </>
    );
};
