import { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import { AddressTransferPanel, type TransferStatus } from './AddressTransferPanel';
import { ErrorCard } from './ErrorCard';

/**
 * FallbackConsole — #017 + #025 related changes
 *
 * Changes vs original:
 *   - ErrorCard now uses new design (Back button, black, orange wash)
 *   - ErrorCard onBack prop → reset() back to home
 *   - DApp Pay tab: Mobile shows "Open DApp Browser" button (unchanged)
 *                   Desktop shows QR Code for scanning from mobile wallet
 *   - QR code is a placeholder SVG; in production, generate from WalletConnect URI
 */

interface FallbackConsoleProps {
    onRetry: () => void;
    onDappPay?: () => void;
}

// Simple responsive hook
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' ? window.innerWidth < 768 : false
    );
    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);
    return isMobile;
}

// QR placeholder SVG — in production replace src with WalletConnect URI QR
const QrPlaceholder = () => (
    <div className="flex flex-col items-center gap-3 py-4">
        <div
            className="p-3 bg-white rounded-xl"
            style={{ border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
        >
            <svg width="140" height="140" viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
                <rect width="140" height="140" fill="white"/>
                {/* Finder TL */}
                <rect x="8" y="8" width="34" height="34" rx="3" fill="#111827"/>
                <rect x="13" y="13" width="24" height="24" rx="1.5" fill="white"/>
                <rect x="18" y="18" width="14" height="14" rx="1" fill="#111827"/>
                {/* Finder TR */}
                <rect x="98" y="8" width="34" height="34" rx="3" fill="#111827"/>
                <rect x="103" y="13" width="24" height="24" rx="1.5" fill="white"/>
                <rect x="108" y="18" width="14" height="14" rx="1" fill="#111827"/>
                {/* Finder BL */}
                <rect x="8" y="98" width="34" height="34" rx="3" fill="#111827"/>
                <rect x="13" y="103" width="24" height="24" rx="1.5" fill="white"/>
                <rect x="18" y="108" width="14" height="14" rx="1" fill="#111827"/>
                {/* Data modules */}
                <rect x="50" y="8" width="6" height="6" fill="#111827"/><rect x="62" y="8" width="6" height="6" fill="#111827"/><rect x="74" y="8" width="6" height="6" fill="#111827"/><rect x="86" y="8" width="6" height="6" fill="#111827"/>
                <rect x="50" y="20" width="6" height="6" fill="#111827"/><rect x="68" y="20" width="6" height="6" fill="#111827"/><rect x="80" y="20" width="6" height="6" fill="#111827"/>
                <rect x="56" y="32" width="6" height="6" fill="#111827"/><rect x="74" y="32" width="6" height="6" fill="#111827"/>
                <rect x="8" y="50" width="6" height="6" fill="#111827"/><rect x="20" y="50" width="6" height="6" fill="#111827"/><rect x="50" y="50" width="6" height="6" fill="#111827"/><rect x="68" y="50" width="6" height="6" fill="#111827"/><rect x="86" y="50" width="6" height="6" fill="#111827"/><rect x="104" y="50" width="6" height="6" fill="#111827"/><rect x="126" y="50" width="6" height="6" fill="#111827"/>
                <rect x="8" y="62" width="6" height="6" fill="#111827"/><rect x="50" y="62" width="6" height="6" fill="#111827"/><rect x="74" y="62" width="6" height="6" fill="#111827"/><rect x="98" y="62" width="6" height="6" fill="#111827"/><rect x="120" y="62" width="6" height="6" fill="#111827"/>
                <rect x="14" y="74" width="6" height="6" fill="#111827"/><rect x="32" y="74" width="6" height="6" fill="#111827"/><rect x="56" y="74" width="6" height="6" fill="#111827"/><rect x="80" y="74" width="6" height="6" fill="#111827"/><rect x="110" y="74" width="6" height="6" fill="#111827"/>
                <rect x="8" y="86" width="6" height="6" fill="#111827"/><rect x="50" y="86" width="6" height="6" fill="#111827"/><rect x="68" y="86" width="6" height="6" fill="#111827"/><rect x="98" y="86" width="6" height="6" fill="#111827"/>
                <rect x="50" y="98" width="6" height="6" fill="#111827"/><rect x="68" y="98" width="6" height="6" fill="#111827"/><rect x="92" y="98" width="6" height="6" fill="#111827"/><rect x="116" y="98" width="6" height="6" fill="#111827"/>
                <rect x="56" y="110" width="6" height="6" fill="#111827"/><rect x="80" y="110" width="6" height="6" fill="#111827"/><rect x="110" y="110" width="6" height="6" fill="#111827"/>
                <rect x="50" y="122" width="6" height="6" fill="#111827"/><rect x="74" y="122" width="6" height="6" fill="#111827"/><rect x="104" y="122" width="6" height="6" fill="#111827"/><rect x="126" y="122" width="6" height="6" fill="#111827"/>
                {/* Center logo */}
                <rect x="56" y="56" width="28" height="28" rx="5" fill="white"/>
                <rect x="59" y="59" width="22" height="22" rx="4" fill="#6366f1"/>
                <text x="70" y="75" textAnchor="middle" fontSize="11" fontWeight="900" fill="white" fontFamily="serif">B</text>
            </svg>
        </div>
        <p className="text-xs font-semibold text-gray-500 text-center">
            Scan with your mobile wallet to pay
        </p>
        <p
            className="text-[10px] text-gray-400 font-mono text-center px-4 py-1.5 rounded-lg"
            style={{ background: '#f9fafb', border: '1px solid #f3f4f6' }}
        >
            pay.bonuspay.com/checkout?order=B50892...
        </p>
        <p className="text-[10px] text-gray-400 text-center leading-relaxed px-2">
            Open your wallet app → scan this code → confirm payment
        </p>
    </div>
);

export const FallbackConsole = ({ onRetry, onDappPay }: FallbackConsoleProps) => {
    const [activeTab, setActiveTab]         = useState<'dapp' | 'address'>('dapp');
    const [transferStatus, setTransferStatus] = useState<TransferStatus>('WAITING');
    const [showExitAlert, setShowExitAlert]  = useState(false);
    const isMobile = useIsMobile();

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (transferStatus === 'PARTIAL_PAID') {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        if (transferStatus === 'PARTIAL_PAID') {
            window.addEventListener('beforeunload', handleBeforeUnload);
        }
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [transferStatus]);

    const handleTabChange = (tab: 'dapp' | 'address') => {
        if (transferStatus === 'PARTIAL_PAID') { setShowExitAlert(true); return; }
        setActiveTab(tab);
    };

    return (
        <>
            {/* Partial-pay navigation guard */}
            {transferStatus === 'PARTIAL_PAID' && (
                <div
                    className="fixed inset-0 bg-transparent z-[999] cursor-not-allowed"
                    onClick={(e) => { e.stopPropagation(); setShowExitAlert(true); }}
                />
            )}

            {/* Exit alert modal */}
            {showExitAlert && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[24px] shadow-2xl max-w-sm w-full p-6 text-center animate-in zoom-in-95 duration-200 border border-gray-100 font-sans">
                        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                            <ShieldAlert size={28} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Attention: Partial Payment Detected</h3>
                        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                            We detected a partial payment of{' '}
                            <span className="text-gray-900 font-bold">15.00 USDT</span>.
                            Please complete the remaining{' '}
                            <span className="text-gray-900 font-bold">5.00 USDT</span>.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => setShowExitAlert(false)}
                                className="w-full bg-indigo-600 text-white rounded-2xl h-[56px] font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                            >
                                Complete Payment
                            </button>
                            <button
                                onClick={() => { setShowExitAlert(false); onRetry(); }}
                                className="text-gray-400 text-xs font-semibold hover:text-gray-600 transition-colors"
                            >
                                Exit Anyway
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main console */}
            <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 font-sans antialiased relative z-[1000]">



                {/* ErrorCard — with new Back button design */}
                {transferStatus !== 'PARTIAL_PAID' && (
                    <div className="px-4 pt-3">
                        <ErrorCard code="00410" onBack={onRetry} />
                    </div>
                )}

                {/* Tabs */}
                <div className="border-b border-gray-100">
                    <div className="flex">
                        <button
                            onClick={() => handleTabChange('dapp')}
                            className={`flex-1 py-3 text-xs font-bold transition-colors border-b-2 ${
                                activeTab === 'dapp'
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            DApp Pay
                        </button>
                        <button
                            onClick={() => handleTabChange('address')}
                            className={`flex-1 py-3 text-xs font-bold transition-colors border-b-2 ${
                                activeTab === 'address'
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            Address Transfer
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                    {activeTab === 'dapp' ? (
                        isMobile ? (
                            /* ── Mobile: button CTA ── */
                            <div className="flex flex-col items-center justify-center h-full space-y-4">
                                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-2">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
                                    </svg>
                                </div>
                                <p className="text-xs text-gray-500 text-center px-4">
                                    Use your wallet's internal browser to scan or navigate to complete payment.
                                </p>
                                <button
                                    onClick={onDappPay}
                                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 mt-2"
                                >
                                    Open DApp Browser
                                </button>
                            </div>
                        ) : (
                            /* ── Desktop: QR Code ── */
                            <QrPlaceholder />
                        )
                    ) : (
                        <AddressTransferPanel onStatusChange={setTransferStatus} />
                    )}
                </div>
            </div>
        </>
    );
};
