import React, { useState, useEffect } from 'react';
import { Smartphone, QrCode, Download, Copy, ScanLine } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { ErrorCard } from './ErrorCard';
import { NetworkSelector } from './NetworkSelector';

interface FallbackConsoleProps {
    onRetry: () => void;
    errorCode?: string;
}

// Real Asset Icons (as requested)
const ICONS = {
    eth: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=026",
    bsc: "https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=026",
    tron: "https://cryptologos.cc/logos/tron-trx-logo.svg?v=026",
    polygon: "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=026",
    avax: "https://cryptologos.cc/logos/avalanche-avax-logo.svg?v=026",
    imtoken: "https://cdn.worldvectorlogo.com/logos/imtoken.svg",
};

const NETWORKS = [
    { id: 'tron', name: 'TRON', icon: ICONS.tron },
    { id: 'eth', name: 'Ethereum', icon: ICONS.eth },
    { id: 'polygon', name: 'Polygon', icon: ICONS.polygon },
    { id: 'bsc', name: 'BSC', icon: ICONS.bsc },
    { id: 'avax', name: 'Avalanche', icon: ICONS.avax },
];

export const FallbackConsole: React.FC<FallbackConsoleProps> = ({ onRetry, errorCode = "00410" }) => {
    const [activeTab, setActiveTab] = useState<'dapp' | 'address'>('dapp');
    const [selectedNet, setSelectedNet] = useState(NETWORKS[0]);
    const [addressStage, setAddressStage] = useState<'selecting' | 'confirmed'>('selecting');
    const [timeLeft, setTimeLeft] = useState(900); // 15:00

    useEffect(() => {
        const timer = setInterval(() => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="w-full flex flex-col h-full animate-slide-up relative space-y-5">

            {/* 1. Error Card (Self-managed retry logic) */}
            <ErrorCard code={errorCode} />

            {/* 2. Navigation Tabs */}
            <div className="space-y-4">
                <div className="flex items-center gap-4 px-2">
                    <div className="flex-1 h-px bg-gray-100"></div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Other Solutions</span>
                    <div className="flex-1 h-px bg-gray-100"></div>
                </div>

                <div className="flex bg-gray-100/80 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('dapp')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 ${activeTab === 'dapp' ? 'bg-white shadow-sm text-indigo-600 scale-[1.02]' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <QrCode size={14} /> Dapp Pay
                    </button>
                    <button
                        onClick={() => setActiveTab('address')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 ${activeTab === 'address' ? 'bg-white shadow-sm text-indigo-600 scale-[1.02]' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Smartphone size={14} /> Address Transfer
                    </button>
                </div>
            </div>

            {/* 3. Content Area */}
            <div className="flex-1">
                {activeTab === 'dapp' ? (
                    // --- Plan B: Dapp Pay ---
                    <div className="flex flex-col items-center justify-center py-4 animate-in fade-in zoom-in-95 duration-300">
                        <div className="relative group p-6 bg-white border border-gray-100 rounded-[24px] shadow-xl shadow-indigo-500/5 mb-4">
                            <QRCodeSVG
                                value={`imtoken:${selectedNet.id}`}
                                size={160}
                                level="H"
                                className="rounded-xl opacity-90"
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-11 h-11 bg-white rounded-full p-0.5 shadow-md border border-gray-100 flex items-center justify-center">
                                    <svg width="32" height="32" viewBox="0 0 40 40" fill="none" className="w-full h-full">
                                        <rect width="40" height="40" rx="20" fill="white" />
                                        <path d="M20 10C14.5 10 10 14.5 10 20C10 25.5 14.5 30 20 30C25.5 30 30 25.5 30 20C30 18 29.5 16.5 28.5 15" stroke="#098DE1" strokeWidth="3" strokeLinecap="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 font-medium text-center mt-4 leading-relaxed">
                            Scan with <span className="text-gray-800 font-bold">imToken App</span>
                            <br />via WalletConnect
                        </p>
                    </div>
                ) : (
                    // --- Plan C: Address Transfer ---
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">

                        {addressStage === 'selecting' ? (
                            // Stage A: Network Selection
                            <NetworkSelector
                                networks={NETWORKS}
                                onGenerate={(chainId) => {
                                    const net = NETWORKS.find(n => n.id === chainId);
                                    if (net) setSelectedNet(net);
                                    setAddressStage('confirmed');
                                }}
                            />
                        ) : (
                            // Stage B: Collect Address Display
                            <div className="pt-2 animate-in slide-in-from-bottom-2 fade-in duration-500">
                                <div className="flex justify-between items-baseline mb-2 px-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Collect Address</span>
                                    <div className="flex items-center gap-1.5 text-orange-500 font-mono text-xs font-bold bg-orange-50 px-2 py-0.5 rounded-md">
                                        <span>⏱</span> {formatTime(timeLeft)}
                                    </div>
                                </div>

                                <div className="bg-white border rounded-2xl shadow-sm overflow-hidden group hover:border-indigo-300 transition-colors duration-300">
                                    <div className="p-6 bg-gray-50/50 flex flex-col gap-1.5">
                                        <div className="text-sm font-mono font-bold text-gray-800 break-all select-all">
                                            0x71C...3A2b
                                        </div>
                                        <div className="text-[10px] text-gray-400 leading-snug">
                                            Only send USDT (<strong className="text-gray-600">{
                                                selectedNet.id === 'tron' ? 'TRC20' :
                                                    selectedNet.id === 'eth' ? 'ERC20' :
                                                        selectedNet.name
                                            }</strong>) to this address.
                                        </div>
                                    </div>

                                    {/* Toolbox */}
                                    <div className="flex border-t border-gray-100 divide-x divide-gray-100 bg-white">
                                        <button className="flex-1 py-3 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors group/btn">
                                            <Copy size={14} className="text-gray-400 group-hover/btn:text-indigo-600" />
                                            <span className="text-[10px] font-bold text-gray-500 group-hover/btn:text-indigo-600">Copy</span>
                                        </button>
                                        <button className="flex-1 py-3 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors group/btn">
                                            <Download size={14} className="text-gray-400 group-hover/btn:text-indigo-600" />
                                            <span className="text-[10px] font-bold text-gray-500 group-hover/btn:text-indigo-600">Download</span>
                                        </button>
                                        <button className="flex-1 py-3 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors group/btn">
                                            <ScanLine size={14} className="text-gray-400 group-hover/btn:text-indigo-600" />
                                            <span className="text-[10px] font-bold text-gray-500 group-hover/btn:text-indigo-600">Show QR</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 4. Footer Link (Global Reset) */}
            <div className="mt-auto pt-4 pb-2 text-center">
                <button
                    onClick={onRetry}
                    className="text-sm font-medium text-slate-600 hover:text-indigo-600 underline decoration-slate-300 hover:decoration-indigo-500 underline-offset-4 transition-all hover:opacity-80 active:scale-95"
                >
                    Choose another wallet
                </button>
            </div>
        </div>
    );
};
