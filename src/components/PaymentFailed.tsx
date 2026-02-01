import { XCircle } from 'lucide-react';

interface PaymentFailedProps {
    onRetry?: () => void;
}

export const PaymentFailed: React.FC<PaymentFailedProps> = () => {
    return (
        <div className="w-full flex flex-col items-center justify-center pt-10 pb-4 animate-in fade-in zoom-in-95 duration-500 h-full">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <XCircle size={40} className="text-red-500" />
            </div>

            <h2 className="text-2xl font-black text-gray-900 mb-2">Payment Failed</h2>
            <p className="text-sm text-gray-500 text-center px-4 mb-8">
                The transaction could not be processed.
            </p>

            <div className="w-full bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4 mb-8">
                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                    <span className="text-xs text-gray-400 font-medium">Amount</span>
                    <span className="text-sm font-bold text-gray-900">20.00 USDT</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                    <span className="text-xs text-gray-400 font-medium">Payment Network</span>
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-gray-900">Ethereum</span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-medium">Merchant Order No.</span>
                    <div className="flex items-center gap-1">
                        <span className="text-xs font-mono text-gray-600">BP-2024001293</span>
                    </div>
                </div>
            </div>

            <div className="mt-auto w-full px-4">
                <div className="bg-gray-50 rounded-lg p-3 text-[10px] text-gray-400 text-center">
                    Transaction ID: 0xFailed...Action
                </div>
            </div>
        </div>
    );
};
