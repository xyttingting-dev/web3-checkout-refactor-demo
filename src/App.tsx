import { useCheckoutState } from './hooks/useCheckoutState';
import { WalletGrid } from './components/WalletGrid';
import { HybridPanel } from './components/HybridPanel';
import { FallbackConsole } from './components/FallbackConsole';
import { MerchantHeader } from './components/MerchantHeader';
import { ChevronDown } from 'lucide-react';

function App() {
  const { state, selectedWallet, selectWallet, confirmHybridAction, reset } = useCheckoutState();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 p-4 font-sans text-gray-900 relative">
      {/* 背景装饰光斑 */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-20 w-96 h-96 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      {/* 主卡片容器 */}
      <div
        className="w-full max-w-[380px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-indigo-500/10 overflow-hidden flex flex-col relative border border-white/50 ring-1 ring-gray-100 transition-all duration-500 ease-in-out h-fit"
      >

        {/* 头部组件 */}
        <MerchantHeader />

        {/* 内容区域 */}
        {/* 修改重点：pb-1 (底部内边距极小)，让内容紧贴下方 */}
        <div className="w-full px-5 pt-4 pb-1 relative flex flex-col">

          {(state === 'SELECTION' || state === 'FOCUS' || state === 'PROCESSING') && (
            <div className={`transition-opacity duration-300 ${state === 'SELECTION' ? 'opacity-100' : 'opacity-100'}`}>
              <WalletGrid
                onSelect={selectWallet}
                checkoutState={state}
                selectedWalletId={selectedWallet}
              />
            </div>
          )}

          {state === 'HYBRID_ACTION' && selectedWallet && (
            <HybridPanel
              walletId={selectedWallet}
              onConfirm={confirmHybridAction}
              onBack={reset}
            />
          )}

          {state === 'FALLBACK' && (
            <FallbackConsole onRetry={reset} />
          )}

        </div>

        {/* 底部 Footer */}
        {/* 修改重点：
            1. mt-0 (无顶部外边距)
            2. py-3 (减少上下厚度)
            3. border-none (去掉分割线，让它看起来像一体的)
        */}
        <div className="px-5 py-3 flex justify-between items-center text-[10px] text-gray-400 font-medium mt-0 bg-white">
          <div className="flex gap-3">
            <button className="hover:text-gray-600 transition-colors">Privacy</button>
            <div className="w-px h-3 bg-gray-300"></div>
            <button className="hover:text-gray-600 transition-colors">Disclosure</button>
          </div>

          <div className="flex items-center gap-1 bg-gray-800 text-white hover:bg-gray-700 transition-colors px-3 py-1.5 rounded-full shadow-sm cursor-pointer font-bold">
            <span>EN</span>
            <ChevronDown size={10} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App