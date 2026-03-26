import React, { useState } from 'react';
import { Unplug } from 'lucide-react';

/**
 * ErrorCard — #017
 *
 * Changes vs original:
 *   - bg-orange-50 flat fill → white + 135° orange wash overlay (精致感)
 *   - border-orange-100 → border-left:3px orange/50 accent + full border orange/12
 *   - shadow-sm → three-layer shadow (ambient orange + key + inset top)
 *   - icon: bg-white/80 rounded-full → orange tint square rounded-lg
 *   - code badge: plain white → orange-tinted background
 *   - button: "Retry" orange outline → "Back" black fill, always visible
 *   - layout: align-items:center single row, no wrapping
 */

interface ErrorCardProps {
    code?: string;
    onBack?: () => void;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({
    code = '00410',
    onBack,
}) => {
    const [isLeaving, setIsLeaving] = useState(false);

    const handleBack = () => {
        setIsLeaving(true);
        setTimeout(() => {
            setIsLeaving(false);
            onBack?.();
        }, 200);
    };

    return (
        <div
            className="w-full mb-4 overflow-hidden relative"
            style={{
                background: 'white',
                border: '1px solid rgba(234,88,12,0.12)',
                borderLeft: '3px solid rgba(234,88,12,0.50)',
                borderRadius: 10,
                boxShadow: [
                    '0 1px 3px rgba(234,88,12,0.08)',
                    '0 4px 12px rgba(234,88,12,0.06)',
                    'inset 0 1px 0 rgba(255,255,255,0.9)',
                ].join(', '),
            }}
        >
            {/* Orange wash overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'linear-gradient(135deg, rgba(255,247,237,0.65) 0%, rgba(255,255,255,0) 55%)',
                    borderRadius: 'inherit',
                }}
            />

            {/* Content row */}
            <div
                className="relative z-10 flex items-center justify-between gap-2.5"
                style={{ padding: '11px 12px 11px 11px' }}
            >
                {/* Icon */}
                <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                        padding: 5,
                        background: 'rgba(234,88,12,0.08)',
                        border: '1px solid rgba(234,88,12,0.12)',
                        borderRadius: 8,
                        color: '#ea580c',
                    }}
                >
                    <Unplug size={13} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                    {/* Title + code badge on same row */}
                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                        <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
                            Connection Interrupted
                        </span>
                        <span
                            className="text-[10px] font-semibold font-mono flex-shrink-0"
                            style={{
                                background: 'rgba(234,88,12,0.07)',
                                border: '1px solid rgba(234,88,12,0.14)',
                                padding: '1px 6px',
                                borderRadius: 4,
                                color: '#9a3412',
                            }}
                        >
                            {code}
                        </span>
                    </div>
                    <span className="text-[11px] text-gray-500 leading-tight">
                        Wallet connect timeout.
                    </span>
                </div>

                {/* ✅ Back button — black by default, always visible */}
                <button
                    onClick={handleBack}
                    disabled={isLeaving}
                    className="flex-shrink-0 inline-flex items-center justify-center gap-1.5 font-bold transition-all active:scale-95"
                    style={{
                        padding: '7px 12px',
                        borderRadius: 8,
                        background: isLeaving ? '#374151' : '#111827',
                        border: 'none',
                        color: 'white',
                        fontSize: 11,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                    }}
                >
                    {/* Back arrow */}
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"/>
                    </svg>
                    Back
                </button>
            </div>
        </div>
    );
};
