import { Outlet } from "react-router";
import { TopNav, type TopNavItem } from "../../navigation/components/TopNav";
import { CalendarDays, Plus, LogIn, Trophy, User, UserPlus, Users } from "lucide-react";
import { useAuth } from "../api/auth/useAuth";
import { NetworkStatusBanner } from "../components/NetworkStatusBanner/NetworkStatusBanner";
import { AvisoPerfilSinNombre } from "../components/AvisoPerfilSinNombre/AvisoPerfilSinNombre";

export type AuthNavContent = {
  miPerfil: TopNavItem;
  competiciones: TopNavItem;
  crearEquipo: TopNavItem;
  crearLiga: TopNavItem;
  equipos: TopNavItem;
  usuarios: TopNavItem;
  temporadas: TopNavItem;
};

export type GuestNavContent = {
  login: TopNavItem;
  register: TopNavItem;
  competiciones: TopNavItem;
};

const TopNavContentAuth: AuthNavContent = {
  miPerfil: { label: "Mi perfil", href: "/mi-perfil", icon: User },
  competiciones: { label: "Competiciones", href: "/competiciones", icon: Trophy },
  crearEquipo: { label: "Crear equipo", href: "/crear-equipo", icon: Plus },
  crearLiga: { label: "Crear liga", href: "/crear-liga", icon: Plus, onlyAdmin: true },
  equipos: { label: "Equipos", href: "/admin-equipos", icon: User, onlyAdmin: true },
  usuarios: { label: "Usuarios", href: "/admin-usuarios", icon: Users, onlyAdmin: true },
  temporadas: { label: "Temporadas", href: "/admin-temporadas", icon: CalendarDays, onlyAdmin: true },
};

const TopNavContent: GuestNavContent = {
  login: { label: "Inciar sesión", href: "/login", icon: LogIn },
  register: { label: "Crear cuenta", href: "/register", icon: UserPlus },
  competiciones: { label: "Competiciones", href: "/competiciones", icon: Trophy },
};

export const MainLayout = () => {
  const { isLoggedIn } = useAuth();

  const content = isLoggedIn ? TopNavContentAuth : TopNavContent

  return (
    <>
      <div className="bg-background text-foreground min-h-svh flex flex-col">
        <TopNav content={content} />
        <AvisoPerfilSinNombre />
        <div className="relative mx-auto flex flex-col items-center flex-1 w-full">
          <img
            src="/logo.png"
            alt="logo"
            className="w-full opacity-[4%] pointer-events-none fixed z-1 -bottom-1/12 left-1/3 md:w-90 md:left-20"
          />
          <div className="z-2 relative flex-1 w-full flex flex-col">
            <Outlet />
          </div>
        </div>
      </div>
      <NetworkStatusBanner />
    </>
  );
};
