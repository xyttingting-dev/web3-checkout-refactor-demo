import { useState } from 'react';
import { useCheckoutState } from './hooks/useCheckoutState';
import { WalletGrid } from './components/WalletGrid';
import { FallbackConsole } from './components/FallbackConsole';
import { MerchantHeader } from './components/MerchantHeader';
import { ChevronDown } from 'lucide-react';
import { TestSidebar } from './components/TestSidebar';
import { MobileShell } from './components/MobileShell';
import { ChainSelector } from './components/ChainSelector';
import { ActionConsole } from './components/ActionConsole';
import { ExchangePanel } from './components/ExchangePanel';
import { DappBrowser } from './components/DappBrowser';
import { DappBrowserPanel } from './components/DappBrowserPanel';

import { PaymentSuccess } from './components/PaymentSuccess';
import { PaymentFailed } from './components/PaymentFailed';
import { SandboxSelector } from './components/SandboxSelector';
import { AddressTransferPanel } from './components/AddressTransferPanel';

function App() {
    const {
        state, selectedWallet, isDappBrowser, dappWalletName,
        selectWallet, confirmHybridAction, selectChain,
        approveAuth, confirmSign, startDappPay, reset, selectPath,
        submitOrder, reselectChain, retryDappConnect, disconnectDapp,
    } = useCheckoutState();

    const [transferSuccess, setTransferSuccess] = useState(false);

    return (
        <div
            className="min-h-[100dvh] flex md:items-center md:justify-center md:py-16 md:p-6 font-sans text-gray-900 relative transition-all duration-500 antialiased supports-[height:100cqh]:min-h-[100cqh] overflow-x-hidden"
            style={{
                backgroundColor: '#f0eef8',
                backgroundImage: [
                    'radial-gradient(ellipse 75% 60% at 5%  10%, rgba(139,92,246,0.22) 0%, transparent 65%)',
                    'radial-gradient(ellipse 65% 70% at 92%  8%, rgba(217,70,239,0.16) 0%, transparent 60%)',
                    'radial-gradient(ellipse 50% 65% at 8%  92%, rgba(99,102,241,0.14) 0%, transparent 60%)',
                    'radial-gradient(ellipse 70% 45% at 95% 90%, rgba(249,115,22,0.12) 0%, transparent 58%)',
                ].join(', '),
            }}
        >
            <TestSidebar
                isVisible={true}
                onTriggerCase={(id) => {
                    if (id === 'dapp_mode') startDappPay();
                }}
            />

            <MobileShell>
                {state === 'DEBUG_INTERCEPT' && (
                    <SandboxSelector onSelectPath={selectPath} onClose={reset} />
                )}

                <MerchantHeader
                    isSuccess={state === 'SUCCESS' || transferSuccess}
                    hideAmount={state === 'CONFIRMATION_PHASE'}
                />

                <div
                    className="w-full px-5 pt-4 pb-24 relative flex-1 flex flex-col custom-scrollbar scrolling-touch overflow-y-auto"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                >
                    {/* ── DApp Browser panel (auto-detected wallet env) — #024 ── */}
                    {isDappBrowser && (state === 'DAPP_CONNECTING' || state === 'DAPP_CONNECTED' || state === 'DAPP_FAILED') && (
                        <DappBrowserPanel
                            state={state as 'DAPP_CONNECTING' | 'DAPP_CONNECTED' | 'DAPP_FAILED'}
                            walletName={dappWalletName}
                            onRetry={retryDappConnect}
                            onDisconnect={disconnectDapp}
                            onPay={selectChain}
                        />
                    )}

                    {/* ── Standard wallet selection ── */}
                    {(state === 'SELECTION' || state === 'FOCUS' || state === 'PROCESSING') && !isDappBrowser && (
                        <div className="transition-opacity duration-300 h-full opacity-100">
                            <WalletGrid
                                onSelect={selectWallet}
                                checkoutState={state}
                                selectedWalletId={selectedWallet}
                            />
                        </div>
                    )}

                    {state === 'CONNECTED_CHAIN_SELECT' && (
                        <ChainSelector onSelect={selectChain} />
                    )}

                    {(state === 'AUTH_REQUEST' || state === 'SIGN_REQUEST' || state === 'CONFIRMATION_PHASE') && (
                        <ActionConsole
                            step={state === 'CONFIRMATION_PHASE' ? 'CONFIRMATION' : (state === 'AUTH_REQUEST' ? 'AUTH' : 'SIGN')}
                            onComplete={state === 'CONFIRMATION_PHASE' ? submitOrder : (state === 'AUTH_REQUEST' ? approveAuth : confirmSign)}
                            onSwitchNetwork={state === 'CONFIRMATION_PHASE' ? reselectChain : undefined}
                        />
                    )}

                    {state === 'HYBRID_ACTION' && selectedWallet && (
                        <ExchangePanel
                            walletId={selectedWallet}
                            onConfirm={() => confirmHybridAction('custodial')}
                            isProcessing={false}
                        />
                    )}

                    {state === 'FALLBACK' && (
                        <FallbackConsole onRetry={reset} onDappPay={startDappPay} />
                    )}

                    {state === 'FAIL' && <PaymentFailed />}

                    {state === 'DAPP_PAY' && <DappBrowser onConfirm={confirmSign} />}

                    {state === 'TRANSFER_FLOW' && (
                        <AddressTransferPanel
                            onBack={reset}
                            onSuccess={() => setTransferSuccess(true)}
                        />
                    )}

                    {state === 'SUCCESS' && <PaymentSuccess />}
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
    );
}

export default App;