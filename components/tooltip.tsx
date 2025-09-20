import { ReactNode } from "react";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";

const ToolTip = ({ children }: { children: ReactNode }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
    </Tooltip>
  );
};

export default ToolTip;
