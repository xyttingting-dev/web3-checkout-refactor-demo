import { useState } from 'react';
import type { WalletId, CheckoutState } from '../hooks/useCheckoutState';
import clsx from 'clsx';
import { useConnectors } from 'wagmi';
import { getWalletIcon } from './IconLibrary';
import { motion, AnimatePresence } from 'framer-motion';
import { WalletLibrary } from './WalletLibrary';

// Full web3 wallet list
const WEB3_WALLETS = [
    { id: 'metamask',      name: 'MetaMask'        },
    { id: 'walletconnect', name: 'WalletConnect'   },
    { id: 'binance',       name: 'Binance Wallet'  },
    { id: 'okx',           name: 'OKX Wallet'      },
    { id: 'bitget',        name: 'Bitget Wallet'   },
    { id: 'trust',         name: 'Trust Wallet'    },
    { id: 'coinbase',      name: 'Coinbase Wallet' },
    { id: 'imtoken',       name: 'imToken'         },
    { id: 'phantom',       name: 'Phantom'         },
    { id: 'tokenpocket',   name: 'TokenPocket'     },
    { id: 'tronlink',      name: 'TronLink'        },
    { id: 'coolwallet',    name: 'CoolWallet'      },
];

// Exchange / custodial partners — shown in expanded section only
const EXCHANGE_PARTNERS = [
    { id: 'topwallet',   name: 'TopWallet'   },
    { id: 'gate',        name: 'Gate Pay'    },
    { id: 'kucoin',      name: 'KuCoin Pay'  },
    { id: 'binance_pay', name: 'Binance Pay' },
];

// Default grid = 7 wallet cards + slot8(Exchange shortcut) + slot9(Transfer shortcut) = 9 cells
const DEFAULT_WALLET_COUNT = 7;

const HOVER_CSS = `
.wc-card { -webkit-tap-highlight-color: transparent; outline: none; }
.wc-card:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 6px 20px rgba(99,102,241,0.13), 0 3px 8px rgba(0,0,0,0.06);
  border-color: rgba(99,102,241,0.28);
}
.wc-card:active { transform: translateY(-1px) scale(0.98); transition-duration: 80ms; }
.wc-card.wc-selected {
  box-shadow: 0 0 0 2px white, 0 0 0 4px #6366f1, 0 6px 20px rgba(99,102,241,0.20);
  border-color: transparent; z-index: 10;
}
.wc-card:hover .wc-icon  { background: #eef2ff; }
.wc-card:hover .wc-label { color: #4f46e5; }
.wc-card.wc-selected .wc-label { color: #4338ca; font-weight: 600; }

.wc-shortcut:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 18px rgba(99,102,241,0.14), 0 3px 8px rgba(0,0,0,0.06);
}
.wc-shortcut:active { transform: scale(0.98); transition-duration: 80ms; }

.wc-exchange:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 20px rgba(243,186,47,0.18), 0 3px 8px rgba(0,0,0,0.06);
  border-color: rgba(243,186,47,0.40);
}
.wc-exchange:active { transform: scale(0.98); transition-duration: 80ms; }
.wc-exchange.wc-selected {
  box-shadow: 0 0 0 2px white, 0 0 0 4px #F3BA2F, 0 6px 20px rgba(243,186,47,0.25);
  border-color: transparent;
}
.wc-at:hover { background: rgba(99,102,241,0.08) !important; border-color: rgba(99,102,241,0.24) !important; }
.wc-showmore:hover { background: #eef2ff !important; border-color: rgba(99,102,241,0.2) !important; color: #4f46e5 !important; }
`;

const CARD_BASE: React.CSSProperties = {
    background: 'white',
    borderRadius: 14,
    border: '1px solid rgba(0,0,0,0.055)',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)',
    cursor: 'pointer',
    transition: [
        'transform    200ms cubic-bezier(0.34,1.56,0.64,1)',
        'box-shadow   200ms cubic-bezier(0.34,1.56,0.64,1)',
        'border-color 150ms ease',
    ].join(', '),
    userSelect: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
};

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

    const sortedWeb3 = [...WEB3_WALLETS].sort((a, b) => {
        const aHit = detectedNames.some(n => n.includes(a.name.toLowerCase().split(' ')[0]));
        const bHit = detectedNames.some(n => n.includes(b.name.toLowerCase().split(' ')[0]));
        return aHit === bHit ? 0 : aHit ? -1 : 1;
    });

    const [isExpanded, setIsExpanded] = useState(false);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const isProcessing = checkoutState === 'PROCESSING';

    const defaultWallets = sortedWeb3.slice(0, DEFAULT_WALLET_COUNT);

    return (
        <div className="flex flex-col h-full min-h-[400px] relative">
            <style>{HOVER_CSS}</style>

            {/* Processing overlay */}
            <AnimatePresence>
                {isProcessing && selectedWalletId && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[60] flex items-center justify-center bg-white/60 backdrop-blur-xl rounded-2xl"
                    >
                        <motion.div
                            key="loader"
                            layoutId={`wallet-icon-${selectedWalletId}`}
                            className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)] z-50 relative"
                            animate={{ scale: [1, 1.08, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <div className="w-12 h-12">{getWalletIcon(selectedWalletId)}</div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── DEFAULT VIEW: 7 wallet cards + 2 shortcut cards ── */}
            {!isExpanded && (
                <>
                    <div className="grid grid-cols-3 gap-2 md:gap-2.5 pb-2 px-2 md:px-3">

                        {/* 7 standard wallet cards */}
                        {defaultWallets.map((w) => {
                            const isSelected = selectedWalletId === w.id;
                            return (
                                <button
                                    key={w.id}
                                    onClick={() => onSelect(w.id as WalletId)}
                                    className={clsx('wc-card', isSelected && 'wc-selected')}
                                    style={{ ...CARD_BASE, padding: '10px 6px 8px', minHeight: 96 }}
                                >
                                    <motion.div
                                        layoutId={isProcessing && isSelected ? `wallet-icon-${w.id}` : undefined}
                                        className="wc-icon"
                                        style={{ width: 40, height: 40, borderRadius: 10, background: 'white', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 200ms ease' }}
                                    >
                                        {getWalletIcon(w.id)}
                                    </motion.div>
                                    <span className="wc-label" style={{ fontSize: 11, fontWeight: 500, color: '#374151', textAlign: 'center', lineHeight: 1.3, padding: '0 3px', transition: 'color 150ms ease' }}>
                                        {w.name}
                                    </span>
                                </button>
                            );
                        })}

                        {/* Slot 8 — Exchange Partners shortcut card */}
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="wc-shortcut"
                            style={{
                                ...CARD_BASE,
                                padding: '10px 6px 8px', minHeight: 96,
                                background: 'white',
                                border: '1px solid rgba(243,186,47,0.22)',
                            }}
                        >
                            {/* Mini logo cluster */}
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                {EXCHANGE_PARTNERS.slice(0, 3).map((p, i) => (
                                    <div key={p.id} style={{
                                        width: 22, height: 22, borderRadius: '50%',
                                        background: 'white', border: '1.5px solid rgba(255,255,255,0.9)',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        marginLeft: i > 0 ? -6 : 0, overflow: 'hidden',
                                        position: 'relative', zIndex: 3 - i,
                                    }}>
                                        <div style={{ width: 16, height: 16 }}>{getWalletIcon(p.id)}</div>
                                    </div>
                                ))}
                                <div style={{
                                    width: 22, height: 22, borderRadius: '50%',
                                    background: 'rgba(243,186,47,0.18)', border: '1.5px solid rgba(255,255,255,0.9)',
                                    fontSize: 8, fontWeight: 700, color: '#b45309',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginLeft: -6, position: 'relative', zIndex: 0,
                                }}>+1</div>
                            </div>
                            <span style={{ fontSize: 10, fontWeight: 600, color: '#92400e', textAlign: 'center', lineHeight: 1.4 }}>
                                Exchange{'\n'}Partners
                            </span>
                        </button>

                        {/* Slot 9 — Address Transfer shortcut card */}
                        <button
                            onClick={() => onSelect('transfer' as WalletId)}
                            className="wc-shortcut"
                            style={{
                                ...CARD_BASE,
                                padding: '10px 6px 8px', minHeight: 96,
                                background: 'white',
                                border: '1px solid rgba(99,102,241,0.18)',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                {[{ bg: '#ef4444' }, { bg: '#3b82f6' }, { bg: '#f59e0b' }, { bg: '#10b981' }].map((c, i) => (
                                    <div key={i} style={{
                                        width: 22, height: 22, borderRadius: '50%',
                                        background: c.bg, border: '1.5px solid rgba(255,255,255,0.9)',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                                        marginLeft: i > 0 ? -6 : 0, position: 'relative', zIndex: 4 - i,
                                    }} />
                                ))}
                            </div>
                            <span style={{ fontSize: 10, fontWeight: 600, color: '#3730a3', textAlign: 'center', lineHeight: 1.4 }}>
                                Address{'\n'}Transfer
                            </span>
                        </button>

                    </div>

                    {/* Show more wallets button */}
                    <div className="px-2 md:px-3 pb-2">
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="wc-showmore"
                            style={{
                                width: '100%', padding: '10px',
                                background: '#f4f4f7', border: '1px solid rgba(0,0,0,0.055)',
                                borderRadius: 11, fontSize: 12, fontWeight: 600, color: '#6b7280',
                                cursor: 'pointer', transition: 'background 150ms, border-color 150ms, color 150ms',
                            }}
                        >
                            Show more wallets
                        </button>
                    </div>
                </>
            )}

            {/* ── EXPANDED VIEW: all wallets + exchange section + address transfer ── */}
            {isExpanded && (
                <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="flex flex-col gap-4 px-2 md:px-3 pb-3"
                >
                    {/* All wallet cards */}
                    <div className="grid grid-cols-3 gap-2 md:gap-2.5">
                        {sortedWeb3.map((w) => {
                            const isSelected = selectedWalletId === w.id;
                            return (
                                <button
                                    key={w.id}
                                    onClick={() => onSelect(w.id as WalletId)}
                                    className={clsx('wc-card', isSelected && 'wc-selected')}
                                    style={{ ...CARD_BASE, padding: '10px 6px 8px', minHeight: 96 }}
                                >
                                    <motion.div
                                        layoutId={isProcessing && isSelected ? `wallet-icon-${w.id}` : undefined}
                                        className="wc-icon"
                                        style={{ width: 40, height: 40, borderRadius: 10, background: 'white', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 200ms ease' }}
                                    >
                                        {getWalletIcon(w.id)}
                                    </motion.div>
                                    <span className="wc-label" style={{ fontSize: 11, fontWeight: 500, color: '#374151', textAlign: 'center', lineHeight: 1.3, padding: '0 3px', transition: 'color 150ms ease' }}>
                                        {w.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Dot divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.07)' }} />
                        {[0.15, 0.10, 0.07].map((o, i) => (
                            <div key={i} style={{ width: 3, height: 3, borderRadius: '50%', background: `rgba(0,0,0,${o})` }} />
                        ))}
                        <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.07)' }} />
                    </div>

                    {/* Exchange Partners section */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
                                Exchange Partners
                            </span>
                            <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.06)' }} />
                        </div>
                        <div className="grid grid-cols-2 gap-2 md:gap-2.5">
                            {EXCHANGE_PARTNERS.map((p) => {
                                const isSelected = selectedWalletId === p.id;
                                return (
                                    <button
                                        key={p.id}
                                        onClick={() => onSelect(p.id as WalletId)}
                                        className={clsx('wc-exchange', isSelected && 'wc-selected')}
                                        style={{ ...CARD_BASE, gap: 8, padding: '14px 10px 12px', minHeight: 88 }}
                                    >
                                        <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {getWalletIcon(p.id)}
                                        </div>
                                        <span style={{ fontSize: 11, fontWeight: 600, color: isSelected ? '#b45309' : '#374151', textAlign: 'center', lineHeight: 1.3 }}>
                                            {p.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Address Transfer */}
                    <button
                        onClick={() => onSelect('transfer' as WalletId)}
                        className="wc-at"
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '9px 12px 9px 14px', borderRadius: 10,
                            background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.14)',
                            cursor: 'pointer', transition: 'background 150ms, border-color 150ms', position: 'relative',
                        }}
                    >
                        <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: '55%', borderRadius: '0 2px 2px 0', background: 'rgba(99,102,241,0.35)' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(99,102,241,0.55)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                            </svg>
                            <span style={{ fontSize: 11, fontWeight: 600, color: '#4b5563' }}>Address Transfer</span>
                            <span style={{ fontSize: 9, color: '#c4c4cc' }}>· manual</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {[{ bg: '#ef4444', label: '₮' }, { bg: '#3b82f6', label: 'Ξ' }, { bg: '#f59e0b', label: 'B' }, { bg: '#10b981', label: 'P' }].map((c, i) => (
                                <div key={i} style={{ width: 17, height: 17, borderRadius: '50%', background: c.bg, border: '1.5px solid white', fontSize: 8, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: i > 0 ? -5 : 0 }}>
                                    {c.label}
                                </div>
                            ))}
                        </div>
                    </button>
                </motion.div>
            )}

            {/* WalletLibrary overlay */}
            <WalletLibrary
                isOpen={isLibraryOpen}
                onClose={() => setIsLibraryOpen(false)}
                onSelect={(id) => { setIsLibraryOpen(false); onSelect(id); }}
                wallets={WEB3_WALLETS}
                initialSearchTerm=""
            />
        </div>
    );
};
