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
    summary: "在系统训练里打下工程基础，也开始意识到自己真正想做的，不只是把功能写出来。",
    logo: "/logos/buaa.svg",
  },
  {
    id: "kyushu",
    from: "2019",
    to: "2020",
    org: "九州大学",
    role: "电气情报工学 · 交换",
    summary: "第一次更直接地站在不同文化和学科语境里看待技术，也让后来的很多选择不再只沿着惯性走。",
    logo: "/logos/kyushu.svg",
  },
  {
    id: "troph",
    from: "2020",
    to: "2021",
    org: "Troph Inc.",
    role: "Web全栈工程师 & 产品经理",
    summary: "在真实产品节奏里同时处理实现与表达，开始确认自己更在意有想法、也能落地的作品。",
    logo: "/logos/troph.svg",
  },
  {
    id: "utokyo",
    from: "2021",
    to: "2022",
    org: "东京大学",
    role: "电子情报学 · 研究生（退学）",
    summary:
      "主动结束一条看起来更标准的路径，也因此更清楚地认识到：重要的不是履历完整，而是是否忠于自己的判断。",
    logo: "/logos/utokyo.svg",
  },
  {
    id: "huawei",
    from: "2022",
    to: "2023",
    org: "华为",
    role: "嵌入式软件工程师 & Web全栈工程师 · 飞虎队成员",
    summary:
      "参与基站芯片物理层软件与内部研发平台，也在高压环境里学会把长期健康和持续成长放回更优先的位置。",
    logo: "/logos/huawei.svg",
  },
  {
    id: "uq",
    from: "2024",
    to: "2025",
    org: "昆士兰大学",
    role: "软件工程 · 硕士",
    summary: "重新出发之后继续进修，在研究中把技术能力和更长期的问题意识重新接上。",
    logo: "/logos/uq.svg",
  },
  {
    id: "weiguang",
    from: "2025",
    to: "至今",
    org: "微光医疗",
    role: "软件开发工程师",
    summary: "独立搭建AI数据标注平台，并主导基于AI的冠脉造影影像分析系统，把判断力和执行力放进真实场景里验证。",
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
