// app/docs/[[...slug]]/page.tsx
import { notFound } from "next/navigation";
import { source } from "@/lib/source";
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from "fumadocs-ui/page";
import { getMDXComponents } from "@/lib/mdx-components";

type SlugParams = { slug?: string[] };

export default async function DocPage({
  params,
}: {
  params: Promise<SlugParams>;
}) {
  const { slug } = await params;
  const slugs = slug ?? ["index"];

  const page =
    source.getPage(slugs) ||
    source.getPage(["index"]) ||
    source.getPages()[0];

  if (!page) return notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc}>
      <DocsTitle>{page.data.title}</DocsTitle>
      {page.data.description ? (
        <DocsDescription>{page.data.description}</DocsDescription>
      ) : null}
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}
