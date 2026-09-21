import {
  CalendarDays,
  Info,
  ListOrdered,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import { NavLink } from "react-router";
import { cn } from "@/lib/utils";
import { useAuth } from "../../shared/api/auth/useAuth";

export interface TabLiga {
  segment: string;
  label: string;
  titulo: string;
  icon: LucideIcon;
  onlyAdmin?: boolean;
}

/** Pestañas del detalle de liga con icono y etiqueta visible (DESIGN.md §5/§6). */
export const TABS_LIGA: TabLiga[] = [
  { segment: "clasificacion", label: "Clasificación", titulo: "Clasificación", icon: ListOrdered },
  { segment: "jornadas", label: "Jornadas", titulo: "Jornadas", icon: CalendarDays },
  { segment: "equipos", label: "Equipos", titulo: "Equipos", icon: Users },
  { segment: "info", label: "Info", titulo: "Información", icon: Info },
  { segment: "ajustes", label: "Ajustes", titulo: "Ajustes", icon: Settings, onlyAdmin: true },
];

export const NavDetalleLiga = () => {
  const { user } = useAuth();
  const tabs = TABS_LIGA.filter((t) => !t.onlyAdmin || user?.admin);

  return (
    <nav
      aria-label="Secciones de la liga"
      className="grid animate-fade-in-top gap-1 rounded-button border border-border bg-card p-1"
    >
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
      >
        {tabs.map((t) => (
          <NavLink
            key={t.segment}
            to={t.segment}
            replace
            className={({ isActive }) =>
              cn(
                "flex h-13 flex-col items-center justify-center gap-[3px] rounded-[10px] px-1 text-[11px] font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring lg:h-11 lg:flex-row lg:gap-2 lg:text-[13px]",
                tabs.length >= 5 && "text-[10px] lg:text-[13px]",
                isActive &&
                  "bg-primary/14 text-primary-text shadow-[inset_0_-2px_0_var(--primary)]"
              )
            }
          >
            <t.icon size={20} strokeWidth={2} aria-hidden="true" />
            <span className="truncate">{t.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
