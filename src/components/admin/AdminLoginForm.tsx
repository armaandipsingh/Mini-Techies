"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error || "Login failed.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-sm rounded-3xl bg-white p-8 shadow-card ring-1 ring-ink/5"
    >
      <h1 className="font-display text-2xl font-bold text-ink">Admin login</h1>
      <p className="mt-2 text-sm text-ink/60">
        Enter the admin password to view waitlist signups.
      </p>
      <label className="mt-6 block text-left text-sm font-semibold text-ink">
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
          className="mt-2 w-full rounded-2xl border border-ink/10 bg-cream px-4 py-3 text-ink outline-none ring-primary focus:ring-2"
        />
      </label>
      {error && (
        <p className="mt-3 text-sm font-semibold text-coral" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-full bg-primary px-5 py-3 font-display font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
