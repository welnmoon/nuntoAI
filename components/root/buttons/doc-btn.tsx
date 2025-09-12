import { File } from "lucide-react";

const DocumentationBtn = () => {
  return (
    <button className="flex gap-2 items-center">
      <span className="hover:underline duration-200 text-white">
        Документация
      </span>
      <File size={20} className="text-white" />
    </button>
  );
};

export default DocumentationBtn;
