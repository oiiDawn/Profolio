import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const shares = [
  {
    title: "我如何管理长期学习计划",
    desc: "用季度目标 + 每周复盘，把“想学很多”变成“持续推进”。",
    tag: "学习方法"
  },
  {
    title: "做项目时最有用的 3 个习惯",
    desc: "先定义问题、先做最小闭环、每次迭代只解决一个核心阻塞。",
    tag: "项目实践"
  },
  {
    title: "我的效率系统（工具 + 流程）",
    desc: "从灵感收集到执行追踪，搭建一个不依赖意志力的工作流。",
    tag: "个人效率"
  }
];

const timeline = [
  { year: "2022", event: "开始系统学习前端开发" },
  { year: "2023", event: "完成多个个人项目并持续迭代" },
  { year: "2024", event: "关注产品思维与用户体验" },
  { year: "Now", event: "构建长期内容分享与个人品牌" }
];

function SectionBadge({ label }: { label: string }) {
  return (
    <Badge variant="outline" className="w-fit tracking-[0.08em]">
      {label}
    </Badge>
  );
}

export default function HomePage() {
  return (
    <main id="top" className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-10 lg:px-14 lg:py-12">
      <nav className="reveal sticky top-3 z-10 mb-8 rounded-full border border-border/80 bg-background/85 px-3 py-2 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <p className="font-serif text-base tracking-wide text-foreground">
            Your Name
          </p>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="nav-link"
              render={<a href="#about" aria-label="跳转到关于我" />}
            >
              关于
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="nav-link"
              render={<a href="#timeline" aria-label="跳转到成长轨迹" />}
            >
              轨迹
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="nav-link"
              render={<a href="#shares" aria-label="跳转到个人分享" />}
            >
              分享
            </Button>
          </div>
        </div>
      </nav>

      <header className="grid grid-cols-1 gap-6 py-8 sm:py-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-8 lg:py-14">
        <div className="reveal flex flex-col gap-6 [--delay:60ms]">
          <SectionBadge label="PERSONAL SITE" />
          <h1 className="max-w-[12ch] font-serif text-4xl leading-[1.08] tracking-tight sm:text-6xl">
            你好，我是 <span className="text-primary">你的名字</span>
          </h1>
          <p className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
            我热爱把想法做成可用的产品，也喜欢把经验整理成清晰可复用的内容。这里是我的个人主页，包含我的经历、关注方向，以及持续更新的个人分享。
          </p>
          <div className="flex flex-wrap gap-3">
            <Button render={<a href="#about" />}>了解我</Button>
            <Button variant="secondary" render={<a href="#shares" />}>
              看看分享
            </Button>
          </div>
        </div>

        <Card className="reveal card-soft drift [--delay:180ms]">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">现在的关注重点</CardTitle>
            <CardDescription>
              我希望做长期有价值的作品，而不是短期堆砌的页面。
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="secondary">Next.js + TypeScript</Badge>
            <Badge variant="secondary">产品体验</Badge>
            <Badge variant="secondary">内容沉淀</Badge>
            <Badge variant="secondary">长期主义</Badge>
          </CardContent>
          <CardFooter>
            <p className="text-sm leading-7 text-muted-foreground">
              用更稳的节奏，把成长变成可复利系统。
            </p>
          </CardFooter>
        </Card>
      </header>

      <section
        id="about"
        className="reveal grid grid-cols-1 items-start gap-6 border-t border-border py-12 [--delay:240ms] md:grid-cols-[1.3fr_1fr]"
      >
        <div className="flex flex-col gap-4">
          <SectionBadge label="ABOUT ME" />
          <h2 className="font-serif text-3xl leading-tight tracking-tight sm:text-5xl">
            我在做什么
          </h2>
          <p className="text-base leading-8 text-muted-foreground">
            我专注于前端开发与产品体验，擅长从用户场景出发，把复杂需求拆解为可落地方案。相比“堆功能”，我更在意信息结构是否清晰、交互是否自然、页面是否真正解决问题。
          </p>
          <p className="text-base leading-8 text-muted-foreground">
            除了写代码，我也持续做知识沉淀，分享学习路径、项目方法和效率系统的实践，希望帮助更多人稳定成长。
          </p>
        </div>

        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">关键词</CardTitle>
            <CardDescription>我当前最关注的方向。</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex list-disc flex-col gap-2.5 pl-5 text-sm leading-7 text-muted-foreground sm:text-base">
              <li>前端开发 / Next.js / TypeScript</li>
              <li>产品思维 / 用户体验</li>
              <li>个人成长 / 知识分享</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section id="timeline" className="reveal flex flex-col gap-5 py-12 [--delay:320ms]">
        <SectionBadge label="TIMELINE" />
        <h2 className="font-serif text-3xl leading-tight tracking-tight sm:text-5xl">
          成长轨迹
        </h2>
        <div className="flex flex-col border-y border-border">
          {timeline.map((item, index) => (
            <div
              key={item.year}
              style={{ ["--delay" as string]: `${390 + index * 70}ms` }}
              className="reveal group grid grid-cols-[80px_1fr] gap-4 border-b border-border py-4 transition-colors duration-300 last:border-b-0 hover:bg-muted/40"
            >
              <p className="font-serif text-lg text-foreground">{item.year}</p>
              <p className="text-base leading-8 text-muted-foreground transition-colors duration-300 group-hover:text-foreground/85">
                {item.event}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5 py-12">
        <div
          id="shares"
          className="reveal mx-[calc(50%-50vw)] bg-foreground px-[calc(50vw-50%)] py-12 [--delay:420ms]"
        >
          <div className="flex flex-col gap-5">
            <Badge variant="secondary" className="w-fit">
              SHARES
            </Badge>
            <h2 className="font-serif text-3xl leading-tight tracking-tight text-background sm:text-5xl">
              个人分享
            </h2>
            <p className="max-w-2xl text-base leading-8 text-primary-foreground/75 sm:text-lg">
              我会定期输出关于学习、项目实践和个人效率的可执行经验，尽量讲清楚方法背后的逻辑。
            </p>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {shares.map((share, index) => (
              <Card
                key={share.title}
                style={{ ["--delay" as string]: `${490 + index * 90}ms` }}
                className="reveal group border-white/10 bg-white/5 transition-transform duration-400 hover:-translate-y-1 hover:shadow-[0_18px_36px_-24px_rgba(0,0,0,0.75)]"
              >
                <CardHeader>
                  <CardDescription className="text-primary-foreground/80">
                    {share.tag}
                  </CardDescription>
                  <CardTitle className="font-serif text-2xl text-background">
                    {share.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <p className="text-sm leading-7 text-primary-foreground/80 sm:text-base">
                    {share.desc}
                  </p>
                  <Button
                    variant="secondary"
                    className="w-fit transition-transform duration-300 group-hover:translate-x-0.5"
                    render={
                      <a href="#" aria-label={`阅读 ${share.title} 的更多内容`} />
                    }
                  >
                    阅读更多
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal flex flex-col gap-5 py-12 [--delay:500ms]">
        <SectionBadge label="CONTACT" />
        <h2 className="font-serif text-3xl leading-tight tracking-tight sm:text-5xl">
          一起交流
        </h2>
        <p className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
          欢迎通过邮箱或社交平台联系我，聊项目合作、学习成长或任何有趣想法。
        </p>
        <Separator />
        <div className="flex flex-wrap gap-3">
          <Button render={<a href="mailto:hello@example.com" />}>
            hello@example.com
          </Button>
          <Button variant="secondary" render={<a href="#top" />}>
            回到顶部
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Your Name. Build warm, useful things.
        </p>
      </footer>
    </main>
  );
}
