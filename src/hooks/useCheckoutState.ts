
import { useState, useCallback, useEffect } from 'react';
import { useConnect, useDisconnect, useAccount } from 'wagmi';

export type CheckoutState = 'SELECTION' | 'FOCUS' | 'PROCESSING' | 'HYBRID_ACTION' | 'FALLBACK' |
    'CONNECTED_CHAIN_SELECT' | 'CONFIRMATION_PHASE' | 'AUTH_REQUEST' | 'SIGN_REQUEST' | 'SUCCESS' | 'FAIL' | 'DAPP_PAY' | 'DEBUG_INTERCEPT' | 'TRANSFER_FLOW';

export type WalletId =
    | 'metamask' | 'bitget' | 'okx' | 'coinbase' | 'particle' | 'walletconnect' | 'imtoken' | 'coolwallet' | 'tronlink'
    | 'binance' | 'binance_web3' | 'kucoin' | 'gate' | 'phantom' | 'trust' | 'rainbow' | 'rabbithole' | 'injected' | 'tokenpocket' | 'transfer';

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
    reselectChain: () => void;
}

export const useCheckoutState = (): CheckoutContext => {
    const [state, setState] = useState<CheckoutState>('SELECTION');
    const [selectedWallet, setSelectedWallet] = useState<WalletId | null>(null);

    // Web3 Hooks
    const { connectAsync, connectors, status: connectStatus } = useConnect();
    const { disconnectAsync } = useDisconnect();
    const { isConnected } = useAccount();

    // ---------------------------------------------------------
    // 1. Connection Listener (State Guard)
    // ---------------------------------------------------------
    useEffect(() => {
        // Only trigger if we are actively trying to connect/process
        // This ensures that if the user is ALREADY connected or matches connection rapidly, we move forward.
        if (state === 'PROCESSING' && isConnected) {
            console.log('[Audit] isConnected detected while PROCESSING. Transitioning to Chain Select.');
            setState('CONNECTED_CHAIN_SELECT');
        }
    }, [isConnected, state]);

    // ---------------------------------------------------------
    // 2. Wallet Selection (Trigger)
    // ---------------------------------------------------------
    const selectWallet = useCallback((id: WalletId) => {
        console.log('[Audit] Selected wallet:', id);
        setSelectedWallet(id);

        if (id === 'transfer') {
            setState('TRANSFER_FLOW');
            return;
        }

        setState('FOCUS');

        // Simulate Centralized/Exchange vs Web3 logic
        setTimeout(() => {
            if (['binance', 'binance_web3'].includes(id)) {
                console.log('[Audit] Binance Wallet -> Hybrid Action');
                setState('HYBRID_ACTION');
            } else {
                console.log('[Audit] Standard Wallet -> Intercept Modal');
                setState('DEBUG_INTERCEPT');
            }
        }, 600);
    }, []);

    // ---------------------------------------------------------
    // 3. Path Selection & Connection Logic (The Core)
    // ---------------------------------------------------------
    const selectPath = useCallback(async (path: 'success' | 'fail') => {
        console.log('[Audit] Path selection triggered:', path);
        setState('PROCESSING'); // Start "Breathing" Animation

        if (path === 'success') {
            // Delay 1s for animation to be seen
            setTimeout(async () => {
                try {
                    // Logic Resurrection: "Double Reset"
                    // Check if already connected (via status or isConnected hook)
                    if (isConnected || connectStatus === 'success') {
                        console.log('[Audit] Pre-flight: Disconnecting existing session...');
                        await disconnectAsync();
                    }

                    // Find Connector - Be very specific for "Metamask"
                    const connector = connectors.find(c => c.name.toLowerCase().includes('metamask')) || connectors[0];
                    if (!connector) {
                        throw new Error("No connector found");
                    }

                    console.log('[Audit] Invoking connectAsync with:', connector.name);

                    // Trigger Connection
                    await connectAsync({ connector });

                    // Note: The useEffect above will catch 'isConnected' -> true and transition state.
                    // But we keep this log for audit.
                    console.log('[Audit] Connection promise resolved. Waiting for useEffect to pick up connection.');
                } catch (error) {
                    console.error('[Audit] Connection Failed:', error);
                    setState('FALLBACK');
                }
            }, 1000);
        } else {
            // Simulated Fail Path
            setTimeout(() => {
                console.log('[Audit] Simulated Failure Path');
                setState('FALLBACK');
            }, 1000);
        }
    }, [connectAsync, connectors, disconnectAsync, isConnected, connectStatus]);

    // ---------------------------------------------------------
    // 4. Step Transitions
    // ---------------------------------------------------------
    const selectChain = useCallback((chainId: string) => {
        console.log('[Audit] Chain selected:', chainId);
        setState('CONFIRMATION_PHASE');
    }, []);

    const submitOrder = useCallback(() => {
        console.log('[Audit] Order submitted, triggering force success timer');
        // Phase 5: Force Success Rule - Wait 1s then Success
        setState('PROCESSING');
        setTimeout(() => {
            setState('SUCCESS');
        }, 1000);
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

    const confirmHybridAction = useCallback(() => {
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
    }, []);

    const reselectChain = useCallback(() => {
        console.log('[Audit] Reselecting chain, maintaining connection');
        setState('CONNECTED_CHAIN_SELECT');
    }, []);

    const reset = useCallback(() => {
        console.log('[Audit] Resetting state');
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
        submitOrder,
        reselectChain
    };
};
