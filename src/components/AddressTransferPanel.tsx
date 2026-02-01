import { useState, useRef, useLayoutEffect } from 'react';
import { Copy, Download, QrCode, Check } from 'lucide-react';
import { getNetworkIcon } from './IconLibrary';

interface AddressTransferPanelProps { }

export const AddressTransferPanel = ({ }: AddressTransferPanelProps) => {
    const [selectedChain, setSelectedChain] = useState<string | null>(null);
    const [addressGenerated, setAddressGenerated] = useState(false);
    const [copied, setCopied] = useState(false);

    const chains = [
        { id: 'avax', name: 'Avalanche', protocol: 'avalanche' },
        { id: 'bsc', name: 'BSC', protocol: 'bep20' },
        { id: 'tron', name: 'TRON', protocol: 'trc20' },
        { id: 'polygon', name: 'Polygon', protocol: 'polygon' },
        { id: 'eth', name: 'Ethereum', protocol: 'erc20' },
    ];

    const handleGenerate = () => {
        setAddressGenerated(true);
    };

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };


    // Use useLayoutEffect to ensure height adjusts correctly if needed, though auto height usually works
    // The key here is proper CSS for text wrapping

    return (
        <div className="flex flex-col h-full space-y-4 font-sans antialiased">

            {!addressGenerated ? (
                <>
                    {/* Step 1: Network Selection */}
                    <div className="space-y-3">
                        <label className="text-xs font-medium text-gray-400">Select Network</label>
                        <div className="grid grid-cols-2 gap-2">
                            {chains.map((chain) => (
                                <button
                                    key={chain.id}
                                    onClick={() => setSelectedChain(chain.id)}
                                    className={`p-3 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${selectedChain === chain.id
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    {selectedChain === chain.id && <Check size={14} />}
                                    <div className="w-4 h-4 flex items-center justify-center">
                                        {getNetworkIcon(chain.id)}
                                    </div>
                                    {chain.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Step 2: CTA */}
                    <div className="pt-4">
                        <button
                            onClick={handleGenerate}
                            disabled={!selectedChain}
                            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Generate Address
                        </button>
                    </div>
                </>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-4">
                    {/* Step 3: Address Display */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-[11px] font-medium text-gray-400">Deposit Address</label>
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                                {chains.find(c => c.id === selectedChain)?.protocol}
                            </span>
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 h-auto min-h-[4rem] flex items-center justify-center">
                            <span className="font-mono text-sm text-gray-900 font-semibold leading-relaxed text-center break-all whitespace-normal w-full">
                                {selectedChain === 'tron' ? 'T9yD14Nj9...j29s' : '0x71C...9A23'}
                            </span>
                        </div>
                    </div>

                    <div className="bg-orange-50 text-orange-800 p-3 rounded-xl text-[11px] leading-relaxed text-center border border-orange-100">
                        Only send <strong>USDT ({chains.find(c => c.id === selectedChain)?.protocol.toUpperCase()})</strong> to this address.
                    </div>

                    {/* Step 4: Toolbox */}
                    <div className="flex justify-around pt-2">
                        <button onClick={handleCopy} className="flex flex-col items-center gap-1.5 group">
                            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                            </div>
                            <span className="text-[10px] font-medium text-gray-400 group-hover:text-indigo-600">Copy</span>
                        </button>
                        <button className="flex flex-col items-center gap-1.5 group">
                            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                <Download size={18} />
                            </div>
                            <span className="text-[10px] font-medium text-gray-400 group-hover:text-indigo-600">Save Image</span>
                        </button>
                        <button className="flex flex-col items-center gap-1.5 group">
                            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                <QrCode size={18} />
                            </div>
                            <span className="text-[10px] font-medium text-gray-400 group-hover:text-indigo-600">QR Code</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
