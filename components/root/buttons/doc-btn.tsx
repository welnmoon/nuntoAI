"use client";

import { CLIENT_ROUTES } from "@/lib/client-routes";
import { File, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const DocumentationBtn = () => {
  const [loading, setLoading] = useState(false);
  return (
    <Link
      onClick={() => setLoading(true)}
      href={CLIENT_ROUTES.docs}
      className="flex gap-2 items-center"
    >
      <span className="hover:underline duration-200 text-white">
        Документация
      </span>
      <div>
        {loading ? (
          <LoaderCircle className="animate-spin text-white" />
        ) : (
          <File size={20} className="text-white" />
        )}
      </div>
    </Link>
  );
};

export default DocumentationBtn;
