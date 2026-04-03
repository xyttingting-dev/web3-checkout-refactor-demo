import React, { useState } from 'react';
import { ChevronLeft, ChevronDown, QrCode, Check } from 'lucide-react';
import { getNetworkIcon } from './IconLibrary';
import { TransactionHistory, type Transaction } from './TransactionHistory';
import { PaymentSuccess } from './PaymentSuccess';

export type TransferStatus = 'WAITING' | 'SCANNING' | 'PARTIAL_PAID' | 'OVER_PAID' | 'SUCCESS';

interface AddressTransferPanelProps {
    onStatusChange?: (status: TransferStatus) => void;
    onBack?: () => void;
    onSuccess?: () => void;
}

// ─── Chain definitions ────────────────────────────────────────────────────────
const CHAINS = [
    { id: 'avax',    name: 'Avalanche C-Chain', protocol: 'ARC20',   time: '~25s',  chainId: '0xa86a'  },
    { id: 'bsc',     name: 'BNB Chain',         protocol: 'BEP20',   time: '~4s',   chainId: '0x38'    },
    { id: 'tron',    name: 'TRON',              protocol: 'TRC20',   time: '~16s',  chainId: null       }, // TRON not EVM
    { id: 'polygon', name: 'Polygon POS',       protocol: 'Polygon', time: '~125s', chainId: '0x89'    },
    { id: 'eth',     name: 'Ethereum',          protocol: 'ERC20',   time: '~32s',  chainId: '0x1'     },
];

const CHAIN_COLORS: Record<string, string> = {
    avax: '#e84142', bsc: '#F0B90B', tron: '#ef4444', polygon: '#8247E5', eth: '#627EEA',
};

const MOCK_ADDRESSES: Record<string, string> = {
    tron:    'T9yD14Nj9j2HXp5FhD3wFdmwFpfuMFTMUR',
    default: '0x61e9789745a6BFcAEbDde08D492A71C9234f8b2e',
};


export const AddressTransferPanel: React.FC<AddressTransferPanelProps> = ({
    onStatusChange, onBack, onSuccess,
}) => {
    const [selectedChain, setSelectedChain]       = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen]     = useState(false);
    const [addressGenerated, setAddressGenerated] = useState(false);
    const [copied, setCopied]                     = useState(false);
    const [status, setStatus]                   = useState<TransferStatus>('WAITING');
    const [receivedAmount, setReceivedAmount]   = useState(0);
    const [showHistory, setShowHistory]         = useState(false);
    const [transactions, setTransactions]       = useState<Transaction[]>([]);

    const requiredAmount = 20.00;
    const chainInfo      = CHAINS.find(c => c.id === selectedChain);
    const depositAddress = selectedChain === 'tron' ? MOCK_ADDRESSES.tron : MOCK_ADDRESSES.default;

    // ─── Track payment ─────────────────────────────────────────────────────────
    const handleTrack = () => {
        if (!selectedChain) return;
        setStatus('SCANNING');
        onStatusChange?.('SCANNING');
        setTimeout(() => {
            const now = new Date();
            const t = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
            let newAmount = 0, newStatus: TransferStatus = 'WAITING', newTx: Transaction | null = null;
            if (receivedAmount === 0) {
                newAmount = 15; newStatus = 'PARTIAL_PAID';
                newTx = { id: 'tx1', amount: 15, time: t, hash: '0x8a...9f21' };
            } else if (receivedAmount < requiredAmount) {
                const rem = requiredAmount - receivedAmount;
                newAmount = receivedAmount + rem; newStatus = 'SUCCESS';
                newTx = { id: 'tx2', amount: rem, time: t, hash: '0x3c...2b9a' };
            }
            if (newTx) {
                setTransactions(p => [...p, newTx!]);
                setReceivedAmount(newAmount); setStatus(newStatus); onStatusChange?.(newStatus);
                if (newStatus === 'SUCCESS') onSuccess?.();
            }
        }, 3000);
    };



    const handleCopy = () => {
        navigator.clipboard.writeText(depositAddress).catch(() => {});
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };

    const handleBack = () => {
        if (addressGenerated) { setAddressGenerated(false); setStatus('WAITING'); }
        else onBack?.();
    };

    if (showHistory) {
        return <TransactionHistory transactions={transactions} onBack={() => setShowHistory(false)} />;
    }

    return (
        <div className="flex flex-col h-full gap-4 font-sans antialiased">

            {status !== 'SUCCESS' && status !== 'OVER_PAID' && (
                <div className="flex items-center gap-2">
                    {onBack && (
                        <button onClick={handleBack}
                            className="p-1.5 -ml-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
                            <ChevronLeft size={20} />
                        </button>
                    )}
                    <span className="font-bold text-lg text-gray-900">Transfer</span>
                </div>
            )}

            {/* ── STEP 1: Chain selection ── */}
            {!addressGenerated && (
                <>
                    <div>
                        <p className="text-xs font-semibold text-gray-400 mb-3">Select Network</p>
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={`w-full flex items-center justify-between px-3.5 py-4 rounded-xl border transition-all ${isDropdownOpen ? 'border-indigo-400 ring-4 ring-indigo-50' : 'border-gray-200 bg-white hover:border-indigo-300 shadow-sm'}`}
                            >
                                {selectedChain ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                                            {getNetworkIcon(selectedChain)}
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">
                                            {CHAINS.find(c => c.id === selectedChain)?.name}
                                        </span>
                                        <span className="text-[10px] text-gray-500 px-1.5 py-0.5 bg-gray-100 font-semibold rounded">
                                            {CHAINS.find(c => c.id === selectedChain)?.protocol}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-sm font-medium text-gray-400">Choose a network...</span>
                                )}
                                <ChevronDown size={18} strokeWidth={2.5} className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                                    <div className="absolute z-20 top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-[220px] overflow-y-auto flex flex-col p-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                                        {CHAINS.map(chain => (
                                            <button key={chain.id} onClick={() => { setSelectedChain(chain.id); setIsDropdownOpen(false); }}
                                                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                                                    selectedChain === chain.id
                                                        ? 'bg-indigo-50'
                                                        : 'hover:bg-gray-50'
                                                }`}>
                                                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                                                    {getNetworkIcon(chain.id)}
                                                </div>
                                                <div className="flex flex-col gap-0.5 text-left flex-1">
                                                    <span className={`text-sm leading-none ${selectedChain === chain.id ? 'font-bold text-indigo-700' : 'font-semibold text-gray-900'}`}>
                                                        {chain.name}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 leading-none mt-0.5">
                                                        {chain.protocol} · {chain.time}
                                                    </span>
                                                </div>
                                                {selectedChain === chain.id && <Check size={16} className="text-indigo-600" strokeWidth={3} />}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    
                    <button onClick={() => setAddressGenerated(true)} disabled={!selectedChain}
                        className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all mt-6">
                        Generate Address
                    </button>
                </>
            )}

            {/* ── STEP 2: Address display ── */}
            {addressGenerated && (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">

                    {/* Scanning */}
                    {status === 'SCANNING' && (
                        <div className="flex flex-col items-center justify-center py-10 gap-4">
                            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                            <div className="text-center">
                                <p className="text-sm font-bold text-indigo-900">Verifying Transaction...</p>
                                <p className="text-[10px] text-gray-400 mt-1">On-chain confirmation may take time</p>
                            </div>
                            <button onClick={() => setStatus(receivedAmount > 0 ? 'PARTIAL_PAID' : 'WAITING')}
                                className="text-xs font-bold text-gray-400 hover:text-gray-600 underline">
                                Return to Address
                            </button>
                        </div>
                    )}

                    {/* Success */}
                    {(status === 'SUCCESS' || status === 'OVER_PAID') && (
                        <PaymentSuccess
                            onViewHistory={() => setShowHistory(true)}
                            amount={receivedAmount} currency="USDT"
                            network={selectedChain || 'eth'}
                            txTime={transactions[transactions.length - 1]?.time || new Date().toLocaleTimeString()}
                            txId={`TX-${Math.floor(Math.random() * 100000000)}`}
                            hash={transactions[transactions.length - 1]?.hash || '0x...'}
                        />
                    )}

                    {/* Main address view: WAITING or PARTIAL_PAID */}
                    {(status === 'WAITING' || status === 'PARTIAL_PAID') && (
                        <>
                            {/* ✅ Single info card */}
                            <div className="bg-white border border-gray-100 rounded-xl p-3.5 cursor-pointer hover:border-indigo-200 transition-colors"
                                onClick={handleBack} title="Click to change network">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#26a17b] flex items-center justify-center flex-shrink-0 shadow-sm">
                                            <span className="text-base font-black text-white">₮</span>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-lg font-bold text-gray-900 leading-none tracking-tight">
                                                {status === 'PARTIAL_PAID'
                                                    ? (requiredAmount - receivedAmount).toFixed(2)
                                                    : requiredAmount.toFixed(2)}{' '}
                                                <span className="text-xs font-semibold text-gray-400">USDT</span>
                                            </span>
                                            <span className="text-[10px] text-gray-400 leading-none">
                                                Already paid: {receivedAmount.toFixed(2)}
                                            </span>
                                            <span className="text-[9px] text-gray-400 leading-none">
                                                {chainInfo?.protocol}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 border border-gray-100 rounded-lg">
                                        <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-white flex-shrink-0"
                                            style={{ background: CHAIN_COLORS[selectedChain || 'eth'] }}>
                                            {chainInfo?.name.charAt(0)}
                                        </div>
                                        <span className="text-[11px] font-semibold text-gray-700">
                                            {chainInfo?.name.split(' ')[0]}
                                        </span>
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Address block */}
                            <div>
                                <p className="text-[10px] font-semibold text-gray-400 mb-1.5">Deposit Address</p>
                                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5">
                                    <p className="font-mono text-sm text-gray-900 font-semibold break-all leading-relaxed mb-3">
                                        {depositAddress}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <button onClick={handleCopy}
                                                className="flex items-center gap-1.5 text-gray-400 hover:text-indigo-600 transition-colors">
                                                {copied
                                                    ? <Check size={13} className="text-green-500" />
                                                    : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                                }
                                                <span className="text-[11px] font-medium">{copied ? 'Copied' : 'Copy'}</span>
                                            </button>
                                            
                                            <button className="flex items-center gap-1.5 text-gray-400 hover:text-indigo-600 transition-colors group">
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-indigo-600"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                                <span className="text-[11px] font-medium group-hover:text-indigo-600">Save Image</span>
                                            </button>
                                        </div>
                                        <button onClick={handleTrack}
                                            className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white text-[10px] font-semibold rounded-lg transition-all">
                                            Track
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Standard warning and desktop QR tools */}
                            <div className="flex flex-col gap-3">
                                {/* Warning */}
                                <div className="bg-white border border-orange-100 border-l-[3px] border-l-orange-500 rounded-xl p-3 text-[11px] text-gray-500 leading-relaxed overflow-hidden shrink-0">
                                    <p className="mb-1.5">
                                        1. Send exactly{' '}
                                        <strong className="text-orange-700">
                                            {status === 'PARTIAL_PAID'
                                                ? `${(requiredAmount - receivedAmount).toFixed(2)} USDT`
                                                : `${requiredAmount.toFixed(2)} USDT`}
                                        </strong>{' '}
                                        ({chainInfo?.protocol}) — gas not included.
                                    </p>
                                    <p>
                                        2.{' '}
                                        <strong className="text-orange-700">Do not send non-USDT assets</strong>{' '}
                                        — permanent loss of funds.
                                    </p>
                                </div>
                                {/* Desktop UI only */}
                                <div className="hidden md:block">
                                    <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-50 border border-gray-100 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 transition-colors group tracking-wide shrink-0">
                                        <QrCode size={15} className="text-gray-500 group-hover:text-indigo-600" />
                                        <span className="text-[11px] font-semibold text-gray-500 group-hover:text-indigo-600">Show QR Code</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
