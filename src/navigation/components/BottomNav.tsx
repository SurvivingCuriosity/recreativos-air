import { useState } from "react";
import { NavLink, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { useAuth } from "../../shared/api/auth/useAuth";
import { useConteoEnfrentamientosPendientes } from "../../shared/api/enfrentamientos/hooks";
import {
  NAV_ADMIN_ICON,
  NAV_ADMIN_LABEL,
  NAV_COMPETICIONES,
  NAV_INICIO,
  NAV_LOGIN,
  NAV_MI_PERFIL,
  isAdminRoute,
  type NavItem,
} from "../navContent";
import { AdminSheet } from "./AdminSheet";
import { BadgePendientes } from "./BadgePendientes";

const itemBase =
  "relative flex h-14 flex-1 flex-col items-center justify-center gap-[3px] rounded-input text-[11px] font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring";
const itemActive =
  "text-primary-text bg-primary/12 shadow-[inset_0_2px_0_var(--color-primary)]";

const BottomNavLink = ({ item, badge }: { item: NavItem; badge?: number }) => (
  <NavLink
    to={item.href}
    end={item.href === "/"}
    className={({ isActive }) => cn(itemBase, isActive && itemActive)}
  >
    {({ isActive }) => (
      <>
        <span className="relative inline-flex">
          <item.icon size={22} strokeWidth={2} aria-hidden="true" />
          {badge !== undefined && <BadgePendientes count={badge} />}
        </span>
        <span aria-current={isActive ? "page" : undefined}>{item.label}</span>
      </>
    )}
  </NavLink>
);

/**
 * Barra inferior móvil (< lg) por rol (DESIGN.md §6.2):
 * usuario: Inicio · Competiciones · Mi perfil
 * invitado: Inicio · Competiciones · Iniciar sesión
 * admin: + Admin (abre Sheet con Usuarios / Equipos / Temporadas)
 */
export const BottomNav = () => {
  const { user, isLoggedIn } = useAuth();
  const { pathname } = useLocation();
  const isAdmin = !!user?.admin;
  const pendientes = useConteoEnfrentamientosPendientes();
  const [sheetOpen, setSheetOpen] = useState(false);
  const AdminIcon = NAV_ADMIN_ICON;

  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-30 flex gap-1 border-t border-border bg-card-2 px-3 pt-1.5 pb-[calc(10px+env(safe-area-inset-bottom,0px))] lg:hidden"
    >
      <BottomNavLink item={NAV_INICIO} badge={isAdmin ? pendientes : undefined} />
      <BottomNavLink item={NAV_COMPETICIONES} />
      {isLoggedIn ? <BottomNavLink item={NAV_MI_PERFIL} /> : <BottomNavLink item={NAV_LOGIN} />}
      {isAdmin && (
        <>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={sheetOpen}
            className={cn(itemBase, (sheetOpen || isAdminRoute(pathname)) && itemActive)}
          >
            <AdminIcon size={22} strokeWidth={2} aria-hidden="true" />
            <span>{NAV_ADMIN_LABEL}</span>
          </button>
          <AdminSheet open={sheetOpen} onOpenChange={setSheetOpen} />
        </>
      )}
    </nav>
  );
};
