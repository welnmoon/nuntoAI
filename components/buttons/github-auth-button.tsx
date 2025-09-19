"use client";

import clsx from "clsx";
import { Github, LoaderCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState, useTransition, type ReactNode } from "react";

export type GithubAuthButtonProps = {
  size?: "sm" | "md" | "lg";
  redirectTo?: string;
  children?: ReactNode;
  className?: string;
};

const sizeStyles: Record<Required<GithubAuthButtonProps>["size"], string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
};

export default function GithubAuthButton({
  size = "md",
  redirectTo = "/",
  children,
  className,
}: GithubAuthButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const disabled = isPending || loading;

  const handleClick = () => {
    if (disabled) return;
    setLoading(true);
    startTransition(() => {
      void signIn("github", { callbackUrl: redirectTo });
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={clsx(
        "w-full rounded-xl cursor-pointer border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-70",
        sizeStyles[size],
        className
      )}
    >
      {loading ? (
        <LoaderCircle className="animate-spin mx-auto" />
      ) : (
        <div className="flex  w-full items-center justify-center gap-2">
          <Github className="h-5 w-5" />
          <span>{children || "Войти через GitHub"}</span>
        </div>
      )}
    </button>
  );
}
