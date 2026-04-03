# 🧾 协作决策清单 (Decision Report)

本文档专门用于记录 Antigravity (Detail Polisher / Stability Architect / Stern Auditor) 与开发者协同确认的所有技术方案、设计微调和业务链路验证结果。
所有经双方确认“通过 (Approved)”的改动都将在此留档，作为后续回归测试和架构演进的唯一真理来源 (Single Source of Truth)。

---

## 🛠️ 当前审查周期：收银台交互方式升级 (UI/UX & 逻辑重构)
**目标工作区**：`bonuspay-demo`
**记录人**：Antigravity
**开始日期**：2026-03-18

### 📝 决策追踪表

| 编号 | 审计模块 / 涉及链路 | 发现的视觉 / 逻辑偏差 | 共同决议的修复方案 (Decision) | 经手特工 | 状态 |
| :-- | :--- | :--- | :--- | :--- | :--- |
| 001 | Web3 Checkout UI - Header | 顶部 Banner 及药丸按钮(| Goods |、详情v) Y轴内边距不足，缺乏呼吸感 | (等待用户审批与方案录入) | Detail Polisher | 🟡 待审批 |
| 002 | Web3 Checkout UI - Amount | 核心金额(5.15 USDT)下方紧迫，缺乏分离留白 | (等待用户审批与方案录入) | Detail Polisher | 🟡 待审批 |
| 003 | Web3 Checkout UI - Grid | 九宫格钱包区横向与纵向间距(gap)断层，比例失衡 | (等待用户审批与方案录入) | Detail Polisher | 🟡 待审批 |
| 004 | Web3 Checkout UI - Text | 钱包次级名称文本色值过浅，在杂乱 Logo 中丢失视觉抓手 | (等待用户审批与方案录入) | Detail Polisher | 🟡 待审批 |
| 005 | Web3 Checkout UI - Hover | 钱包卡片主体缺失由 Border/Shadow/Scale 组成的复合 CSS 悬停微动效反馈 | (等待用户审批与方案录入) | Detail Polisher | 🟡 待审批 |
| 006 | Web3 Checkout UI - Footer | 底部 "Show more wallets" 展开图标纵向光学校准严重偏上 | (等待用户审批与方案录入) | Detail Polisher | 🟡 待审批 |
| 007 | Network Selection | 订单号未使用等宽字体(Mono)；链选择块的余额与时间标记视觉引导偏弱 | (等待用户审批与方案录入) | Detail Polisher | 🟡 待审批 |
| 008 | Error Fallback | 错误 Banner 与 Tab 栏间距脱节；双并排二维码容器导致视觉极度拥挤 | (等待用户审批与方案录入) | Detail Polisher | 🟡 待审批 |
| 009 | Connecting Status | 毛玻璃白底遮罩过度洗白背景；缺乏带有缩放阴影的高级呼吸动效反馈 | (等待用户审批与方案录入) | Detail Polisher | 🟡 待审批 |
| 010 | Address Transfer - Layout | `转账` 大标题冗余累赘；表单域两侧留白失控（无 max-width 约束）；底部生成按钮全黑生硬，与顶部弥散光效严重割裂 | (等待用户审批与方案录入) | Detail Polisher | 🟡 待审批 |
| 011 | Address Transfer - Input | 长地址展示框的复制操作错误使用了紫色“放大镜”图标；下方“仅限USDT”橘色提示缺少危险图标且缺乏胶囊感的内间距修饰 | (等待用户审批与方案录入) | Detail Polisher | 🟡 待审批 |
| 012 | Address Transfer - Actions | 复制/保存/二维码三大圆形操作按钮纵横向间距诡异，像孤岛般漂浮在大段留白中；点击弹出的全尺寸二维码气泡直接遮盖核心支付信息，交互极度粗暴 | (等待用户审批与方案录入) | Detail Polisher | 🟡 待审批 |
| 013 | Wallet Scan - QR Layout | “钱包扫码”面板内超大矩形白框包裹双二维码，并用廉价的灰色单竖线分割，信息密度极低且横向屏效极差（满屏白地） | (等待用户审批与方案录入) | Detail Polisher | 🟡 待审批 |
| 014 | Loading & Verification | “验证交易中”过度的半圆蓝色 Spinner 十分简陋；“我知道了”按钮退化为干瘪默认文字链接，缺乏可点击的心智模型；整体视觉底版空洞无物 | (等待用户审批与方案录入) | Detail Polisher | 🟡 待审批 |
| 015 | Global Header | 顶部紫色渐变主面板的外边缘处理过于粗暴切割，缺失能衬托“高级质感”的内层反光（Inner Shadow / Ring）或细腻的 1px 玻璃态描边 | (等待用户审批与方案录入) | Detail Polisher | 🟡 待审批 |
| 016 | Order Details Toggle | 展示位的 `详情 ∨` 展开按钮使用了毫无生命力的实心浅灰胶囊块，在原本应该是视觉重心（金额下方）的位置毫无立体光影感 | (等待用户审批与方案录入) | Detail Polisher | 🟡 待审批 |
| 017 | Error Box Container | `连接失败` 的大宽报警卡片边缘极其粗糙；大块面实心浅橙色平铺，严重缺失轻量化边框勒出精致感（如 `border-orange-500/10`）与微投影 | (等待用户审批与方案录入) | Detail Polisher | 🟡 待审批 |
| 018 | Address Transfer Button | 钱包九宫格底栏的“Address Transfer”入口按钮极丑；单薄廉价的细蓝线描边框，加上极其违和的“灰白三圆圈+More”，排版杂乱且毫无按钮应有的饱满触感级别 | (等待用户审批与方案录入) | Detail Polisher | 🟡 待审批 |
| 019 | Error Fallback UX | `连接失败` 报错卡片中的“重试”操作毫无逻辑：实际交互是退回首页，并未原地重连当前钱包；文案语义（Retry）与实际路由行为（Back to Home）严重背离，彻底摧毁用户控制感 | (等待用户审批与方案录入) | Detail Polisher | 🟡 待审批 |
| 020 | Dual QR Layout (Wallet Scan) | “钱包扫码”双二维码极度简陋丑陋：在一个巨大的白框中粗暴并排塞入两个码，中间仅用一条极细灰线隔开，屏效极低且极其“线框图”；下方图标语义不明（无文字标识），说明文案悬浮排版亦完全失衡 | (等待用户审批与方案录入) | Detail Polisher | 🟡 待审批 |
| 021 | Missing Context (Address Transfer) | 兜底的“地址转账”生成地址后，页面完全丢失了用户刚刚选择的“公链网络（Network）”和“币种（Token）”上下文；在 Crypto 支付中隐藏这些核对信息是致命的安全体验缺陷 | (等待用户审批与方案录入) | Detail Polisher | 🟡 待审批 |
| 022 | Weak Warning Copy (Address Transfer) | 充值页面的提示语“仅将USDT 发送至此地址”文案软弱无力且语境缺失，未能强调报错网络会导致资产永久丢失的严重性，同时 UI 展现形式（浅橙色底+红字）不够高级且缺乏秩序感 | (等待用户审批与方案录入) | Detail Polisher | 🟡 待审批 |
| 023 | Gradient Tuning (Banner & BG) | 顶部 Banner 需在“紫-粉-橙”的过渡中融入更多蓝色（Blue）作为点缀；整屏背景（Background）左下角需补充蓝色光源漫反射，右下角需补充橙色光源浸染，提升整体空间层次感 | (等待用户审批与方案录入) | Detail Polisher | 🟡 待审批 |
| 024 | DApp Browser Auto-Connect UX | 在移动端钱包内置浏览器（DApp Browser）打开时，首页渲染了一个破碎且毫无关联的布局（孤立的 Provider 卡片 + 下方变形的四个灰点连着 Address Transfer）。在 DApp 环境中应直接感知注入的 Provider 并提供醒目的“Pay with Current Wallet”主行动点，而非展示残缺的钱包列表大盘 | (等待用户审批与方案录入) | Detail Polisher | 🟡 待审批 |
| 025 | Mobile Network Selection Density | 移动端钱包浏览器中的“Choose Network”两列网格布局过于臃肿，按钮粗大且屏效极低；缺乏移动端原生的沉浸感（如底部弹窗 Bottom Sheet 形式或更紧凑的单列列表形态），且标题层级不清晰 | (等待用户审批与方案录入) | Detail Polisher | 🟡 待审批 |
| 026 | DApp Context Fallback Actions | 在钱包浏览器内生成的转账地址页面，底部的三大操作（Copy, Save Image, QR Code）排版极度稀疏散乱。更严重的是，在 DApp 环境内本可以直接唤起钱包原生转账（Send Transaction），但此处仍将其作为纯离线扫码工具处理，没有根据“入口环境（Entry Point）”做使用习惯的上下文特化降维或升维 | (等待用户审批与方案录入) | Detail Polisher | 🟡 待审批 |
| 027 | Mobile Web Wallet Grid Layout | 在移动端独立浏览器（如 Safari）首屏，3x3 的钱包九宫格极大占据了纵向空间，下方紧贴着依然处于碎裂状态的“Address Transfer”兜底方案。各大区块之间缺少明确的视觉分割线（Divider）或层级阴影，导致整个操作区扁平且粘连 | (等待用户审批与方案录入) | Detail Polisher | 🟡 待审批 |
| 028 | Order Details Accordion UI | 订单“Details”下拉展开后的键值对（Key-Value）排版极度失衡。左侧 Label 和右侧 Value 之间缺乏视觉引导锚点，排版间距被生硬拉扯至屏幕两端，导致视觉追踪动线（Eye Tracking）断裂，显得极不专业 | (等待用户审批与方案录入) | Detail Polisher | 🟡 待审批 |
| 029 | Deep Link Execution Flow (Critical) | 在 Mobile Safari 中点击 MetaMask 等钱包，现有的跳转逻辑是粗暴地利用 Universal Link 将当前 URL 强行扔进钱包内置的 DApp 浏览器中再开一遍！这导致用户跳转后必须经历“同意打开 DApp -> 重新加载页面 -> 重新点击连接 -> 重新发起支付”的自杀式冗长链路。现代 Web3 Checkout 必须通过 WalletConnect v2 或 Native Provider URI Scheme 直接将转账签名弹窗拉起（Deep Link Payload），实现真正的无缝拉起支付 | (等待用户审批与方案录入) | Detail Polisher | 🟡 待审批 |---
*注：本文件随工作流实时更新。每次代码合入前，请审计本表。*
··