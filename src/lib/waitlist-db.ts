import { ensureWaitlistSchema, getSql, type WaitlistRow } from "@/lib/db";
import type { WaitlistEntry } from "@/lib/waitlist";

/**
 * Persists a waitlist signup in Postgres.
 */
export async function saveWaitlistEntry(entry: WaitlistEntry): Promise<void> {
  await ensureWaitlistSchema();
  const sql = getSql();
  await sql`
    INSERT INTO waitlist_entries (email, name, role, submitted_at)
    VALUES (
      ${entry.email},
      ${entry.name ?? null},
      ${entry.role ?? null},
      ${entry.submittedAt}
    )
  `;
}

/**
 * Returns all waitlist signups, newest first.
 */
export async function listWaitlistEntries(): Promise<WaitlistRow[]> {
  await ensureWaitlistSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT id, email, name, role, submitted_at
    FROM waitlist_entries
    ORDER BY submitted_at DESC, id DESC
  `;
  return rows as WaitlistRow[];
}
