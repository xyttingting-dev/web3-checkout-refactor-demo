import { useConnectors } from 'wagmi';
import { Zap } from 'lucide-react';
import { Tooltip } from 'antd';
import clsx from 'clsx';
import type { WalletId } from '../hooks/useCheckoutState';

export const SmartDock = ({ onSelect }: { onSelect: (id: WalletId) => void }) => {
    const connectors = useConnectors();

    // Filter detected injected connectors
    let detectedConnectors = connectors.filter(c => c.type === 'injected' && c.icon);

    // --- MOCK LOGIC FOR DEMO ---
    if (detectedConnectors.length === 0) {
        const mockBinance = {
            uid: 'mock-binance',
            name: 'Binance',
            icon: 'https://seeklogo.com/images/B/binance-coin-bnb-logo-CD94CC6D31-seeklogo.com.png',
            type: 'injected'
        };
        const mockMetaMask = {
            uid: 'mock-metamask',
            name: 'MetaMask',
            icon: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
            type: 'injected'
        };
        detectedConnectors = [mockBinance, mockMetaMask] as any;
    }

    const uniqueConnectors = Array.from(new Set(detectedConnectors.map(c => c.name)))
        .map(name => detectedConnectors.find(c => c.name === name));

    if (uniqueConnectors.length === 0) return null;

    return (
        <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
            {/* Compact Header */}
            <div className="flex items-center gap-1.5 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">
                <Zap size={10} className="text-amber-500 fill-amber-500" />
                Detected on your device
            </div>

            {/* Icon Row */}
            <div className="flex items-center gap-4 pl-1">
                {uniqueConnectors.map((connector) => (
                    connector && (
                        <Tooltip key={connector.uid} title={connector.name} color="#1f1f1f" placement="bottom">
                            <button
                                onClick={() => {
                                    // Mapping logic from connector name to WalletId
                                    let id: WalletId | undefined;
                                    if (connector.name.toLowerCase().includes('binance')) id = 'binance';
                                    else if (connector.name.toLowerCase().includes('metamask')) id = 'metamask';

                                    if (id) onSelect(id);
                                }}
                                className={clsx(
                                    "group relative flex items-center justify-center p-0 transition-all duration-300",
                                    "hover:-translate-y-1"
                                )}
                            >
                                {/* Icon Container (48px) */}
                                <div className={clsx(
                                    "relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100/50",
                                    "bg-white group-hover:shadow-md transition-all duration-300",
                                    // Specific colors for recognized wallets (optional, or stick to clean white)
                                    connector.name.includes('Binance') ? "bg-[#FCD535] border-[#FCD535]" :
                                        connector.name.includes('MetaMask') ? "bg-[#F6851B] border-[#F6851B]" : "bg-white border-gray-100/50"
                                )}>

                                    {/* Main Logo */}
                                    {connector.icon ? (
                                        <img src={connector.icon} alt={connector.name} className="w-6 h-6 object-contain" />
                                    ) : (
                                        <span className={clsx(
                                            "font-bold text-lg",
                                            connector.name.includes('Binance') ? "text-black" :
                                                connector.name.includes('MetaMask') ? "text-white" : "text-indigo-500"
                                        )}>
                                            {connector.name[0]}
                                        </span>
                                    )}
                                </div>

                                {/* Status Badge (Absolute Positioned) */}
                                <div className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center bg-white rounded-full p-0.5 shadow-sm border border-gray-50">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                </div>
                            </button>
                        </Tooltip>
                    )
                ))}
            </div>
        </div>
    )
}
