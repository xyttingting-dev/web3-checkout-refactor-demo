
import { useState, useEffect } from 'react';
import { X, ArrowLeft, RefreshCw, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { getWalletIcon } from './IconLibrary';

interface ConnectQrModalProps {
    walletName: string;
    walletId: string;
    onClose: () => void;
    onBack?: () => void;
}

export const ConnectQrModal = ({ walletName, walletId, onClose, onBack }: ConnectQrModalProps) => {
    const [connectStatus, setConnectStatus] = useState<'scan' | 'connecting' | 'failed'>('scan');
    const [mockUri] = useState('wc:8b3e5684-1...6612');

    // Simulate connection lifecycle for demo
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | undefined;
        if (connectStatus === 'scan') {
            // Just wait indefinitely for user simulation
        }
        return () => { if (timer) clearTimeout(timer); };
    }, [connectStatus]);

    const handleCopy = () => {
        navigator.clipboard.writeText(mockUri);
        setConnectStatus('connecting');
        setTimeout(() => setConnectStatus('failed'), 5000); // Simulate mock fail for demo robustness testing
    };

    const handleRetry = () => {
        setConnectStatus('scan');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        >
            {/* Backdrop Blur */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />

            {/* Modal Container: White Rounded Card */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white w-full max-w-[360px] rounded-3xl shadow-2xl relative z-70 overflow-hidden flex flex-col items-center pb-8"
            >
                {/* Header */}
                <div className="w-full flex items-center justify-between p-4 px-5">
                    {onBack ? (
                        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowLeft size={20} className="text-gray-500" />
                        </button>
                    ) : (
                        <div className="w-9" /> // Spacer
                    )}

                    <h3 className="text-lg font-bold text-gray-900">Connect {walletName}</h3>

                    <button onClick={onClose} className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>


                {/* Authorization Zone */}
                <div className="flex flex-col items-center justify-center w-full px-8 pt-4">

                    {/* Combined Logic with Responsive CSS Classes */}

                    {/* State: SCAN */}
                    {connectStatus === 'scan' && (
                        <>
                            {/* Desktop: QR Code (Hidden on Mobile) */}
                            <div className="hidden md:block relative group">
                                <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 relative z-10">
                                    <QRCodeSVG
                                        value={mockUri}
                                        size={240}
                                        level="M"
                                        imageSettings={{
                                            src: "https://cryptologos.cc/logos/walletconnect-logo.svg?v=026",
                                            x: undefined,
                                            y: undefined,
                                            height: 48,
                                            width: 48,
                                            excavate: true,
                                        }}
                                    />
                                    <div className="absolute inset-0 rounded-3xl bg-blue-500/10 blur-xl -z-10 animate-breathe" />
                                </div>
                            </div>

                            {/* Mobile: Blue Action Button (Hidden on Desktop) */}
                            <div className="block md:hidden w-full py-8">
                                <button
                                    onClick={handleCopy} // In real app, this would be a deep link
                                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-base shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <Smartphone className="w-5 h-5" />
                                    Open DApp Browser
                                </button>
                                <p className="text-xs text-gray-400 text-center mt-4 px-4 leading-relaxed">
                                    Deep linking to {walletName}. If nothing happens, try copying the link below.
                                </p>
                            </div>
                        </>
                    )}

                    {/* State: CONNECTING (Shared View) */}
                    {connectStatus === 'connecting' && (
                        <div className="w-[240px] h-[240px] flex flex-col items-center justify-center bg-gray-50 rounded-3xl border border-gray-100 relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center mb-4"
                                >
                                    <div className="w-10 h-10 p-1">
                                        {getWalletIcon(walletId)}
                                    </div>
                                </motion.div>
                                <span className="text-sm font-bold text-gray-800">Opening {walletName}...</span>
                            </div>
                        </div>
                    )}

                    {connectStatus === 'failed' && (
                        <div className="w-[240px] h-[240px] flex flex-col items-center justify-center bg-red-50 rounded-3xl border border-red-100">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-3">
                                <X size={24} strokeWidth={3} />
                            </div>
                            <p className="text-center text-sm font-bold text-gray-800 mb-1">Connection Failed</p>
                            <button
                                onClick={handleRetry}
                                className="mt-3 px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold shadow-sm hover:bg-gray-50"
                            >
                                <div className="flex items-center gap-1">
                                    <RefreshCw size={12} /> Retry
                                </div>
                            </button>
                        </div>
                    )}

                    {/* Footer / Instructions */}
                    <div className="mt-8 text-center space-y-3">
                        {connectStatus === 'scan' && (
                            <>
                                {/* Desktop Instruction */}
                                <p className="hidden md:block text-sm font-bold text-gray-900">Scan with your phone to connect</p>

                                {/* Copy Link (Available on both) */}
                                <button
                                    onClick={handleCopy}
                                    className="text-violet-600 text-sm font-medium hover:text-violet-700 underline underline-offset-2 flex items-center justify-center gap-1 mx-auto"
                                >
                                    <CopyLinkIcon /> Copy to Clipboard
                                </button>
                            </>
                        )}
                        {connectStatus === 'connecting' && (
                            <p className="text-sm text-gray-500">Approve connection in your wallet app</p>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const CopyLinkIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
)
