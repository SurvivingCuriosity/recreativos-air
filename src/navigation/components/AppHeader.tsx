import { NavLink } from "react-router";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/shared/theme/ThemeToggle";
import { useAuth } from "../../shared/api/auth/useAuth";
import {
  NAV_COMPETICIONES,
  NAV_LOGIN,
  NAV_MI_PERFIL,
  NAV_REGISTER,
  type NavItem,
} from "../navContent";
import { AdminMenu } from "./AdminMenu";

const HeaderLink = ({ item }: { item: NavItem }) => (
  <NavLink
    to={item.href}
    className={({ isActive }) =>
      cn(
        "inline-flex min-h-11 items-center px-1.5 font-display text-[15px] font-semibold text-foreground-soft transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        isActive && "text-primary-text shadow-[inset_0_-2px_0_var(--primary)]"
      )
    }
  >
    {item.label}
  </NavLink>
);

/**
 * Header (§2.2 del brief + DESIGN.md §6.3):
 * - Móvil: logo + conmutador de tema (la navegación va en la barra inferior).
 * - Desktop (≥lg): logo + enlaces inline + desplegable Admin + conmutador.
 * Borde inferior primary (con glow) cuando el usuario es admin.
 */
export const AppHeader = () => {
  const { user, isLoggedIn } = useAuth();
  const isAdmin = !!user?.admin;

  return (
    <header
      className={cn(
        "relative z-30 h-14 w-full shrink-0 border-b bg-background lg:h-16",
        isAdmin
          ? "border-primary dark:shadow-[0_1px_10px_rgb(235_138_31/0.18)]"
          : "border-border"
      )}
    >
      <nav
        aria-label="Principal"
        className="mx-auto flex h-full w-full max-w-5xl items-center gap-5 px-4 lg:px-6"
      >
        <NavLink to="/" aria-label="Inicio" className="mr-auto -ml-0.5 flex size-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          <img src="/logo.png" alt="Recreativos AIR" className="size-10 rounded-full ring-logo" />
        </NavLink>

        <div className="hidden items-center gap-2 lg:flex">
          {isLoggedIn ? (
            <>
              <HeaderLink item={NAV_MI_PERFIL} />
              <HeaderLink item={NAV_COMPETICIONES} />
              {isAdmin && <AdminMenu />}
            </>
          ) : (
            <>
              <HeaderLink item={NAV_LOGIN} />
              <HeaderLink item={NAV_REGISTER} />
              <HeaderLink item={NAV_COMPETICIONES} />
            </>
          )}
        </div>

        <ThemeToggle />
      </nav>
    </header>
  );
};
