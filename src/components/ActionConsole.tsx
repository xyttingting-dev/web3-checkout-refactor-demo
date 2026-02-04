

import { useState } from 'react';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useSendTransaction } from 'wagmi';

interface ActionConsoleProps {
    step: 'AUTH' | 'SIGN' | 'CONFIRMATION';
    onComplete: () => void;
}

export const ActionConsole = ({ step, onComplete }: ActionConsoleProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const { sendTransactionAsync } = useSendTransaction();

    const handleAction = async () => {
        setIsLoading(true);

        if (step === 'CONFIRMATION') {
            // Phase 4: Trigger Wallet Sign
            try {
                // Attempt to open wallet with a dummy transaction to simulate "Sign"
                // In a real app we'd target the merchant address
                await sendTransactionAsync({
                    to: '0xd2135CfB216b74109775236E36d4b433F1DF507B',
                    value: 0n // 0 ETH just to trigger prompt
                });
            } catch (e) {
                console.log("User rejected or failed", e);
                // "Regardless of user action... force jump"
            } finally {
                // Force success outcome
                setTimeout(() => {
                    setIsLoading(false);
                    onComplete();
                }, 1000);
            }
        } else {
            // Fallback for Auth scenarios if needed
            setTimeout(() => {
                setIsLoading(false);
                onComplete();
            }, 1000);
        }
    };

    if (step === 'CONFIRMATION') {
        return (
            <div className="flex flex-col animate-in fade-in zoom-in-95 duration-300 h-full">
                <h3 className="text-lg font-black text-gray-900 mb-6 text-center">Confirm Order</h3>

                <div className="bg-gray-50 rounded-2xl p-6 space-y-3 border border-gray-100 flex-1">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-xs font-medium text-gray-400">Payment Network</span>
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-blue-100 text-[8px] text-blue-600 flex items-center justify-center font-bold">EVM</div>
                            <span className="text-sm font-semibold text-gray-900">Ethereum</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-xs font-medium text-gray-400">Merchant</span>
                        <span className="text-sm font-semibold text-gray-900">BonusPay Global</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-1">
                        <span className="text-xs font-medium text-gray-400">Total Amount</span>
                        <span className="text-2xl font-black text-gray-900">20.00 <span className="text-sm font-medium text-gray-500">USDT</span></span>
                    </div>
                </div>

                <div className="mt-8 space-y-4">
                    <button
                        onClick={handleAction}
                        disabled={isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-200"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                <span>Requesting Signature...</span>
                            </>
                        ) : (
                            <>
                                <span>Submit Order</span>
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>

                    <p className="text-center text-[10px] text-gray-400">
                        Clicking submit will trigger your wallet signature.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center py-8 animate-in fade-in zoom-in-95 duration-300">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${step === 'AUTH' ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600'}`}>
                <ShieldCheck size={32} />
            </div>

            <h3 className="text-lg font-black text-gray-900 mb-2">
                {step === 'AUTH' ? 'Approve Allowance' : 'Sign Transaction'}
            </h3>

            <p className="text-center text-xs text-gray-400 mb-8 max-w-[80%]">
                Please sign the transaction in your wallet to complete the payment.
            </p>

            <button
                onClick={handleAction}
                disabled={isLoading}
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin" size={18} />
                        <span>Check Wallet...</span>
                    </>
                ) : (
                    <>
                        <span>Confirm Payment</span>
                        <ArrowRight size={18} />
                    </>
                )}
            </button>
        </div>
    );
};
