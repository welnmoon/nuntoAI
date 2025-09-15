import type { ReactNode } from "react";

// Nested under `app/docs/layout.tsx` which already provides the docs sidebar
// via `DocsLayout` from fumadocs-ui. Keep this layout as a passthrough to
// avoid rendering a second sidebar or duplicate TOC.
export default function DocsSlugLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}

