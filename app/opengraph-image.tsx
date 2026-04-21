import { ImageResponse } from "next/og";

/**
 * 根级 OG 图。Next.js App Router 会自动把这张图注入所有页面的
 * <meta property="og:image"> 与 <meta name="twitter:image">，
 * 除非具体路由自己提供了同名约定文件（e.g. `app/writing/[id]/opengraph-image.tsx`）。
 *
 * 采用 edge runtime 以获得更快的首图生成；全部视觉元素走
 * 几何 SVG + Satori 默认字体，避开本地只有 woff2（Satori 需 TTF/OTF）的坑。
 *
 * 注意：Satori 不支持 repeating-linear-gradient 等部分 CSS；背景只用其支持的渐变。
 */
export const runtime = "edge";
export const alt = "OII_DAWN · Terminal Architect";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CYAN = "#8ff5ff";
const MAGENTA = "#d575ff";
const BG = "#0a0a0a";
const MUTED = "#a1a1a1";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: BG,
          backgroundImage: `radial-gradient(circle at 20% 20%, rgba(143,245,255,0.12), transparent 55%), radial-gradient(circle at 85% 90%, rgba(213,117,255,0.1), transparent 50%), linear-gradient(180deg, rgba(143,245,255,0.04) 0%, transparent 40%, transparent 60%, rgba(213,117,255,0.03) 100%)`,
          color: CYAN,
          padding: "64px 80px",
          position: "relative",
        }}
      >
        {/* Four corner brackets — echoes favicon */}
        <svg
          width={1200}
          height={630}
          viewBox="0 0 1200 630"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <g
            fill="none"
            stroke={CYAN}
            strokeWidth={4}
            strokeLinecap="square"
            strokeLinejoin="miter"
          >
            <path d="M56 140 V56 H140" />
            <path d="M1060 56 H1144 V140" />
            <path d="M56 490 V574 H140" />
            <path d="M1060 574 H1144 V490" />
          </g>
        </svg>

        {/* Top meta row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 22,
            color: MUTED,
            letterSpacing: "4px",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              backgroundColor: CYAN,
              boxShadow: `0 0 14px ${CYAN}`,
            }}
          />
          <span>OII_DAWN @ PORTFOLIO</span>
        </div>

        {/* Hero wordmark + tagline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 36,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              color: CYAN,
              fontSize: 172,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-6px",
            }}
          >
            <span>[OII_DAWN</span>
            <div
              style={{
                width: 96,
                height: 28,
                backgroundColor: MAGENTA,
                marginLeft: 20,
                marginRight: 16,
                marginBottom: 22,
              }}
            />
            <span>]</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 36,
              color: MUTED,
              letterSpacing: "2px",
            }}
          >
            Terminal Architect — personal portfolio & writing
          </div>
        </div>

        {/* Bottom prompt row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 26,
            color: MUTED,
          }}
        >
          <span style={{ color: MAGENTA, fontWeight: 900 }}>&gt;</span>
          <span style={{ color: CYAN }}>oii_dawn</span>
          <span>@portfolio:~$ cat profile.md</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
