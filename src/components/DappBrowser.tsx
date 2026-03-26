import { ExternalLink, QrCode, ArrowLeft } from 'lucide-react';
import { getWalletIcon } from './IconLibrary';

// Local wallet list (WalletGrid no longer exports ALL_WALLETS)
const WALLET_LIST = [
    { id: 'metamask',      name: 'MetaMask'        },
    { id: 'walletconnect', name: 'WalletConnect'   },
    { id: 'binance',       name: 'Binance Wallet'  },
    { id: 'okx',           name: 'OKX Wallet'      },
    { id: 'bitget',        name: 'Bitget Wallet'   },
    { id: 'trust',         name: 'Trust Wallet'    },
    { id: 'coinbase',      name: 'Coinbase Wallet' },
    { id: 'imtoken',       name: 'imToken'         },
    { id: 'tokenpocket',   name: 'TokenPocket'     },
    { id: 'tronlink',      name: 'TronLink'        },
    { id: 'phantom',       name: 'Phantom'         },
    { id: 'coolwallet',    name: 'CoolWallet'      },
];

interface DappBrowserProps {
    walletId?: string | null;
    onBack?: () => void;
    onConfirm?: () => void;
}

export const DappBrowser = ({ walletId, onBack }: DappBrowserProps) => {
    // 动态获取钱包信息
    const activeWallet = WALLET_LIST.find((w: { id: string; name: string }) => w.id === walletId) || { name: 'Wallet', id: walletId || 'unknown' };
    const currentWalletId = activeWallet.id;

    // 移动端 Deep Link 唤起逻辑
    const handleDeepLink = () => {
        // 根据不同钱包生成对应的 Deep Link 协议
        const deepLinkMap: Record<string, string> = {
            'metamask': 'https://metamask.app.link/dapp/pay.bonuspay.com/checkout',
            'trust': 'https://link.trustwallet.com/open_url?url=https://pay.bonuspay.com/checkout',
            'coinbase': 'https://go.cb-w.com/dapp?url=https://pay.bonuspay.com/checkout',
            'binance': 'bnc://app.binance.com/dapp?url=https://pay.bonuspay.com/checkout',
            'okx': 'okx://wallet/dapp/url?dappUrl=https://pay.bonuspay.com/checkout',
            'imtoken': 'imtokenv2://navigate/DappView?url=https://pay.bonuspay.com/checkout',
            'tokenpocket': 'tpdapp://open?params={"url":"https://pay.bonuspay.com/checkout"}',
            'tronlink': 'tronlinkoutside://pull.activity?param={"url":"https://pay.bonuspay.com/checkout"}',
        };

        const deepLink = deepLinkMap[currentWalletId] || `https://${currentWalletId}.app/dapp/pay.bonuspay.com/checkout`;
        console.log(`[Deep Link] Attempting to open ${activeWallet.name}:`, deepLink);
        window.location.href = deepLink;
    };

    return (
        <div className="absolute inset-0 z-50 bg-white flex flex-col font-sans animate-in fade-in duration-300">
            {/* Header with Back Button */}
            <div className="h-14 border-b border-gray-100 flex items-center px-4 shrink-0">
                <button
                    onClick={onBack}
                    className="p-2 -ml-2 text-gray-400 hover:text-gray-700 bg-transparent hover:bg-gray-50 rounded-lg transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
                <span className="font-bold text-gray-900 ml-2">Connect {activeWallet.name}</span>
            </div>

            <div className="flex-1 flex flex-col relative overflow-y-auto">
                {/* ========== 移动端 Deep Link 引导 (md:hidden) ========== */}
                <div className="md:hidden flex flex-col items-center justify-center flex-1 p-6 space-y-8">

                    {/* 大图标展示：80x80px 圆角钱包 Logo */}
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl flex items-center justify-center shadow-lg border border-gray-200">
                        <div className="scale-[2.5] w-8 h-8 flex items-center justify-center">
                            {getWalletIcon(currentWalletId)}
                        </div>
                    </div>

                    {/* 动态文案 */}
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Link to {activeWallet.name}
                        </h2>
                        <p className="text-sm text-gray-500 px-4 leading-relaxed">
                            Complete your payment securely in the {activeWallet.name} app.
                        </p>
                    </div>

                    {/* Deep Link 按钮 */}
                    <div className="w-full space-y-3">
                        <button
                            onClick={handleDeepLink}
                            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-indigo-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <span>Open {activeWallet.name}</span>
                            <ExternalLink size={20} />
                        </button>

                        <button
                            className="w-full py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
                            onClick={() => {
                                const fallbackUrl = `https://pay.bonuspay.com/checkout?wallet=${currentWalletId}`;
                                navigator.clipboard.writeText(fallbackUrl);
                                alert('Payment link copied to clipboard');
                            }}
                        >
                            Copy Payment Link
                        </button>
                    </div>
                </div>

                {/* ========== PC 端扫码连接 (hidden md:flex) ========== */}
                <div className="hidden md:flex flex-col items-center justify-center flex-1 p-8 space-y-6">

                    {/* 标题区域 */}
                    <div className="text-center space-y-1">
                        <h2 className="text-xl font-bold text-gray-900">Scan to Connect</h2>
                        <p className="text-sm text-gray-500">Use {activeWallet.name} on your mobile device</p>
                    </div>

                    {/* QR 容器：内嵌钱包 Logo（核心逻辑） */}
                    <div className="relative cursor-pointer group bg-white p-4 border-2 border-indigo-50 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                        {/* 二维码主体：200x200 */}
                        <QrCode size={200} className="text-gray-900" strokeWidth={1} />

                        {/* 中心 Logo 覆盖层：绝对定位居中，白底圆角 */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md border-2 border-white p-2 group-hover:scale-110 transition-transform pointer-events-auto">
                                <div className="w-full h-full flex items-center justify-center">
                                    {getWalletIcon(currentWalletId)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 连接状态指示 */}
                    <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-4 py-2 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Waiting for {activeWallet.name} connection...</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
