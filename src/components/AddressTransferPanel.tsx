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

// USDT contract addresses per chain
const USDT_CONTRACTS: Record<string, string> = {
    avax:    '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
    bsc:     '0x55d398326f99059fF775485246999027B3197955',
    polygon: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    eth:     '0xdAC17F958D2ee523a2206206994597C13D831ec7',
};

// ─── ERC-20 transfer() calldata encoder ──────────────────────────────────────
// Encodes transfer(address to, uint256 amount) for eth_sendTransaction
function encodeERC20Transfer(to: string, amountWei: bigint): string {
    const sig = '0xa9059cbb'; // keccak256('transfer(address,uint256)') first 4 bytes
    const toHex = to.replace('0x', '').padStart(64, '0');
    const amountHex = amountWei.toString(16).padStart(64, '0');
    return `${sig}${toHex}${amountHex}`;
}

// ─── DApp environment detection ───────────────────────────────────────────────
function detectDapp(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(window as any).ethereum;
}

// ─── SendViaWallet state ──────────────────────────────────────────────────────
type SendState = 'idle' | 'sending' | 'pending' | 'confirmed' | 'failed';

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

    // #026: DApp-specific state
    const [isDapp]                    = useState(detectDapp);
    const [sendState, setSendState]   = useState<SendState>('idle');
    const [txHash, setTxHash]         = useState<string | null>(null);
    const [sendError, setSendError]   = useState<string | null>(null);

    const requiredAmount = 20.00;
    const chainInfo      = CHAINS.find(c => c.id === selectedChain);
    const depositAddress = selectedChain === 'tron' ? MOCK_ADDRESSES.tron : MOCK_ADDRESSES.default;
    // TRON is not EVM — disable Send via Wallet for TRON
    const canSendViaWallet = isDapp && selectedChain && selectedChain !== 'tron' && chainInfo?.chainId;

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

    // ─── #026: Send via wallet (eth_sendTransaction) ───────────────────────────
    const handleSendViaWallet = async () => {
        if (!canSendViaWallet || !selectedChain) return;
        setSendState('sending');
        setSendError(null);

        try {
            const provider = (window as any).ethereum;

            // 1. Request account access
            const accounts: string[] = await provider.request({ method: 'eth_requestAccounts' });
            const from = accounts[0];
            if (!from) throw new Error('No account available');

            // 2. Switch to correct chain if needed
            try {
                await provider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: chainInfo!.chainId }],
                });
            } catch (switchErr: any) {
                // 4902 = chain not added — user needs to add it manually
                if (switchErr.code !== 4902) throw switchErr;
            }

            // 3. Build ERC-20 transfer() calldata
            // 20 USDT @ 6 decimals = 20_000_000n
            const amountWei = BigInt(Math.round(requiredAmount * 1_000_000));
            const contractAddr = USDT_CONTRACTS[selectedChain];
            if (!contractAddr) throw new Error(`No USDT contract for ${selectedChain}`);

            const data = encodeERC20Transfer(depositAddress, amountWei);

            // 4. Send transaction — triggers native wallet signing sheet
            const hash: string = await provider.request({
                method: 'eth_sendTransaction',
                params: [{
                    from,
                    to: contractAddr,
                    data,
                    value: '0x0',  // No ETH sent, only ERC-20
                }],
            });

            setTxHash(hash);
            setSendState('pending');

            // 5. Poll for receipt (simplified — production use ethers.js provider.waitForTransaction)
            const pollReceipt = async () => {
                for (let i = 0; i < 60; i++) {
                    await new Promise(r => setTimeout(r, 3000));
                    try {
                        const receipt = await provider.request({
                            method: 'eth_getTransactionReceipt',
                            params: [hash],
                        });
                        if (receipt && receipt.status === '0x1') {
                            setSendState('confirmed');
                            // Notify backend via onSuccess after brief display
                            setTimeout(() => onSuccess?.(), 1500);
                            return;
                        }
                        if (receipt && receipt.status === '0x0') {
                            throw new Error('Transaction reverted');
                        }
                    } catch { /* receipt not yet available */ }
                }
                throw new Error('Timeout waiting for receipt');
            };

            pollReceipt().catch(err => {
                setSendError(err.message ?? 'Transaction failed');
                setSendState('failed');
            });

        } catch (err: any) {
            if (err.code === 4001) {
                // User rejected
                setSendState('idle');
            } else {
                setSendError(err.message ?? 'Unknown error');
                setSendState('failed');
            }
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(depositAddress).catch(() => {});
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };

    const handleBack = () => {
        if (addressGenerated) { setAddressGenerated(false); setStatus('WAITING'); setSendState('idle'); setTxHash(null); setSendError(null); }
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

                    {/* ── #026: DApp Send confirmed state ── */}
                    {sendState === 'confirmed' && (
                        <div className="flex flex-col items-center justify-center py-10 gap-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <Check size={32} className="text-green-600" strokeWidth={3} />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-bold text-gray-900">Transfer Sent</p>
                                <p className="text-[10px] text-gray-400 mt-1">
                                    {requiredAmount.toFixed(2)} USDT · {chainInfo?.name}
                                </p>
                            </div>
                            {txHash && (
                                <span className="font-mono text-[10px] text-gray-400 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                                    {txHash.slice(0, 10)}...{txHash.slice(-6)} ✓
                                </span>
                            )}
                        </div>
                    )}

                    {/* ── #026: DApp Send pending state ── */}
                    {sendState === 'pending' && (
                        <div className="flex flex-col items-center justify-center py-10 gap-4">
                            <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center">
                                <div className="w-6 h-6 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-bold text-gray-900">Sending {requiredAmount.toFixed(2)} USDT...</p>
                                <p className="text-[10px] text-gray-400 mt-1">Transaction submitted — waiting for confirmation</p>
                            </div>
                            {txHash && (
                                <span className="font-mono text-[10px] text-gray-400 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                                    {txHash.slice(0, 10)}...{txHash.slice(-6)}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Main address view: WAITING or PARTIAL_PAID */}
                    {(status === 'WAITING' || status === 'PARTIAL_PAID') && sendState === 'idle' && (
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
                                        <button onClick={handleCopy}
                                            className="flex items-center gap-1.5 text-gray-400 hover:text-indigo-600 transition-colors">
                                            {copied
                                                ? <Check size={13} className="text-green-500" />
                                                : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                            }
                                            <span className="text-[11px] font-medium">{copied ? 'Copied' : 'Copy'}</span>
                                        </button>
                                        <button onClick={handleTrack}
                                            className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white text-[10px] font-semibold rounded-lg transition-all">
                                            Track
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* ✅ #026: DApp environment — primary CTA is Send via Wallet */}
                            {canSendViaWallet ? (
                                <div className="flex flex-col gap-2">
                                    {/* Primary: Send via Wallet */}
                                    <button
                                        onClick={handleSendViaWallet}
                                        className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-200/50 active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="22" y1="2" x2="11" y2="13"/>
                                            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                                        </svg>
                                        Send via Wallet
                                    </button>
                                    <p className="text-[10px] text-gray-400 text-center">
                                        Triggers native wallet transfer — no manual copy needed
                                    </p>
                                </div>
                            ) : (
                                /* Non-DApp: standard Save Image + QR Code tools */
                                <div className="flex flex-col gap-3">
                                    {/* Warning */}
                                    <div className="bg-white border border-orange-100 border-l-[3px] border-l-orange-400 rounded-xl p-3 text-[11px] text-gray-500 leading-relaxed">
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
                                    <div className="flex gap-3">
                                        <button className="flex-1 flex flex-col items-center gap-1.5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 transition-colors group">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-indigo-500"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                            <span className="text-[10px] font-medium text-gray-400 group-hover:text-indigo-600">Save Image</span>
                                        </button>
                                        <button className="flex-1 flex flex-col items-center gap-1.5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 transition-colors group">
                                            <QrCode size={16} className="text-gray-500 group-hover:text-indigo-500" />
                                            <span className="text-[10px] font-medium text-gray-400 group-hover:text-indigo-600">QR Code</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* ── #026: Send failed state ── */}
                    {sendState === 'failed' && (
                        <div className="flex flex-col items-center gap-4 py-6">
                            <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                                </svg>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-bold text-gray-900">Transaction Failed</p>
                                <p className="text-[10px] text-gray-400 mt-1">{sendError || 'Unknown error'}</p>
                            </div>
                            <button
                                onClick={() => { setSendState('idle'); setSendError(null); }}
                                className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
