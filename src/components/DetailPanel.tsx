import type { WalletId } from '../hooks/useCheckoutState';
import { ArrowLeft, Zap, Link, ShieldCheck } from 'lucide-react';

interface DetailPanelProps {
    walletId: WalletId;
    onConfirm: (type: 'custodial' | 'web3') => void;
    onBack: () => void;
}

const WALLET_CONFIGS: Record<string, { displayName: string; payBrandName: string; color: string; textColor: string; gradient: string }> = {
    binance: {
        displayName: 'Binance',
        payBrandName: 'Binance Pay',
        color: 'bg-[#FCD535]',
        textColor: 'text-black',
        gradient: 'from-yellow-400 to-yellow-500'
    },
    okx: {
        displayName: 'OKX',
        payBrandName: 'OKX Pay',
        color: 'bg-black',
        textColor: 'text-white',
        gradient: 'from-gray-700 to-black'
    },
    kucoin: {
        displayName: 'KuCoin',
        payBrandName: 'KuCoin Pay',
        color: 'bg-[#24AE8F]',
        textColor: 'text-white',
        gradient: 'from-teal-400 to-teal-600'
    },
    gate: {
        displayName: 'Gate.io',
        payBrandName: 'GatePay',
        color: 'bg-[#F5222D]',
        textColor: 'text-white',
        gradient: 'from-red-400 to-red-600'
    },
    // Fallback for others
    default: {
        displayName: 'Wallet',
        payBrandName: 'Instant Pay',
        color: 'bg-gray-900',
        textColor: 'text-white',
        gradient: 'from-gray-700 to-gray-900'
    }
};

export const DetailPanel = ({ walletId, onConfirm, onBack }: DetailPanelProps) => {
    const config = WALLET_CONFIGS[walletId] || WALLET_CONFIGS.default;
    const initial = config.displayName[0];

    return (
        <div className="animate-in slide-in-from-bottom-5 fade-in duration-500">
            <div className="flex items-center gap-3 mb-8">
                <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <ArrowLeft size={24} />
                </button>
                <span className="text-gray-400 text-sm font-medium">Back to selection</span>
            </div>

            <div className="flex items-center gap-4 mb-8">
                <div className={`w-16 h-16 rounded-2xl ${config.color} ${config.textColor} flex items-center justify-center text-3xl font-bold shadow-lg animate-float`}>
                    {initial}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{config.displayName}</h2>
                    <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <ShieldCheck size={14} />
                        Official Partner
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {/* Custodial Option (Priority) */}
                <button
                    onClick={() => onConfirm('custodial')}
                    className="w-full relative overflow-hidden flex items-center justify-between p-5 bg-gray-900 rounded-2xl shadow-xl border border-gray-800 group hover:shadow-2xl transition-all hover:scale-[1.01]"
                >
                    {/* Glow Effect */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-3xl -mr-10 -mt-10 rounded-full group-hover:bg-indigo-500/30 transition-all"></div>

                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-yellow-400">
                            <Zap size={24} fill="currentColor" />
                        </div>
                        <div className="text-left">
                            <div className="text-white font-bold text-lg">{config.payBrandName}</div>
                            <div className="text-gray-400 text-sm font-medium">Use spot balance · Instant · No Gas</div>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <div className={`px-3 py-1 bg-gradient-to-r ${config.gradient} text-white text-xs font-bold rounded-full shadow-lg opacity-90`}>
                            RECOMMENDED
                        </div>
                    </div>
                </button>

                {/* Web3 Option */}
                <button
                    onClick={() => onConfirm('web3')}
                    className="w-full flex items-center gap-4 p-5 bg-white border-2 border-gray-100 rounded-2xl hover:border-indigo-500/30 hover:shadow-lg transition-all text-gray-400/80 hover:text-gray-900 group"
                >
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <Link size={24} />
                    </div>
                    <div className="text-left">
                        <div className="text-gray-900 font-bold text-lg">Web3 Wallet Connect</div>
                        <div className="text-gray-500 text-sm">On-chain transaction · Self-custody</div>
                    </div>
                </button>
            </div>
        </div>
    );
};
