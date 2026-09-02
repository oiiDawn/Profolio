/* This configuration pre-renders every public page and emits Vercel-native static output. */
import type { Config } from "@react-router/dev/config";

import { workStudies } from "./lib/portfolio-data";

export default {
  ssr: false,
  prerender: ["/", "/404", ...workStudies.map((work) => `/work/${work.slug}`)],
} satisfies Config;
