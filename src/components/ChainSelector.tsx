
import { useAccount, useBalance } from 'wagmi';
import { getNetworkIcon } from './IconLibrary';

export const ChainSelector = ({ onSelect }: { onSelect: (chainId: string) => void }) => {
    const { address } = useAccount();

    // Example: Read ETH Balance (Mainnet)
    const { data: ethBalance } = useBalance({
        address: address,
    });

    // Mock/Real Hybrid Data
    const chains = [
        {
            id: 'eth',
            name: 'Ethereum',
            type: 'EVM',
            // If connected to ETH and has balance, show it, otherwise Fallback for demo
            balance: ethBalance ? `${(Number(ethBalance.value) / (10 ** ethBalance.decimals)).toFixed(4)} ${ethBalance.symbol}` : '2,045.00 USDT',
            time: '~ 18s'
        },
        { id: 'bsc', name: 'BNB Smart Chain', type: 'EVM', balance: '450.00 USDT', time: '~ 3s' },
        { id: 'polygon', name: 'Polygon', type: 'EVM', balance: '128.50 USDT', time: '~ 2s' },
        { id: 'tron', name: 'TRON (TRC20)', type: 'TRON', balance: '1,200.00 USDT', time: '~ 1s' },
        { id: 'avax', name: 'Avalanche', type: 'EVM', balance: '0.00 USDT', time: '~ 1s' },
    ];

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-sm font-bold text-gray-900">Select Payment Network</h3>

            <div className="space-y-2">
                {chains.map((chain) => (
                    <button
                        key={chain.id}
                        onClick={() => onSelect(chain.id)}
                        className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 flex items-center justify-center">
                                {getNetworkIcon(chain.id)}
                            </div>
                            <div className="text-left">
                                <span className="block font-bold text-sm text-gray-900">{chain.name}</span>
                                <span className="block text-[10px] text-gray-400 font-medium font-mono">Bal: {chain.balance}</span>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="flex items-center gap-1.5 justify-end">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                <span className="text-[10px] text-gray-400 font-medium">{chain.time}</span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}
