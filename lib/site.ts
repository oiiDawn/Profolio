/** 站点级数据：顶栏、页脚与各页共用 */

/** 站点首次上线或本次部署日（用于首页运行天数展示），ISO 8601 */
export const siteDeployDate = "2024-06-01T00:00:00+08:00";

export const contactLinks = [
  {
    label: "邮箱",
    href: "mailto:oii.zhangjm@gmail.com",
    external: false,
    ariaLabel: "发送邮件",
  },
  {
    label: "GitHub",
    href: "https://github.com/oiidawn",
    external: true,
    ariaLabel: "在 GitHub 打开个人主页",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/yourprofile",
    external: true,
    ariaLabel: "在 LinkedIn 打开",
  },
  {
    label: "X",
    href: "https://x.com/oiidawn",
    external: true,
    ariaLabel: "在 X 打开",
  },
] as const;

export const siteOwner = "Zhang JM";

export const timeline = [
  {
    year: "2022",
    event:
      "开始系统学习前端：HTML/CSS/JS 基础、React 与 TypeScript，完成首个可上线的练习项目。",
  },
  {
    year: "2023",
    event:
      "完成多轮个人项目迭代：从组件化到路由与状态管理，注重可维护性与部署流程。",
  },
  {
    year: "2024",
    event:
      "将重心放在产品思维与用户体验：信息架构、交互细节与可访问性，而不只是实现功能。",
  },
  {
    year: "Now",
    event:
      "持续构建个人站点与内容输出：把方法论写成可复用的笔记，并探索与社区协作的方式。",
  },
] as const;

export const stackTags = [
  "NEXT_JS",
  "TYPESCRIPT",
  "PRODUCT_UX",
  "CONTENT",
] as const;

export const shares = [
  {
    id: "01",
    title: "我如何管理长期学习计划",
    desc: "用季度目标 + 每周复盘，把「想学很多」变成「持续推进」。",
    tag: "学习方法",
    readTime: "约 6 分钟",
  },
  {
    id: "02",
    title: "做项目时最有用的 3 个习惯",
    desc: "先定义问题、先做最小闭环、每次迭代只解决一个核心阻塞。",
    tag: "项目实践",
    readTime: "约 5 分钟",
  },
  {
    id: "03",
    title: "我的效率系统（工具 + 流程）",
    desc: "从灵感收集到执行追踪，搭建一个不依赖意志力的工作流。",
    tag: "个人效率",
    readTime: "约 8 分钟",
  },
] as const;

export const projects = [
  {
    id: "P01",
    title: "Profolio · 个人主页",
    desc: "Next.js 14 + TypeScript + Tailwind，Terminal Architect 视觉系统，多页路由与 Vercel 部署。",
    tag: "本站",
    href: "https://github.com/oiidawn",
    linkLabel: "仓库",
  },
  {
    id: "P02",
    title: "组件与工具实验",
    desc: "小型 UI 与脚本仓库：练习可复用组件、无障碍与性能边界。",
    tag: "开源",
    href: "https://github.com/oiidawn",
    linkLabel: "GitHub",
  },
  {
    id: "P03",
    title: "更多项目",
    desc: "工作流与 side project 持续补充中；欢迎通过邮件或社交账号交流想法。",
    tag: "进行中",
    href: "mailto:oii.zhangjm@gmail.com",
    linkLabel: "联系",
  },
] as const;
