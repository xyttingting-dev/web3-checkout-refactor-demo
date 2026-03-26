import { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { getNetworkIcon } from './IconLibrary';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

/**
 * ChainSelector — #025
 *
 * Changes vs original:
 *   - Mobile: renders as a Bottom Sheet (slides up from bottom, bg backdrop blur)
 *     with handle bar, chain list, and Confirm button
 *   - Desktop: keeps the inline list layout (appropriate for larger screens)
 *   - Both: real network icons via getNetworkIcon(), balance, estimated time
 *   - Responsive detection via window.innerWidth (SSR-safe with useState init)
 */

interface ChainSelectorProps {
    onSelect: (chainId: string) => void;
}

const CHAINS = [
    { id: 'eth',     name: 'Ethereum',       protocol: 'ERC20',   time: '~18s' },
    { id: 'bsc',     name: 'BNB Smart Chain', protocol: 'BEP20',  time: '~3s'  },
    { id: 'polygon', name: 'Polygon',         protocol: 'MATIC',  time: '~2s'  },
    { id: 'tron',    name: 'TRON',            protocol: 'TRC20',  time: '~1s'  },
    { id: 'avax',    name: 'Avalanche',       protocol: 'ARC20',  time: '~1s'  },
];

const MOCK_BALANCES: Record<string, string> = {
    eth: '2,045.00 USDT',
    bsc: '450.00 USDT',
    polygon: '128.50 USDT',
    tron: '1,200.00 USDT',
    avax: '0.00 USDT',
};

export const ChainSelector = ({ onSelect }: ChainSelectorProps) => {
    const { address } = useAccount();
    const { data: ethBalance } = useBalance({ address });

    const [selected, setSelected] = useState('eth');

    // Responsive: detect mobile breakpoint
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const getBalance = (id: string) => {
        if (id === 'eth' && ethBalance) {
            return `${(Number(ethBalance.value) / 10 ** ethBalance.decimals).toFixed(4)} ${ethBalance.symbol}`;
        }
        return MOCK_BALANCES[id] || '0.00 USDT';
    };

    const handleConfirm = () => onSelect(selected);

    const chainList = (
        <div className="flex flex-col gap-1.5">
            {CHAINS.map(chain => (
                <button
                    key={chain.id}
                    onClick={() => setSelected(chain.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-all ${
                        selected === chain.id
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-100 bg-white hover:border-indigo-300 hover:bg-indigo-50/30'
                    }`}
                >
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                        {getNetworkIcon(chain.id)}
                    </div>
                    <div className="flex flex-col gap-0.5 text-left flex-1">
                        <span className={`text-sm font-bold leading-none ${
                            selected === chain.id ? 'text-indigo-700' : 'text-gray-900'
                        }`}>
                            {chain.name}
                        </span>
                        <span className="text-[10px] text-gray-400 leading-none mt-0.5 font-mono">
                            Bal: {getBalance(chain.id)} · {chain.time}
                        </span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center flex-shrink-0 ${
                        selected === chain.id
                            ? 'border-indigo-600 bg-indigo-600'
                            : 'border-gray-300'
                    }`}>
                        {selected === chain.id && (
                            <Check size={11} className="text-white" strokeWidth={3} />
                        )}
                    </div>
                </button>
            ))}
        </div>
    );

    // ── MOBILE: Bottom Sheet ─────────────────────────────────────────────────
    if (isMobile) {
        return (
            <>
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                    onClick={handleConfirm}
                />

                {/* Sheet */}
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                    className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl"
                    style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
                >
                    {/* Handle bar */}
                    <div className="flex justify-center pt-3 pb-1">
                        <div className="w-9 h-1 bg-gray-200 rounded-full" />
                    </div>

                    {/* Title */}
                    <div className="px-4 pt-2 pb-3">
                        <h3 className="text-sm font-bold text-gray-900">Select Payment Network</h3>
                    </div>

                    {/* Chain list */}
                    <div className="px-4 pb-3">
                        {chainList}
                    </div>

                    {/* Confirm button */}
                    <div className="px-4 pb-4">
                        <button
                            onClick={handleConfirm}
                            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-indigo-200/50 active:scale-[0.98]"
                        >
                            Confirm Network
                        </button>
                    </div>
                </motion.div>
            </>
        );
    }

    // ── DESKTOP: Inline list ─────────────────────────────────────────────────
    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-sm font-bold text-gray-900">Select Payment Network</h3>
            {chainList}
            <button
                onClick={handleConfirm}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-indigo-200/50 active:scale-[0.98]"
            >
                Confirm Network
            </button>
        </div>
    );
};
