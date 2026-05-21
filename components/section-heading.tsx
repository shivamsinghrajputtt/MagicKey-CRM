import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  action
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-1 text-xs font-semibold uppercase tracking-normal text-gold">{eyebrow}</p>
        ) : null}
        <h2 className="truncate text-lg font-bold tracking-normal md:text-xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}
