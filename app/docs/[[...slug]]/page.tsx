import { source } from '@/lib/source';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return source.generateParams('slug');
}

export default function DocPage({ params }: { params: { slug?: string[] } }) {
  const slugs = params.slug ?? [];
  const page = source.getPage(slugs);
  if (!page) return notFound();

  const Body = page.data.body as React.ComponentType;
  return (
    <div className="prose prose-zinc dark:prose-invert max-w-none">
      <Body />
    </div>
  );
}

