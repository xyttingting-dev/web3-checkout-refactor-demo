
import { useState, useCallback, useEffect } from 'react';
import { useConnect, useDisconnect } from 'wagmi';

export type CheckoutState = 'SELECTION' | 'FOCUS' | 'PROCESSING' | 'HYBRID_ACTION' | 'FALLBACK' |
    'CONNECTED_CHAIN_SELECT' | 'CONFIRMATION_PHASE' | 'AUTH_REQUEST' | 'SIGN_REQUEST' | 'SUCCESS' | 'FAIL' | 'DAPP_PAY' | 'DEBUG_INTERCEPT';

export type WalletId =
    | 'metamask' | 'bitget' | 'okx' | 'coinbase' | 'particle' | 'walletconnect' | 'imtoken' | 'coolwallet' | 'tronlink'
    | 'binance' | 'binance_web3' | 'kucoin' | 'gate' | 'phantom' | 'trust' | 'rainbow' | 'rabbithole' | 'injected' | 'tokenpocket';

export interface CheckoutContext {
    state: CheckoutState;
    selectedWallet: WalletId | null;
    selectWallet: (id: WalletId) => void;
    confirmHybridAction: (type: 'custodial' | 'web3') => void;
    selectChain: (chainId: string) => void;
    approveAuth: () => void;
    confirmSign: () => void;
    startDappPay: () => void;
    reset: () => void;
    selectPath: (path: 'success' | 'fail') => void;
    debugAction: (action: 'success' | 'fail' | 'retry') => void;
    submitOrder: () => void;
}

export const useCheckoutState = (): CheckoutContext => {
    const [state, setState] = useState<CheckoutState>('SELECTION');
    const [selectedWallet, setSelectedWallet] = useState<WalletId | null>(null);
    const { connectAsync, connectors, status } = useConnect();
    const { disconnectAsync } = useDisconnect();

    useEffect(() => {
        // Safety net: if connected, ensure we aren't stuck in processing indefinitely if the promise flow missed it
        // Wagmi v2 status: 'success' means connected
        if (status === 'success' && state === 'PROCESSING') {
            setState('CONNECTED_CHAIN_SELECT');
        }
    }, [status, state]);

    const selectWallet = useCallback((id: WalletId) => {
        console.log('Selected wallet:', id);
        setSelectedWallet(id);
        setState('FOCUS');

        // Simulate Processing + Connection
        setTimeout(() => {
            // For Binance, go to HYBRID_ACTION directly (simulating successful scan page)
            if (['binance', 'binance_web3'].includes(id)) {
                setState('HYBRID_ACTION');
            } else {
                // INTERCEPT for Sandbox for others (MetaMask etc)
                setState('DEBUG_INTERCEPT');
            }
        }, 600);
    }, []);


    const selectPath = useCallback(async (path: 'success' | 'fail') => {
        setState('PROCESSING'); // Triggers Breathing Animation
        console.log('[Audit] Processing started. Path:', path);

        if (path === 'success') {
            // Phase 1: Animation 1s -> Wagmi Connect
            setTimeout(async () => {
                // Find MetaMask or first injected
                const connector = connectors.find(c => c.name.toLowerCase() === 'metamask') || connectors[0];
                console.log('[Audit] Connector found:', connector?.name);

                if (connector) {
                    try {
                        // 1. Pre-check: If connected, force disconnect to allow re-trigger
                        // This fixes the "ConnectorAlreadyConnectedError" or stale state
                        if (status === 'success') {
                            console.log('[Audit] Already connected, disconnecting...');
                            await disconnectAsync();
                        }

                        // 2. Connect
                        console.log('[Audit] Connecting...');

                        // Race condition: Connect vs 5s Timeout
                        const connectPromise = connectAsync({ connector }, {
                            onSuccess: () => console.log('[Audit] Connection Success Callback')
                        });

                        const timeoutPromise = new Promise((_, reject) =>
                            setTimeout(() => reject(new Error('Connection Timeout')), 5000)
                        );

                        await Promise.race([connectPromise, timeoutPromise]);

                        // 3. Success -> Next Phase
                        console.log('[Audit] Setting state to CONNECTED_CHAIN_SELECT');
                        setState('CONNECTED_CHAIN_SELECT');
                    } catch (e) {
                        console.error("[Audit] Connect error", e);
                        setState('FALLBACK'); // Fallback on error to avoid sticking
                    }
                } else {
                    // No connector found, jump or fallback
                    console.warn('[Audit] No connector found');
                    setState('CONNECTED_CHAIN_SELECT');
                }
            }, 1000);
        } else {
            setTimeout(() => {
                setState('FALLBACK');
            }, 1000);
        }
    }, [connectAsync, connectors, disconnectAsync, status]);

    const selectChain = useCallback((chainId: string) => {
        console.log("Chain selected:", chainId);
        setState('CONFIRMATION_PHASE');
    }, []);

    const submitOrder = useCallback(() => {
        setState('SUCCESS');
    }, []);

    const approveAuth = useCallback(() => {
        setState('SIGN_REQUEST');
    }, []);

    const confirmSign = useCallback(() => {
        setState('SUCCESS');
    }, []);

    const startDappPay = useCallback(() => {
        setState('DAPP_PAY');
    }, []);

    const confirmHybridAction = useCallback((type: 'custodial' | 'web3') => {
        // Exchange Tab logic: Confirm Payment -> Load -> Success
        setState('PROCESSING');
        setTimeout(() => {
            setState('SUCCESS');
        }, 1500);
    }, []);

    const debugAction = useCallback((action: 'success' | 'fail' | 'retry') => {
        if (action === 'success') setState('SUCCESS');
        if (action === 'fail') setState('FALLBACK');
        if (action === 'retry') {
            setState('SELECTION');
            setSelectedWallet(null);
        }
    }, [])

    const reset = useCallback(() => {
        setState('SELECTION');
        setSelectedWallet(null);
    }, []);

    return {
        state,
        selectedWallet,
        selectWallet,
        confirmHybridAction,
        selectChain,
        approveAuth,
        confirmSign,
        startDappPay,
        reset,
        selectPath,
        debugAction,
        submitOrder
    };
};
