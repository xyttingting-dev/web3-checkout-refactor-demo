
import React from 'react';

interface MobileShellProps {
    children: React.ReactNode;
}

/**
 * Responsive Container Component
 * 
 * Architecture:
 * - Mobile: Full-width, edge-to-edge, dynamic viewport height (dvh).
 * - Desktop: Centered card layout with shadow and rounded corners.
 */
export const MobileShell: React.FC<MobileShellProps> = ({ children }) => {
    return (
        <div className="
            w-full 
            min-h-[100dvh]
            rounded-none shadow-none border-none
            md:max-w-[480px] 
            md:min-h-[600px]
            md:rounded-2xl 
            md:shadow-2xl 
            md:shadow-indigo-500/10
            md:border 
            md:border-white/50 
            md:ring-1 
            md:ring-gray-100
            bg-white/95 
            backdrop-blur-xl 
            overflow-hidden 
            flex 
            flex-col 
            relative 
            transition-all 
            duration-500 
            ease-in-out 
            font-sans
        ">
            {children}
        </div>
    );
};
