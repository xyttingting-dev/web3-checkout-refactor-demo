import { useState } from 'react';
import type { WalletId, CheckoutState } from '../hooks/useCheckoutState';
import { Search, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { useConnectors } from 'wagmi';

// --- Wallet Inventory Definitions ---
const ALL_WALLETS = [
    { id: 'metamask', name: 'MetaMask', type: 'evm', color: 'bg-[#F6851B]', textColor: 'text-white' },
    { id: 'walletconnect', name: 'WalletConnect', type: 'other', color: 'bg-[#3B99FC]', textColor: 'text-white' },
    { id: 'bitget', name: 'Bitget Wallet', type: 'evm', color: 'bg-[#00F0FF]', textColor: 'text-black' },
    { id: 'okx', name: 'OKX Wallet', type: 'evm', color: 'bg-black', textColor: 'text-white' },
    { id: 'coinbase', name: 'Coinbase', type: 'evm', color: 'bg-[#0052FF]', textColor: 'text-white' },
    { id: 'particle', name: 'Particle', type: 'other', color: 'bg-[#FF4D4F]', textColor: 'text-white' },
    { id: 'imtoken', name: 'imToken', type: 'evm', color: 'bg-[#098DE6]', textColor: 'text-white' },
    { id: 'coolwallet', name: 'CoolWallet', type: 'other', color: 'bg-[#F9C32D]', textColor: 'text-black' },
    { id: 'tronlink', name: 'TronLink', type: 'tron', color: 'bg-[#3771F4]', textColor: 'text-white' },
];

const EXCHANGE_WALLETS = [
    { id: 'binance', name: 'Binance', type: 'exchange', color: 'bg-[#FCD535]', textColor: 'text-black' },
    { id: 'kucoin', name: 'KuCoin', type: 'exchange', color: 'bg-[#24AE8F]', textColor: 'text-white' },
    { id: 'gate', name: 'Gate.io', type: 'exchange', color: 'bg-[#FF3333]', textColor: 'text-white' },
];

interface WalletGridProps {
    onSelect: (id: WalletId) => void;
    checkoutState: CheckoutState;
    selectedWalletId: WalletId | null;
}

export const WalletGrid = ({ onSelect, checkoutState, selectedWalletId }: WalletGridProps) => {
    const connectors = useConnectors();
    // Detection Check
    const detectedNames = connectors
        .filter(c => c.type === 'injected' && c.icon)
        .map(c => c.name.toLowerCase());

    // Mock Detection for Demo: Ensure MetaMask is 'detected'
    if (detectedNames.length === 0) detectedNames.push('metamask');

    const [activeTab, setActiveTab] = useState<'web3' | 'exchange'>('web3');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    // --- Data Logic ---
    // 1. Prioritize Detected Wallets & WalletConnect on Top
    const sortedWeb3Wallets = [...ALL_WALLETS].sort((a, b) => {
        const aDetected = detectedNames.some(n => n.includes(a.name.toLowerCase().split(' ')[0].toLowerCase()));
        const bDetected = detectedNames.some(n => n.includes(b.name.toLowerCase().split(' ')[0].toLowerCase()));

        // Priority 1: Detected
        if (aDetected && !bDetected) return -1;
        if (!aDetected && bDetected) return 1;

        // Priority 2: WalletConnect
        if (a.id === 'walletconnect' && b.id !== 'walletconnect') return -1;
        if (a.id !== 'walletconnect' && b.id === 'walletconnect') return 1;

        return 0; // Keep original order for others
    });

    const targetList = activeTab === 'web3' ? sortedWeb3Wallets : EXCHANGE_WALLETS;
    let displayedWallets = targetList.filter(w => w.name.toLowerCase().includes(searchQuery.toLowerCase()));

    // Folding Logic for Web3 Tab (only if no search query)
    const showFolding = activeTab === 'web3' && searchQuery === '' && !isExpanded;
    const initialDisplayCount = 2; // Minimalist start: Top 2 only

    // If not expanded and using default view, slice the list
    const visibleWallets = (showFolding) ? displayedWallets.slice(0, initialDisplayCount) : displayedWallets;
    const remainingCount = displayedWallets.length - initialDisplayCount;

    // Animation States
    const isFocusMode = checkoutState === 'FOCUS' || checkoutState === 'PROCESSING';

    return (
        <div className="flex flex-col h-full min-h-[400px] relative">

            {/* Overlay for Focus Mode */}
            {isFocusMode && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 transition-opacity duration-300"></div>
            )}

            {/* V3 Tabs */}
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
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <img
                        src="https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Logo/Blue%20(Default)/Logo.svg"
                        alt="WC"
                        className="w-5 h-5"
                    />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search wallet"
                    className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-gray-400"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    <Search size={16} />
                </div>

                {/* Dropdown (Mock) */}
                {searchFocused && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                        <div className="text-[10px] uppercase font-bold text-gray-400 px-2 py-1 mb-1">Suggested</div>
                        {displayedWallets.slice(0, 3).map(w => (
                            <button key={w.id} onClick={() => onSelect(w.id as WalletId)} className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className={`w-6 h-6 rounded-md ${w.color} flex items-center justify-center text-[10px] text-white`}>{w.name[0]}</div>
                                <span className="text-sm font-medium text-gray-700">{w.name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Grid Area */}
            <div className="flex-1 overflow-y-auto pr-1 -mr-1 custom-scrollbar relative z-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-4">
                    {visibleWallets.map((w) => {
                        const isSelected = selectedWalletId === w.id;
                        const isProcessing = isSelected && checkoutState === 'PROCESSING';
                        // Detected Check
                        const isDetected = detectedNames.some(n => n.includes(w.name.toLowerCase().split(' ')[0].toLowerCase()));

                        return (
                            <button
                                key={w.id}
                                onClick={() => onSelect(w.id as WalletId)}
                                disabled={isFocusMode && !isSelected}
                                className={clsx(
                                    "group relative flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-500 min-h-[110px]",
                                    "bg-white border border-gray-100",
                                    !isFocusMode && "hover:border-indigo-300 hover:shadow-lg hover:-translate-y-1",
                                    isFocusMode && isSelected ? "z-50 scale-110 shadow-2xl border-indigo-500 ring-4 ring-indigo-500/10" : "z-0",
                                    isFocusMode && !isSelected && "opacity-20 blur-[1px] scale-95 grayscale"
                                )}
                                style={isFocusMode && isSelected ? {
                                    position: 'absolute',
                                    top: '50%', left: '50%',
                                    transform: 'translate(-50%, -150%) scale(1.2)',
                                    width: '140px',
                                    height: '140px'
                                } : {}}
                            >
                                {isProcessing && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="absolute w-full h-full rounded-full bg-indigo-500/20 animate-ripple"></div>
                                        <div className="absolute w-full h-full rounded-full bg-indigo-500/10 animate-ripple animation-delay-2000"></div>
                                    </div>
                                )}

                                <div className={clsx(
                                    "w-12 h-12 rounded-xl mb-3 flex items-center justify-center shadow-sm transition-all duration-300",
                                    w.color, w.textColor,
                                    isProcessing && "animate-heartbeat shadow-indigo-500/50"
                                )}>
                                    <span className="font-bold text-lg">{w.name[0]}</span>
                                </div>

                                <span className={clsx(
                                    "font-semibold text-xs text-center leading-tight px-1 transition-colors",
                                    isSelected ? "text-indigo-900" : "text-gray-800"
                                )}>
                                    {w.name}
                                </span>

                                {activeTab === 'web3' && isDetected && !isFocusMode && (
                                    <span className="absolute bottom-2 right-2 flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 border border-white"></span>
                                    </span>
                                )}
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
                        <span>Show {remainingCount} more wallets</span>
                        <ChevronDown size={14} />
                    </button>
                )}
            </div>
        </div>
    )
}
