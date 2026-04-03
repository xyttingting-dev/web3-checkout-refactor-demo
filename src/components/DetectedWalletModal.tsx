import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWalletIcon } from './IconLibrary';

interface DetectedWalletModalProps {
    isOpen: boolean;
    walletName: string;
    onConnect: () => void;
    onCancel: () => void;
}

// Function to map walletName to icon ID 
function walletIdFromName(name: string): string {
    const n = name.toLowerCase();
    if (n.includes('metamask'))  return 'metamask';
    if (n.includes('trust'))     return 'trust';
    if (n.includes('bitget'))    return 'bitget';
    if (n.includes('okx'))       return 'okx';
    if (n.includes('coinbase'))  return 'coinbase';
    if (n.includes('tokenpocket')) return 'tokenpocket';
    return 'injected';
}

export const DetectedWalletModal: React.FC<DetectedWalletModalProps> = ({
    isOpen, walletName, onConnect, onCancel
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="absolute inset-0 z-[70] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-2xl"
                        onClick={onCancel}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative w-full max-w-[280px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 p-6 flex flex-col items-center text-center overflow-hidden"
                    >
                        {/* Decorative background glow */}
                        <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />

                        {/* Icon */}
                        <div className="w-16 h-16 mb-4 relative z-10 drop-shadow-md rounded-2xl bg-white flex items-center justify-center">
                            {getWalletIcon(walletIdFromName(walletName))}
                        </div>
                        
                        <h3 className="text-[17px] font-bold text-gray-900 mb-1.5 leading-tight relative z-10 tracking-tight">
                            {walletName} Detected
                        </h3>
                        <p className="text-[11px] font-medium text-gray-500 mb-6 relative z-10 leading-relaxed px-1">
                            We found a locally installed wallet plugin. Connect now for a seamless checkout.
                        </p>

                        <div className="w-full flex flex-col gap-2 relative z-10">
                            <button
                                onClick={onConnect}
                                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[13px] rounded-xl transition-all shadow-md shadow-indigo-200/50 active:scale-[0.98]"
                            >
                                Connect {walletName}
                            </button>
                            <button
                                onClick={onCancel}
                                className="w-full py-3 text-gray-400 hover:text-gray-600 text-[11px] font-semibold rounded-xl bg-transparent hover:bg-gray-50 transition-colors"
                            >
                                Cancel / Other wallets
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
