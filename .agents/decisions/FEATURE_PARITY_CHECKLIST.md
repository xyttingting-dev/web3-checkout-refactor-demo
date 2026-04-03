# Feature Parity & Technical Logic Checklist

This document maps the core functional and technical logic from the **Old Checkout Version** to ensure that absolutely nothing is dropped or omitted during the **New Version UI/UX Refactoring**. 

## 1. 核心订单上下文层 (Core Order Context)
| 旧版功能点 (Old Feature) | 业务/技术作用 (Technical Purpose) | 新版重构必须保留的要求 (New Version Requirement) |
| --- | --- | --- |
| **商品与总价锁定** (Goods & Total Payment) | 展示支付目标及精度（如 `5.00 USDT`） | 必须高亮展示。精度控制算法不可变。 |
| **流水号双展示** (Merchant & Payment Order No) | `商户订单号` 与 `支付订单号` 分离展示，附带 Copy 按钮，便于排障 | 必须保留两者并支持一键复制，但 UI 层级需弱化以防干扰主行动点。 |
| **国际化支持** (i18n Toggle) | 左下角的 `中/EN` 切换以及 Privacy/Disclosure 链接 | 必须保留 i18n Context 切换能力及合规链接。 |

## 2. 支付方式与路由分配层 (Payment Method & Routing)
| 旧版功能点 (Old Feature) | 业务/技术作用 (Technical Purpose) | 新版重构必须保留的要求 (New Version Requirement) |
| --- | --- | --- |
| **三大支付通道切换** (Payment Options) | 隔离交互流：`地址转账` (传统)、`链接钱包` (Web3 Native)、`第三方合作` (法币/聚合) | 业务通道隔离不可变，但新版需通过更智能的“入口环境监测”决定首屏透出优先级。 |
| **币种与网络级联选择** (Token & Network Cascading) | 同一个 Token（如 USDT）跨多链（Tron, ETH, BSC等）。必须先选币，再选链。 | 级联选择的映射逻辑必须保留。**极其重要：须保留防呆设计**（不可出现空网络）。 |
| **🌟 预期到账时间预估** (Estimated Time of Arrival) | UX 亮点：明确告知 `Tron: 16s`, `Avalanche: 25s`, `Polygon: 125s` | **此功能属于极佳的 UX 设计，新版绝对不可遗漏！** 需在选择网络时透出预估秒数。 |

## 3. 支付执行与倒计时层 (Execution & Session State)
| 旧版功能点 (Old Feature) | 业务/技术作用 (Technical Purpose) | 新版重构必须保留的要求 (New Version Requirement) |
| --- | --- | --- |
| **订单失效倒计时** (Order Expiry Time) | 释放锁定的汇率或超时熔断。旧版显示具体时间 `23:12:21` | 必须保留倒计时轮询 (Polling/WebSocket)。建议新版改为倒数 (MM:SS) 提升紧迫感。 |
| **分步支付状态感知** (Partial/Paid Status) | 展示 `已支付 0.00` | 必须保留针对**多次打款/部分到账**状态的监听及数据渲染能力。 |
| **链上追踪** (Track Button) | 唤出区块浏览器 (Block Explorer) Tx Hash 或内部状态流转弹窗 | 必须保留交易哈希上链后的追踪快捷键。 |

## 4. 地址转账兜底模式 (Address Transfer Fallback)
| 旧版功能点 (Old Feature) | 业务/技术作用 (Technical Purpose) | 新版重构必须保留的要求 (New Version Requirement) |
| --- | --- | --- |
| **支付信息多维展示** (Address + QR) | 同时提供 `0x...` 复制及针对移动端的 `QR Code` 扫描 | 必须完整保留，二维码组件生成逻辑不可弃。 |
| **转账规则强提示** (Strict Rules Warning) | 提示“不包 Gas”、“不可转非 USDT 资产”、“金额需完全一致” | 必须保留该文本或通过组件级 Alert 强化该阻断警告，防错打款。 |
| **同页内通道热切** (In-page Tab Switching) | 在最后付款页，依然允许用户在`地址转账|浏览器插件|钱包扫码`热切换 | 此处的底层逻辑证明后端 API 支持同一 Session 热切换支付手段，新版可通过更优雅的交互（如“Change Method”弹窗）继承此特性。 |

## 5. Web3 钱包生态与插件交互 (Web3 Wallet & Extension Ecosystem)
| 旧版功能点 (Old Feature) | 业务/技术作用 (Technical Purpose) | 新版重构必须保留的要求 (New Version Requirement) |
| --- | --- | --- |
| **主流钱包插件直连** (Browser Extension) | 支持 MetaMask, Bitget, OKX, Coinbase, Particle, WalletConnect, imToken, CoolWallet 等 8个主流协议 | 必须接入等效的 Wagmi/Web3Modal 或自定义 Connector 矩阵，并根据用户环境自动响应 (Injected Providers)。 |
| **双码扫码流** (Dual QR Code Scanner) | 提供针对特定钱包环境的二维码组合（如左侧通配符 vs 右侧多渠道） | 新版扫码支付聚合页中，必须妥善处理标准二维码扫描与 Deep Link / URI Intent 之间的切换能力。 |

## 6. 异常状态与防流失机制 (Edge Cases & Retention)
| 旧版功能点 (Old Feature) | 业务/技术作用 (Technical Purpose) | 新版重构必须保留的要求 (New Version Requirement) |
| --- | --- | --- |
| **网络切换资金防损弹窗** (Network Switch Lock Modal) | 检测到变更可能导致“已打款丢失”的风险时，阻断并抛出红字警告：`已经转账后切换网络会导致...` | **强要求 (Critical)**: 此保护弹窗必须在业务层 1:1 继承。哪怕新版交互如何扁平，底层保护逻辑也绝不能减配！ |
| **链上拥堵安抚状态** (Network Congestion Spinner) | 当区块打包慢时，主动全屏/局部锁死，提示语句`支付网络当前拥堵，请不要离开...` | **UX 必备**: WebSocket 或轮询监听到慢网状态时，必须切换至专门的拥堵安抚态 (Congestion UI)，防重复流窜并发起。 |

---
*结论：所有 UI 重构行为，必须基于本 Checklist 进行回归测试 (Regression Test)。一切对新版“高大上”美的追求，不可以在以上逻辑上发生任何妥协。*
