// source.config.ts
import { defineDocs, defineConfig } from "fumadocs-mdx/config/zod-3";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
var docs = defineDocs({
  dir: "content/docs",
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight]
  }
});
var source_config_default = defineConfig();
export {
  source_config_default as default,
  docs
};
