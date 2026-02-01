import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Loader2, Lock, X, RefreshCcw, CheckCircle2, AlertCircle } from 'lucide-react';
import { NetworkSelector } from './NetworkSelector';
import { motion, AnimatePresence } from 'framer-motion';

interface DappBrowserProps {
    onConfirm: () => void;
}

export const DappBrowser = ({ onConfirm }: DappBrowserProps) => {
    const [step, setStep] = useState<'network' | 'confirm' | 'signing' | 'success' | 'rejected'>('network');
    const [selectedChain, setSelectedChain] = useState('');
    const [isAuthorizing, setIsAuthorizing] = useState(false);

    const networks = [
        { id: 'avax', name: 'Avalanche', icon: 'avax' },
        { id: 'bsc', name: 'BSC', icon: 'bsc' },
        { id: 'tron', name: 'TRON', icon: 'tron' },
        { id: 'polygon', name: 'Polygon', icon: 'polygon' },
        { id: 'eth', name: 'Ethereum', icon: 'eth' },
    ];

    const handleGenerate = (chain: string) => {
        setSelectedChain(chain);
        setStep('confirm');
    };

    const handleSubmit = () => {
        setStep('signing');
    };

    const handleSignConfirm = () => {
        // State 1: Pending -> Loading
        setIsAuthorizing(true);

        // State 2: Authorizing (Simulate Contract Call)
        setTimeout(() => {
            setIsAuthorizing(false);
            setStep('success');

            // State 3: Success Sync (Sync to Main App)
            setTimeout(() => {
                onConfirm();
            }, 800);
        }, 1500);
    }

    const handleSignReject = () => {
        setStep('rejected');
        // Reset after delay or keep rejected state? 
        // Instruction says: "收银台保持在 DApp 支付待命状态，不跳转结果页。"
        // So we just show rejected in DApp view, maybe allow retry.
        setTimeout(() => {
            setStep('confirm'); // Go back to confirm screen to retry
        }, 2000);
    }


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm font-sans antialiased text-gray-900">
            {/* Device Frame */}
            <div className="w-full max-w-[360px] h-[640px] bg-gray-100 rounded-[3rem] overflow-hidden shadow-2xl relative flex flex-col border-[8px] border-gray-900">

                {/* Simulated System Status Bar (iOS) */}
                <div className="h-8 bg-black text-white flex justify-between items-center px-6 text-[10px] font-bold z-20 pt-2">
                    <span>9:41</span>
                    <div className="w-16 h-4 bg-black rounded-b-xl absolute top-0 left-1/2 -translate-x-1/2"></div>
                    <div className="flex gap-1.5">
                        <span className="opacity-80">5G</span>
                        <span className="opacity-80">100%</span>
                    </div>
                </div>

                {/* Simulated Wallet App Header */}
                <div className="bg-gray-900 px-4 py-3 flex items-center gap-3 z-20 shadow-sm shrink-0">
                    <button className="bg-gray-800 rounded-full p-1.5 text-white/50 hover:bg-gray-700 hover:text-white transition-colors">
                        <X size={14} />
                    </button>
                    <div className="flex-1 bg-gray-800 rounded-lg h-7 flex items-center px-3 gap-2 overflow-hidden">
                        <Lock size={10} className="text-green-500 flex-shrink-0" />
                        <span className="text-[10px] text-gray-300 font-mono truncate">pay.bonuspay.com/checkout...</span>
                    </div>
                    <button className="bg-gray-800 rounded-full p-1.5 text-white/50 hover:bg-gray-700 hover:text-white transition-colors">
                        <RefreshCcw size={14} />
                    </button>
                </div>

                {/* Browser Content */}
                <div className="flex-1 overflow-y-auto bg-white relative flex flex-col">

                    {/* Header Section */}
                    <div className="pt-8 pb-6 px-6 text-center bg-white z-10">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-blue-600">
                            <ShieldCheck size={28} />
                        </div>
                        <h3 className="text-gray-800 font-bold mb-0.5 leading-tight">BonusPay Global</h3>
                        <div className="text-2xl font-black text-gray-900 leading-tight">
                            20.00 <span className="text-sm text-gray-500 font-medium">USDT</span>
                        </div>
                    </div>

                    <div className="px-6 pb-6 flex-1 flex flex-col">

                        {/* Step 1: Network Selection */}
                        {step === 'network' && (
                            <div className="flex-1">
                                <NetworkSelector onGenerate={handleGenerate} networks={networks} />
                            </div>
                        )}

                        {/* Step 2: Confirm Payment Details */}
                        {(step === 'confirm' || step === 'rejected') && (
                            <div className="animate-in fade-in slide-in-from-right duration-300 flex-1 flex flex-col">
                                {step === 'rejected' && (
                                    <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-bold animate-in slide-in-from-top-2">
                                        <AlertCircle size={16} />
                                        Transaction Rejected
                                    </div>
                                )}

                                <div className="space-y-4 flex-1">
                                    <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-400 font-medium">Payment Network</span>
                                            <span className="font-bold text-gray-900 leading-relaxed">{networks.find(n => n.id === selectedChain)?.name}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-400 font-medium">Gas Fee (Est.)</span>
                                            <span className="font-bold text-gray-900 leading-relaxed">$0.45</span>
                                        </div>
                                        <div className="flex justify-between text-xs pt-2 border-t border-gray-200">
                                            <span className="text-gray-400 font-medium">Total</span>
                                            <span className="font-bold text-gray-900 leading-relaxed">$20.45</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xl shadow-blue-200"
                                >
                                    <span>Submit Payment</span>
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        )}

                        {/* Success State */}
                        {step === 'success' && (
                            <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in duration-300 pb-10">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h3 className="font-bold text-lg text-gray-900">Payment Successful</h3>
                                <p className="text-xs text-gray-400 mt-1">Redirecting to merchant...</p>
                            </div>
                        )}
                    </div>

                    {/* Signature Modal (Bottom Sheet Style) */}
                    <AnimatePresence>
                        {step === 'signing' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end"
                            >
                                <motion.div
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    exit={{ y: "100%" }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="w-full bg-white rounded-t-[2rem] p-6 pb-8 shadow-2xl relative"
                                >
                                    {/* Handle Bar */}
                                    <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>

                                    <div className="flex flex-col gap-6">
                                        <div className="text-center">
                                            <h4 className="font-bold text-lg text-gray-900">Signature Request</h4>
                                            <p className="text-xs text-gray-400 mt-1">Allow <strong className="text-gray-900">BonusPay Global</strong> to spend your USDT?</p>
                                        </div>

                                        <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-gray-400 font-medium">Contract</span>
                                                <span className="font-mono text-gray-600 bg-gray-200 px-1.5 py-0.5 rounded tracking-tight">0x55d...b1a</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-gray-400 font-medium">Permission</span>
                                                <span className="font-bold text-gray-900">Unlimited Spend Limit</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-gray-400 font-medium">Network Fee</span>
                                                <span className="font-bold text-orange-600">$0.12 ~ $0.50</span>
                                            </div>
                                        </div>

                                        <p className="text-[10px] text-gray-400 text-center leading-tight px-4">
                                            Please make sure you trust this site. A signature can grant access to your assets.
                                        </p>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleSignReject}
                                                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 active:scale-[0.98] transition-all"
                                            >
                                                Reject
                                            </button>
                                            <button
                                                onClick={handleSignConfirm}
                                                disabled={isAuthorizing}
                                                className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                                            >
                                                {isAuthorizing ? (
                                                    <>
                                                        <Loader2 className="animate-spin" size={16} />
                                                        <span>Confirming...</span>
                                                    </>
                                                ) : (
                                                    <span>Confirm</span>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>
        </div>
    );
};
