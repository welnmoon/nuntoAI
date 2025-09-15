// app/api/search/route.ts
import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

export const { GET } = createFromSource(source, {
  language: 'russian', // или 'english'
});
