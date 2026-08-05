"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink ring-1 ring-ink/10 transition hover:bg-cream disabled:opacity-60"
    >
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
