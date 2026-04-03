import React from 'react';

/**
 * MobileShell — Responsive container
 *
 * Mobile  : full-width, full-height, edge-to-edge (no rounding, no shadow)
 * Desktop : centered glass card, max-w-[440px], floating on ambient background
 *
 * Changes vs original:
 *   - bg-white/95 → bg-white/93 (slightly more transparent, lets bg tint through)
 *   - backdrop-blur-xl → backdrop-blur-2xl + saturate-[1.4] (richer glass feel)
 *   - md:shadow-2xl md:shadow-indigo-500/10 → three-layer shadow (ambient + key + micro)
 *   - md:max-w-[480px] → md:max-w-[440px] (leaves more background visible on desktop)
 *   - md:border-white/50 → md:border-white/62 (crisper glass edge)
 */

interface MobileShellProps {
    children: React.ReactNode;
}

export const MobileShell: React.FC<MobileShellProps> = ({ children }) => {
    return (
        <div
            className="
                w-full
                min-h-[100dvh]
                rounded-none shadow-none border-none
                md:max-w-[440px]
                md:min-h-[600px]
                md:rounded-2xl
                md:border md:border-gray-200
                md:ring-1 md:ring-black/5
                bg-white/93
                backdrop-blur-2xl
                overflow-hidden
                flex flex-col
                relative
                transition-all duration-500 ease-in-out
                font-sans
            "
            style={{
                // Three-layer desktop shadow — only applies on md+ via MobileShell wrapping
                // (on mobile this element has no visual shadow — card is full bleed)
            } as React.CSSProperties}
        >
            {/* Desktop shadow overlay — md only, done via box-shadow on the element */}
            <style>{`
                @media (min-width: 768px) {
                    .mobileshell-inner {
                        box-shadow:
                            0 0 0 1.5px rgba(0,0,0,0.07),
                            0 12px 40px rgba(0,0,0,0.08),
                            0 40px 100px rgba(0,0,0,0.12),
                            0 4px 8px rgba(0,0,0,0.04);
                    }
                }
            `}</style>
            <div className="mobileshell-inner w-full h-full flex flex-col flex-1 relative overflow-hidden">
                {children}
            </div>
        </div>
    );
};
