import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWalletIcon } from './IconLibrary';
import { getNetworkIcon } from './IconLibrary';

/**
 * DappBrowserPanel — #024
 *
 * Replaces WalletGrid when window.ethereum is detected (DApp browser env).
 * Three states driven by CheckoutState:
 *   DAPP_CONNECTING — breathing wallet logo + spinner (mirrors WalletGrid PROCESSING)
 *   DAPP_CONNECTED  — wallet pill + disconnect + chain selector + pay CTA
 *   DAPP_FAILED     — wallet logo + error badge + retry button
 */

interface DappBrowserPanelProps {
    state: 'DAPP_CONNECTING' | 'DAPP_CONNECTED' | 'DAPP_FAILED';
    walletName: string;         // e.g. "MetaMask"
    onRetry: () => void;
    onDisconnect: () => void;
    onPay: (chainId: string) => void;
}

const CHAINS = [
    { id: 'eth',     name: 'Ethereum',      balance: '2,045.00 USDT', time: '~18s' },
    { id: 'bsc',     name: 'BNB Chain',     balance: '450.00 USDT',   time: '~3s'  },
    { id: 'polygon', name: 'Polygon',       balance: '128.50 USDT',   time: '~2s'  },
    { id: 'tron',    name: 'TRON',          balance: '1,200.00 USDT', time: '~1s'  },
    { id: 'avax',    name: 'Avalanche',     balance: '0.00 USDT',     time: '~1s'  },
];

// Map walletId key to wallet name string
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

export const DappBrowserPanel: React.FC<DappBrowserPanelProps> = ({
    state, walletName, onRetry, onDisconnect, onPay,
}) => {
    const [selectedChain, setSelectedChain] = React.useState('eth');
    const walletId = walletIdFromName(walletName);

    return (
        <AnimatePresence mode="wait">

            {/* ── CONNECTING ─────────────────────────────────────────────── */}
            {state === 'DAPP_CONNECTING' && (
                <motion.div
                    key="connecting"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex flex-col items-center justify-center py-12 gap-5"
                >
                    {/* Breathing wallet icon — same pattern as WalletGrid PROCESSING */}
                    <motion.div
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)] relative"
                    >
                        <div className="w-12 h-12">
                            {getWalletIcon(walletId)}
                        </div>
                    </motion.div>

                    <div className="text-center space-y-1">
                        <p className="text-sm font-bold text-gray-900">
                            Connecting {walletName}...
                        </p>
                        <p className="text-xs text-gray-400">Please approve in your wallet</p>
                    </div>

                    {/* Spinner */}
                    <div className="w-4 h-4 border-2 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />

                    <p className="text-[10px] text-gray-300 text-center px-8 leading-relaxed">
                        Wallet detected automatically.<br />No need to select manually.
                    </p>
                </motion.div>
            )}

            {/* ── CONNECTED ──────────────────────────────────────────────── */}
            {state === 'DAPP_CONNECTED' && (
                <motion.div
                    key="connected"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex flex-col gap-4"
                >
                    {/* Connected wallet pill + disconnect */}
                    <div className="flex items-center justify-between px-3 py-2.5 bg-green-50 border border-green-200/60 rounded-xl">
                        <div className="flex items-center gap-2.5">
                            <div className="w-5 h-5">{getWalletIcon(walletId)}</div>
                            <div>
                                <p className="text-xs font-bold text-green-800 leading-none">{walletName}</p>
                                <p className="text-[10px] text-green-600 font-mono mt-0.5">0x71C...9A23</p>
                            </div>
                        </div>
                        <button
                            onClick={onDisconnect}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold text-gray-500 hover:text-red-500 bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50 rounded-lg transition-all"
                        >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/>
                                <line x1="12" y1="2" x2="12" y2="12"/>
                            </svg>
                            Disconnect
                        </button>
                    </div>

                    {/* Chain selector */}
                    <div>
                        <p className="text-xs font-semibold text-gray-400 mb-2">Select Network</p>
                        <div className="space-y-2">
                            {CHAINS.map(chain => (
                                <button
                                    key={chain.id}
                                    onClick={() => setSelectedChain(chain.id)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all ${
                                        selectedChain === chain.id
                                            ? 'border-indigo-500 bg-indigo-50'
                                            : 'border-gray-100 bg-white hover:border-indigo-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-5 h-5 flex items-center justify-center">
                                            {getNetworkIcon(chain.id)}
                                        </div>
                                        <div className="text-left">
                                            <p className={`text-xs font-bold leading-none ${
                                                selectedChain === chain.id ? 'text-indigo-700' : 'text-gray-900'
                                            }`}>{chain.name}</p>
                                            <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                                                Bal: {chain.balance}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-gray-400">{chain.time}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Pay CTA */}
                    <button
                        onClick={() => onPay(selectedChain)}
                        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-indigo-200/50 active:scale-[0.98]"
                    >
                        Pay 20.00 USDT
                    </button>
                </motion.div>
            )}

            {/* ── FAILED ─────────────────────────────────────────────────── */}
            {state === 'DAPP_FAILED' && (
                <motion.div
                    key="failed"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex flex-col items-center justify-center py-12 gap-5"
                >
                    {/* Wallet icon + red X badge */}
                    <div className="relative">
                        <div className="w-20 h-20 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center opacity-50">
                            <div className="w-12 h-12">{getWalletIcon(walletId)}</div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 border-2 border-white rounded-full flex items-center justify-center">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </div>
                    </div>

                    <div className="text-center space-y-1.5">
                        <p className="text-sm font-bold text-gray-900">Authorization denied</p>
                        <p className="text-xs text-gray-400 leading-relaxed px-6">
                            You're in your wallet browser.<br />Tap below to try again.
                        </p>
                    </div>

                    <button
                        onClick={onRetry}
                        className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 4 23 10 17 10"/>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                        </svg>
                        Retry Connection
                    </button>

                    <p className="text-[10px] text-gray-300 text-center">
                        Only option available in wallet browser
                    </p>
                </motion.div>
            )}

        </AnimatePresence>
    );
};
