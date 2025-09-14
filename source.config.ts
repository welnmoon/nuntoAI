import { defineDocs, defineConfig } from 'fumadocs-mdx/config';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

export const docs = defineDocs({
  dir: 'content/docs',
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
  },
});

export default defineConfig();
