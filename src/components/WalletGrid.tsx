import { useState } from 'react';
import type { WalletId } from '../hooks/useCheckoutState';
import { Search, Cable } from 'lucide-react'; // Using Cable as a proxy for WalletConnect icon
import clsx from 'clsx';

// Mock Data
const WALLETS = [
    { id: 'binance', name: 'Binance', type: 'exchange', color: 'bg-[#FCD535]', textColor: 'text-black' },
    { id: 'okx', name: 'OKX Wallet', type: 'exchange', color: 'bg-black', textColor: 'text-white' },
    { id: 'metamask', name: 'MetaMask', type: 'web3', color: 'bg-[#F6851B]', textColor: 'text-white' },
    { id: 'phantom', name: 'Phantom', type: 'web3', color: 'bg-[#AB9FF2]', textColor: 'text-white' },
    { id: 'trust', name: 'Trust Wallet', type: 'web3', color: 'bg-[#3375BB]', textColor: 'text-white' },
    { id: 'coinbase', name: 'Coinbase', type: 'web3', color: 'bg-[#0052FF]', textColor: 'text-white' },
];

export const WalletGrid = ({ onSelect, excludeIds = [] }: { onSelect: (id: WalletId) => void, excludeIds?: string[] }) => {
    const [filter, setFilter] = useState<'all' | 'exchange' | 'web3'>('all');

    const filteredWallets = WALLETS
        .filter(w => !excludeIds.includes(w.id))
        .filter(w => filter === 'all' || w.type === filter);
    const showSearch = filter !== 'exchange';

    return (
        <div className="space-y-6">
            {/* Filter Tabs & Search Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Tabs */}
                <div className="flex bg-gray-100/80 p-1.5 rounded-xl self-start sm:self-auto">
                    {(['all', 'exchange', 'web3'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={clsx(
                                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300",
                                filter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            {f === 'all' && 'All'}
                            {f === 'exchange' && 'Exchanges'}
                            {f === 'web3' && 'Web3'}
                        </button>
                    ))}
                </div>

                {/* Intelligent Search Input (Hidden on Exchange Tab) */}
                {showSearch && (
                    <div className={clsx(
                        "relative flex items-center group transition-all duration-300",
                        "border border-slate-200 bg-white rounded-full px-4 py-2",
                        "hover:border-indigo-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100",
                        "w-full sm:w-[240px] md:w-[280px]" // Responsive width
                    )}>
                        {/* WalletConnect Brand Logo (Left) */}
                        <div className="flex-shrink-0 mr-3 p-1 bg-blue-50 rounded-full">
                            <Cable size={14} className="text-blue-500" />
                        </div>

                        {/* Input Field (Center) */}
                        <input
                            type="text"
                            placeholder="Search a web3 wallet"
                            className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                        />

                        {/* Search Icon (Right) */}
                        <Search size={16} className="text-indigo-300 ml-2 group-hover:text-indigo-500 transition-colors" />
                    </div>
                )}
            </div>

            {/* Grid */}
            <div className={clsx(
                "grid grid-cols-2 sm:grid-cols-3 gap-4 transition-opacity duration-300",
                "animate-in fade-in slide-in-from-bottom-2"
            )}>
                {filteredWallets.map(w => (
                    <button
                        key={w.id}
                        onClick={() => onSelect(w.id as WalletId)}
                        className="group relative flex flex-col items-center justify-center p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className={clsx(
                            "w-14 h-14 rounded-2xl mb-3 flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:animate-float",
                            w.color, w.textColor
                        )}>
                            {/* Placeholder for Icon */}
                            <span className="font-bold text-xl">{w.name[0]}</span>
                        </div>
                        <span className="font-semibold text-gray-800 text-sm">{w.name}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}
