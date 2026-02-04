import { useState, useEffect } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWalletIcon } from './IconLibrary';
import type { WalletId } from '../hooks/useCheckoutState';
import { ConnectQrModal } from './ConnectQrModal';

interface WalletLibraryProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (id: WalletId) => void;
    wallets: Array<{ id: string; name: string }>;
    initialSearchTerm?: string;
}

export const WalletLibrary = ({ isOpen, onClose, onSelect, wallets, initialSearchTerm = '' }: WalletLibraryProps) => {
    const [searchQuery, setSearchQuery] = useState(initialSearchTerm);
    const [qrWallet, setQrWallet] = useState<{ id: string; name: string } | null>(null);

    useEffect(() => {
        if (isOpen && initialSearchTerm) {
            setSearchQuery(initialSearchTerm);
        } else if (!isOpen) {
            setSearchQuery(''); // Reset on close
            setQrWallet(null);
        }
    }, [isOpen, initialSearchTerm]);

    // Mock Cloud Discovery Logic
    // If query matches a known "Cloud" wallet not in local list, append it for demo
    // const extendedWallets = [...wallets]; // Unused
    const lowerQuery = searchQuery.toLowerCase();

    // Cloud database simulation
    const cloudKnown = [
        { id: 'rainbow', name: 'Rainbow' },
        { id: 'trust', name: 'Trust Wallet' },
        { id: 'safe', name: 'Safe' },
        { id: 'argent', name: 'Argent' }
    ];

    // --- Search Logic Split ---
    const isSearchActive = lowerQuery.length > 0;

    // 1. Local Results
    const localMatches = wallets.filter(w => w.name.toLowerCase().includes(lowerQuery));

    // 2. Cloud Results (Always show Rainbow if searching for it, or empty if not found in cloud)
    const cloudMatches = isSearchActive
        ? cloudKnown.filter(c => c.name.toLowerCase().includes(lowerQuery) && !wallets.find(w => w.id === c.id))
        : [];

    const handleWalletClick = (w: { id: string; name: string }) => {
        // Condition: If it's a "Direct Connect" wallet (like MetaMask Injected), just select.
        // If it's a "QR Scan" wallet (WalletConnect, Rainbow, etc), open QR Modal.
        // For this demo: MetaMask = Direct; Others = QR (as they likely rely on WC in desktop mode).

        if (w.id === 'metamask' || w.id === 'injected') {
            onSelect(w.id as WalletId);
        } else {
            // Open QR Modal
            console.log('[Audit] Opening QR Modal for:', w.name);
            setQrWallet(w);
        }
    };

    // Helper to render wallet item
    const renderWalletItem = (w: { id: string; name: string }) => (
        <button
            key={w.id}
            onClick={() => handleWalletClick(w)}
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
                                className="w-full bg-gray-100/50 border-none rounded-xl pl-9 pr-8 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20"
                                autoFocus
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Grid Content */}
                    <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">

                        {!isSearchActive ? (
                            // Default View: All Local Wallets
                            <>
                                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4 leading-tight">All Wallets ({localMatches.length})</h3>
                                <div className="grid grid-cols-4 sm:grid-cols-4 gap-x-2 gap-y-6">
                                    {localMatches.map(renderWalletItem)}
                                </div>
                            </>
                        ) : (
                            // Search Results View: Split Layout
                            <div className="flex flex-col gap-8">

                                {/* Section A: Local Wallets */}
                                <div>
                                    <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4 leading-tight">Local Wallets</h3>
                                    {localMatches.length > 0 ? (
                                        <div className="grid grid-cols-4 sm:grid-cols-4 gap-x-2 gap-y-6">
                                            {localMatches.map(renderWalletItem)}
                                        </div>
                                    ) : (
                                        <div className="py-4 text-center">
                                            <p className="text-xs text-gray-300">No local results found.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-gray-100 w-full" />

                                {/* Section B: Cloud / Library Wallets */}
                                <div>
                                    <h3 className="text-xs font-medium text-blue-500 uppercase tracking-wider mb-4 leading-tight flex items-center gap-2">
                                        Connect Library
                                        <span className="bg-blue-50 text-blue-600 text-[8px] px-1.5 py-0.5 rounded-full font-bold">Cloud</span>
                                    </h3>

                                    {cloudMatches.length > 0 ? (
                                        <div className="grid grid-cols-4 sm:grid-cols-4 gap-x-2 gap-y-6">
                                            {cloudMatches.map(renderWalletItem)}
                                        </div>
                                    ) : (
                                        <div className="py-2">
                                            <p className="text-xs text-gray-300 italic">Try searching for "Rainbow" or "Safe"...</p>
                                        </div>
                                    )}
                                </div>

                            </div>
                        )}

                    </div>

                    {/* Authorization Zone Modal */}
                    <AnimatePresence>
                        {qrWallet && (
                            <ConnectQrModal
                                walletName={qrWallet.name}
                                walletId={qrWallet.id}
                                onClose={() => setQrWallet(null)}
                                onBack={() => setQrWallet(null)}
                            />
                        )}
                    </AnimatePresence>

                </motion.div>
            )}
        </AnimatePresence>
    );
};
