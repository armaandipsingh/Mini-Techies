import { saveWaitlistEntry } from "@/lib/waitlist-db";

export type WaitlistEntry = {
  email: string;
  name?: string;
  role?: string;
  submittedAt: string;
};

/**
 * Saves a waitlist signup to the database, then optionally notifies
 * configured destinations (webhook / Resend).
 *
 * Returns true when the database write succeeded.
 */
export async function deliverWaitlistEntry(
  entry: WaitlistEntry
): Promise<boolean> {
  try {
    await saveWaitlistEntry(entry);
  } catch (err) {
    console.error("[waitlist] database save failed:", err);
    return false;
  }

  // Optional side-channels — failures here do not fail the signup.
  const webhook = process.env.WAITLIST_WEBHOOK_URL;
  if (webhook) {
    void sendWebhook(webhook, entry);
  }

  const resendKey = process.env.RESEND_API_KEY;
  const notify = process.env.WAITLIST_NOTIFY_EMAIL;
  const from = process.env.WAITLIST_FROM_EMAIL;
  if (resendKey && notify && from) {
    void sendResend(resendKey, from, notify, entry);
  }

  return true;
}

async function sendWebhook(
  url: string,
  entry: WaitlistEntry
): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    return res.ok;
  } catch (err) {
    console.error("[waitlist] webhook delivery failed:", err);
    return false;
  }
}

async function sendResend(
  apiKey: string,
  from: string,
  to: string,
  entry: WaitlistEntry
): Promise<boolean> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: `New Mini Techies waitlist signup: ${entry.email}`,
        text: [
          `Email: ${entry.email}`,
          `Name: ${entry.name || "-"}`,
          `Role: ${entry.role || "-"}`,
          `Submitted: ${entry.submittedAt}`,
        ].join("\n"),
      }),
    });
    return res.ok;
  } catch (err) {
    console.error("[waitlist] email delivery failed:", err);
    return false;
  }
}
