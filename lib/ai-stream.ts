"use client";

/**
 * Вспомогательная функция для стриминга ответа ИИ через /api/openai.
 *
 * На каждом чанке вызывает onChunk(chunk, fullReply),
 * а в конце возвращает полный ответ ассистента.
 */
export async function streamAI(
  message: string,
  selectedModel: string,
  signal: AbortSignal,
  onChunk: (chunk: string, full: string) => void
): Promise<string> {
  const res = await fetch("/api/openai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, model: selectedModel }),
    signal,
  });

  if (!res.body) return "";

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let fullReply = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunkValue = decoder.decode(value, { stream: true });
    fullReply += chunkValue;
    onChunk(chunkValue, fullReply);
  }

  return fullReply;
}
