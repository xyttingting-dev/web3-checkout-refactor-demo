# 核心支付生命周期时序图 (Core Payment Lifecycle)

这份文档描述了 BonusPay 收银台的核心状态流转逻辑，用于指导测试用例编写。

> **图例说明:**
> - **Participants:**
>   - **User:** 最终用户
>   - **UI:** 收银台界面组件 (WalletGrid, ActionConsole 等)
>   - **Hook:** 核心状态机 (useCheckoutState)
>   - **Wagmi:** 钱包连接库与 Web3 钱包实例
>   - **Chain:** 区块链网络

```mermaid
sequenceDiagram
    autonumber
    participant User
    participant UI as Frontend UI
    participant Hook as useCheckoutState
    participant Wagmi as Wagmi SDK / Wallet
    participant Chain as Blockchain Network

    %% ============================================================
    %% 场景 1: 标准 Web3 钱包连接流程
    %% ============================================================
    Note over User, Chain: 场景 1: 标准 Web3 钱包连接 (Wallet Connection)

    User->>UI: 点击钱包图标 (例如 MetaMask)
    UI->>Hook: selectWallet('metamask')
    Hook-->>UI: 状态变更为 FOCUS -> DEBUG_INTERCEPT (Demo模式)
    
    Note right of UI: 开发模式下模拟路径选择
    User->>UI: 点击 "Simulate Success"
    UI->>Hook: selectPath('success')
    Hook-->>UI: 状态变更为 PROCESSING (呼吸动画)
    
    rect rgb(240, 248, 255)
        note right of Hook: 关键逻辑: "Double Reset" (先断后连)
        Hook->>Wagmi: disconnectAsync()
        Note right of Hook: 确保清除旧 session
        Hook->>Wagmi: connectAsync()
        activate Wagmi
        Wagmi-->>User: 唤起钱包插件/应用
        User->>Wagmi: 批准连接请求
        Wagmi-->>Hook: 连接成功 (isConnected = true)
        deactivate Wagmi
    end
    
    Hook->>Hook: useEffect 监听到连接状态
    Hook-->>UI: 状态变更为 CONNECTED_CHAIN_SELECT
    UI-->>User: 展示链选择界面 (ChainSelector)

    %% ============================================================
    %% 场景 2: 支付指令与签名
    %% ============================================================
    Note over User, Chain: 场景 2: 支付执行 (Payment Execution)

    User->>UI: 选择支付网络 (例如 Ethereum)
    UI->>Hook: selectChain('1')
    Hook-->>UI: 状态变更为 CONFIRMATION_PHASE
    UI-->>User: 展示确认订单页 (ActionConsole)

    User->>UI: 点击 "Submit Order"
    activate UI
    UI->>Wagmi: sendTransactionAsync()
    Wagmi-->>User: 钱包弹出签名/交易请求

    alt 用户确认签名 (Happy Path)
        User->>Wagmi: 确认/签名
        Wagmi->>Chain: 广播交易
        Wagmi-->>UI: 返回 TxHash
        UI->>Hook: submitOrder()
        Hook-->>UI: 状态变更为 PROCESSING
        Note right of Hook: 模拟上链等待 (1s)
        Hook-->>UI: 状态变更为 SUCCESS
        UI-->>User: 展示支付成功页 (PaymentSuccess)
    else 用户拒绝/失败 (Exception)
        User->>Wagmi: 拒绝操作
        Wagmi-->>UI: 抛出 UserRejected 错误
        UI-->>User: 停留在确认页 / 提示错误
    end
    deactivate UI

    %% ============================================================
    %% 场景 3: 异常处理与降级
    %% ============================================================
    Note over User, Chain: 场景 3: 连接失败自动降级 (Fallback Flow)

    User->>UI: 选择钱包
    UI->>Hook: selectPath('fail') (模拟失败)
    Hook->>Wagmi: connectAsync()
    Wagmi-->>Hook: 抛出 Connection Error (Timeout/410)
    Hook-->>UI: 状态变更为 FALLBACK
    UI-->>User: 展示错误提示 + "Try Address Transfer" 选项

    %% ============================================================
    %% 场景 4: 手动转账 (Address Transfer) - 含差额处理
    %% ============================================================
    Note over User, Chain: 场景 4: 手动地址转账与差额处理 (Address Transfer & Amount Logic)

    User->>UI: 点击 "Address Transfer"
    UI->>Hook: selectWallet('transfer')
    Hook-->>UI: 状态变更为 TRANSFER_FLOW
    
    User->>UI: 点击 "Generate Address"
    UI->>Chain: 请求充值地址 (API)
    Chain-->>UI: 返回 Address & 锁定汇率
    UI-->>User: 展示 QR Code, Address, 应付金额 ($20.00 / 20 USDT)

    User->>Chain: 用户通过交易所/冷钱包转账
    
    rect rgb(255, 240, 245)
        Note right of Chain: 后端异步监听 (Backend Listener)
        Chain->>Hook: WebSocket/Polling 推送入账事件
        
        alt 足额支付 (Exact Amount)
            Hook-->>UI: 状态变更为 SUCCESS
            UI-->>User: 展示“支付成功”
        
        else 少付 (Underpayment)
            Hook-->>UI: 状态变更为 PARTIAL_PAYMENT
            UI-->>User: 警告弹窗: "Received: 18 USDT, Remaining: 2 USDT"
            User->>Chain: 补齐剩余金额
            Chain->>Hook: 检测到补单 -> SUCCESS
        
        else 多付 (Overpayment)
            Hook-->>UI: 状态变更为 OVER_PAYMENT
            UI-->>User: 提示成功 "Paid 22 USDT. Excess 2 USDT will be credited."
            Hook-->>UI: 延迟跳转 SUCCESS
        end
    end

    User->>UI: 点击 "I Have Transferred" (手动触发查询)
    UI->>Chain: 主动查询订单状态
    Chain-->>UI: 返回当前入账金额
    UI-->>User: 根据上述逻辑展示对应状态
```
