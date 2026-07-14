import { compileMDX } from "next-mdx-remote/rsc";
import { cache as reactCache } from "react";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

import { mdxComponents } from "@/components/mdx/mdx-components";

export async function compileMdxSourceUncached(source: string) {
  return compileMDX({
    source,
    components: mdxComponents,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              theme: "github-dark",
            },
          ],
        ],
      },
    },
  });
}

export const compileMdxSource = reactCache(async (source: string) =>
  compileMdxSourceUncached(source),
);
