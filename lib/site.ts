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
    label: "X",
    href: "https://x.com/oiidawn",
    external: true,
    ariaLabel: "在 X 打开",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jiaming-zhang-070277290",
    external: true,
    ariaLabel: "在 LinkedIn 打开个人主页",
  },
] as const;

export const siteOwner = "Zhang JM";

/** 成长轨迹：起止时间 + 机构 + 学位/职位 + 一句摘要；logo 为 public/logos 下静态资源 */
export const timeline = [
  {
    id: "buaa",
    from: "2016",
    to: "2020",
    org: "北京航空航天大学",
    role: "软件工程 · 学士",
    summary: "",
    logo: "/logos/buaa.svg",
  },
  {
    id: "kyushu",
    from: "2019",
    to: "2020",
    org: "九州大学",
    role: "电气情报工学 · 交换",
    summary: "",
    logo: "/logos/kyushu.svg",
  },
  {
    id: "troph",
    from: "2020",
    to: "2021",
    org: "Troph Inc.",
    role: "Web全栈工程师 & 产品经理",
    summary: "Kupo World 游戏社交平台（上线初期访问量破万）与 ACG 社区侧项目。",
    logo: "/logos/troph.svg",
  },
  {
    id: "utokyo",
    from: "2021",
    to: "2022",
    org: "东京大学",
    role: "电子情报学 · 研究生（退学）",
    summary: "因为Covid-19影响，前往学校遥遥无期，故退学，想要在工作上获得更多经验。",
    logo: "/logos/utokyo.svg",
  },
  {
    id: "huawei",
    from: "2022",
    to: "2023",
    org: "华为",
    role: "嵌入式软件工程师 & Web全栈工程师 · 飞虎队成员",
    summary: "参与基站芯片物理层软件；主导负责内部研发平台。因为还是想要进修，加上疫情影响身体健康，所以决定离开。",
    logo: "/logos/huawei.svg",
  },
  {
    id: "uq",
    from: "2024",
    to: "2025",
    org: "昆士兰大学",
    role: "软件工程 · 硕士",
    summary: "基于LLM的隐私政策领域词典构建",
    logo: "/logos/uq.svg",
  },
  {
    id: "weiguang",
    from: "2025",
    to: "至今",
    org: "微光医疗",
    role: "软件开发工程师",
    summary: "独立搭建AI数据标注平台；主导负责基于AI的冠脉造影影像分析系统。",
    logo: "/logos/weiguang.svg",
  },
] as const;

export const stackTags = [
  "TYPESCRIPT",
  "REACT",
  "C/C++",
  "PYTHON",
  "DOCKER",
  "MACHINE_LEARNING",
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
    title: "Kupo World",
    desc: "游戏玩家招募与社交平台，上线三天访问量破万，在微博、NGA、Twitter 等社区也传开了。React + Node.js + MongoDB。",
    tag: "Side project",
    href: "https://github.com/oiidawn",
    linkLabel: "GitHub",
  },
  {
    id: "P02",
    title: "AI 数据标注平台",
    desc: "替代手工文件流程，让内部标注效率提升约 10 倍。React + Node.js + MySQL + Docker。",
    tag: "工具",
    href: "mailto:oii.zhangjm@gmail.com",
    linkLabel: "联系",
  },
  {
    id: "P03",
    title: "Profolio · 个人主页",
    desc: "就是本站：Next.js 14 + TypeScript + Tailwind，Terminal Architect 视觉，多页路由与部署。也是我的前端实验场。",
    tag: "本站",
    href: "https://github.com/oiidawn",
    linkLabel: "仓库",
  },
] as const;
