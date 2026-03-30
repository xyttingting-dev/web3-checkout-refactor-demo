
import { useState, useCallback, useEffect } from 'react';
import { useConnect, useDisconnect, useAccount } from 'wagmi';

export type CheckoutState = 'SELECTION' | 'FOCUS' | 'PROCESSING' | 'HYBRID_ACTION' | 'FALLBACK' |
    'CONNECTED_CHAIN_SELECT' | 'CONFIRMATION_PHASE' | 'AUTH_REQUEST' | 'SIGN_REQUEST' | 'SUCCESS' | 'FAIL' |
    'DAPP_PAY' | 'DEBUG_INTERCEPT' | 'TRANSFER_FLOW' |
    'DAPP_CONNECTING' | 'DAPP_CONNECTED' | 'DAPP_FAILED';

export type WalletId =
    | 'metamask' | 'bitget' | 'okx' | 'coinbase' | 'particle' | 'walletconnect' | 'imtoken' | 'coolwallet' | 'tronlink'
    | 'binance' | 'binance_web3' | 'binance_pay' | 'kucoin' | 'gate' | 'topwallet'
    | 'phantom' | 'trust' | 'rainbow' | 'rabbithole' | 'injected' | 'tokenpocket' | 'transfer';

// Exchange/custodial wallets that show a QR code pay flow instead of Web3 connect
export const EXCHANGE_WALLET_IDS: WalletId[] = ['binance_pay', 'kucoin', 'gate', 'topwallet'];

// ─── #029 Deep-link helpers ───────────────────────────────────────────────────
const WALLET_DEEP_LINKS: Partial<Record<WalletId, string>> = {
    metamask:    'metamask://',
    trust:       'trust://',
    coinbase:    'cbwallet://',
    rainbow:     'rainbow://',
    tokenpocket: 'tpoutside://',
    imtoken:     'imtokenv2://',
};

function isMobileBrowser(): boolean {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

type EthProvider = { isMetaMask?: boolean; isTrust?: boolean; isCoinbaseWallet?: boolean };

function detectDappBrowser(): boolean {
    return typeof window !== 'undefined' &&
        typeof (window as Window & { ethereum?: unknown }).ethereum !== 'undefined';
}

function tryDeepLink(id: WalletId): void {
    if (!isMobileBrowser()) return;
    const scheme = WALLET_DEEP_LINKS[id];
    if (scheme) window.location.href = scheme;
}

export interface CheckoutContext {
    state: CheckoutState;
    selectedWallet: WalletId | null;
    isDappBrowser: boolean;
    dappWalletName: string;
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
    retryDappConnect: () => void;
    disconnectDapp: () => void;
}

export const useCheckoutState = (): CheckoutContext => {
    const [state, setState] = useState<CheckoutState>('SELECTION');
    const [selectedWallet, setSelectedWallet] = useState<WalletId | null>(null);
    const [isDappBrowser, setIsDappBrowser] = useState(false);
    const [dappWalletName, setDappWalletName] = useState('Injected Wallet');

    // Web3 Hooks
    const { connectAsync, connectors, status: connectStatus } = useConnect();
    const { disconnectAsync } = useDisconnect();
    const { isConnected } = useAccount();

    // ---------------------------------------------------------
    // 1. Connection Listener (State Guard)
    // ---------------------------------------------------------
    // DApp browser auto-detect on mount (#024)
    useEffect(() => {
        if (detectDappBrowser()) {
            setIsDappBrowser(true);
            const eth = (window as Window & { ethereum?: EthProvider }).ethereum;
            let name = 'Injected Wallet';
            if (eth?.isMetaMask) name = 'MetaMask';
            else if (eth?.isTrust) name = 'Trust Wallet';
            else if (eth?.isCoinbaseWallet) name = 'Coinbase Wallet';
            setDappWalletName(name);
            setState('DAPP_CONNECTING');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Connection state listener
    useEffect(() => {
        if (state === 'PROCESSING' && isConnected) {
            setState('CONNECTED_CHAIN_SELECT');
        }
        if (state === 'DAPP_CONNECTING' && isConnected) {
            setState('DAPP_CONNECTED');
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
                // #029 Deep link: on mobile + known wallet → jump to wallet app
                tryDeepLink(id);
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

    const retryDappConnect = useCallback(async () => {
        setState('DAPP_CONNECTING');
        try {
            const connector = connectors.find(c => c.id === 'injected') ?? connectors[0];
            if (!connector) throw new Error('No injected connector');
            await connectAsync({ connector });
            setState('DAPP_CONNECTED');
        } catch {
            setState('DAPP_FAILED');
        }
    }, [connectors, connectAsync]);

    const disconnectDapp = useCallback(async () => {
        await disconnectAsync();
        setState('SELECTION');
        setIsDappBrowser(false);
        setSelectedWallet(null);
    }, [disconnectAsync]);

    return {
        state, selectedWallet, isDappBrowser, dappWalletName,
        selectWallet, confirmHybridAction, selectChain, approveAuth,
        confirmSign, startDappPay, reset, selectPath, debugAction,
        submitOrder, reselectChain, retryDappConnect, disconnectDapp,
    };
};
