import type { ReactNode } from 'react';

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      {children}
    </div>
  );
}

