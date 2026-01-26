import { useState } from 'react';
import { Copy, Activity, RefreshCw, QrCode, Smartphone } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const FallbackConsole = ({ onRetry }: { onRetry: () => void }) => {
    const [mode, setMode] = useState<'standard' | 'deeplink'>('standard');
    const address = "0x7A250d5630B4cF539739dF2C5dAcb4c659F2488D"; // Full mock address

    return (
        <div className="animate-in fade-in zoom-in-95 duration-500 ease-out">
            {/* Header / Notice */}
            <div className="bg-amber-50 border border-amber-100/50 rounded-2xl p-4 mb-6 flex items-start gap-4 shadow-sm">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                <div>
                    <h4 className="text-amber-950 font-bold text-sm">Connection Interrupted</h4>
                    <p className="text-amber-700/80 text-xs mt-1 leading-relaxed font-medium">
                        Don't worry. We've switched you to the direct transfer channel (Fall-back Mode).
                    </p>
                </div>
            </div>

            {/* QR Section */}
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-white p-6 pt-4 mb-6 text-center relative overflow-hidden group">
                {/* Custom Segmented Control */}
                <div className="absolute top-4 right-4 flex bg-gray-100/80 rounded-lg p-1 z-10 backdrop-blur-sm">
                    <button
                        onClick={() => setMode('standard')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-md transition-all ${mode === 'standard' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <QrCode size={12} />
                        Address Transfer
                    </button>
                    <button
                        onClick={() => setMode('deeplink')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-md transition-all ${mode === 'deeplink' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <Smartphone size={12} />
                        Mobile Deeplink
                    </button>
                </div>

                <div className="mt-12 mb-6 flex justify-center">
                    {/* Real Generated QR Code */}
                    <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-inner relative">
                        <QRCodeSVG
                            value={`ethereum:${address}`}
                            size={180}
                            level="H"
                            includeMargin={false}
                            className="rounded-lg"
                        />
                        {/* Optional Logo Overlay in QR */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1 shadow-md">
                                <div className="w-full h-full bg-indigo-600 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="text-3xl font-bold text-gray-900 tracking-tight">$20.00 <span className="text-lg text-gray-400 font-medium">USDC</span></div>
                </div>
            </div>

            {/* Address Row (Full Display) */}
            <div className="bg-white rounded-2xl border border-gray-200 p-3 pl-4 flex items-center justify-between mb-8 group cursor-pointer hover:border-indigo-500 hover:shadow-md hover:scale-[1.01] transition-all duration-300">
                <div className="w-full overflow-hidden mr-3">
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Ethereum Mainnet</div>
                    {/* Full Address Display with truncation only if absolutely necessary on tiny screens */}
                    <div className="font-mono text-gray-800 font-medium text-xs sm:text-sm break-all">
                        {address}
                    </div>
                </div>
                <button className="p-3 flex-shrink-0 bg-gray-50 rounded-xl text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <Copy size={18} />
                </button>
            </div>

            {/* Radar / Listening */}
            <div className="relative h-20 flex items-center justify-center overflow-hidden rounded-2xl bg-gray-900 text-white mb-8 shadow-inner ring-1 ring-white/10">
                {/* Radar Rings */}
                <div className="absolute w-full h-full flex items-center justify-center opacity-30">
                    <div className="absolute w-12 h-12 border border-indigo-400 rounded-full animate-radar" style={{ animationDelay: '0s' }}></div>
                    <div className="absolute w-12 h-12 border border-indigo-400 rounded-full animate-radar" style={{ animationDelay: '0.8s' }}></div>
                    <div className="absolute w-12 h-12 border border-indigo-400 rounded-full animate-radar" style={{ animationDelay: '1.6s' }}></div>
                </div>

                <div className="relative z-10 flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2 text-sm font-bold text-indigo-200">
                        <Activity size={16} className="text-green-400 animate-pulse" />
                        Listening for on-chain events...
                    </div>
                    <div className="text-[10px] text-gray-500">No manual confirmation required</div>
                </div>
            </div>

            {/* Enhanced Back Button (Bottom) */}
            <button
                onClick={onRetry}
                className="w-full py-4 bg-white border border-gray-200 rounded-2xl text-gray-600 font-bold text-sm shadow-sm hover:shadow-md hover:border-indigo-200 hover:text-indigo-600 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
                <RefreshCw size={16} />
                Select a different wallet
            </button>
        </div>
    )
}
