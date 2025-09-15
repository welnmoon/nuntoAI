// mdx-components.tsx
import defaultMdx from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdx,
    // свои компоненты можно добавлять сюда
    ...components,
  };
}
