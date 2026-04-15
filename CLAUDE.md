# CLAUDE.md

本文件用于说明 Claude Code 在本项目中的协作约定。

## 项目概览

- **项目类型**：个人主页 / 作品集站点，包含写作分享系统
- **技术栈**：Next.js 14、React 18、TypeScript、Tailwind CSS
- **包管理器**：统一使用 `pnpm`，不要混用 `npm` / `yarn`
- **文档语言**：本项目 `CLAUDE.md` 统一使用中文编写
- **路由结构**：主要页面位于 `/`、`/about`、`/projects`、`/writing`、`/writing/[id]`

## 安装与常用命令

```bash
pnpm install
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm typecheck              # 建议指向 `tsc -p tsconfig.typecheck.json --noEmit`
pnpm test
pnpm test:unit
pnpm test:component
pnpm test:data
pnpm test:e2e
pnpm test:visual
pnpm test:a11y
pnpm check:fast            # lint + typecheck + unit/component/data
pnpm check:full            # check:fast + build + e2e/a11y/visual（按 CI 策略）
pnpm upload-writing ./path/to/article.mdx
```

## 目录结构

```text
app/
  layout.tsx               # 根布局，本地字体、Topbar/Footer、Vercel Analytics/SpeedInsights
  page.tsx                 # 首页 / hero terminal 体验
  about/page.tsx           # 关于我 + 时间线
  projects/page.tsx        # 项目列表
  writing/page.tsx         # 来自 Supabase `writing_shares` 的分享列表
  writing/[id]/page.tsx    # MDX 文章页 / 外链跳转页
  globals.css              # 全局样式与设计令牌
components/
  layout/                  # Topbar、Footer、ContactLinksNav
  mdx/mdx-components.tsx   # 写作文章的 MDX 渲染样式
  ui/                      # 可复用 UI 基础组件
lib/
  site.ts                  # 站点级静态内容（联系方式、时间线、项目、部署日期）
  supabase.ts              # Supabase 服务端 client 工厂（按环境变量启用）
  writing.ts               # 从 Supabase / Storage 读取分享数据并带缓存
  mdx-compile.ts           # next-mdx-remote + remark-gfm + rehype-pretty-code
  types.ts                 # 写作数据的共享 schema / 类型
scripts/
  upload-writing.ts        # 上传 MDX / 外链并 upsert `writing_shares`
content/writing/           # 本地 MDX 草稿/源文件目录，仅作为上传输入，不是运行时内容源
tests/
  lib/types.test.ts
  scripts/upload-writing.test.ts
  setup/node.ts            # Vitest Node 测试环境 setup
  setup/jsdom.ts           # Vitest + Testing Library 的 JSDOM setup
vitest.config.ts           # Vitest 根配置（Node/JSDOM 分流、coverage）
tsconfig.typecheck.json    # 不依赖 `.next/types` 的类型检查配置
tsconfig.vitest.json       # 测试类型环境配置
.lintstagedrc.json         # lint-staged 规则
.husky/
  pre-commit               # lint-staged（若未安装则回退 lint）
  pre-push                 # 优先 check:fast（若未定义则回退 check）
.agents/                   # 项目内 agent 相关资源
skills-lock.json           # skill lockfile（已跟踪）
supabase/
  writing.sql              # `writing_shares` 的 DDL + RLS（无 seed 数据）
package.json
```

## 工作规则

1. 修改保持聚焦，除非用户明确要求，否则不要做大范围重构。
2. 优先保持 TypeScript 安全，并沿用现有组件模式。
3. 文案默认保持当前中文语气，除非用户明确要求英文。
4. 新增 UI 前先检查 `components/ui` 是否已有可复用组件。
5. 完成较大修改后优先运行 `pnpm check:fast`（若尚未接入则回退 `pnpm check`）；至少运行与你改动最相关的校验命令。
6. 修改静态个人信息、项目、时间线、联系方式时，优先检查 `lib/site.ts`，不要把同类内容分散硬编码到页面文件。
7. 涉及依赖安装、脚本执行、锁文件变更时，默认使用 `pnpm` 体系处理。

## 样式约定

- 优先沿用 `app/page.tsx` 中已有的 utility-first 风格。
- 优先做语义化的间距、排版调整，避免零散 magic values。
- 非必要不要加入过重动画。
- 修改全局样式时，要检查主要页面，不要只看当前路由。
- 字体通过 `app/layout.tsx` 中的本地 `@fontsource/*` 引入；除非明确需要，不要切换到远程字体加载。

## 写作数据流

- `/writing` 只读取 Supabase 表 `public.writing_shares`；没有本地占位文章列表。
- `/writing/[id]` 会先读取 share 行，再对 `md` 类型条目从公开 Storage bucket `writing` 下载原始 MDX，最后通过 `lib/mdx-compile.ts` 编译渲染。
- `type = "link"` 的条目会跳转到 `url`；`type = "md"` 的条目依赖 `file_path`。
- `content/writing/` 下的本地文件只是作者编写/上传输入，不会在运行时被应用直接读取。
- About / Projects / 联系方式等静态站点内容统一维护在 `lib/site.ts`。

## Supabase 与环境变量

- 读取写作内容需要：
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- 仅本地发布写作用 `pnpm upload-writing` 时需要：
  - `SUPABASE_SERVICE_ROLE_KEY`
- 不要把 service role key 暴露到前端，也不要放进任何 `NEXT_PUBLIC_*` 变量。
- 需要先在 Supabase SQL Editor 执行一次 `supabase/writing.sql`，然后创建名为 `writing` 的**公开** Storage bucket。
- 如果环境变量未配置，`/writing` 可能显示空状态，文章页可能拿不到正文；先检查配置，不要先假设是前端 bug。

## 写作上传流程

- 新建 MDX 文章：
  - `pnpm upload-writing ./path/to/article.mdx`
- 更新已有文章：
  - `pnpm upload-writing ./path/to/article.mdx --id <uuid>`
- 创建或更新外链分享：
  - `pnpm upload-writing --link --url <https://...> --title <title> [--description ...] [--tag ...] [--id <uuid>]`
- 脚本支持的常用参数包括：`--dry-run`、`--strip-frontmatter`、`--file-path`
- frontmatter / payload 校验复用 `lib/types.ts` 中的 Zod schema。

## 缓存与验证说明

- writing 相关页面使用 300 秒 revalidate 窗口；新上传内容不一定会立刻出现。
- `lib/writing.ts` 使用了 `unstable_cache`，因此短时间内内容延迟可能是正常缓存行为。
- 一般代码改动优先运行 `pnpm check:fast`（若尚未接入则回退 `pnpm check`）。
- 新测试体系下优先运行 `pnpm check:fast`；涉及部署链路或发布前再跑 `pnpm check:full`。
- 修改写作系统后，至少手动验证：
  - `/writing` 列表是否正常展示
  - `/writing/[id]` 的 MDX 渲染或外链跳转是否正常
- `vitest.config.ts` 已提供 Node/JSDOM 双环境基础配置，后续新增组件/路由测试优先放到 `tests/frontend/`，数据与契约测试优先放到 `tests/data/`。

## Git 与交付

- 使用小而清晰的提交。
- 不要提交 secrets、`.env` 或本地环境文件。
- 项目当前面向 Vercel；如果后续涉及发布/部署操作，先确认目标平台再执行。

## 后续维护提示

- 共享页面框架主要在 `components/layout`；共享页面级数据主要在 `lib/site.ts`。
- 如果设计令牌继续扩展，统一收敛到 `app/globals.css` 中管理并命名清晰。
