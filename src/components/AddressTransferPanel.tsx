import { useState } from 'react';
import { Copy, QrCode, Check, Search, ChevronLeft } from 'lucide-react';
import { getNetworkIcon } from './IconLibrary';
import { TransactionHistory, type Transaction } from './TransactionHistory';
import { PaymentSuccess } from './PaymentSuccess';

export type TransferStatus = 'WAITING' | 'SCANNING' | 'PARTIAL_PAID' | 'OVER_PAID' | 'SUCCESS';


interface AddressTransferPanelProps {
    onStatusChange?: (status: TransferStatus) => void;
    onBack?: () => void;
    onSuccess?: () => void;
}

export const AddressTransferPanel = ({ onStatusChange, onBack, onSuccess }: AddressTransferPanelProps) => {
    const [selectedChain, setSelectedChain] = useState<string | null>(null);
    const [addressGenerated, setAddressGenerated] = useState(false);
    const [copied, setCopied] = useState(false);

    // State Machine
    const [status, setStatus] = useState<TransferStatus>('WAITING');
    const [receivedAmount, setReceivedAmount] = useState(0);
    // Level 3 View State
    const [showHistory, setShowHistory] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const requiredAmount = 20.00;

    // Simulation Logic: Manual Check Trigger
    const handleCheckResult = () => {
        if (!selectedChain) return;

        setStatus('SCANNING');
        onStatusChange?.('SCANNING');

        // Simulate network delay
        setTimeout(() => {
            const now = new Date();
            const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

            // Logic: 
            // 1. If currently waiting (0 received), simulate 15.00 partial payment.
            // 2. If already PARTIAL (15.00 received), simulate +5.00 remaining payment -> SUCCESS.

            let newAmount = 0;
            let newStatus: TransferStatus = 'WAITING';
            let newTx: Transaction | null = null;

            if (receivedAmount === 0) {
                // First Payment: 15.00
                newAmount = 15.00;
                newStatus = 'PARTIAL_PAID';
                newTx = {
                    id: 'tx1',
                    amount: 15.00,
                    time: timeString,
                    hash: '0x8a...9f21'
                };
            } else if (receivedAmount < requiredAmount) {
                // Second Payment: Remaining (e.g. 5.00)
                const remaining = requiredAmount - receivedAmount;
                newAmount = receivedAmount + remaining;
                newStatus = 'SUCCESS'; // Total >= Required
                newTx = {
                    id: 'tx2',
                    amount: remaining,
                    time: timeString,
                    hash: '0x3c...2b9a'
                };
            }

            if (newTx) {
                setTransactions(prev => [...prev, newTx!]);
                setReceivedAmount(newAmount);
                setStatus(newStatus);
                onStatusChange?.(newStatus);
                if (newStatus === 'SUCCESS') {
                    onSuccess?.();
                }
            }

        }, 3000);
    };

    const chains = [
        { id: 'avax', name: 'Avalanche', protocol: 'avalanche' },
        { id: 'bsc', name: 'BSC', protocol: 'bep20' },
        { id: 'tron', name: 'TRON', protocol: 'trc20' },
        { id: 'polygon', name: 'Polygon', protocol: 'polygon' },
        { id: 'eth', name: 'Ethereum', protocol: 'erc20' },
    ];

    const handleGenerate = () => {
        setAddressGenerated(true);
    };

    // Fix 1: Back Logic Intervention
    const handleBack = () => {
        if (addressGenerated) {
            // Return to Network Selection
            setAddressGenerated(false);
            setStatus('WAITING');
        } else {
            // Return to Home (Wallet Grid)
            onBack?.();
        }
    };

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (showHistory) {
        return <TransactionHistory transactions={transactions} onBack={() => setShowHistory(false)} />;
    }


    return (
        <div className="flex flex-col h-full space-y-4 font-sans antialiased">

            {/* Header with Title & Back Button - Hidden on Success */}
            {status !== 'SUCCESS' && status !== 'OVER_PAID' && (
                <div className="flex items-center justify-between pb-2">
                    <div className="flex items-center gap-2">
                        {onBack && (
                            <button
                                onClick={handleBack}
                                className="p-1.5 -ml-2 text-gray-400 hover:text-gray-700 bg-transparent hover:bg-gray-100 rounded-lg transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>
                        )}
                        <span className="font-bold text-lg text-gray-900">Transfer</span>
                    </div>
                </div>

            )}
            {!addressGenerated ? (
                <>
                    {/* Step 1: Network Selection */}
                    <div className="space-y-3">
                        <label className="text-xs font-medium text-gray-400">Select Network</label>
                        <div className="grid grid-cols-2 gap-2">
                            {chains.map((chain) => (
                                <button
                                    key={chain.id}
                                    onClick={() => setSelectedChain(chain.id)}
                                    className={`p-3 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${selectedChain === chain.id
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    {selectedChain === chain.id && <Check size={14} />}
                                    <div className="w-4 h-4 flex items-center justify-center">
                                        {getNetworkIcon(chain.id)}
                                    </div>
                                    {chain.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Step 2: CTA */}
                    <div className="pt-4">
                        <button
                            onClick={handleGenerate}
                            disabled={!selectedChain}
                            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Generate Address
                        </button>
                    </div>
                </>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-4">

                    {/* Status: SCANNING */}
                    {status === 'SCANNING' ? (
                        <div className="flex flex-col items-center justify-center py-10 space-y-4">
                            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            <div className="text-center space-y-1">
                                <span className="block text-sm font-bold text-indigo-900">Verifying Transaction...</span>
                                <span className="block text-[10px] text-gray-400">On-chain confirmation may take time</span>
                            </div>
                            <button
                                onClick={() => setStatus(receivedAmount > 0 ? 'PARTIAL_PAID' : 'WAITING')}
                                className="text-xs font-bold text-gray-400 hover:text-gray-600 underline"
                            >
                                Return to Address
                            </button>
                        </div>
                    ) : status === 'OVER_PAID' || status === 'SUCCESS' ? (
                        <PaymentSuccess
                            onViewHistory={() => setShowHistory(true)}
                            amount={receivedAmount}
                            currency="USDT"
                            network={selectedChain || 'eth'}
                            txTime={transactions[transactions.length - 1]?.time || new Date().toLocaleTimeString()}
                            txId={`TX-${Math.floor(Math.random() * 100000000)}`}
                            hash={transactions[transactions.length - 1]?.hash || "0x..."}
                        />
                    ) : (
                        <>
                            {status === 'PARTIAL_PAID' ? (
                                <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
                                    <div className="flex flex-col space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500 font-medium">Order Total</span>
                                            <span className="font-bold text-gray-900">{requiredAmount.toFixed(2)} USDT</span>
                                        </div>
                                        <div className="w-full h-px bg-gray-100 my-1"></div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-green-600 font-medium">Paid</span>
                                            <span className="font-bold text-green-600">{receivedAmount.toFixed(2)} USDT</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-orange-600 font-bold">Remaining</span>
                                            <span className="font-bold text-orange-600">{(requiredAmount - receivedAmount).toFixed(2)} USDT</span>
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            {/* Step 3: Address Display */}
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-[11px] font-medium text-gray-400">
                                        {status === 'PARTIAL_PAID' ? 'Remaining Deposit Address' : 'Deposit Address'}
                                    </label>
                                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                                        {chains.find(c => c.id === selectedChain)?.protocol}
                                    </span>
                                </div>
                                <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 h-14 flex items-center justify-between">
                                    <span className="font-mono text-sm text-gray-900 font-semibold truncate mr-2">
                                        {selectedChain === 'tron' ? 'T9yD14Nj9...j29s' : '0x71C...9A23'}
                                    </span>
                                    {/* Embedded Check Result Icon */}
                                    {(status === 'WAITING' || status === 'PARTIAL_PAID') && (
                                        <button
                                            onClick={handleCheckResult}
                                            className="w-8 h-8 flex items-center justify-center text-indigo-600 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-indigo-300 hover:text-indigo-700 transition-all active:scale-95"
                                            title="Check Payment Result"
                                        >
                                            <Search size={16} strokeWidth={2.5} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {status !== 'PARTIAL_PAID' && (
                                <div className="bg-orange-50 text-orange-800 p-3 rounded-xl text-[11px] leading-relaxed text-center border border-orange-100">
                                    Only send <strong>USDT ({chains.find(c => c.id === selectedChain)?.protocol.toUpperCase()})</strong> to this address.
                                </div>
                            )}

                            {/* Step 4: Toolbox */}
                            <div className="flex justify-around pt-2">
                                <button onClick={handleCopy} className="flex flex-col items-center gap-1.5 group">
                                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                        {copied ? <Check size={18} /> : <Copy size={18} />}
                                    </div>
                                    <span className="text-[10px] font-medium text-gray-400 group-hover:text-indigo-600">Copy</span>
                                </button>
                                <button className="flex flex-col items-center gap-1.5 group">
                                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                        {/* Download icon was here */}
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                    </div>
                                    <span className="text-[10px] font-medium text-gray-400 group-hover:text-indigo-600">Save Image</span>
                                </button>
                                <button className="flex flex-col items-center gap-1.5 group">
                                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                        <QrCode size={18} />
                                    </div>
                                    <span className="text-[10px] font-medium text-gray-400 group-hover:text-indigo-600">QR Code</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
