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

/** 默认 GitHub 用户名（项目页拉取公开仓库；可被环境变量 GITHUB_USERNAME 覆盖） */
export const siteGithubUsername = "oiidawn";

/** About 页时间线数据：时间、机构、身份；logo 放在 public/logos/ */
export const timeline = [
  {
    id: "buaa",
    from: "2016",
    to: "2020",
    org: "北京航空航天大学",
    role: "软件工程 · 学士",
    logo: "/logos/buaa.svg",
  },
  {
    id: "kyushu",
    from: "2019",
    to: "2020",
    org: "九州大学",
    role: "电气情报工学 · 交换",
    logo: "/logos/kyushu.svg",
  },
  {
    id: "troph",
    from: "2020",
    to: "2021",
    org: "Troph Inc.",
    role: "Web全栈工程师 & 产品经理",
    logo: "/logos/troph.svg",
  },
  {
    id: "utokyo",
    from: "2021",
    to: "2022",
    org: "东京大学",
    role: "电子情报学 · 研究生（退学）",
    logo: "/logos/utokyo.svg",
  },
  {
    id: "huawei",
    from: "2022",
    to: "2023",
    org: "华为",
    role: "嵌入式软件工程师 & Web全栈工程师 · 飞虎队成员",
    logo: "/logos/huawei.svg",
  },
  {
    id: "uq",
    from: "2024",
    to: "2025",
    org: "昆士兰大学",
    role: "软件工程 · 硕士",
    logo: "/logos/uq.svg",
  },
  {
    id: "weiguang",
    from: "2025",
    to: "至今",
    org: "微光医疗",
    role: "软件开发工程师",
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
