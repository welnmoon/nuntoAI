import type { ReactNode } from "react";
import DocsSidebar from "@/components/docs/sidebar";
import { getTableOfContents } from "fumadocs-core/server";
import { source } from "@/lib/source";

export default async function DocsSlugLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { slug?: string[] };
}) {
  const slugs = params?.slug ?? [];
  const page = source.getPage(slugs);
  const currentPath = page?.url;
  const toc = page ? await getTableOfContents(page.data.content) : [];

  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-12 gap-8">
      <div className="md:block col-span-3">
        <DocsSidebar currentPath={currentPath} />
        {toc.length > 0 && (
          <div className="mt-6 rounded-md border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-900">
            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2">
              На этой странице
            </div>
            <ul className="m-0 list-none p-0">
              {toc.map((item, idx) => (
                <li key={idx} style={{ paddingLeft: (item.depth - 1) * 12 }}>
                  <a
                    href={item.url}
                    className="text-sm text-zinc-700 dark:text-zinc-300 hover:underline"
                  >
                    {item.title as any}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <main className="col-span-12 md:col-span-9 min-w-0">{children}</main>
    </div>
  );
}

