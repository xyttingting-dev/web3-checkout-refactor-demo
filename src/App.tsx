
import { useState } from 'react';
import { useCheckoutState } from './hooks/useCheckoutState';
import { WalletGrid } from './components/WalletGrid';
import { FallbackConsole } from './components/FallbackConsole';
import { MerchantHeader } from './components/MerchantHeader';
import { ChevronDown } from 'lucide-react';
import { EnvironmentSwitcher } from './components/EnvironmentSwitcher';
import type { EnvironmentMode } from './components/EnvironmentSwitcher';
import { TestSidebar } from './components/TestSidebar';
import { MobileShell } from './components/MobileShell';
import { ChainSelector } from './components/ChainSelector';
import { ActionConsole } from './components/ActionConsole';
import { ExchangePanel } from './components/ExchangePanel';
import { DappBrowser } from './components/DappBrowser';
import { PaymentSuccess } from './components/PaymentSuccess';
import { PaymentFailed } from './components/PaymentFailed';
import { SandboxSelector } from './components/SandboxSelector';
import { AddressTransferPanel } from './components/AddressTransferPanel';

function App() {
  // In App component
  const { state, selectedWallet, selectWallet, confirmHybridAction, selectChain, approveAuth, confirmSign, startDappPay, reset, selectPath, submitOrder, reselectChain } = useCheckoutState();
  const [environment, setEnvironment] = useState<EnvironmentMode>('desktop');
  const [transferSuccess, setTransferSuccess] = useState(false);


  return (
    <div className="min-h-[100dvh] bg-gray-50 flex items-center justify-center py-12 p-4 font-sans text-gray-900 relative transition-all duration-500 antialiased supports-[height:100cqh]:min-h-[100cqh]">

      {/* Background Decor */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob pointer-events-none"></div>
      <div className="absolute top-0 -right-20 w-96 h-96 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>

      {/* Sidebars (Desktop Only) */}
      <EnvironmentSwitcher currentMode={environment} onSwitch={setEnvironment} />
      <TestSidebar
        isVisible={environment === 'desktop'}
        onTriggerCase={(id) => {
          if (id === 'dapp_mode') startDappPay();
          console.log('Test Trigger:', id);
        }}
      />

      {/* Main Card Container */}
      <MobileShell environment={environment}>

        {/* Sandbox Interceptor Modal for Demo */}
        {state === 'DEBUG_INTERCEPT' && (
          <SandboxSelector
            onSelectPath={selectPath}
            onClose={reset}
          />
        )}

        {/* Header */}
        <MerchantHeader
          isSuccess={state === 'SUCCESS' || transferSuccess}
          hideAmount={state === 'CONFIRMATION_PHASE'}
        />


        {/* Content Area */}
        <div
          className={`w-full px-5 pt-4 relative flex-1 flex flex-col custom-scrollbar scrolling-touch !overflow-y-auto ${environment === 'android' ? 'pb-24' : 'pb-20'}`}
          style={{ WebkitOverflowScrolling: 'touch', overflowY: 'auto' }}
        >

          {/* Wallet Grid (Selection Phase) */}
          {(state === 'SELECTION' || state === 'FOCUS' || state === 'PROCESSING') && (
            <div className={`transition-opacity duration-300 h-full ${state === 'SELECTION' ? 'opacity-100' : 'opacity-100'}`}>
              <WalletGrid
                onSelect={selectWallet}
                checkoutState={state}
                selectedWalletId={selectedWallet}
              />
            </div>
          )}

          {/* New Flow: Chain Selection */}
          {state === 'CONNECTED_CHAIN_SELECT' && (
            <ChainSelector onSelect={selectChain} />
          )}

          {/* New Flow: Auth & Sign / Confirmation */}
          {(state === 'AUTH_REQUEST' || state === 'SIGN_REQUEST' || state === 'CONFIRMATION_PHASE') && (
            <ActionConsole
              step={state === 'CONFIRMATION_PHASE' ? 'CONFIRMATION' : (state === 'AUTH_REQUEST' ? 'AUTH' : 'SIGN')}
              onComplete={state === 'CONFIRMATION_PHASE' ? submitOrder : (state === 'AUTH_REQUEST' ? approveAuth : confirmSign)}
              onSwitchNetwork={state === 'CONFIRMATION_PHASE' ? reselectChain : undefined}
            />
          )}

          {/* Hybrid/Exchange Action: Now using ExchangePanel for QR */}
          {state === 'HYBRID_ACTION' && selectedWallet && (
            <ExchangePanel
              walletId={selectedWallet}
              onConfirm={() => confirmHybridAction('custodial')}
              isProcessing={false}
            />
          )}

          {/* Fallback / Error - 410 Connection Error */}
          {state === 'FALLBACK' && (
            <FallbackConsole onRetry={reset} onDappPay={startDappPay} />
          )}

          {/* Transaction Failed - Hard Loop */}
          {state === 'FAIL' && (
            <PaymentFailed />
          )}

          {/* DApp Browser Simulation */}
          {state === 'DAPP_PAY' && (
            <DappBrowser onConfirm={confirmSign} />
          )}

          {/* New Flow: Address Pay (Transfer) */}
          {state === 'TRANSFER_FLOW' && (
            <AddressTransferPanel
              onBack={reset}
              onSuccess={() => setTransferSuccess(true)}
            />
          )}

          {/* Success */}
          {state === 'SUCCESS' && (
            <PaymentSuccess />
          )}

        </div>

        {/* Footer */}
        <div
          className="absolute bottom-0 w-full px-5 py-3 flex justify-between items-center text-[10px] text-gray-400 font-medium bg-white/60 backdrop-blur-md z-50 font-sans border-t border-white/20 flex-shrink-0"
          style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 20px))' }}
        >
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
      </MobileShell>
    </div>
  )
}

export default App