import { useState } from 'react';
import type { WalletId, CheckoutState } from '../hooks/useCheckoutState';
import { Search, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { useConnectors } from 'wagmi';
import { getWalletIcon } from './IconLibrary';
import { motion, AnimatePresence } from 'framer-motion';

// --- Wallet Inventory Definitions ---
const ALL_WALLETS = [
    { id: 'metamask', name: 'MetaMask' },
    { id: 'walletconnect', name: 'WalletConnect' },
    { id: 'bitget', name: 'Bitget Wallet' },
    { id: 'okx', name: 'OKX Wallet' },
    { id: 'coinbase', name: 'Coinbase' },
    { id: 'imtoken', name: 'imToken' },
    { id: 'phantom', name: 'Phantom' },
    { id: 'trust', name: 'Trust Wallet' },
    { id: 'tronlink', name: 'TronLink' },
];
const EXCHANGE_WALLETS = [
    { id: 'binance', name: 'Binance' },
    { id: 'kucoin', name: 'KuCoin' },
    { id: 'gate', name: 'Gate.io' },
];

interface WalletGridProps {
    onSelect: (id: WalletId) => void;
    checkoutState: CheckoutState;
    selectedWalletId: WalletId | null;
}

export const WalletGrid = ({ onSelect, checkoutState, selectedWalletId }: WalletGridProps) => {
    const connectors = useConnectors();
    const detectedNames = connectors
        .filter(c => c.type === 'injected' && c.icon)
        .map(c => c.name.toLowerCase());
    if (detectedNames.length === 0) detectedNames.push('metamask');

    const [activeTab, setActiveTab] = useState<'web3' | 'exchange'>('web3');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const sortedWeb3Wallets = [...ALL_WALLETS].sort((a, b) => {
        const aDetected = detectedNames.some(n => n.includes(a.name.toLowerCase().split(' ')[0].toLowerCase()));
        const bDetected = detectedNames.some(n => n.includes(b.name.toLowerCase().split(' ')[0].toLowerCase()));
        if (aDetected && !bDetected) return -1;
        if (!aDetected && bDetected) return 1;
        if (a.id === 'walletconnect' && b.id !== 'walletconnect') return -1;
        if (a.id !== 'walletconnect' && b.id === 'walletconnect') return 1;
        return 0;
    });

    const targetList = activeTab === 'web3' ? sortedWeb3Wallets : EXCHANGE_WALLETS;
    let displayedWallets = targetList.filter(w => w.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const showFolding = activeTab === 'web3' && searchQuery === '' && !isExpanded;
    const initialDisplayCount = 6; // Show more initially to fit design better if folded
    const visibleWallets = (showFolding) ? displayedWallets.slice(0, 6) : displayedWallets; // Adjusted logic
    const remainingCount = displayedWallets.length - 6;

    const isProcessing = checkoutState === 'PROCESSING';

    return (
        <div className="flex flex-col h-full min-h-[400px] relative">

            {/* Global Overlay for Processing State */}
            <AnimatePresence>
                {isProcessing && selectedWalletId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-xl rounded-2xl"
                    >
                        {/* Centered Breathing Icon */}
                        <motion.div
                            layoutId={`wallet-icon-${selectedWalletId}`}
                            className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)] z-50 relative"
                            animate={{ scale: [1, 1.08, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <div className="w-12 h-12">
                                {getWalletIcon(selectedWalletId)}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl mb-4 flex-shrink-0 relative z-0">
                <button
                    onClick={() => setActiveTab('web3')}
                    className={clsx(
                        "flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-300",
                        activeTab === 'web3' ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    Web3
                </button>
                <button
                    onClick={() => setActiveTab('exchange')}
                    className={clsx(
                        "flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-300",
                        activeTab === 'exchange' ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    Exchange
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4 group flex-shrink-0 z-20">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-500">
                    <Search size={16} /> {/* Generic search icon instead of WC logo */}
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search wallet"
                    className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-gray-400"
                />
            </div>

            {/* Grid Area */}
            <div className="flex-1 overflow-y-auto pr-1 -mr-1 custom-scrollbar relative z-0 pl-1 pt-1">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-4">
                    {visibleWallets.map((w) => {
                        const isSelected = selectedWalletId === w.id;
                        // const isDetected = detectedNames.some(n => n.includes(w.name.toLowerCase().split(' ')[0].toLowerCase()));

                        return (
                            <button
                                key={w.id}
                                onClick={() => onSelect(w.id as WalletId)}
                                className={clsx(
                                    "group relative flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 min-h-[110px]",
                                    "bg-white border border-gray-100",
                                    // Remove border on hover, use shadow/transform
                                    !isSelected && "hover:shadow-lg hover:-translate-y-1 hover:border-blue-200",
                                    // Real Selection State using Rings. Z-index 20 ensures visual layering over neighbors.
                                    isSelected ? "ring-2 ring-blue-500 ring-offset-2 z-20" : "z-0"
                                )}
                            >
                                <motion.div
                                    // Use layoutId for shared element transition if not processing, 
                                    // OR handle the lift off. 
                                    // Strategically, if we are processing, this element 'disappears' here and 'reappears' in overlay via layoutId.
                                    layoutId={isProcessing && isSelected ? `wallet-icon-${w.id}` : undefined}
                                    className="w-12 h-12 rounded-xl mb-3 flex items-center justify-center bg-white transition-all duration-300"
                                >
                                    {getWalletIcon(w.id)}
                                </motion.div>

                                <span className={clsx(
                                    "font-semibold text-xs text-center leading-tight px-1 transition-colors",
                                    isSelected ? "text-blue-600" : "text-gray-800"
                                )}>
                                    {w.name}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* More Button */}
                {showFolding && remainingCount > 0 && (
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="w-full py-3 mb-4 flex items-center justify-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
                    >
                        <span>Show more wallets</span>
                        <ChevronDown size={14} />
                    </button>
                )}
            </div>
        </div>
    )
}
