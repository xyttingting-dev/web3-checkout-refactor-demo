# Bonuspay Checkout - 界面层级结构 v6.0

## 核心设计理念
极简入口 (Stripe风格) -> 智能双核分流 -> 自动逆向兜底

## 1. 顶层容器 (Main Frame)
*   **Header:** 商户Logo | 订单金额 ($20.00) | 帮助按钮

## 2. 状态 A: 默认选择态 (Selection Hub)
*   **Filter Bar:** [搜索] | [全部] [交易所钱包] [Web3钱包] (Tab切换)
*   **Smart Dock:** 位于顶部，高亮展示通过 EIP-6963 检测到的已安装钱包 (wagmi connectors)。
*   **Wallet Grid:** 极简卡片网格。
    *   *动效:* 鼠标悬停时图标有轻微“漂浮感” (Floating)。

## 3. 状态 B: 混合原子展开态 (Hybrid Action)
*   **触发:** 点击 Binance / OKX 等双核钱包。
*   **交互:** 覆盖层或面板展开，而非直接连接。
*   **选项:**
    1.  **Binance Pay (托管):** 推荐，无 Gas，模拟 API 调用。
    2.  **Web3 Connect (自管):** 调用 wagmi 连接。

## 4. 状态 C: 逆向兜底控制台 (Fallback Console)
*   **触发:** 状态 B 连接超时 (>8s) 或 报错 (UserRejected)。
*   **表现:** 界面平滑切换 (无弹窗)。
*   **内容:**
    *   提示条: "连接未完成，已切换至专用通道"
    *   二维码: 支持 [标准/纯地址] 切换。
    *   原子组件: 大号金额显示 + 一键复制。
    *   **反馈:** 底部雷达动画 "正在监听链上交易..."。