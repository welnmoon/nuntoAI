import { JsonValue } from "@prisma/client/runtime/library";

type FeatureFlags = Record<string, JsonValue> & {
  maxChats?: number | null;
  canUseAi?: boolean;
  prioritySupport?: boolean;
};

const bullet = (text: string) => (
  <li key={text} className="flex items-start gap-2">
    <span className="mt-1 size-1.5 rounded-full bg-emerald-400/80" />
    <span className="text-sm">{text}</span>
  </li>
);

export function renderFeatures(features: JsonValue) {
  if (!features) {
    return (
      <li className="text-sm text-gray-400">
        Нет информации о возможностях
      </li>
    );
  }

  if (Array.isArray(features)) {
    const items = features.filter((v): v is string => typeof v === "string");
    if (items.length === 0) {
      return (
        <li className="text-sm text-gray-400">
          Нет информации о возможностях
        </li>
      );
    }
    return items.map(bullet);
  }

  if (typeof features === "object") {
    const f = features as FeatureFlags;
    const list: string[] = [];

    if ("maxChats" in f && f.maxChats !== undefined) {
      list.push(
        f.maxChats === null
          ? "Неограниченное количество чатов"
          : `До ${f.maxChats} чатов`
      );
    }

    if ("canUseAi" in f) {
      list.push(f.canUseAi ? "Доступ к AI" : "Без доступа к AI");
    }

    if (f.prioritySupport) {
      list.push("Приоритетная поддержка");
    }

    if (list.length === 0) {
      return (
        <li className="text-sm text-gray-400">
          Нет информации о возможностях
        </li>
      );
    }

    return list.map(bullet);
  }

  if (typeof features === "string") {
    return [bullet(features)];
  }

  return (
    <li className="text-sm text-gray-400">
      Нет информации о возможностях
    </li>
  );
}
