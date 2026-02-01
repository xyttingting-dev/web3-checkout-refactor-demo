import React from 'react';
import { CheckCircle2, Copy, Check } from 'lucide-react';
import { getNetworkIcon } from './IconLibrary';

interface PaymentSuccessProps { }

export const PaymentSuccess: React.FC<PaymentSuccessProps> = () => {
    const [copied, setCopied] = React.useState(false);
    const txHash = "0x7a...3f9c";

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="w-full flex flex-col items-center justify-center pt-8 pb-4 animate-in fade-in zoom-in-95 duration-500 font-sans antialiased text-gray-900">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-50"></div>
                <CheckCircle2 size={40} className="text-green-600 relative z-10" strokeWidth={2.5} />
            </div>

            <h2 className="text-2xl font-black text-gray-900 mb-2 leading-tight">Payment Successful</h2>
            <p className="text-sm text-gray-500 text-center px-4 mb-4 leading-relaxed">
                Your transaction has been confirmed on the blockchain.
            </p>


            <div className="w-full bg-gray-50 rounded-xl p-6 mb-6 border border-gray-100 space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-[11px] font-medium text-gray-400">Amount</span>
                    <span className="text-sm font-semibold text-gray-900 leading-relaxed">20.00 USDT</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[11px] font-medium text-gray-400">Merchant</span>
                    <span className="text-sm font-semibold text-gray-900 leading-relaxed">BonusPay Global</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[11px] font-medium text-gray-400">Payment Network</span>
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4">{getNetworkIcon('eth')}</div>
                        <span className="text-sm font-semibold text-gray-900 leading-relaxed">Ethereum Mainnet</span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[11px] font-medium text-gray-400">MerchantOrderNo.</span>
                    <span className="text-sm font-mono font-semibold text-gray-900 tracking-tight leading-relaxed">BP-202488821</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[11px] font-medium text-gray-400">TransactionID</span>
                    <span className="text-sm font-mono font-semibold text-gray-900 tracking-tight leading-relaxed">TX-99283712</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[11px] font-medium text-gray-400">TransactionTime</span>
                    <span className="text-sm font-mono font-semibold text-gray-900 tracking-tight leading-relaxed">2024-10-24 14:30:22</span>
                </div>
                <div className="flex justify-between items-start pt-2 border-t border-gray-200">
                    <span className="text-[11px] font-medium text-gray-400 mt-1">Hash No.</span>
                    <div className="flex-1 flex justify-end gap-1.5 cursor-pointer max-w-[70%]" onClick={handleCopy}>
                        <span className="text-sm font-mono font-semibold text-indigo-600 tracking-tight leading-relaxed text-right break-all whitespace-normal">
                            {txHash}
                        </span>
                        <div className="w-4 h-4 flex items-center justify-center -mt-px">
                            {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="text-gray-400 hover:text-indigo-600" />}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Locked - Dead End Text or Nothing */}
            <div className="mt-8 text-center">
                <p className="text-[10px] text-gray-300 uppercase tracking-widest font-bold">
                    Payment Complete
                </p>
            </div>
        </div>
    );
};
