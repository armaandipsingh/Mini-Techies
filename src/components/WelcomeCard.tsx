import Image from "next/image";
import { Logo } from "@/components/brand/Logo";
import { accentStyles } from "@/lib/accents";
import type { Accent } from "@/lib/site";
import { cn } from "@/lib/cn";

const CARD_BOX =
  "relative flex aspect-[3/4.15] h-full flex-col items-center overflow-hidden rounded-3xl bg-white px-4 pb-6 pt-5 text-center shadow-card ring-1 ring-ink/5 transition-transform duration-300 hover:-translate-y-1.5";

/**
 * Branded "Welcome to the Team" card. One layout for every member so
 * photos, type, and spacing stay identical across the grid.
 */
export function WelcomeCard({
  name,
  title,
  initials,
  accent,
  photo,
}: {
  name: string;
  title: string;
  initials: string;
  accent: Accent;
  photo?: string | null;
}) {
  const s = accentStyles[accent];

  return (
    <div className={CARD_BOX}>
      <Logo className="h-7 w-auto shrink-0" />

      <div className="relative mx-auto mt-4 w-[52%] max-w-[152px] shrink-0">
        <span className="absolute -left-3 top-1/3 h-6 w-6 rotate-45 rounded-[5px] bg-primary/30" />
        <span className="absolute -right-3 top-1/2 h-8 w-8 rotate-45 rounded-[5px] bg-primary/20" />
        {photo ? (
          <div className="relative aspect-square overflow-hidden rounded-2xl shadow-pop ring-1 ring-ink/5">
            <Image
              src={photo}
              alt={`${name}, ${title}`}
              fill
              sizes="(max-width: 768px) 45vw, 160px"
              className="object-cover object-center"
            />
          </div>
        ) : (
          <div
            className={cn(
              "relative flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br font-display text-4xl font-bold text-white shadow-pop",
              s.gradient
            )}
          >
            {initials}
          </div>
        )}
      </div>

      {/* Fixed text band — same height on every card so WELCOME lines up */}
      <div className="mt-4 flex h-[5.5rem] w-full shrink-0 flex-col items-center justify-start px-1">
        <h3 className="line-clamp-2 font-display text-base font-bold leading-snug text-primary sm:text-[1.05rem]">
          {name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[0.65rem] font-bold uppercase leading-snug tracking-[0.1em] text-ink sm:text-[0.7rem]">
          {title}
        </p>
      </div>

      <div className="mt-auto shrink-0 pt-1">
        <p className="text-gradient font-display text-2xl font-bold leading-none">
          WELCOME
        </p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink/60">
          to the team
        </p>
      </div>
    </div>
  );
}
