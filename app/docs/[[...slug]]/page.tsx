import { source } from "@/lib/source";
import { notFound } from "next/navigation";
import { getTableOfContents } from "fumadocs-core/server";

export function generateStaticParams() {
  return source.generateParams("slug");
}

export default async function DocPage({
  params,
}: {
  params: { slug?: string[] };
}) {
  const slugs = params.slug ?? [];
  const page = source.getPage(slugs);
  if (!page) return notFound();

  const Body = page.data.body as React.ComponentType;
  const toc = await getTableOfContents(page.data.content);

  return (
    <article className="prose prose-zinc dark:prose-invert max-w-none">
      {toc.length > 0 && (
        <nav aria-label="Содержание" className="not-prose mb-6 rounded-md border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-900">
          <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2">Содержание</div>
          <ul className="m-0 list-none p-0">
            {toc.map((item, idx) => (
              <li key={idx} style={{ paddingLeft: (item.depth - 1) * 12 }}>
                <a href={item.url} className="text-sm text-zinc-700 dark:text-zinc-300 hover:underline">
                  {item.title as any}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <Body />
    </article>
  );
}
