import { neon } from "@neondatabase/serverless";

/**
 * Shared Neon SQL client. Uses DATABASE_URL from Vercel/Neon env.
 */
export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not configured.");
  }
  return neon(url);
}

let schemaReady: Promise<void> | null = null;

/**
 * Creates the waitlist table on first use (idempotent).
 */
export function ensureWaitlistSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = getSql();
      await sql`
        CREATE TABLE IF NOT EXISTS waitlist_entries (
          id SERIAL PRIMARY KEY,
          email TEXT NOT NULL,
          name TEXT,
          role TEXT,
          submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS waitlist_entries_submitted_at_idx
        ON waitlist_entries (submitted_at DESC)
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS waitlist_entries_email_idx
        ON waitlist_entries (email)
      `;
    })().catch((err) => {
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}

export type WaitlistRow = {
  id: number;
  email: string;
  name: string | null;
  role: string | null;
  submitted_at: string;
};
