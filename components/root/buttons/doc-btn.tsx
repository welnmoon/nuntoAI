import { CLIENT_ROUTES } from "@/lib/client-routes";
import { File } from "lucide-react";
import Link from "next/link";

const DocumentationBtn = () => {
  return (
    <Link href={CLIENT_ROUTES.docs} className="flex gap-2 items-center">
      <span className="hover:underline duration-200 text-white">
        Документация
      </span>
      <File size={20} className="text-white" />
    </Link>
  );
};

export default DocumentationBtn;
