import { useState } from 'react';
import { Check, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { MerchantLogo } from './assets/MerchantLogo';

interface MerchantHeaderProps {
    isSuccess?: boolean;
    hideAmount?: boolean;
}

export const MerchantHeader = ({ isSuccess, hideAmount }: MerchantHeaderProps) => {
    const [copied, setCopied] = useState<string | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    const handleCopy = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 1500);
    };



    // Mock 数据
    const fullMerchantOrder = "B50892189DE04";
    const fullTxId = "131769414929481";


    if (isSuccess) {
        return null;
    }

    return (
        <div className="w-full bg-white relative mb-5">


            {/* === 1. Banner 区域 === */}
            <div className="relative h-44 w-full overflow-hidden rounded-t-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 flex flex-col items-center pt-8 pb-4 gap-2">

                {/* 背景纹理/光束 */}
                <div className="absolute -top-10 left-10 h-64 w-64 bg-white/20 blur-3xl rotate-45 mix-blend-overlay"></div>
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/10 via-transparent to-transparent"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-white/30"></div>

                {/* Animated 'Pay' Watermark */}
                <div className="absolute -bottom-8 -right-8 opacity-[0.05] pointer-events-none select-none animate-float z-0 transform rotate-12">
                    <span className="text-[160px] font-black text-white italic tracking-tighter leading-none">
                        Pay
                    </span>
                </div>

                {/* === Brand Content Group (Centered Vertically in Banner) === */}
                <div className="relative z-20 flex flex-col items-center gap-2">

                    {/* 2. Refined Brand Box */}
                    <MerchantLogo />

                    {/* 3. Brand Name Tab (Style Frozen) */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/10 px-6 py-2 rounded-lg shadow-xl relative overflow-hidden flex items-center justify-center min-h-[44px]">
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-30"></div>
                        <div className="relative z-10 flex items-center gap-3">
                            {/* Left Separator */}
                            <div className="w-px h-6 bg-white/50"></div>

                            {/* Merchant Name */}
                            <span className="text-white text-sm md:text-base font-bold tracking-wide text-center whitespace-nowrap">
                                {("BonusPay Global Merchant").length > 25 ? ("BonusPay Global Merchant").slice(0, 25) + "..." : "BonusPay Global Merchant"}
                            </span>

                            {/* Right Separator */}
                            <div className="w-px h-6 bg-white/50"></div>
                        </div>
                    </div>
                </div>

            </div>


            {/* === 3. 数据展示区域 (Data Display) === */}
            {/* Adjusted padding sine image is gone */}
            {!hideAmount && (
                <div className="pt-4 px-5 flex flex-col items-center justify-center min-h-[60px] relative mt-0 text-center">


                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-[32px] font-bold text-gray-900 tracking-tight leading-none" style={{ letterSpacing: '-0.02em' }}>20.00</span>
                        <span className="text-sm font-semibold text-gray-500">USDT</span>
                    </div>

                    <div className="text-xs text-gray-400 font-medium mb-2">≈ $20.00 USD</div>

                    {/* Details Button - Centered in its own row */}
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-100/80 hover:bg-gray-200/80 text-gray-500 rounded-full transition-all active:scale-95 group"
                    >
                        <span className="text-sm font-semibold group-hover:text-gray-700">Details</span>
                        {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>
            )}

            {/* === 4. 折叠详情区域 === */}
            {!hideAmount && (
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showDetails ? 'max-h-24 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 pb-2 pt-0 space-y-3">
                        <div className="flex justify-between items-center group">
                            <span className="text-xs text-gray-400 font-medium min-w-[30%] text-left">Merchant Order</span>
                            <div className="text-right flex items-center justify-end gap-1.5 flex-1 min-w-0">
                                <span className="text-sm font-semibold text-gray-900 break-all leading-tight text-right">
                                    {fullMerchantOrder}
                                </span>
                                <button
                                    onClick={() => handleCopy(fullMerchantOrder, 'Order ID')}
                                    className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-indigo-600 flex-shrink-0"
                                    title="Copy Order ID"
                                >
                                    {copied === 'Order ID' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center group">
                            <span className="text-xs text-gray-400 font-medium min-w-[30%] text-left">Transaction ID</span>
                            <div className="text-right flex items-center justify-end gap-1.5 flex-1 min-w-0">
                                <span className="text-sm font-semibold text-gray-900 break-all leading-tight text-right">
                                    {fullTxId}
                                </span>
                                <button
                                    onClick={() => handleCopy(fullTxId, 'Tx ID')}
                                    className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-indigo-600 flex-shrink-0"
                                    title="Copy Transaction ID"
                                >
                                    {copied === 'Tx ID' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};