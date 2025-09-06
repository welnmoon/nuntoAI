// app/p/[publicId]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";

async function getData(publicId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/public/${publicId}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function PublicChatPage({
  params,
}: {
  params: { publicId: string };
}) {
  const data = await getData(params.publicId);
  if (!data) return notFound();

  return (
    <>
      <meta name="robots" content="noindex,nofollow" />
      <main className="mx-auto max-w-2xl p-4">
        <h1 className="text-xl font-semibold mb-4">{data.title}</h1>
        <div className="space-y-3">
          {data.messages.map((m: any) => (
            <div key={m.id} className="rounded-md border p-3">
              <div className="text-xs text-muted-foreground mb-1">
                {m.role.toLowerCase()}
              </div>
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export async function generateMetadata({ params }: { params: { publicId: string } }): Promise<Metadata> {
  return {
    robots: { index: false, follow: false },
    alternates: { canonical: `/p/${params.publicId}` },
  };
}
