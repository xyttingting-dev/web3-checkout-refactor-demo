import { useState } from 'react';
import { Check, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { MerchantLogo } from './MerchantLogo';

/**
 * MerchantHeader
 *
 * Changes vs original (audit IDs):
 *   #023 — Banner gradient: deep purple→violet→magenta→orange→gold + blue radial glow (bottom-left) + orange radial glow (bottom-right)
 *   #015 — Inner ring: inset box-shadow top white/25 + bottom black/15 + top 1px glass line
 *   #016 — Details toggle: upgraded to stateful glass capsule with violet active state
 *   #028 — Details kv layout: fixed-width label + dot leader + mono value, proper eye-tracking alignment
 *   Logo  — Replaced hardcoded Shopify SVG with MerchantLogo component (supports logoUrl / brandColor / merchantName props)
 *
 * Responsive behaviour:
 *   Mobile  : Banner h-44 (176px), full-bleed no top rounding (!rounded-none)
 *   Desktop : Banner h-48 (192px), rounded-t-2xl top corners, card shadow from MobileShell
 */

interface MerchantHeaderProps {
    isSuccess?: boolean;
    hideAmount?: boolean;
}

export const MerchantHeader = ({ isSuccess, hideAmount }: MerchantHeaderProps) => {
    const [copied, setCopied] = useState<string | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    const fullMerchantOrder = 'B50892189DE04';
    const fullTxId = '131769414929481';

    const handleCopy = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 1500);
    };

    if (isSuccess) return null;

    return (
        <div className={`w-full bg-white relative ${hideAmount ? 'mb-1' : 'mb-5'} !rounded-none md:rounded-t-2xl transition-all`}>

            {/* ─── Banner ─────────────────────────────────────────────── */}
            <div
                className="relative h-44 md:h-48 w-full overflow-hidden !rounded-none md:!rounded-t-2xl flex flex-col items-center pt-7 md:pt-8 pb-4 gap-4"
                style={{
                    background: 'linear-gradient(135deg, #1a0533 0%, #3b1278 20%, #7c3aed 42%, #db2777 65%, #f97316 85%, #fbbf24 100%)',
                }}
            >
                {/* Inner ring — #015 */}
                <div
                    className="absolute inset-0 !rounded-none md:!rounded-t-2xl pointer-events-none"
                    style={{
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.15)',
                    }}
                />

                {/* Blue radial glow — bottom-left — #023 */}
                <div
                    className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, rgba(59,130,246,0.55) 0%, transparent 70%)',
                        filter: 'blur(28px)',
                    }}
                />

                {/* Orange radial glow — bottom-right — #023 */}
                <div
                    className="absolute -bottom-8 -right-8 w-56 h-56 rounded-full pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, rgba(249,115,22,0.5) 0%, transparent 70%)',
                        filter: 'blur(24px)',
                    }}
                />

                {/* Rim light — top-right */}
                <div
                    className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
                    style={{
                        background: 'radial-gradient(ellipse at 100% 0%, rgba(255,255,255,0.12) 0%, transparent 60%)',
                    }}
                />

                {/* Top 1px glass line */}
                <div
                    className="absolute top-0 left-0 w-full h-px pointer-events-none"
                    style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 30%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.4) 70%, transparent 100%)',
                    }}
                />

                {/* Pay watermark */}
                <div className="absolute -bottom-6 -right-6 opacity-[0.06] pointer-events-none select-none animate-float z-0 rotate-12">
                    <span className="text-[120px] md:text-[140px] font-black text-white italic tracking-tighter leading-none">Pay</span>
                </div>

                {/* ── Logo tile ── */}
                <div
                    className="relative z-20 flex-shrink-0"
                    style={{
                        width: 56,
                        height: 56,
                        borderRadius: 16,
                        background: 'rgba(255,255,255,0.14)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: '1.5px solid rgba(255,255,255,0.30)',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.30), inset 0 1.5px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.10)',
                    }}
                >
                    {/* Inner shimmer overlay */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            borderRadius: 16,
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 55%)',
                        }}
                    />
                    {/* MerchantLogo — pass merchant data from your order context */}
                    <div className="relative z-10 w-full h-full p-1.5">
                        <MerchantLogo
                            /* logoUrl="https://cdn.yourmerchant.com/logo.png" */
                            merchantName="Shopify Store"
                            brandColor="#96bf48"
                        />
                    </div>
                </div>

                {/* ── Brand name — typographic only, no background box ── */}
                <div className="relative z-20 flex items-center gap-3">
                    <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.35)' }} />
                    <span
                        style={{
                            color: 'rgba(255,255,255,0.90)',
                            fontSize: 11,
                            fontWeight: 500,
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase' as const,
                            fontFamily: 'Georgia, "Times New Roman", serif',
                            whiteSpace: 'nowrap',
                            textShadow: '0 1px 8px rgba(0,0,0,0.25)',
                        }}
                    >
                        Shopify Store
                    </span>
                    <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.35)' }} />
                </div>
            </div>

            {/* ─── Amount Display — #002 breathing room ──────────────── */}
            {!hideAmount && (
                <div className="pt-5 px-5 pb-1 flex flex-col items-center justify-center relative text-center">
                    <div className="flex items-baseline gap-2 mb-1.5">
                        <span className="text-[30px] md:text-[34px] font-bold text-gray-900 tracking-tight leading-none">
                            20.00
                        </span>
                        <span className="text-xs md:text-sm font-semibold text-gray-400">USDT</span>
                    </div>

                    <div className="text-xs text-gray-400 font-medium mb-3">≈ $20.00 USD</div>

                    {/* Details toggle — #016 stateful glass capsule */}
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="flex items-center gap-1.5 transition-all active:scale-95 group"
                        style={{
                            padding: '6px 14px',
                            borderRadius: '999px',
                            background: showDetails
                                ? 'linear-gradient(135deg, rgba(124,58,237,0.10), rgba(219,39,119,0.08))'
                                : 'rgba(243,244,246,0.9)',
                            border: showDetails
                                ? '1px solid rgba(124,58,237,0.20)'
                                : '1px solid rgba(0,0,0,0.06)',
                            boxShadow: showDetails
                                ? '0 2px 8px rgba(124,58,237,0.12), inset 0 1px 0 rgba(255,255,255,0.5)'
                                : '0 1px 3px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
                        }}
                    >
                        <span
                            className="text-xs font-semibold transition-colors"
                            style={{ color: showDetails ? '#7c3aed' : '#6b7280' }}
                        >
                            Details
                        </span>
                        {showDetails
                            ? <ChevronUp size={14} style={{ color: '#8b5cf6' }} />
                            : <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600" />
                        }
                    </button>
                </div>
            )}

            {/* ─── Collapsible Details — #028 dot-leader kv layout ───── */}
            {!hideAmount && (
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        showDetails ? 'max-h-28 opacity-100 mt-2' : 'max-h-0 opacity-0'
                    }`}
                >
                    <div className="px-5 pb-4 pt-1 space-y-2.5">

                        {/* Merchant Order */}
                        <div className="flex items-center">
                            <span className="text-xs text-gray-400 font-medium w-32 flex-shrink-0">
                                Merchant Order
                            </span>
                            {/* Dot leader */}
                            <span className="flex-1 border-b border-dotted border-gray-200 mx-2 mb-px" />
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-gray-800 font-mono">
                                    {fullMerchantOrder}
                                </span>
                                <button
                                    onClick={() => handleCopy(fullMerchantOrder, 'Order ID')}
                                    className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-indigo-600 flex-shrink-0"
                                >
                                    {copied === 'Order ID'
                                        ? <Check size={12} className="text-green-500" />
                                        : <Copy size={12} />
                                    }
                                </button>
                            </div>
                        </div>

                        {/* Transaction ID */}
                        <div className="flex items-center">
                            <span className="text-xs text-gray-400 font-medium w-32 flex-shrink-0">
                                Transaction ID
                            </span>
                            <span className="flex-1 border-b border-dotted border-gray-200 mx-2 mb-px" />
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-gray-800 font-mono">
                                    {fullTxId}
                                </span>
                                <button
                                    onClick={() => handleCopy(fullTxId, 'Tx ID')}
                                    className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-indigo-600 flex-shrink-0"
                                >
                                    {copied === 'Tx ID'
                                        ? <Check size={12} className="text-green-500" />
                                        : <Copy size={12} />
                                    }
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};