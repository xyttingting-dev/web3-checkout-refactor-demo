import React from 'react';

/**
 * Merchant Logo Component
 * 
 * Replace this component's content to update the merchant brand identity.
 * Recommended size: 56x56px (w-14 h-14 equivalent)
 */
export const MerchantLogo: React.FC = () => {
    return (
        <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 shadow-xl p-1 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-30"></div>
            {/* Inner Logo Placeholder */}
            <div className="w-full h-full bg-white/90 rounded-lg flex items-center justify-center shadow-inner relative z-10">
                <span className="font-bold text-gray-400 text-[10px]">BP</span>
            </div>
        </div>
    );
};
