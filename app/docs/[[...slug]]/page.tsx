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

type Props = { params: { slug?: string[] } };

export default function DocPage({ params }: Props) {
  const slugs = params.slug ?? ["index"];

  // Временная диагностика — смотри вывод в серверной консоли:
  console.log(
    "Available pages:",
    source.getPages().map((p) => p.slugs.join("/"))
  );

  const page =
    source.getPage(slugs) || source.getPage(["index"]) || source.getPages()[0]; // фоллбек на первую попавшуюся страницу

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
