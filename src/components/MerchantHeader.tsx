import React, { useState } from 'react';
import { Store, Check, Copy, ChevronDown, ChevronUp } from 'lucide-react';

export const MerchantHeader = () => {
    const [expanded, setExpanded] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 1500);
    };

    // Mock 数据
    const merchantOrder = "B508...DE04";
    const fullMerchantOrder = "B50892189DE04";
    const txId = "1317...9429";
    const fullTxId = "131769414929481";

    return (
        <div className="w-full bg-white relative mb-6">

            {/* === 1. Banner 区域 === */}
            <div className="relative h-36 w-full overflow-hidden rounded-t-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500">

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

                {/* Banner 中央：商户 Icon + USDT 标 */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                        {/* 白色半透明的 Store Icon */}
                        <Store className="text-white/90 w-14 h-14 drop-shadow-md" strokeWidth={1.5} />

                        {/* USDT 角标 */}
                        <div className="absolute -bottom-1 -right-2 bg-[#26A17B] text-white rounded-full w-6 h-6 flex items-center justify-center border-2 border-transparent shadow-sm font-bold text-[10px]">
                            T
                        </div>
                    </div>
                </div>
            </div>

            {/* === 2. 悬浮框区域 (商品兜底图) === */}
            {/* 修改点 1: 改用 top-32 定位 (约128px)
         Banner高144px，图片从128px开始，重叠16px。
         这比之前的位置更靠下，拉开了与Banner的距离。
      */}
            <div className="absolute top-32 left-6 z-10">
                <div className="relative h-20 w-20 bg-white rounded-2xl shadow-lg ring-4 ring-white overflow-hidden group">
                    <img
                        src="https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=300&auto=format&fit=crop"
                        alt="Product Placeholder"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                </div>
            </div>

            {/* === 3. 数据展示区域 === */}
            {/* 修改点 2: pt-6 (24px)
         这会把文字整体向下推 24px，留出明显的呼吸感。
         配合左侧图片的 top-32，依然保持“文字顶部与图片中心线对齐”的视觉效果。
      */}
            <div className="pt-6 px-5 pl-32 flex flex-col items-start justify-center min-h-[60px] relative">

                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900 tracking-tight">20.00</span>
                    <span className="text-sm font-bold text-gray-500">USDT</span>
                </div>
                <span className="text-xs text-gray-400 font-medium mt-1">≈ $20.00 USD</span>

                {/* Details 按钮 */}
                <div className="absolute right-5 top-8">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-full transition-colors"
                    >
                        {expanded ? 'Hide Details' : 'Details'}
                        {expanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                    </button>
                </div>
            </div>

            {/* === 4. 折叠详情区域 === */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? 'max-h-24 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                <div className="px-5 pb-2 pt-0 space-y-2">

                    <div className="flex justify-between items-center group">
                        <span className="text-xs text-gray-400">Merchant Order</span>
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs font-mono text-gray-600 font-medium">{merchantOrder}</span>
                            <button onClick={() => handleCopy(fullMerchantOrder, 'order')} className="text-gray-300 hover:text-indigo-600 transition-colors p-1">
                                {copied === 'order' ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center group">
                        <span className="text-xs text-gray-400">Transaction ID</span>
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs font-mono text-gray-600 font-medium">{txId}</span>
                            <button onClick={() => handleCopy(fullTxId, 'tx')} className="text-gray-300 hover:text-indigo-600 transition-colors p-1">
                                {copied === 'tx' ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};