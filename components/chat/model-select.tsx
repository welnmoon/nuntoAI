import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALLOWED_MODELS } from "@/constants/allowed-models";

const ModelSelect = ({
  selectedModel,
  setSelectedModel,
}: {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}) => {
  const models = ALLOWED_MODELS;
  return (
    <Select value={selectedModel} onValueChange={setSelectedModel}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={selectedModel} />
      </SelectTrigger>
      <SelectContent>
        {[...models].map((m) => (
          <SelectItem value={m} onClick={() => setSelectedModel(m)} key={m}>
            {m}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ModelSelect;
