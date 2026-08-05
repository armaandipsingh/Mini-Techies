import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import {
  isAdminAuthenticated,
  isAdminConfigured,
} from "@/lib/admin-auth";
import { listWaitlistEntries } from "@/lib/waitlist-db";

export const metadata: Metadata = {
  title: "Admin · Waitlist",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminPage() {
  if (!isAdminConfigured()) {
    return (
      <div className="mx-auto max-w-lg px-4 py-28 text-center">
        <h1 className="font-display text-3xl font-bold text-ink">
          Admin not configured
        </h1>
        <p className="mt-3 text-ink/70">
          Set the <code className="rounded bg-cream px-1.5 py-0.5">ADMIN_PASSWORD</code>{" "}
          environment variable, then redeploy.
        </p>
      </div>
    );
  }

  const authed = await isAdminAuthenticated();
  if (!authed) {
    return (
      <div className="px-4 py-28">
        <AdminLoginForm />
      </div>
    );
  }

  let entries: Awaited<ReturnType<typeof listWaitlistEntries>> = [];
  let loadError: string | null = null;
  try {
    entries = await listWaitlistEntries();
  } catch (err) {
    console.error("[admin] failed to load waitlist:", err);
    loadError = "Could not load waitlist entries. Check the database connection.";
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            Admin
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-ink sm:text-4xl">
            Waitlist signups
          </h1>
          <p className="mt-2 text-ink/65">
            {entries.length} {entries.length === 1 ? "signup" : "signups"} saved
            from the website form.
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      {loadError ? (
        <p className="mt-8 rounded-2xl bg-coral-soft px-4 py-3 text-sm font-semibold text-ink">
          {loadError}
        </p>
      ) : entries.length === 0 ? (
        <div className="mt-10 rounded-3xl bg-white p-10 text-center shadow-card ring-1 ring-ink/5">
          <p className="font-display text-xl font-bold text-ink">No signups yet</p>
          <p className="mt-2 text-ink/60">
            When someone joins the waitlist, they&apos;ll show up here.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-ink/5">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-cream/80 text-xs font-bold uppercase tracking-wide text-ink/55">
                <tr>
                  <th className="px-5 py-3">#</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((row, i) => (
                  <tr
                    key={row.id}
                    className="border-t border-ink/5 odd:bg-white even:bg-cream/30"
                  >
                    <td className="px-5 py-3 text-ink/40">{i + 1}</td>
                    <td className="px-5 py-3 font-semibold text-ink">
                      <a
                        href={`mailto:${row.email}`}
                        className="hover:text-primary"
                      >
                        {row.email}
                      </a>
                    </td>
                    <td className="px-5 py-3 text-ink/80">{row.name || "—"}</td>
                    <td className="px-5 py-3 capitalize text-ink/80">
                      {row.role || "—"}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-ink/60">
                      {formatDate(row.submitted_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
