import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { MerchantLogo } from './MerchantLogo';

interface MerchantHeaderProps {
    isSuccess?: boolean;
    hideAmount?: boolean;
}

export const MerchantHeader = ({ isSuccess, hideAmount }: MerchantHeaderProps) => {
    const [copied, setCopied] = useState<string | null>(null);

    const fullMerchantOrder = 'B50892189DE04';
    const fullTxId = '131769414929481';

    const handleCopy = (text: string, key: string) => {
        navigator.clipboard.writeText(text).catch(() => {});
        setCopied(key);
        setTimeout(() => setCopied(null), 1500);
    };

    if (isSuccess) return null;

    return (
        <div className={`w-full bg-white relative ${hideAmount ? 'mb-1' : 'mb-5'} !rounded-none md:rounded-t-2xl transition-all`}>

            {/* Banner — minHeight 15rem to accommodate order IDs at bottom */}
            <div
                className="relative w-full overflow-hidden !rounded-none md:!rounded-t-2xl flex flex-col items-center pt-7 md:pt-8 gap-3"
                style={{
                    minHeight: '15rem',
                    background: 'linear-gradient(135deg, #1a0533 0%, #3b1278 20%, #7c3aed 42%, #db2777 65%, #f97316 85%, #fbbf24 100%)',
                }}
            >
                {/* Inner ring */}
                <div className="absolute inset-0 !rounded-none md:!rounded-t-2xl pointer-events-none"
                    style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.15)' }} />
                {/* Blue glow bottom-left */}
                <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.55) 0%, transparent 70%)', filter: 'blur(28px)' }} />
                {/* Orange glow bottom-right */}
                <div className="absolute -bottom-8 -right-8 w-56 h-56 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.5) 0%, transparent 70%)', filter: 'blur(24px)' }} />
                {/* Rim light top-right */}
                <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at 100% 0%, rgba(255,255,255,0.12) 0%, transparent 60%)' }} />
                {/* Top 1px glass line */}
                <div className="absolute top-0 left-0 w-full h-px pointer-events-none"
                    style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 30%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.4) 70%, transparent 100%)' }} />
                {/* Pay watermark */}
                <div className="absolute -bottom-6 -right-6 opacity-[0.06] pointer-events-none select-none animate-float z-0 rotate-12">
                    <span className="text-[120px] md:text-[140px] font-black text-white italic tracking-tighter leading-none">Pay</span>
                </div>

                {/* Logo tile */}
                <div className="relative z-20 flex-shrink-0"
                    style={{
                        width: 56, height: 56, borderRadius: 16,
                        background: 'rgba(255,255,255,0.14)',
                        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                        border: '1.5px solid rgba(255,255,255,0.30)',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.30), inset 0 1.5px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.10)',
                    }}>
                    <div className="absolute inset-0 pointer-events-none"
                        style={{ borderRadius: 16, background: 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 55%)' }} />
                    <div className="relative z-10 w-full h-full p-1.5">
                        <MerchantLogo merchantName="Shopify Store" brandColor="#96bf48" />
                    </div>
                </div>

                {/* Brand name */}
                <div className="relative z-20 flex items-center gap-3">
                    <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.35)' }} />
                    <span style={{
                        color: 'rgba(255,255,255,0.90)', fontSize: 11, fontWeight: 500,
                        letterSpacing: '0.14em', textTransform: 'uppercase' as const,
                        fontFamily: 'Georgia, "Times New Roman", serif',
                        whiteSpace: 'nowrap', textShadow: '0 1px 8px rgba(0,0,0,0.25)',
                    }}>
                        Shopify Store
                    </span>
                    <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.35)' }} />
                </div>

                {/* Order IDs — anchored to bottom of banner via mt-auto */}
                <div className="relative z-20 w-full mt-auto px-5 pb-4 flex flex-col gap-1.5">
                    <div className="w-full mb-1" style={{ height: 1, background: 'rgba(255,255,255,0.12)' }} />

                    {/* Merchant Order row */}
                    <div className="flex items-center justify-between gap-2">
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.48)', fontWeight: 500, flexShrink: 0, whiteSpace: 'nowrap' }}>
                            Merchant Order
                        </span>
                        <div className="flex items-center gap-1.5 min-w-0">
                            <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 600, color: 'rgba(255,255,255,0.82)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {fullMerchantOrder}
                            </span>
                            <button onClick={() => handleCopy(fullMerchantOrder, 'order')}
                                className="flex-shrink-0 p-0.5 rounded hover:opacity-75 active:scale-90 transition-all">
                                {copied === 'order'
                                    ? <Check size={11} style={{ color: 'rgba(134,239,172,1)' }} />
                                    : <Copy size={11} style={{ color: 'rgba(255,255,255,0.38)' }} />}
                            </button>
                        </div>
                    </div>

                    {/* Transaction ID row */}
                    <div className="flex items-center justify-between gap-2">
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.48)', fontWeight: 500, flexShrink: 0, whiteSpace: 'nowrap' }}>
                            Transaction ID
                        </span>
                        <div className="flex items-center gap-1.5 min-w-0">
                            <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 600, color: 'rgba(255,255,255,0.82)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {fullTxId}
                            </span>
                            <button onClick={() => handleCopy(fullTxId, 'tx')}
                                className="flex-shrink-0 p-0.5 rounded hover:opacity-75 active:scale-90 transition-all">
                                {copied === 'tx'
                                    ? <Check size={11} style={{ color: 'rgba(134,239,172,1)' }} />
                                    : <Copy size={11} style={{ color: 'rgba(255,255,255,0.38)' }} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Amount — no Details toggle, order IDs are now in banner */}
            {!hideAmount && (
                <div className="pt-5 px-5 pb-4 flex flex-col items-center justify-center text-center">
                    <div className="flex items-baseline gap-2 mb-1.5">
                        <span className="text-[30px] md:text-[34px] font-bold text-gray-900 tracking-tight leading-none">
                            20.00
                        </span>
                        <span className="text-xs md:text-sm font-semibold text-gray-400">USDT</span>
                    </div>
                    <div className="text-xs text-gray-400 font-medium">≈ $20.00 USD</div>
                </div>
            )}
        </div>
    );
};
