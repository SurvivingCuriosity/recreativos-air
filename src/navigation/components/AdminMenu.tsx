import { ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useConteoEnfrentamientosPendientes } from "../../shared/api/enfrentamientos/hooks";
import { ADMIN_LINKS, NAV_ADMIN_ICON, NAV_ADMIN_LABEL, isAdminRoute } from "../navContent";
import { BadgePendientes } from "./BadgePendientes";

/** Desplegable «Admin» del header desktop (DESIGN.md §6.3). */
export const AdminMenu = () => {
  const { pathname } = useLocation();
  const pendientes = useConteoEnfrentamientosPendientes();
  const AdminIcon = NAV_ADMIN_ICON;
  const active = isAdminRoute(pathname);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex min-h-11 items-center gap-1.5 rounded-input border border-primary-text/60 bg-primary/8 px-3 font-display text-[15px] font-semibold text-primary-text transition-colors hover:bg-primary/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-[state=open]:bg-primary/15",
          active && "bg-primary/15"
        )}
      >
        <AdminIcon size={18} strokeWidth={2} aria-hidden="true" />
        <span>{NAV_ADMIN_LABEL}</span>
        <BadgePendientes count={pendientes} className="static" />
        <ChevronDown size={16} aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52 rounded-card border-border bg-card p-1.5">
        {ADMIN_LINKS.map((item) => (
          <DropdownMenuItem
            key={item.href}
            asChild
            className="min-h-11 gap-3 rounded-input px-3 font-display text-[15px] font-semibold text-foreground focus:bg-muted focus:text-foreground"
          >
            <Link to={item.href}>
              <item.icon size={18} className="text-primary-text" aria-hidden="true" />
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
