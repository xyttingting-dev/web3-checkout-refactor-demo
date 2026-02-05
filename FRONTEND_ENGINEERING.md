# BonusPay Checkout - Frontend Engineering Documentation

> **Status:** Handover Ready (v1.0.0)  
> **Target Audience:** Frontend Developers / UI Engineers  
> **Tech Stack:** React (Vite), Tailwind CSS, Framer Motion, Wagmi v2

This document serves as the "Operator's Manual" for the codebase, focusing on style architecture, mobile adaptation strategies, core component definitions, and Web3 integration logic.

---

## 1. Style Architecture (Tailwind CSS)

The project leverages **Tailwind CSS** with a customized configuration to achieve a modern, "Glassmorphism" aesthetic.

### 1.1 Configuration (`tailwind.config.js`)
- **Font Family:** `Inter`, `system-ui`, `sans-serif`. (Optimized for readability).
- **Animations:**
    - `animate-float`: Gentle floating effect using `translateY`.
    - `animate-breathe`: Subtle shadow pulsation.
    - `animate-radar`: Scaling loop check for "Looking for wallet".
    - `animate-blob`: Large background gradient blobs moving in a triangular path.
- **Plugins:** `tailwindcss-animate` is included for granular delay control.

### 1.2 Global Styles & Glassmorphism (`index.css`)
- **Base Layer:** Background set to `bg-gray-50`, text `text-gray-900`.
- **Utility Class: `.glass-panel`**
    - `@apply bg-white/80 backdrop-blur-md border border-white/20 shadow-xl;`
    - Use this class for any card or overlay that needs the signature frosted glass look.
- **Ant Design Overrides:**
    - Global variable override: `--ant-primary-color: #4F46E5` (Indigo 600).
    - Buttons and Inputs are forced to match Tailwind's `rounded-xl` and shadow tokens using `@apply !important`.

---

## 2. Mobile Adaptation Strategy

The application is designed to run flawlessly on mobile browsers and within embedded webviews (e.g., wallet dApp browsers).

### 2.1 Viewport Height Fix (`App.tsx`)
We use dynamic viewport units to prevent the address bar from covering content on iOS Safari.
```tsx
className="min-h-[100dvh] ... supports-[height:100cqh]:min-h-[100cqh]"
```
- **`100dvh`**: "Dynamic Viewport Height" - adapts when the address bar expands/collapses.
- **`100cqh`**: Container Query Height fallback for future-proofing.

### 2.2 Scroll Locking & Safe Area (`MobileShell.tsx` & `App.tsx`)
- **Safe Area:** The Footer includes explicit padding for iPhone X+ home indicators:
  ```tsx
  style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 20px))' }}
  ```
- **Scroll Behavior:**
  - `overflow-hidden` is applied to the main container to prevent "body bounce".
  - The content area uses `scrolling-touch` (iOS legacy support) and `overflow-y-auto` for smooth internal scrolling.

### 2.3 Mobile Simulator
- **Logic:** `MobileShell` component conditionally renders a device frame (iPhone/Android) on Desktop, but renders a simple `div` wrapper on actual mobile devices.
- **Device Detection:** Controlled via the `EnvironmentSwitcher`, not user agent sniffing (for development stability).

---

## 3. Core Component Index

Key components that drive the checkout flow.

| Component | Responsibility | Key Props/State |
| :--- | :--- | :--- |
| **`MerchantHeader.tsx`** | Displays Brand Banner, Logo, and Order IDs. | `isSuccess`: Hides amount/details on success.<br>`hideAmount`: **New in v1.0**, cleans up confirmation page header. |
| **`WalletGrid.tsx`** | 3x3 Grid for wallet selection. Handles "More" expansion. | Auto-sorts usage (Injected > Others).<br>Adapts to `DEBUG_INTERCEPT` flow. |
| **`ActionConsole.tsx`** | The "Confirm Order" page. logic. | `step`: 'AUTH' \| 'SIGN' \| 'CONFIRMATION'.<br>`onSwitchNetwork`: Triggers chain re-selection while maintaining session. |
| **`AddressTransferPanel.tsx`** | Fallback manual transfer UI. | **Crucial Fix:** Back button logic branches based on whether an address was generated. |
| **`MobileShell.tsx`** | Device simulator wrapper. | `environment`: 'ios' \| 'android' \| 'desktop'. Handles font switching (San Francisco vs Roboto). |

---

## 4. Web3 Integration (Wagmi v2)

The project uses `wagmi` with `viem` for blockchain interactions.

### 4.1 Configuration (`wagmi.ts`)
- **Chains:** Mainnet, BSC, Polygon.
- **Connectors:** `injected({ shimDisconnect: true })`.
- **Transports:** HTTP default.

### 4.2 Connection Logic (`useCheckoutState.ts`)
The `useCheckoutState` hook acts as a finite state machine (FSM).
1.  **Selection:** User picks wallet.
2.  **Processing (Breathing):** Visual feedback.
3.  **Connection (Double Reset):**
    - Logic checks if `isConnected`.
    - If true, it **disconnects first** to ensure a fresh session challenge.
    - Then calls `connectAsync`.
4.  **Chain Selection:** Post-connection, state transitions to `CONNECTED_CHAIN_SELECT`.
5.  **Chain Switching:**
    - New `reselectChain` function allows returning to Chain Select state *without* running `disconnectAsync`.

### 4.3 "Switch Network" Implementation
- Located in `ActionConsole` (Confirmation Phase).
- Clicking "Switch Network" fires `reselectChain` -> State becomes `CONNECTED_CHAIN_SELECT`.
- This preserves the `wagmi` wallet connection effectively, only changing the app's UI phase.

---

**Generated by Antigravity** | Last Updated: 2026-02-05
