"use client";
import Image from "next/image";

export default function TrustedBy() {
  const logos = [
    { name: "Google", url: "https://cdn.simpleicons.org/google/9ca3af" },
    { name: "Microsoft", url: "https://cdn.simpleicons.org/youtube/9ca3af" },
    { name: "Amazon", url: "https://cdn.simpleicons.org/obsidian/9ca3af" },
    { name: "Stripe", url: "https://cdn.simpleicons.org/stripe/9ca3af" },
    { name: "GitHub", url: "https://cdn.simpleicons.org/github/9ca3af" },
    { name: "Slack", url: "https://cdn.simpleicons.org/slack/9ca3af" },
    { name: "Notion", url: "https://cdn.simpleicons.org/notion/9ca3af" },
    { name: "Vercel", url: "https://cdn.simpleicons.org/vercel/9ca3af" },
    { name: "OpenAI", url: "https://cdn.simpleicons.org/openai/9ca3af" },
    { name: "Figma", url: "https://cdn.simpleicons.org/figma/9ca3af" },
  ];

  return (
    <section className="py-12">
      <h2 className="text-center text-gray-400 text-sm font-semibold tracking-wide uppercase">
        Нам доверяют
      </h2>
      <div className="mt-8 grid grid-cols-5 lg:flex flex-wrap items-center justify-center gap-10">
        {logos.map((logo) => (
          <Image
            key={logo.name}
            src={logo.url}
            alt={logo.name}
            width={64}
            height={64}
            className="h-10 w-auto opacity-70 lg:mx-0 mx-auto hover:opacity-100 transition"
          />
        ))}
      </div>
    </section>
  );
}
