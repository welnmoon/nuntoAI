import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MODEL_LIST,
  TARIFF_LABELS,
  TariffSlug,
  isModelAllowedForTariff,
} from "@/constants/allowed-models";

const ModelSelect = ({
  selectedModel,
  setSelectedModel,
  tariffSlug,
}: {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  tariffSlug: TariffSlug;
}) => {
  return (
    <Select value={selectedModel} onValueChange={setSelectedModel}>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Выберите модель" />
      </SelectTrigger>
      <SelectContent>
        {MODEL_LIST.map((model) => {
          const allowed = isModelAllowedForTariff(model.id, tariffSlug);
          return (
            <SelectItem
              value={model.id}
              key={model.id}
              disabled={!allowed}
              className={!allowed ? "opacity-70" : undefined}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{model.label}</span>
                {model.description && (
                  <span className="text-[11px] text-muted-foreground">
                    {model.description}
                  </span>
                )}
                {!allowed && (
                  <span className="text-[11px] text-amber-600">
                    Доступно с тарифа {TARIFF_LABELS[model.minTariff]}
                  </span>
                )}
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default ModelSelect;
