"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import LoginForm from "@/components/form/login/login-form";
import RegisterForm from "@/components/form/register/register-form";

type Mode = "login" | "register";

export default function AuthSwitcher({ initial = "login" as Mode }) {
  const [mode, setMode] = useState<Mode>(initial);

  useEffect(() => {
    setMode(initial);
  }, [initial]);


  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(0,123,255,0.35), transparent 50%),
          radial-gradient(circle at 80% 40%, rgba(0,200,255,0.25), transparent 50%),
          radial-gradient(circle at 50% 80%, rgba(100,180,255,0.3), transparent 50%),
          #0f1226
        `,
      }}
    >
      <div className="w-full max-w-sm">
        <div className="mb-4 text-center">
          <Link href="/" className="text-white/80 hover:text-white text-sm underline">
            На главную
          </Link>
        </div>
        <div className="mb-3 flex items-center gap-2">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              mode === "login"
                ? "bg-cyan-500 text-white"
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            Вход
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              mode === "register"
                ? "bg-cyan-500 text-white"
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            Регистрация
          </button>
        </div>

        {mode === "login" ? (
          <LoginForm onToggle={() => setMode("register")} />
        ) : (
          <RegisterForm onToggle={() => setMode("login")} />
        )}
      </div>
    </div>
  );
}
