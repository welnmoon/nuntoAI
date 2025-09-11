// app/p/[publicId]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { headers } from "next/headers";

// Disable static rendering to avoid caching/mismatch
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getData(publicId: string) {
  try {
    const h = await headers();
    const proto = h.get("x-forwarded-proto") ?? "http";
    const host = h.get("host");
    const url = host
      ? `${proto}://${host}/api/public/${publicId}`
      : `/api/public/${publicId}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function PublicChatPage({
  params,
}: {
  params?: Promise<{ publicId?: string | string[] }>;
}) {
  const resolved = (await params) ?? {};
  const publicIdRaw = Array.isArray(resolved.publicId)
    ? resolved.publicId[0]
    : resolved.publicId;
  const data = publicIdRaw ? await getData(publicIdRaw) : null;
  if (!data) return notFound();

  return (
    <>
      <meta name="robots" content="noindex,nofollow" />
      <main className="mx-auto max-w-2xl p-4">
        <h1 className="text-xl font-semibold mb-4">{data.title}</h1>
        <div className="space-y-3">
          {data.messages.map(
            (m: { id: number; role: string; content: string }) => (
              <div key={m.id} className="rounded-md border dark:border-zinc-800 p-3">
                <div className="text-xs text-muted-foreground mb-1">
                  {m.role.toLowerCase()}
                </div>
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            )
          )}
        </div>
      </main>
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params?: Promise<{ publicId?: string | string[] }>;
}): Promise<Metadata> {
  const resolved = (await params) ?? {};
  const publicIdRaw = Array.isArray(resolved.publicId)
    ? resolved.publicId[0]
    : resolved.publicId;
  return {
    robots: { index: false, follow: false },
    alternates: { canonical: `/p/${publicIdRaw ?? ""}` },
  };
}
