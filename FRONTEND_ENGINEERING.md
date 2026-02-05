# BonusPay Checkout - 前端工程化技术文档

> **状态:** 已移交 (v1.0.0)
> **目标读者:** 前端开发人员 / UI 工程师
> **技术栈:** React (Vite), Tailwind CSS, Framer Motion, Wagmi v2

本文档作为本项目的“操作说明书”，重点阐述样式架构、移动端适配策略、核心组件定义以及 Web3 集成逻辑，旨在帮助人类开发人员快速上手。

---

## 1. 样式架构 (Tailwind CSS)

本项目使用 **Tailwind CSS** 并配合深度自定义配置，以实现现代化的“毛玻璃 (Glassmorphism)”视觉风格。

### 1.1 配置详情 (`tailwind.config.js`)
- **字体族:** 优先使用 `Inter`，回退至 `system-ui`, `sans-serif` (优化阅读体验)。
- **核心动画:**
    - `animate-float`: 使用 `translateY` 实现轻柔的悬浮效果。
    - `animate-breathe`: 阴影呼吸效果。
    - `animate-radar`: 用于“搜索钱包”时的雷达扫描扩散效果。
    - `animate-blob`: 背景中大尺寸光斑的三角路径移动动画。
- **插件:** 引入了 `tailwindcss-animate` 以实现更精细的延迟 (delay) 控制。

### 1.2 全局样式与毛玻璃效果 (`index.css`)
- **基础层:** 背景设定为 `bg-gray-50`，文本色 `text-gray-900`。
- **工具类: `.glass-panel`**
    - `@apply bg-white/80 backdrop-blur-md border border-white/20 shadow-xl;`
    - **规范:** 任何需要实现“磨砂玻璃”质感的卡片或浮层，都必须添加此 Class。
- **Ant Design 样式覆盖:**
    - 全局主色变量覆盖: `--ant-primary-color: #4F46E5` (Indigo 600)。
    - 按钮与输入框: 使用 `@apply !important` 强制统一为 Tailwind 的 `rounded-xl` 圆角和阴影风格。

---

## 2. 移动端适配策略

本项目设计目标为：在原生移动浏览器和内嵌 Webview (如钱包 dApp 浏览器) 中均能完美运行。

### 2.1 视口高度修正 (`App.tsx`)
使用动态视口单位，防止 iOS Safari 地址栏遮挡底部内容。
```tsx
className="min-h-[100dvh] ... supports-[height:100cqh]:min-h-[100cqh]"
```
- **`100dvh`**: "Dynamic Viewport Height" - 会随地址栏的展开/由于自动伸缩。
- **`100cqh`**: Container Query Height，作为面向未来的降级方案。

### 2.2 滚动锁定与安全区 (`MobileShell.tsx` & `App.tsx`)
- **安全区 (Safe Area):** Footer 底部增加了显式 padding 以适配 iPhone X+ 的 Home Indicator：
  ```tsx
  style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 20px))' }}
  ```
- **滚动行为:**
  - 主容器使用 `overflow-hidden` 防止“橡皮筋”回弹效果。
  - 内容区域使用 `scrolling-touch` (iOS 惯性滚动支持) 和 `overflow-y-auto` 确保内部流畅滚动。

### 2.3 移动端模拟器
- **逻辑:** `MobileShell` 组件在桌面端 (Desktop) 会渲染一个高仿真的 iPhone/Android 手机壳，但在真实移动设备上会回退为简单的 `div` 容器。
- **设备检测:** 通过 `EnvironmentSwitcher` 全局状态控制，而非不可靠的 User Agent 嗅探。

---

## 3. 核心组件索引

以下是驱动收银台流程的关键业务组件。

| 组件 | 职责描述 | 关键 Props/State |
| :--- | :--- | :--- |
| **`MerchantHeader.tsx`** | 展示顶部商户 Banner、Logo 及订单 ID。 | `isSuccess`: 成功态隐藏金额。<br>`hideAmount`: **v1.0 新增**，用于确认页“去噪”，仅隐藏金额保留商户名。 |
| **`WalletGrid.tsx`** | 3x3 钱包选择网格，含“展开更多”功能。 | 自动排序 (Injected 优先)。<br>适配 `DEBUG_INTERCEPT` 拦截流。 |
| **`ActionConsole.tsx`** | “确认订单”页面的核心交互区。 | `step`: 'AUTH' \| 'SIGN' \| 'CONFIRMATION'。<br>`onSwitchNetwork`: 触发换链操作并保持会话连接。 |
| **`AddressTransferPanel.tsx`** | 兜底的手动转账 UI。 | **关键修复:** 返回按钮逻辑已分流，已生成地址时返回“选链页”，未生成时返回“首页”。 |
| **`MobileShell.tsx`** | 移动端真机模拟外壳。 | `environment`: 'ios' \| 'android' \| 'desktop'。<br>自动切换字体 (San Francisco vs Roboto)。 |

---

## 4. Web3 集成逻辑 (Wagmi v2)

本项目基于 `wagmi` 和 `viem` 处理区块链交互。

### 4.1 基础配置 (`wagmi.ts`)
- **链:** Mainnet (主网), BSC, Polygon。
- **连接器:** `injected({ shimDisconnect: true })` (支持 MetaMask 等插件钱包)。
- **传输层:** 默认 HTTP 传输。

### 4.2 连接状态机 (`useCheckoutState.ts`)
`useCheckoutState` Hook 作为一个有限状态机 (FSM) 运行：
1.  **Selection:** 用户选择钱包。
2.  **Processing (Breathing):** 呼吸动画过渡。
3.  **Connection (Double Reset - 双重重置):**
    - 逻辑检查 `isConnected`。
    - 若已连接，**先执行断开 (disconnect)**，确保触发全新的会话签名请求。
    - 然后调用 `connectAsync`。
4.  **Chain Selection:** 连接成功后，状态流转至 `CONNECTED_CHAIN_SELECT`。
5.  **Chain Switching (换链):**
    - 提供了 `reselectChain` 函数，允许在不运行 `disconnectAsync` 的情况下返回选链界面。

### 4.3 "Switch Network" 实现细节
- 位于 `ActionConsole` (确认阶段)。
- 点击 "Switch Network" 触发 `reselectChain` -> 状态变为 `CONNECTED_CHAIN_SELECT`。
- 此操作**不会**断开 Wagmi 连接，仅改变 UI 阶段，显著提升了用户体验。

---

**由 Antigravity 生成** | 最后更新: 2026-02-05
