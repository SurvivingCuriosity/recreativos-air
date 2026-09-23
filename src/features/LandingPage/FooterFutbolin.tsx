import { cn } from "@/lib/utils";

/** Pie con el enlace a futbolin.app (DESIGN.md §6.2: pie de Home/Landing). */
export const FooterFutbolin = ({ className }: { className?: string }) => (
  <a
    href="https://www.futbolin.app"
    target="_blank"
    rel="noreferrer"
    className={cn(
      "relative mt-auto flex w-full flex-col items-center gap-2.5 rounded-liga border border-border bg-card/85 p-4 font-display text-[13px] font-semibold tracking-[0.04em] text-foreground backdrop-blur-xs lg:mx-auto lg:w-auto lg:flex-row lg:gap-4 lg:px-6",
      className
    )}
  >
    <span>¡ Encuentra futbolines cerca !</span>
    <img src="/logo-futbol-in.png" alt="futbolin.app" className="w-[150px] lg:w-24" />
  </a>
);
