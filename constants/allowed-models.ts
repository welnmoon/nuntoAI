const ALLOWED_MODELS = new Set([
  "openai/gpt-4o",
  "openai/gpt-4o-mini",
  "x-ai/grok-4-fast:free",
]);

const DEFAULT_MODEL = "openai/gpt-4o-mini";

export { ALLOWED_MODELS, DEFAULT_MODEL };
