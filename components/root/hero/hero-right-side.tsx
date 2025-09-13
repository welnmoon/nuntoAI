"use client";
import { useEffect, useMemo, useState } from "react";

const promptText = "Сгенерируй слоган для Nunto AI";

const HeroRightSide = () => {
  const [i, setI] = useState(0);
  const [done, setDone] = useState(false);
  const speed = 40;

  useEffect(() => {
    if (i >= promptText.length) {
      setDone(true);
      return;
    }
    const t = setTimeout(() => setI((v) => v + 1), speed);
    return () => clearTimeout(t);
  }, [i]);

  const typed = useMemo(() => promptText.slice(0, i), [i]);

  return (
    <div className="w-full md:w-1/2 text-left mt-8 md:mt-0">
      <div className="relative rounded-2xl border border-white/10 bg-black/40 text-white shadow-[0_0_0_1px_rgba(255,255,255,.05)]">
        <div className="flex gap-2 p-3">
          <span className="size-2 rounded-full bg-red-400/80" />
          <span className="size-2 rounded-full bg-yellow-400/80" />
          <span className="size-2 rounded-full bg-green-400/80" />
        </div>
        <pre className="px-4 pb-4 overflow-x-auto text-sm leading-6 font-mono">
          <code className="whitespace-pre">
            <span className="token keyword">import</span>
            {" { createClient } "}
            <span className="token keyword">from</span>{" "}
            <span className="token string">&apos;nunto-ai&apos;</span>
            {"\n"}
            <span className="token keyword">const</span> ai{" "}
            <span className="token operator">=</span> createClient(
            <span className="token punctuation">{"{"}</span> apiKey:
            process.env.NUNTO_API_KEY{" "}
            <span className="token punctuation">{"}"}</span>){"\n\n"}
            <span className="token keyword">async</span>{" "}
            <span className="token keyword">function</span>{" "}
            <span className="token function">main</span>() {"\n"}
            {"  "}
            <span className="token keyword">const</span> res{" "}
            <span className="token operator">
              =<br />
            </span>
            {""}
            <span className="token keyword">await</span> ai.chat.ask(
            <span className="token string">&quot;</span>
            <span className="text-cyan-200/90">{typed}</span>
            <span className={`typing-caret ${done ? "opacity-0" : ""}`} />
            <span className="token string">&quot;</span>)
            {"\n  console.log(res.text)\n"}
            {"}"}
            {"\n\n"}
            <span className="token function">main</span>()
          </code>
        </pre>
      </div>
    </div>
  );
};

export default HeroRightSide;
