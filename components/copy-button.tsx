"use client";
import { useState } from "react";
import { CheckCheck, Copy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onCopy}
            className="absolute top-3 right-3 p-1 rounded-md text-gray-500 hover:text-white"
          >
            {copied ? <CheckCheck size={16} /> : <Copy size={16} />}
          </button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{copied ? "Скопировано!" : "Копировать"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
