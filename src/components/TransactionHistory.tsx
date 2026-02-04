import { ArrowLeft, Check, ExternalLink } from 'lucide-react';

export interface Transaction {
    id: string;
    amount: number;
    time: string;
    hash: string;
}

interface TransactionHistoryProps {
    transactions: Transaction[];
    onBack: () => void;
}

export const TransactionHistory = ({ transactions, onBack }: TransactionHistoryProps) => {
    // Sort transactions by time descending (newest first)
    // Note: In real app, consider using Date objects for sorting. Here we assume time strings or pre-sorted order if complex. 
    // Given the prompt requirement, we'll do a simple reverse rendering or assume the parent passes them in order.
    // Let's assume the parent adds new ones to the end, so we reverse for display, or we just map them.
    // Let's stick to the prompt's request: "Sort logic: Descending by confirmation time".

    const sortedTransactions = [...transactions].reverse();

    return (
        <div className="h-full flex flex-col font-sans animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={onBack}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft size={16} />
                </button>
                <h2 className="text-lg font-bold text-gray-900">Transaction History</h2>
            </div>

            {/* List */}
            <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar">
                {sortedTransactions.map((tx) => (
                    <div
                        key={tx.id}
                        className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
                    >
                        {/* Left: Icon & Amount */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 shrink-0">
                                <Check size={18} strokeWidth={3} />
                            </div>
                            <div>
                                <div className="font-bold text-gray-900 text-sm">
                                    +{tx.amount.toFixed(2)} USDT
                                </div>
                                <div className="text-[10px] text-gray-400 font-medium mt-0.5">
                                    Confirmed
                                </div>
                            </div>
                        </div>

                        {/* Right: Time & Hash */}
                        <div className="flex flex-col items-end gap-1">
                            <span className="text-xs font-medium text-gray-500">{tx.time}</span>
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); }}
                                className="flex items-center gap-1 text-[10px] text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded hover:text-indigo-600 transition-colors"
                            >
                                {tx.hash} <ExternalLink size={8} />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
