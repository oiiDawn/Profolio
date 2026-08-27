/* This file is the single editable source for every visible fact, link, and case study. */
export type Project = {
  title: string;
  images: { src: string; alt: string; width?: number; height?: number }[];
  tags: string[];
  kind?: "mascot";
  prompt?: string;
};

type Chapter = {
  title?: string;
  body?: string[];
  projects: Project[];
};

export type CaseStudy = {
  id: string;
  company: string;
  period: string;
  role: string;
  logo: string;
  notice: string;
  title: string;
  body: string[];
  metrics: { value: string; label: string; icon?: string; href?: string }[];
  facts: { label: string; value: string }[];
  chapters: Chapter[];
  links: { label: string; href: string; icon?: string }[];
};

const project = (title: string, image: string, tags: string[], alt = title): Project => ({
  title,
  images: [{ src: image, alt }],
  tags,
});

export const portfolio: {
  labels: {
    contactMe: string;
    readCv: string;
    workLife: string;
    sideQuests: string;
    approach: string;
    stack: string;
    contact: string;
    sendEmail: string;
    touchGrass: string;
    openCaseStudy: string;
    closeDialog: string;
    moreInformation: string;
    mascot: string;
  };
  name: string;
  followers: { label: string; href: string };
  headline: string;
  intro: string[];
  email: string;
  resume: string;
  work: CaseStudy[];
  sideQuests: { name: string; description: string; href: string; logo: string }[];
  approach: { title: string; body: string }[];
  stack: { name: string; icon: string }[];
  socials: { name: string; href: string; icon: string }[];
} = {
  labels: {
    contactMe: "Contact me",
    readCv: "Read my CV",
    workLife: "Work Life",
    sideQuests: "Side Quests",
    approach: "Approach",
    stack: "Stack",
    contact: "Contact",
    sendEmail: "Send me an email",
    touchGrass: "Touch the grass",
    openCaseStudy: "Open case study",
    closeDialog: "Close dialog",
    moreInformation: "More information",
    mascot: "Interactive Felix mascot",
  },
  name: "Filip Gres",
  followers: {
    label: "59,125 followers",
    href: "https://www.linkedin.com/in/filipgres/",
  },
  headline: "Designing category-defining products from day one",
  intro: [
    "I help ambitious founders elevate their design. From standout marketing websites to refined product UI&UX, my work focuses on thoughtful execution and a deep care for craft.",
    "If that resonates, I'd love to hear more about what you're building.",
  ],
  email: "mailto:gresfilip@gmail.com",
  resume: "https://thegistof.me/gresfilip/resume",
  work: [
    {
      id: "felix",
      company: "Felix",
      period: "2026 - Now",
      role: "Founding Designer",
      logo: "felix.svg",
      notice:
        "All designs featured in this case study are part of Felix’s live product and brand experience. Explore the website to see the work in action.",
      title: "The first designer behind Felix",
      body: [
        "As Felix's Founding Designer, I helped build a venture-backed AI startup from 0 to 1 after it raised $1.7M in funding. I established the company's design foundation across brand, product, and systems, while serving as a strategic partner to the founders on product direction and company growth.",
      ],
      metrics: [
        { value: "Zero → One", label: "in just 4 months" },
        { value: "$1.7M", label: "pre-seed" },
      ],
      facts: [
        { label: "Role", value: "Founding Designer" },
        { label: "When", value: "2026 - Now" },
        { label: "Where", value: "Hybrid in Prague, CZ" },
      ],
      chapters: [
        {
          projects: [
            project(
              "Felix App",
              "felix/felix-app-ui.png",
              ["Zero → One", "Product Design", "UI&UX", "Interaction Design", "User Research", "Product Management"],
              "Felix app UI",
            ),
            project("Felix Landing Page", "felix/felix-landing-page.png", ["Web Design", "UI&UX", "Interaction Design", "Illustrations"]),
            {
              title: "Felix Brand",
              images: [
                { src: "felix/felix-logo.png", alt: "Felix logo", width: 2112, height: 996 },
                { src: "felix/felix-colors.png", alt: "Felix color palette", width: 2112, height: 996 },
              ],
              tags: ["Brand Identity", "Logo Design", "Design System", "Iconography", "Illustrations"],
            },
            {
              title: "Felix Mascot",
              images: [],
              kind: "mascot",
              prompt: "Hover over!",
              tags: ["Brand Identity", "Interaction Design", "Animations", "Illustrations"],
            },
          ],
        },
      ],
      links: [{ label: "Visit website", href: "https://felix.so/" }],
    },
    {
      id: "mimo",
      company: "Mimo",
      period: "2018 - 2026",
      role: "Head of Design",
      logo: "mimo.svg",
      notice:
        "Much of Mimo’s current product and brand experience was shaped during my time there and remains part of the product today. Visit the website or download the app to see the work in action.",
      title: "From first designer to Head of Design",
      body: [
        "Over eight years at Mimo, I grew from the company's first design hire into Head of Design. During that time, Mimo grew into a globally recognized learning platform with more than 35 million users and earned recognition from both Apple and Google, including being featured as Apple's App of the Day and Editors' Choice.",
        "I defined the visual direction, built and led a small design team, and contributed hands on across product, growth, and marketing initiatives across mobile and web. Along the way, I established design systems and helped make design a trusted voice in product and business decisions.",
      ],
      metrics: [
        { value: "35+ million", label: "users all around the world" },
        { value: "4.8/5", label: "avg. app rating" },
        { value: "awards", label: "", icon: "awards.svg" },
      ],
      facts: [
        { label: "Role", value: "Head of Design" },
        { label: "When", value: "2018 - 2026" },
        { label: "Where", value: "Remote" },
      ],
      chapters: [
        {
          projects: [
            { ...project("Mimo Mobile App", "mimo/mimo-mobile.png", ["Zero → One", "Mobile App Design", "Product Design", "UI&UX", "Design System", "Interaction Design", "User Research"]), images: [{ src: "mimo/mimo-mobile.png", alt: "Mimo Mobile App", width: 2256, height: 1160 }] },
            project("Mimo Web App", "mimo/mimo-web-app.png", ["Zero → One", "Web App Design", "Product Design", "UI&UX", "Design System", "Interaction Design", "User Research"]),
            project("Mimo Landing Page", "mimo/mimo-landing-page.png", ["Web Design", "UI&UX", "Interaction Design", "Illustrations", "Animations"]),
            { ...project("Mimo Brand - Illustrations", "mimo/mimo-illustrations.png", ["Art Direction", "Vector Design", "Illustrations"]), images: [{ src: "mimo/mimo-illustrations.png", alt: "Mimo Brand - Illustrations", width: 2256, height: 1280 }] },
            { ...project("Mimo Brand - App Icons", "mimo/mimo-app-icons.png", ["Brand Identity", "App Icon Design", "Art Direction", "Vector Design"]), images: [{ src: "mimo/mimo-app-icons.png", alt: "Mimo Brand - App Icons", width: 2256, height: 528 }] },
          ],
        },
        {
          title: "Exploring a new category with Instance",
          body: [
            "Instance was Mimo's standalone experiment in AI-assisted creation tools, in the same space later popularized by products like Lovable and Bolt. I worked on it from 0 to 1, defining the brand and contributing to early product and strategy. We later integrated Instance into Mimo to strengthen the core product and increase overall user value.",
          ],
          projects: [
            project("Instance Web App", "mimo/instance-web-app.png", ["Zero → One", "Product Design", "UI&UX", "Interaction Design", "User Research", "Product Management"]),
            project("Instance Landing Page", "mimo/instance-landing-page.png", ["Web Design", "UI&UX", "Interaction Design", "Illustrations"]),
            { ...project("Instance Brand - Illustrations", "mimo/instance-illustrations.png", ["Brand Identity", "App Icon Design", "Art Direction", "Vector Design"]), images: [{ src: "mimo/instance-illustrations.png", alt: "Instance Brand - Illustrations", width: 2256, height: 1140 }] },
          ],
        },
        {
          title: "Shaping the learning experience for Mimo Bootcamp",
          body: [
            "I led the design direction for Mimo Bootcamp, a hybrid coding bootcamp combining asynchronous learning with live sessions. I was responsible for all product and learning experience design, shaping the full student journey. The program was discontinued due to scalability constraints, and insights from it helped inform future product decisions at Mimo.",
          ],
          projects: [
            {
              title: "Mimo Bootcamp Landing Page",
              images: [],
              tags: ["Web Design", "UI&UX", "Interaction Design", "Illustrations"],
            },
          ],
        },
      ],
      links: [
        { label: "Download Android App", href: "https://play.google.com/store/apps/details?id=com.getmimo", icon: "android.svg" },
        { label: "Download iOS App", href: "https://apps.apple.com/app/mimo-learn-coding/id1133960732", icon: "apple.svg" },
        { label: "Visit website", href: "https://mimo.org" },
      ],
    },
    {
      id: "avocode",
      company: "Avocode",
      period: "2016 - 2018",
      role: "Visual Designer",
      logo: "avocode.svg",
      notice: "Avocode no longer exists. It was acquired by Ceros in 2021.",
      title: "Crafting a brand that stood out",
      body: [
        "At Avocode, one of the early design handoff tools that helped define the category before platforms like Zeplin, I worked as a Visual Designer focused on brand and marketing. I contributed to shaping the company's visual identity across web and marketing initiatives, with one project earning an Awwwards Site of the Day recognition.",
      ],
      metrics: [
        {
          value: "Awwwards SOTD",
          label: "for Avocode 2016 Design Report",
          href: "https://www.awwwards.com/sites/avocode-2016-web-design-report",
        },
        { value: "Acquired", label: "by Ceros" },
      ],
      facts: [
        { label: "Role", value: "Visual Designer" },
        { label: "When", value: "2016 - 2018" },
        { label: "Where", value: "Prague, CZ" },
      ],
      chapters: [
        {
          projects: [
            { ...project("Avocode Brand", "avocode/avocode-brand.png", ["Brand Identity", "Art Direction", "Logo Design", "Illustrations", "Icon Design", "Vector Design"]), images: [{ src: "avocode/avocode-brand.png", alt: "Avocode Brand", width: 2256, height: 1359 }] },
            project("Avocode Community Page", "avocode/avocode-community-page.png", ["Web Design", "UI&UX", "Interaction Design", "Illustrations"]),
            { ...project("Avocode 2016 Web Design Report", "avocode/avocode-design-report.png", ["Awwwards SOTD", "Web Design", "UI&UX", "Interaction Design", "Illustrations"]), images: [{ src: "avocode/avocode-design-report.png", alt: "Avocode 2016 Web Design Report", width: 2256, height: 1311 }] },
          ],
        },
      ],
      links: [],
    },
  ],
  sideQuests: [
    { name: "the gist of", description: "Mini-site Builder", href: "https://thegistof.me/", logo: "the-gist-of.svg" },
    { name: "GriddyIcons", description: "Icon Library", href: "https://griddyicons.com/", logo: "griddyicons.svg" },
  ],
  approach: [
    { title: "I start with why.", body: "Before designing, I define the problem. I dig into customer feedback, user behavior, and conversations until the problem and success criteria are clear." },
    { title: "I think in systems.", body: "I design with users, engineering, and business goals in mind. By mapping flows and testing constraints early, I make sure solutions work in the real world, not just in demos." },
    { title: "I obsess over craft.", body: "Nothing is random. Spacing, hierarchy, motion, and visual details are intentional decisions shaped by years of studying and refining great products." },
    { title: "I ship with the team.", body: "I work closely with engineering, marketing, and product from start to finish. I care about what the team ships, not just the designs I hand over." },
    { title: "I write for alignment.", body: "I document decisions, tradeoffs, and rationale so teams stay aligned. Clear documentation creates shared understanding long after meetings end." },
    { title: "I follow the signal.", body: "I do not chase tools or trends. I use AI where it adds value, but judgment, product decisions, and final quality always remain my responsibility." },
  ],
  stack: [
    { name: "Figma", icon: "figma.svg" },
    { name: "Framer", icon: "stack-1.svg" },
    { name: "Rive", icon: "stack-2.svg" },
    { name: "Anthropic", icon: "stack-3.svg" },
    { name: "Claude Code", icon: "stack-4.svg" },
    { name: "Lovable", icon: "stack-5.svg" },
    { name: "Perplexity", icon: "stack-6.svg" },
    { name: "Notion", icon: "stack-7.svg" },
    { name: "Linear", icon: "stack-8.svg" },
    { name: "GitHub", icon: "stack-9.svg" },
    { name: "Supabase", icon: "stack-10.svg" },
  ],
  socials: [
    { name: "X", href: "https://x.com/FilipGres", icon: "x.svg" },
    { name: "Threads", href: "https://www.threads.com/@gresfilip", icon: "threads.svg" },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/filipgres/", icon: "linkedin-contact.svg" },
  ],
};
