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
            {/* Shopify Logo */}
            <div className="w-full h-full bg-[#96bf48] rounded-lg flex items-center justify-center shadow-inner relative z-10">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.5 7.5C20.5 7.5 20.3 5.8 18.8 5.8C18.7 5.8 18.6 5.8 18.5 5.8C18.4 5.3 18.1 4.8 17.6 4.3C16.8 3.5 15.7 3.1 14.5 3.1H14.4C14.3 3 14.2 2.9 14.1 2.8C13.5 2.2 12.7 2 12 2C9.8 2 7.8 3.8 7 6.8C5.7 7.2 4.8 7.5 4.7 7.5C4.2 7.7 4.1 7.7 4 8.2C4 8.6 2 26.5 2 26.5L21.5 30L30 27.8C30 27.8 20.5 7.5 20.5 7.5ZM17.5 6.1C17.2 6.2 16.8 6.3 16.4 6.4V6.2C16.4 5.5 16.3 4.9 16.1 4.4C16.8 4.6 17.3 5.2 17.5 6.1ZM15.4 6.7C14.6 6.9 13.7 7.2 12.8 7.4C13 6.5 13.5 5.7 14.1 5.2C14.3 5 14.5 4.9 14.8 4.8C15.1 5.3 15.3 5.9 15.4 6.7ZM14.5 3.6C14.8 3.6 15 3.7 15.3 3.8C15 4 14.7 4.2 14.4 4.5C13.6 5.2 13 6.4 12.8 7.7L9.5 8.6C10.2 5.9 12.1 3.6 14.5 3.6Z" fill="white" />
                    <path d="M18.8 5.8C18.7 5.8 18.6 5.8 18.5 5.8C18.4 5.3 18.1 4.8 17.6 4.3C16.8 3.5 15.7 3.1 14.5 3.1H14.4V30L30 27.8C30 27.8 20.5 7.5 20.5 7.5C20.5 7.5 20.3 5.8 18.8 5.8Z" fill="white" fillOpacity="0.3" />
                </svg>
            </div>
        </div>
    );
};
