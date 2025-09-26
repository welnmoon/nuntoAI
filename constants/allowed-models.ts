export type TariffSlug = "free" | "pro" | "enterprise";

export interface ModelInfo {
  id: string;
  label: string;
  description?: string;
  /** Минимальный тариф, начиная с которого доступна модель. **/
  minTariff: TariffSlug;
}

const TARIFF_ORDER: Record<TariffSlug, number> = {
  free: 0,
  pro: 1,
  enterprise: 2,
};

const TARIFF_LABELS: Record<TariffSlug, string> = {
  free: "Free",
  pro: "Pro",
  enterprise: "Enterprise",
};

const MODEL_LIST: ModelInfo[] = [
  {
    id: "openai/gpt-4o",
    label: "OpenAI GPT-4o",
    description: "Флагманская модель, доступная с тарифа Pro",
    minTariff: "pro",
  },
  {
    id: "openai/gpt-4o-mini",
    label: "OpenAI GPT-4o Mini",
    description: "Быстрая и доступная по умолчанию",
    minTariff: "free",
  },
  {
    id: "x-ai/grok-4-fast:free",
    label: "xAI Grok 4 Fast",
    description: "Экспериментальная модель от xAI",
    minTariff: "free",
  },
];

const MODELS = new Set(MODEL_LIST.map((model) => model.id));

const DEFAULT_MODEL = "openai/gpt-4o-mini";

const FALLBACK_MODEL_BY_TARIFF: Record<TariffSlug, string> = {
  free: "openai/gpt-4o-mini",
  pro: "openai/gpt-4o",
  enterprise: "openai/gpt-4o",
};

function normalizeTariff(tariff: TariffSlug | null | undefined): TariffSlug {
  if (!tariff) return "free";
  return tariff;
}

function fromUnknownTariff(value: string | null | undefined): TariffSlug {
  if (value === "pro" || value === "enterprise") {
    return value;
  }
  return "free";
}

function getTariffOrder(tariff: TariffSlug | null | undefined): number {
  const normalized = normalizeTariff(tariff);
  return TARIFF_ORDER[normalized];
}

function isModelSupported(modelId: string): boolean {
  return MODELS.has(modelId);
}

function isModelAllowedForTariff(
  modelId: string,
  tariff: TariffSlug | null | undefined
): boolean {
  const model = MODEL_LIST.find((item) => item.id === modelId);
  if (!model) return false;
  return getTariffOrder(tariff) >= TARIFF_ORDER[model.minTariff];
}

function getModelsForTariff(tariff: TariffSlug | null | undefined): ModelInfo[] {
  return MODEL_LIST.filter((model) =>
    isModelAllowedForTariff(model.id, tariff)
  );
}

function getDefaultModelForTariff(
  tariff: TariffSlug | null | undefined
): string {
  const normalized = normalizeTariff(tariff);
  const fallback = FALLBACK_MODEL_BY_TARIFF[normalized];
  if (isModelAllowedForTariff(fallback, normalized)) {
    return fallback;
  }
  const firstAllowed = getModelsForTariff(normalized)[0]?.id;
  return firstAllowed ?? DEFAULT_MODEL;
}

export {
  DEFAULT_MODEL,
  FALLBACK_MODEL_BY_TARIFF,
  MODEL_LIST,
  MODELS,
  TARIFF_LABELS,
  fromUnknownTariff,
  getDefaultModelForTariff,
  getModelsForTariff,
  isModelAllowedForTariff,
  isModelSupported,
};
