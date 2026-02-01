import React, { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWalletIcon } from './IconLibrary';
import type { WalletId } from '../hooks/useCheckoutState';

interface WalletLibraryProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (id: WalletId) => void;
    wallets: Array<{ id: string; name: string }>;
}

export const WalletLibrary = ({ isOpen, onClose, onSelect, wallets }: WalletLibraryProps) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredWallets = wallets.filter(w =>
        w.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute inset-0 bg-white z-50 flex flex-col font-sans antialiased text-gray-900"
                >
                    {/* Header */}
                    <div className="flex items-center gap-3 p-5 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                        <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors">
                            <ArrowLeft size={20} className="text-gray-700" />
                        </button>
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <Search size={14} />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search all wallets"
                                className="w-full bg-gray-100/50 border-none rounded-xl pl-9 pr-4 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4 leading-tight">All Wallets ({filteredWallets.length})</h3>
                        <div className="grid grid-cols-4 sm:grid-cols-4 gap-x-2 gap-y-6">
                            {filteredWallets.map(w => (
                                <button
                                    key={w.id}
                                    onClick={() => onSelect(w.id as WalletId)}
                                    className="flex flex-col items-center gap-2 group"
                                >
                                    <div className="w-14 h-14 relative bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm transition-all group-hover:scale-105 group-hover:shadow-md group-hover:border-indigo-100">
                                        <div className="w-9 h-9">
                                            {getWalletIcon(w.id)}
                                        </div>
                                        {/* EVM / TRON Badge Simulation */}
                                        <div className="absolute -bottom-1 -right-1 bg-gray-900/90 text-[8px] text-white px-1 py-0.5 rounded-md font-bold shadow-sm">
                                            EVM
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-medium text-gray-600 text-center leading-tight line-clamp-2 max-w-[60px]">
                                        {w.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
