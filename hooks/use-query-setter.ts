"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useQuerySetter() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return useCallback(
    (key: string, value: string | null, { replace = false } = {}) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === null) params.delete(key);
      else params.set(key, value);

      const url = params.size ? `${pathname}?${params}` : pathname;
      (replace ? router.replace : router.push)(url, { scroll: false });
    },
    [pathname, router, searchParams]
  );
}
