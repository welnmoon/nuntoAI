import LogotypeNunto from "@/components/logotype-nunto";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: { title: <LogotypeNunto />,  },
  };
}
