"use client";
import { useState } from "react";

export default function PayButton({
  slug = "pro",
  interval = "month",
  userId,
}: {
  slug?: string;
  interval?: string;
  userId?: number;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <button
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, interval, userId }),
        });
        const { url, error } = await res.json();
        setLoading(false);
        if (error) alert(error);
        else window.location.href = url;
      }}
    >
      {loading ? "..." : "Купить"}
    </button>
  );
}
