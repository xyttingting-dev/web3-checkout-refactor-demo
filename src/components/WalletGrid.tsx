import React, { useState } from 'react';
import type { WalletId, CheckoutState } from '../hooks/useCheckoutState';
import { Search, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { useConnectors } from 'wagmi';
import { getWalletIcon } from './IconLibrary';
import { motion, AnimatePresence } from 'framer-motion';
import { WalletLibrary } from './WalletLibrary';

// --- Wallet Inventory Definitions ---
const ALL_WALLETS = [
    { id: 'metamask', name: 'MetaMask' },
    { id: 'walletconnect', name: 'WalletConnect' },
    { id: 'bitget', name: 'Bitget Wallet' },
    { id: 'okx', name: 'OKX Wallet' },
    { id: 'coinbase', name: 'Coinbase Wallet' },
    { id: 'imtoken', name: 'imToken' },
    { id: 'trust', name: 'Trust Wallet' },
    { id: 'tokenpocket', name: 'TokenPocket' },
    { id: 'tronlink', name: 'TronLink' },
    { id: 'phantom', name: 'Phantom' },
    { id: 'coolwallet', name: 'CoolWallet' },
];

const EXCHANGE_WALLETS = [
    { id: 'binance', name: 'Binance' },
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
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const sortedWeb3Wallets = [...ALL_WALLETS].sort((a, b) => {
        const aDetected = detectedNames.some(n => n.includes(a.name.toLowerCase().split(' ')[0].toLowerCase()));
        const bDetected = detectedNames.some(n => n.includes(b.name.toLowerCase().split(' ')[0].toLowerCase()));

        if (aDetected && !bDetected) return -1;
        if (!aDetected && bDetected) return 1;

        return 0;
    });

    const targetList = activeTab === 'web3' ? sortedWeb3Wallets : EXCHANGE_WALLETS;

    // First Level: Popular 6 (Indices 0-5)
    // Second Level: Expanded All
    const initialDisplayCount = 6;

    // Logic: 
    // If not expanded: Show first 8.
    // If expanded: Show ALL.
    // + More Card: ALWAYS render as the last item if expanded, OR as the 8th item if not expanded?
    // Requirement:
    // "First Level: Popular 8" -> Show 0-7.
    // "Second Level: Show more wallets" -> Expand all.
    // "At the end of expanded list -> + More card".

    // Actually the requirement says: 
    // "第一级 (首页 Popular)： 展示精选的 8 个常用钱包。"
    // "第二级 (展开列表)： 点击列表下方的 Show more wallets 后，在当前页面平滑展开全量钱包网格。"
    // "关键点： 在展开后的网格最后一位，增加一个具备扩展感的 + More 规范入口卡片"

    // So:
    // 1. Initial view: 8 wallets.
    // 2. Button "Show more wallets" below grid.
    // 3. Expanded view: All listed wallets + "+ More" card at the very end.

    const displayedWallets = isExpanded
        ? targetList
        : targetList.slice(0, initialDisplayCount);

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

            {/* Search Bar - Acts as Library Trigger */}
            <div className="relative mb-4 group flex-shrink-0 z-20">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-500">
                    <Search size={16} />
                </div>
                <input
                    type="text"
                    onFocus={() => setIsLibraryOpen(true)}
                    onClick={() => setIsLibraryOpen(true)}
                    readOnly
                    value=""
                    placeholder="Search wallets"
                    className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-gray-400 cursor-pointer"
                />
            </div>

            <div className="grid grid-cols-3 gap-3 pb-4 px-1">
                {displayedWallets.map((w) => {
                    const isSelected = selectedWalletId === w.id;
                    return (
                        <button
                            key={w.id}
                            onClick={() => onSelect(w.id as WalletId)}
                            className={clsx(
                                "group relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 min-h-[100px]",
                                "bg-white border border-gray-100",
                                !isSelected && "hover:shadow-lg hover:-translate-y-1 hover:border-blue-200",
                                isSelected ? "ring-2 ring-blue-500 ring-offset-2 z-30" : "z-0"
                            )}
                        >
                            <motion.div
                                layoutId={isProcessing && isSelected ? `wallet-icon-${w.id}` : undefined}
                                className="w-10 h-10 rounded-xl mb-2 flex items-center justify-center bg-white transition-all duration-300"
                            >
                                {getWalletIcon(w.id)}
                            </motion.div>

                            <span className={clsx(
                                "font-semibold text-[11px] text-center leading-tight px-1 transition-colors",
                                isSelected ? "text-blue-600" : "text-gray-800"
                            )}>
                                {w.name}
                            </span>

                            {/* Badge */}
                            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[8px] font-bold text-gray-300">EVM</span>
                            </div>
                        </button>
                    );
                })}

                {/* + More Card: ONLY visible when EXPANDED */}
                {isExpanded && activeTab === 'web3' && (
                    <button
                        onClick={() => setIsLibraryOpen(true)}
                        className="group flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 min-h-[100px] border border-dashed border-gray-300 bg-gray-50/50 hover:bg-gray-100 hover:border-gray-400"
                    >
                        <div className="w-10 h-10 rounded-xl mb-2 flex items-center justify-center bg-transparent opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                            {getWalletIcon('walletconnect')}
                        </div>
                        <span className="font-bold text-[11px] text-gray-500 group-hover:text-gray-700">
                            + More
                        </span>
                    </button>
                )}
            </div>

            {/* Show More Button (Only if NOT expanded and we have enough wallets) */}
            {!isExpanded && activeTab === 'web3' && (
                <div className="flex justify-center mt-0 pb-4">
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="w-full py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-500 transition-colors flex items-center justify-center gap-1"
                    >
                        Show more wallets
                        <ChevronDown size={14} />
                    </button>
                </div>
            )}


            {/* Library Overlay */}
            <WalletLibrary
                isOpen={isLibraryOpen}
                onClose={() => setIsLibraryOpen(false)}
                onSelect={(id) => {
                    setIsLibraryOpen(false);
                    onSelect(id);
                }}
                wallets={ALL_WALLETS}
            />
        </div>
    )
}
