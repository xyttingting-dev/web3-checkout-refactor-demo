import React, { useEffect } from 'react';
import { CheckCircle2, Copy, Check } from 'lucide-react';
import { getNetworkIcon } from './IconLibrary';

interface PaymentSuccessProps {
    onViewHistory?: () => void;
    // Dynamic Data Props
    amount?: number;
    currency?: string;
    merchantName?: string;
    network?: string;
    orderId?: string;
    txId?: string; // Added back txId
    txTime?: string;
    status?: 'Success' | 'Pending';
    hash?: string; // New prop for hash
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
    amount = 20.00,
    currency = 'USDT',
    merchantName = 'BonusPay Global',
    network = 'eth',
    orderId = 'BP-202488821',
    txId = 'TX-99283712',
    txTime = '2024-10-24 14:30:22',
    hash = '0x7a...3f9c'
}) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(hash);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="w-full flex flex-col items-center justify-center pt-8 pb-32 animate-in fade-in zoom-in-95 duration-500 font-sans antialiased text-gray-900 mt-4">
            {/* 1. Status Area: Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 relative">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-50"></div>
                <CheckCircle2 size={36} className="text-green-600 relative z-10" strokeWidth={3} />
            </div>

            {/* 2. Text Area */}
            <h2 className="text-2xl font-black text-gray-900 mb-2 leading-tight tracking-tight">Payment Successful</h2>
            <p className="text-sm text-gray-500 text-center px-4 mb-8 leading-relaxed max-w-[280px]">
                Your transaction has been confirmed on the blockchain.
            </p>

            {/* 3. Details Card (Everything Inside) */}
            <div className="w-full bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100 space-y-4">

                {/* Amount */}
                <div className="flex justify-between items-center">
                    <span className="text-[11px] font-medium text-gray-400">Amount</span>
                    <span className="text-sm font-semibold text-gray-900 leading-relaxed tabular-nums">
                        {amount.toFixed(2)} {currency}
                    </span>
                </div>

                {/* Merchant */}
                <div className="flex justify-between items-center">
                    <span className="text-[11px] font-medium text-gray-400">Merchant</span>
                    <span className="text-sm font-semibold text-gray-900 leading-relaxed font-sans">
                        {merchantName}
                    </span>
                </div>

                {/* Payment Network */}
                <div className="flex justify-between items-center">
                    <span className="text-[11px] font-medium text-gray-400">Payment Network</span>
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 flex items-center justify-center">
                            {getNetworkIcon(network)}
                        </div>
                        <span className="text-sm font-semibold text-gray-900 leading-relaxed capitalize text-right">
                            {network === 'eth' ? 'Ethereum Mainnet' : network}
                        </span>
                    </div>
                </div>

                {/* Merchant Order ID */}
                <div className="flex justify-between items-center">
                    <span className="text-[11px] font-medium text-gray-400">MerchantOrderNo.</span>
                    <span className="text-sm font-semibold text-gray-900 leading-relaxed font-mono tracking-tight">{orderId}</span>
                </div>

                {/* Transaction ID */}
                <div className="flex justify-between items-center">
                    <span className="text-[11px] font-medium text-gray-400">TransactionID</span>
                    <span className="text-sm font-semibold text-gray-900 leading-relaxed font-mono tracking-tight">{txId}</span>
                </div>

                {/* Time */}
                <div className="flex justify-between items-center">
                    <span className="text-[11px] font-medium text-gray-400">TransactionTime</span>
                    <span className="text-sm font-semibold text-gray-900 leading-relaxed font-mono tracking-tight">{txTime}</span>
                </div>

                {/* Hash No. (With Divider) */}
                <div className="flex justify-between items-start pt-3 border-t border-gray-200 mt-2">
                    <span className="text-[11px] font-medium text-gray-400 mt-0.5">Hash No.</span>
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={handleCopy}>
                        <span className="text-sm font-semibold text-indigo-600 font-mono tracking-tight break-all text-right max-w-[150px]">
                            {hash}
                        </span>
                        <div className="w-4 h-4 flex items-center justify-center text-gray-400 group-hover:text-indigo-600 transition-colors">
                            {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};
