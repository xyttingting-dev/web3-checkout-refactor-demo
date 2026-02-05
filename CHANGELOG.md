# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-02-05

### Core Features & Architecture Refinements
Summary of the top 5 core structural and logical evolutions since project inception.

#### 1. Unified Payment Logic & Fallback Mechanism
- **Feature:** Implemented `FallbackConsole` and `AddressTransferPanel`.
- **Logic:** Established a robust fallback flow where connection failures (e.g., 410 Error) automatically transition users to a manual "Address Transfer" mode.
- **Key Files:** `src/hooks/useCheckoutState.ts`, `src/components/FallbackConsole.tsx`, `src/components/AddressTransferPanel.tsx`.

#### 2. Adaptive Wallet Grid System
- **UI:** Redesigned wallet selection into a 3x3 grid with a "Show More" expansion capability.
- **Logic:** Integrated sorting logic to prioritize "Injected" wallets (e.g., MetaMask) dynamically based on browser environment.
- **Key Files:** `src/components/WalletGrid.tsx`, `src/components/WalletLibrary.tsx`.

#### 3. Hybrid Payment Architecture
- **Feature:** Clear separation between "Web3 Connect" and "Custodial/Exchange" payment paths.
- **Logic:** Added `HybridPanel` to offer users a choice between direct blockchain connection and off-chain exchange payment (Binance/OKX).
- **Key Files:** `src/components/HybridPanel.tsx`, `src/components/ExchangePanel.tsx`.

#### 4. Mobile-First Simulation & Responsive Design
- **UI:** Created `MobileShell` component to simulate iOS/Android environments accurately on desktop.
- **Style:** Enforced `100dvh` and Container Queries to ensure pixel-perfect rendering across real mobile devices and simulators.
- **Key Files:** `src/components/MobileShell.tsx`, `src/App.tsx`.

#### 5. Optimized Confirmation Workflow ("Purified UI")
- **UX:** Streamlined the "Confirm Order" page by removing redundant header information (Amount/Details) while keeping core Context (Merchant/Network).
- **Logic:** Introduced "Switch Network" (reselectChain) functionality, allowing users to change networks without breaking the wallet session.
- **Key Files:** `src/components/ActionConsole.tsx`, `src/hooks/useCheckoutState.ts`, `src/components/MerchantHeader.tsx`.
