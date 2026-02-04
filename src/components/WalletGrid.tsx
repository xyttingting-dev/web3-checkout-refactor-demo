
import { useState } from 'react';
import type { WalletId, CheckoutState } from '../hooks/useCheckoutState';
import { ChevronRight, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { useConnectors } from 'wagmi';


import { getWalletIcon, IconAvalanche, IconBSC, IconPolygon, IconTron, IconEthereum } from './IconLibrary';
import { motion, AnimatePresence } from 'framer-motion';
import { WalletLibrary } from './WalletLibrary';


// --- Wallet Inventory Definitions ---
const ALL_WALLETS = [
    { id: 'metamask', name: 'MetaMask' },
    { id: 'walletconnect', name: 'WalletConnect' },
    { id: 'binance', name: 'Binance Wallet' }, // Moved from Exchange
    { id: 'okx', name: 'OKX Wallet' },
    { id: 'bitget', name: 'Bitget Wallet' },
    { id: 'trust', name: 'Trust Wallet' },
    { id: 'coinbase', name: 'Coinbase Wallet' },
    { id: 'imtoken', name: 'imToken' },

    // Less priority
    { id: 'tokenpocket', name: 'TokenPocket' },
    { id: 'tronlink', name: 'TronLink' },
    { id: 'phantom', name: 'Phantom' },
    { id: 'coolwallet', name: 'CoolWallet' },
];

// Special entry for Manual Transfer. Only shown at the end of expanded list.
const TRANSFER_WALLET = { id: 'transfer', name: 'Transfer Pay' };

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


    // Sort logic
    const sortedWeb3Wallets = [...ALL_WALLETS].sort((a, b) => {
        const aDetected = detectedNames.some(n => n.includes(a.name.toLowerCase().split(' ')[0].toLowerCase()));
        const bDetected = detectedNames.some(n => n.includes(b.name.toLowerCase().split(' ')[0].toLowerCase()));

        if (aDetected && !bDetected) return -1;
        if (!aDetected && bDetected) return 1;

        return 0;
    });

    const [isExpanded, setIsExpanded] = useState(false);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);

    const targetList: any[] = [...sortedWeb3Wallets];
    if (isExpanded) {
        targetList.push(TRANSFER_WALLET as any);
    }
    const initialDisplayCount = 9;

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

    // REMOVED: Search State for V2.0
    // const [searchTerm, setSearchTerm] = useState('');
    // const [showSamples, setShowSamples] = useState(false);

    // Filter logic removed as search is gone
    const finalDisplay = displayedWallets;

    return (
        <div className="flex flex-col h-full min-h-[400px] relative">


            {/* Global Overlay for Processing State */}
            <AnimatePresence>
                {/* Condition: PROCESSING state AND wallet is selected. 
                    This covers both:
                    1. Initial Wallet Selection (Simulated Processing)
                    2. Web3 Connect Processing (triggered by selectPath) 
                */}
                {isProcessing && selectedWalletId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[60] flex items-center justify-center bg-white/60 backdrop-blur-xl rounded-2xl"
                    >
                        {/* Centered Breathing Icon */}
                        <motion.div
                            key="loader"
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

            {/* Tabs - REMOVED for V2.0 */}
            {/* 
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
            */}


            {/* Search Bar - Acts as Library Trigger */}
            {/* REMOVED: Search Bar to clean up layout as per V2.0 instructions. */}
            {/* 
                <div className="relative mb-4 group flex-shrink-0 z-20">
                     ... Search code ...
                </div> 
                */}

            {/* Wallet Grid */}
            <div className="grid grid-cols-3 gap-3 pb-4 px-1">
                {finalDisplay.map((w) => {
                    const isSelected = selectedWalletId === w.id;
                    const isTransfer = w.id === 'transfer';

                    if (isTransfer) {
                        return (
                            <button
                                key={w.id}
                                onClick={() => onSelect(w.id as WalletId)}
                                className={clsx(
                                    "col-span-3 relative flex flex-col items-center justify-between p-3 rounded-xl transition-all duration-300 min-h-[100px]",
                                    "bg-white border border-gray-100",
                                    !isSelected && "hover:shadow-lg hover:-translate-y-1 hover:border-blue-200",
                                    isSelected ? "ring-2 ring-blue-500 ring-offset-2 z-30" : "z-0"
                                )}
                            >
                                {/* Content Wrapper to match centering of others but with specific layout */}
                                <div className="flex flex-col items-center w-full h-full gap-2">

                                    {/* Custom 'Icon' Area - simulating other wallets having a big icon, here we show chain row + chevron? 
                                        Or stick to requested: "Address Transfer" text style matches "MetaMask".
                                        Common wallets have: Icon (Top), Text (Bottom).
                                        Address Transfer: 
                                        User said: "Card right side ... simple vector > icon".
                                        "Bottom bar ... 5 chain icons".
                                        Let's try to mimic the structure: 
                                        Top Area: Chain Icons Row (as the 'visual'?) OR Title?
                                        User said: "Title style must match MetaMask".
                                        Let's put Title at Bottom like others?
                                        And Chains at Top? 
                                        Or Title Top, Chains Bottom?
                                        The user prompt implies a Layout similar to 'standard tab'.
                                        Standard tab is: Icon (Center), Name (Bottom).
                                        If I put Chains at bottom, it might conflict with Name position.
                                        Let's try:
                                            Top: Row of Chain Icons (acting as the main visual)
                                            Bottom: "Address Transfer" Name
                                            Right absolute: Chevron?
                                        Actually, User said: "Text style must match... MetaMask".
                                        "Bottom bar: 5 chain icons".
                                        So:
                                        Name (Middle/Top?)
                                        Chain Icons (Bottom)
                                        Chevron (Right side)
                                    */}

                                    {/* Let's try to keep it clean. */}
                                    <div className="flex-1 flex items-center justify-center w-full relative">
                                        {/* Chain Icons as the 'Main Visual' in the center */}
                                        <div className="flex -space-x-1 items-center justify-center">
                                            <div className="w-5 h-5 rounded-full border border-white bg-white z-[5]"><IconAvalanche /></div>
                                            <div className="w-5 h-5 rounded-full border border-white bg-white z-[4]"><IconBSC /></div>
                                            <div className="w-5 h-5 rounded-full border border-white bg-white z-[3]"><IconPolygon /></div>
                                            <div className="w-5 h-5 rounded-full border border-white bg-white z-[2]"><IconTron /></div>
                                            <div className="w-5 h-5 rounded-full border border-white bg-white z-[1]"><IconEthereum /></div>
                                        </div>

                                        {/* Chevron absolute right */}
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1">
                                            <ChevronRight size={14} className="text-gray-300" />
                                        </div>
                                    </div>

                                    <span className={clsx(
                                        "font-semibold text-[11px] text-center leading-tight px-1 transition-colors",
                                        isSelected ? "text-blue-600" : "text-gray-800"
                                    )}>
                                        Address Transfer
                                    </span>
                                </div>
                            </button>
                        )
                    }

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
                        </button>
                    );
                })}
            </div>


            {/* Empty State / Cloud Search Trigger - REMOVED for V2.0 */}
            {/* 
            {searchTerm && finalDisplay.length === 0 && (
                ...
            )} 
            */}

            {/* Show More Button (Only if NOT expanded) */}
            {!isExpanded && (
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
                initialSearchTerm={''}
            />
        </div>
    )
}
