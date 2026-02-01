import { QRCodeSVG } from 'qrcode.react';
import { ArrowRight, Loader2 } from 'lucide-react';
import type { WalletId } from '../hooks/useCheckoutState';
import { getWalletIcon } from './IconLibrary';

interface ExchangePanelProps {
    walletId: WalletId;
    onConfirm: () => void;
    isProcessing?: boolean;
}

export const ExchangePanel = ({ walletId, onConfirm, isProcessing = false }: ExchangePanelProps) => {

    return (
        <div className="flex flex-col items-center animate-in fade-in slide-in-from-right-4 duration-300 h-full">

            <div className="w-full bg-blue-50/50 rounded-xl p-3 border border-blue-100 mb-6 text-center">
                <p className="text-xs text-gray-500">Scan to pay with Binance App<br />The currency is confirmed in your Binance spot wallet.</p>
            </div>

            <div className="relative mb-8 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                <QRCodeSVG
                    value={`bonuspay://pay/${walletId}/order/123456`}
                    size={160}
                    level={"H"}
                    includeMargin={false}
                />

                {/* Center Logo Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 bg-white rounded-lg p-1 shadow-md flex items-center justify-center">
                        {/* Force Binance Logo if walletId includes binance, else generic */}
                        {walletId.includes('binance') ? getWalletIcon('binance') : getWalletIcon(walletId)}
                    </div>
                </div>
            </div>

            <div className="mt-auto w-full">
                <button
                    onClick={onConfirm}
                    disabled={isProcessing}
                    className="w-full bg-[#F3BA2F] text-black hover:bg-[#E2AB24] py-4 rounded-xl font-bold text-sm shadow-xl shadow-yellow-500/10 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="animate-spin" size={16} />
                            <span>Confirming...</span>
                        </>
                    ) : (
                        <>
                            <span>Confirm Payment</span>
                            <ArrowRight size={16} />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
