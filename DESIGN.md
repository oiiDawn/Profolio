# Design System: Terminal Architect（Stitch「Dynamic Engineer Portfolio」）

本文件描述从 Google Stitch 项目 **Dynamic Engineer Portfolio** 提取并落地到本站的视觉与布局规范。创意方向：**终端建筑师**——黑曜石底色 + 霓虹能量色，像操作一台高对比度的「命令中心」，而非传统 SaaS 落地页。

## 1. 创意方向与氛围

- **North Star**：代码即界面、界面即系统。拒绝圆角友好风与「安全」的灰阶，拥抱**刻意不对称**、**等宽字元数据**与**层级分明的暗色表面**。
- **情绪关键词**：高对比、可执行感、赛博工程、终端、HUD。
- **与 Stitch 的对应**：Home（终端英雄区 + 预览栅格）、Vault（项目 bento）、Identity（技能/指标）、Frequency（ masonry 灵感的内容块）——本站单页聚合这些区块的角色。

## 2. 色彩体系

### 模式

仅 **Dark**。页面基底为近黑，不用浅色主题。

### 能量色（Accent）

| 角色 | 色名 | Hex | 用途 |
|------|------|-----|------|
| Primary | Electric Cyan | `#8ff5ff` | 主 CTA、高亮数据、链接、终端提示符 |
| On Primary | Deep Teal | `#005d63` | 主按钮上的文字 |
| Secondary | Neon Purple | `#d575ff` | 标签、副强调、侧栏光晕 |
| Tertiary | Hot Pink | `#ff6e81` | 状态角标、警示性强调 |

### 表面层级（由深到浅）

| Token | Hex | 用途 |
|-------|-----|------|
| surface / background | `#0e0e0e` | 页面背景 |
| surface-container-lowest | `#000000` | 最深遮罩、渐变端点 |
| surface-container-low | `#131313` | 次级区块 |
| surface-container | `#1a1919` | 卡片默认 |
| surface-container-high | `#201f1f` | 抬升卡片 |
| surface-container-highest | `#262626` | 更高一层 |
| surface-bright | `#2c2c2c` | 局部提亮 |

### 文本与线

| Token | Hex | 用途 |
|-------|-----|------|
| on-surface / foreground | `#ffffff` | 主正文 |
| on-surface-variant | `#adaaaa` | 次要说明 |
| outline | `#777575` | 弱分割线、输入底线 |
| outline-variant | `#494847` | Ghost border（约 10–15% 透明度叠用时更弱） |

### 深度与光

- **禁止**大面积传统 drop shadow。
- 使用 **霓虹色晕染**：`box-shadow: 0 0 20px–60px rgba(143, 245, 255, 0.05–0.15)`（可按组件缩小）。
- **Glass**：`rgba(38, 38, 38, 0.4)` + `backdrop-filter: blur(20px)`，左侧可配 `2px solid #8ff5ff` 作为「终端窗格」边。

## 3. 字体

| 角色 | 字体 | 回退 |
|------|------|------|
| 标题 / UI 标题 / 正文 UI | **Space Grotesk** | system-ui, sans-serif |
| 代码感标签、元数据、终端、年份标记 | **JetBrains Mono** | ui-monospace, monospace |

### 层级原则

- **Display / Hero**：Space Grotesk，粗体，大字号，`tracking-tighter`，常配合 **全大写**。
- **章节标题**：Space Grotesk，粗体，uppercase 或小标题混排。
- **正文**：Space Grotesk 常规，行高约 1.5–1.65；长段落保持可读宽度。
- **标签 / 元数据**：JetBrains Mono，10–12px，`tracking-widest` 或 `uppercase`，形如 `[SECTION_08]`、`STATUS: ONLINE`。

## 4. 形状与圆角

- **全局圆角：`0px`（直角）**。按钮、卡片、输入、徽章均为直角——这是该系统与「柔和产品风」的核心差异。
- 仅 **全圆** 用于极小装饰点（如状态圆点 `rounded-full`）。

## 5. 组件模式

### 按钮（Power Cell）

- **Primary**：填充 `#8ff5ff`，文字 `#005d63`，粗体；可加同色微弱外发光 hover。
- **Secondary / Ghost**：透明或暗面，边框用 `outline-variant` 低透明度；hover 可轻微 **skew** 或位移模拟 glitch（慎用强度）。

### 卡片（Glass Module）

- 背景：`surface-container-high` 或 glass 配方。
- 边框：尽量用 **背景层级差** 区分；必要時 1px `white/5` 或 `outline-variant/15`。
- 左上角可加 **Tech-ID**：`[PROJECT_01]`，JetBrains Mono。

### 导航

- **顶栏**：固定，`backdrop-blur`，底边 `border-white/5`。
- **侧栏（桌面）**：固定左侧，深色条 + 紫色侧向光晕（极弱）；当前项：左侧 cyan 条 + 半透明 cyan 背景。

### 背景纹理

- **Circuit**：径向点阵，低透明度（约 3–5%）。
- **Scanline**：全屏固定层，极低透明度（约 2%），不阻挡点击 `pointer-events-none`。

## 6. 布局原则

- **Bento / 不规则栅格**：大屏使用 `grid-cols-12` 与 `col-span` 制造不对称。
- **留白**：在深色底上，留白是「黑空间」——靠层级与霓虹点题，而非大量装饰。
- **路由**：主导航为 `/`、`/about`、`/projects`、`/writing`；子页共用顶栏与页脚。

## 7. 动效

- **入场**：可用自左向右的 reveal（与 Stitch 建议一致）；尊重 `prefers-reduced-motion`。
- **悬停**：卡片轻微 `-translate-y-1` + 霓虹 shadow；避免过度弹跳。

## 8. Do / Don’t

**Do**

- 用 cyan 表示「可执行 / 实时 / 主路径」。
- 用紫色作次级能量与标签。
- 保持等宽字用于系统感文案。
- 用表面色阶做层次，少画线。

**Don’t**

- 不要用大圆角作为主语言（与系统定义冲突）。
- 不要用冷灰蓝中性色铺满（中性沿用暖灰 `#494847`–`#777575` 体系）。
- 不要用重 drop shadow 代替霓虹晕染。
- 不要用浅色整页背景（本系统为纯暗）。

## 9. 实现速查（给 Agent）

- 主色引用：`primary #8ff5ff`，`on-primary #005d63`，`secondary #d575ff`，`tertiary #ff6e81`，`background #0e0e0e`。
- 工具类语义：`bg-background`、`text-primary`、`font-mono`、`rounded-none`、`glass-panel`、`circuit-bg`、`scanline-overlay`。

## 10. 来源

- Google Stitch 项目：**Dynamic Engineer Portfolio**（主题名 Terminal Architect / High-End Creative Coding）。
- 本站 `DESIGN.md` 为对该设计稿 tokens 与模式的**提取与本地化**，非逐像素复刻第三方 HTML。
