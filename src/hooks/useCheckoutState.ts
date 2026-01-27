import { useState, useCallback } from 'react';

export type CheckoutState = 'SELECTION' | 'FOCUS' | 'PROCESSING' | 'HYBRID_ACTION' | 'FALLBACK';
export type WalletId =
    | 'metamask' | 'bitget' | 'okx' | 'coinbase' | 'particle' | 'walletconnect' | 'imtoken' | 'coolwallet' | 'tronlink'
    | 'binance' | 'kucoin' | 'gate' | 'phantom' | 'trust' | 'rainbow' | 'rabbithole' | 'injected';

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

        // Phase 1: Focus (Immediate UI feedback)
        setState('FOCUS');

        // Phase 2: Processing/Ripple (Simulated delay)
        setTimeout(() => {
            setState('PROCESSING');

            // Phase 3: Routing Logic
            setTimeout(() => {
                if (['binance', 'kucoin', 'gate'].includes(id)) {
                    setState('HYBRID_ACTION');
                } else if (id === 'walletconnect') {
                    // Wallet Connect usually brings up its own modal or QR, 
                    // but here we might simulate a connecting state or fallback
                    setState('FALLBACK');
                } else {
                    // Standard Wallet -> Attempt Deep Link -> Fail -> Fallback
                    // Simulating failure/not installed for demo
                    setState('FALLBACK');
                }
            }, 1500); // Wait for Ripple effect
        }, 600); // Wait for Focus animation
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
