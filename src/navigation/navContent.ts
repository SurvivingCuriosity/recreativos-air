import {
  CalendarDays,
  House,
  LogIn,
  Shield,
  Trophy,
  User,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/** Barra inferior móvil (DESIGN.md §6.2). Rutas intactas. */
export const NAV_INICIO: NavItem = { label: "Inicio", href: "/", icon: House };
export const NAV_COMPETICIONES: NavItem = {
  label: "Competiciones",
  href: "/competiciones",
  icon: Trophy,
};
export const NAV_MI_PERFIL: NavItem = { label: "Mi perfil", href: "/mi-perfil", icon: User };
export const NAV_LOGIN: NavItem = { label: "Iniciar sesión", href: "/login", icon: LogIn };
export const NAV_REGISTER: NavItem = { label: "Crear cuenta", href: "/register", icon: UserPlus };
export const NAV_ADMIN_LABEL = "Admin";
export const NAV_ADMIN_ICON = Shield;

/** Enlaces del Sheet / desplegable de administración. */
export const ADMIN_LINKS: NavItem[] = [
  { label: "Usuarios", href: "/admin-usuarios", icon: Users },
  { label: "Equipos", href: "/admin-equipos", icon: User },
  { label: "Temporadas", href: "/admin-temporadas", icon: CalendarDays },
];

/** Rutas que se consideran "sección Admin" para el estado activo. */
export const isAdminRoute = (pathname: string) =>
  pathname.startsWith("/admin-") || pathname.startsWith("/crear-liga");
