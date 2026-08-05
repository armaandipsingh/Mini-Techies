import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "mt_admin_session";

function getAdminPassword(): string | null {
  const pw = process.env.ADMIN_PASSWORD?.trim();
  return pw ? pw : null;
}

function getSessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    process.env.ADMIN_PASSWORD?.trim() ||
    "mini-techies-dev-secret"
  );
}

/**
 * Creates a signed session token for the admin cookie.
 */
export function createAdminSessionToken(): string {
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days
  const payload = `admin:${exp}`;
  const sig = createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("hex");
  return `${payload}:${sig}`;
}

/**
 * Validates an admin session token.
 */
export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(":");
  if (parts.length !== 3) return false;
  const [role, expStr, sig] = parts;
  if (role !== "admin") return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;

  const payload = `${role}:${expStr}`;
  const expected = createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("hex");

  try {
    const a = Buffer.from(sig, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Checks the submitted password against ADMIN_PASSWORD.
 */
export function checkAdminPassword(password: string): boolean {
  const expected = getAdminPassword();
  if (!expected) return false;
  try {
    const a = Buffer.from(password, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * True when ADMIN_PASSWORD is configured.
 */
export function isAdminConfigured(): boolean {
  return Boolean(getAdminPassword());
}

/**
 * Reads the current request's admin cookie and verifies it.
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  return verifyAdminSessionToken(jar.get(ADMIN_COOKIE)?.value);
}
