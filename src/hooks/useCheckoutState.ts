import { useState, useCallback } from 'react';

export type CheckoutState = 'SELECTION' | 'HYBRID_ACTION' | 'PROCESSING' | 'FALLBACK';
export type WalletId = 'binance' | 'metamask' | 'okx' | 'phantom' | 'walletconnect';

export interface CheckoutContext {
    state: CheckoutState;
    selectedWallet: WalletId | null;
    selectWallet: (id: WalletId) => void;
    confirmHybridAction: (type: 'custodial' | 'web3') => void;
    reset: () => void;
}

export const useCheckoutState = (): CheckoutContext => {
    const [state, setState] = useState<CheckoutState>('SELECTION');
    const [selectedWallet, setSelectedWallet] = useState<WalletId | null>(null);

    const selectWallet = useCallback((id: WalletId) => {
        console.log('Selected wallet:', id);
        setSelectedWallet(id);

        if (id === 'binance' || id === 'okx') {
            setState('HYBRID_ACTION');
        } else if (id === 'metamask') {
            // Simulate Web3 Connection flow
            setState('PROCESSING');
            // Logic: Simulate user opening MetaMask -> Waiting -> User Rejects or Timeout
            setTimeout(() => {
                console.warn('Simulation: Connection Timed Out / Rejected');
                setState('FALLBACK');
            }, 3000);
        } else {
            // Other wallets generic flow
            setState('PROCESSING');
            setTimeout(() => setState('FALLBACK'), 3000);
        }
    }, []);

    const confirmHybridAction = useCallback((type: 'custodial' | 'web3') => {
        console.log('Hybrid action confirmed:', type);
        setState('PROCESSING');

        if (type === 'custodial') {
            // Simulate Binance Pay API call
            setTimeout(() => {
                console.warn('Simulation: API Error 503');
                setState('FALLBACK');
            }, 2500);
        } else {
            // Web3 Connect
            setTimeout(() => {
                console.warn('Simulation: Web3 Connection Failed');
                setState('FALLBACK');
            }, 3000);
        }
    }, []);

    const reset = useCallback(() => {
        setState('SELECTION');
        setSelectedWallet(null);
    }, []);

    return {
        state,
        selectedWallet,
        selectWallet,
        confirmHybridAction,
        reset
    };
};
