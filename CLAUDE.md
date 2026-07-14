# CLAUDE.md

本文件用于说明 Claude Code 在本项目中的协作约定。

## 项目概览

- **项目类型**：个人主页 / 作品集站点，包含写作分享系统
- **技术栈**：Next.js 14、React 18、TypeScript、Tailwind CSS 4
- **包管理器**：统一使用 `pnpm`（≥10.18.2），不要混用 `npm` / `yarn`
- **Node 版本**：≥20.0.0（见 `package.json` engines）
- **文档语言**：本项目 `CLAUDE.md` 统一使用中文编写
- **路由结构**：`/`、`/about`、`/projects`、`/writing`、`/writing/[id]`
- **路径别名**：`@/*` 映射到项目根目录（见 `tsconfig.json` paths）
- **设计规范**：详见 `DESIGN.md`（Terminal Architect 设计系统：暗色主题、霓虹能量色、直角组件）

## 安装与常用命令

```bash
pnpm install                    # 安装依赖
pnpm dev                        # 本地开发服务
pnpm build                      # 生产构建
pnpm start                      # 启动生产服务
pnpm lint                       # ESLint 检查
pnpm typecheck                  # tsc -p tsconfig.typecheck.json --noEmit
pnpm check:fast                 # lint + typecheck（pnpm check 为其别名）
pnpm ci:pr                      # check:fast + build（PR 验证流程）
pnpm upload-writing ./path/to/article.mdx  # 上传写作内容
```

## 目录结构

```text
app/
  layout.tsx               # 根布局，本地字体、Topbar/Footer、Vercel Analytics/SpeedInsights
  page.tsx                 # 首页 / hero terminal 体验
  globals.css              # 全局样式与设计令牌
  icon.svg                 # 站点图标（自动生成）
  opengraph-image.tsx      # OG 图片（自动生成）
  about/page.tsx           # 关于我 + 时间线
  projects/page.tsx        # 项目列表 + 贡献热力图
  writing/
    page.tsx               # 来自 Supabase `writing_shares` 的分享列表
    writing-page-view.tsx  # Writing 页面视图组件
    error.tsx              # Writing 列表错误边界
    [id]/
      page.tsx             # MDX 文章页 / 外链跳转页
      article-helpers.tsx  # 文章页辅助组件
      error.tsx            # 文章页错误边界
      loading.tsx          # 文章页加载态
      not-found.tsx        # 文章页 404
components/
  layout/                  # topbar.tsx、footer.tsx、contact-links-nav.tsx
  ui/                      # 可复用 UI 基础组件（button、badge、card）
  mdx/mdx-components.tsx   # 写作文章的 MDX 渲染样式
  hero-terminal.tsx        # 首页终端交互
  typing-cycle.tsx         # 打字循环动画
  circuit-backdrop.tsx     # 电路纹理背景
  page-shell.tsx           # 页面通用外壳
  section-label.tsx        # 章节标签
  status-bar.tsx           # 状态栏
  github-contribution-calendar.tsx  # react-github-calendar 封装
  github-activity-log.tsx  # GitHub 活动日志
  github-top-repos-chart.tsx       # GitHub 热门仓库图表
  projects-calendar-log-row.tsx    # 项目页日历+日志行
lib/
  site.ts                  # 站点级静态内容（联系方式、时间线、部署日期）
  github.ts                # GitHub API 拉取公开仓库
  supabase.ts              # Supabase 服务端 client 工厂
  writing.ts               # 从 Supabase / Storage 读取分享数据并带缓存
  mdx-compile.ts           # next-mdx-remote + remark-gfm + rehype-pretty-code
  types.ts                 # 写作数据的共享 schema / 类型（Zod）
  utils.ts                 # 通用工具函数（cn 等）
scripts/
  upload-writing.ts        # 上传 MDX / 外链并 upsert `writing_shares`
content/writing/           # 本地 MDX 草稿目录，仅作为上传输入，运行时不读取
supabase/
  writing.sql              # `writing_shares` DDL + RLS
  writing.seed.sql         # 种子数据（可选）
DESIGN.md                  # Terminal Architect 设计系统规范
tsconfig.typecheck.json    # 不依赖 `.next/types` 的类型检查配置
next.config.mjs            # Next.js 配置（reactStrictMode）
vercel.json                # Vercel 部署配置
.husky/
  pre-commit               # lint-staged（未安装时回退 lint）
  pre-push                 # check:fast（未定义时回退 check）
.lintstagedrc.json         # lint-staged：eslint --max-warnings=0 --fix
.agents/                   # 项目内 agent 技能（supabase、humanizer-zh 等）
package.json               # engines: node ≥20, pnpm ≥10.18.2
```

## 工作规则

1. 修改保持聚焦，除非用户明确要求，否则不要做大范围重构。
2. 优先保持 TypeScript 安全（strict mode），沿用现有组件模式。
3. 文案默认保持当前中文语气，除非用户明确要求英文。
4. 新增 UI 前先检查 `components/ui` 是否已有可复用组件。
5. 完成较大修改后运行 `pnpm check:fast`；至少运行与改动最相关的校验命令。
6. 修改静态个人信息、项目、时间线、联系方式时，优先检查 `lib/site.ts`，不要分散硬编码到页面文件。
7. 涉及依赖安装、脚本执行、锁文件变更时，默认使用 `pnpm`。
8. 共享页面框架在 `components/layout`；站点级静态数据在 `lib/site.ts`。
9. 设计令牌扩展统一收敛到 `app/globals.css`，并保持与 `DESIGN.md` 规范一致。

## 样式约定

- 遵循 `DESIGN.md` 中的 Terminal Architect 设计系统：暗色主题、霓虹能量色（cyan/purple/pink）、直角（`rounded-none`）。
- 优先沿用 `app/page.tsx` 中已有的 utility-first 风格。
- 优先做语义化的间距、排版调整，避免零散 magic values。
- 非必要不要加入过重动画；动效尊重 `prefers-reduced-motion`。
- 修改全局样式时，要检查主要页面，不要只看当前路由。
- 字体通过 `app/layout.tsx` 中的本地 `@fontsource/*` 引入（Space Grotesk + JetBrains Mono）；不要切换到远程字体加载。

## 写作数据流

- `/writing` 只读取 Supabase 表 `public.writing_shares`；没有本地占位文章列表。
- `/writing/[id]` 先读取 share 行，再对 `md` 类型条目从公开 Storage bucket `writing` 下载原始 MDX，通过 `lib/mdx-compile.ts` 编译渲染。
- `type = "link"` 跳转到 `url`；`type = "md"` 依赖 `file_path`。
- `content/writing/` 下的本地文件只是上传输入，运行时不读取。
- `/projects` 仅从 GitHub 拉取公开仓库，失败或无可用仓库时显示说明，不维护本地备用列表。
- `/projects` 贡献热力图使用 `react-github-calendar`，数据由 `github-contributions-api.jogruber.de` 提供，与 GitHub 网页可能略有差异。

## Supabase 与环境变量

| 变量 | 必需 | 说明 |
|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | 读取写作 | Supabase 项目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 读取写作 | Supabase 匿名 key |
| `SUPABASE_SERVICE_ROLE_KEY` | 仅上传脚本 | **禁止暴露到前端**，不要放入 `NEXT_PUBLIC_*` |
| `GITHUB_USERNAME` | 可选 | GitHub 用户名（未设置时用 `lib/site.ts` 的 `siteGithubUsername`） |
| `GITHUB_TOKEN` | 可选 | 仅服务端，提高 GitHub API 速率限制 |

- 需先在 Supabase SQL Editor 执行 `supabase/writing.sql`，并创建名为 `writing` 的**公开** Storage bucket。
- 环境变量未配置时 `/writing` 可能显示空状态；先检查配置，不要先假设前端 bug。

## 写作上传流程

```bash
# 新建 MDX 文章
pnpm upload-writing ./path/to/article.mdx

# 更新已有文章
pnpm upload-writing ./path/to/article.mdx --id <uuid>

# 创建或更新外链分享
pnpm upload-writing --link --url <https://...> --title <title> [--description ...] [--tag ...] [--id <uuid>]
```

- 常用参数：`--dry-run`、`--strip-frontmatter`、`--file-path`
- frontmatter / payload 校验复用 `lib/types.ts` 中的 Zod schema。

## 缓存与验证

- writing 相关页面使用 300 秒 revalidate 窗口；新上传内容不会立刻出现。
- `lib/writing.ts` 使用了 `unstable_cache`，短时间延迟可能是正常缓存行为。
- 修改写作系统后，至少手动验证：
  - `/writing` 列表正常展示
  - `/writing/[id]` 的 MDX 渲染或外链跳转正常

## Git 与交付

- 使用小而清晰的提交。
- 不要提交 secrets、`.env` 或本地环境文件。
- 项目面向 Vercel 部署；涉及发布操作先确认目标平台。
