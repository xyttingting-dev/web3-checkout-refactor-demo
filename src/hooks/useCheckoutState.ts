
import { useState, useCallback, useEffect } from 'react';
import { useConnect, useDisconnect, useAccount } from 'wagmi';

export type CheckoutState = 'SELECTION' | 'FOCUS' | 'PROCESSING' | 'HYBRID_ACTION' | 'FALLBACK' |
    'CONNECTED_CHAIN_SELECT' | 'CONFIRMATION_PHASE' | 'AUTH_REQUEST' | 'SIGN_REQUEST' | 'SUCCESS' | 'FAIL' | 'DAPP_PAY' | 'DEBUG_INTERCEPT' | 'TRANSFER_FLOW';

export type WalletId =
    | 'metamask' | 'bitget' | 'okx' | 'coinbase' | 'particle' | 'walletconnect' | 'imtoken' | 'coolwallet' | 'tronlink'
    | 'binance' | 'binance_web3' | 'binance_pay' | 'kucoin' | 'gate' | 'topwallet'
    | 'phantom' | 'trust' | 'rainbow' | 'rabbithole' | 'injected' | 'tokenpocket' | 'transfer';

// Exchange/custodial wallets that show a QR code pay flow instead of Web3 connect
export const EXCHANGE_WALLET_IDS: WalletId[] = ['binance_pay', 'kucoin', 'gate', 'topwallet'];

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
        if (state === 'PROCESSING' && isConnected) {
            setState('CONNECTED_CHAIN_SELECT');
        }
    }, [isConnected, state]);

    // ---------------------------------------------------------
    // 2. Wallet Selection (Trigger)
    // ---------------------------------------------------------
    const selectWallet = useCallback((id: WalletId) => {
        setSelectedWallet(id);

        if (id === 'transfer') {
            setState('TRANSFER_FLOW');
            return;
        }

        setState('FOCUS');

        setTimeout(() => {
            // Exchange / custodial wallets → QR code pay flow (HYBRID_ACTION)
            // binance (Web3 connect) stays in DEBUG_INTERCEPT like other Web3 wallets
            if (EXCHANGE_WALLET_IDS.includes(id)) {
                setState('HYBRID_ACTION');
            } else {
                setState('DEBUG_INTERCEPT');
            }
        }, 600);
    }, []);

    // ---------------------------------------------------------
    // 3. Path Selection & Connection Logic
    // ---------------------------------------------------------
    const selectPath = useCallback(async (path: 'success' | 'fail') => {
        setState('PROCESSING');

        if (path === 'success') {
            setTimeout(async () => {
                try {
                    if (isConnected || connectStatus === 'success') {
                        await disconnectAsync();
                    }
                    const connector = connectors.find(c => c.name.toLowerCase().includes('metamask')) || connectors[0];
                    if (!connector) throw new Error('No connector found');
                    await connectAsync({ connector });
                } catch (error) {
                    console.error('[System] Connection Failed:', error);
                    setState('FALLBACK');
                }
            }, 1000);
        } else {
            setTimeout(() => setState('FALLBACK'), 1000);
        }
    }, [connectAsync, connectors, disconnectAsync, isConnected, connectStatus]);

    // ---------------------------------------------------------
    // 4. Step Transitions
    // ---------------------------------------------------------
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const selectChain = useCallback((_chainId: string) => {
        setState('CONFIRMATION_PHASE');
    }, []);

    const submitOrder = useCallback(() => {
        setState('PROCESSING');
        setTimeout(() => setState('SUCCESS'), 1000);
    }, []);

    const approveAuth    = useCallback(() => setState('SIGN_REQUEST'), []);
    const confirmSign    = useCallback(() => setState('SUCCESS'), []);
    const startDappPay   = useCallback(() => setState('DAPP_PAY'), []);

    const confirmHybridAction = useCallback(() => {
        setState('PROCESSING');
        setTimeout(() => setState('SUCCESS'), 1500);
    }, []);

    const debugAction = useCallback((action: 'success' | 'fail' | 'retry') => {
        if (action === 'success') setState('SUCCESS');
        if (action === 'fail')    setState('FALLBACK');
        if (action === 'retry')   { setState('SELECTION'); setSelectedWallet(null); }
    }, []);

    const reselectChain = useCallback(() => setState('CONNECTED_CHAIN_SELECT'), []);

    const reset = useCallback(() => {
        setState('SELECTION');
        setSelectedWallet(null);
    }, []);

    return {
        state, selectedWallet,
        selectWallet, confirmHybridAction, selectChain, approveAuth,
        confirmSign, startDappPay, reset, selectPath, debugAction,
        submitOrder, reselectChain,
    };
};
