import { Outlet } from "react-router";
import { TopNav, type TopNavItem } from "../../navigation/components/TopNav";
import {
  faPlus,
  faRightToBracket,
  faTrophy,
  faUser,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../api/auth/useAuth";
import { NetworkStatusBanner } from "../components/NetworkStatusBanner/NetworkStatusBanner";

const TopNavContentAuth: TopNavItem[] = [
  { label: "Mi perfil", href: "/mi-perfil", icon: faUser },
  { label: "Competiciones", href: "/competiciones", icon: faTrophy },
  { label: "Crear equipo", href: "/crear-equipo", icon: faPlus },
  { label: "Crear liga", href: "/crear-liga", icon: faPlus, onlyAdmin: true },
];

const TopNavContent: TopNavItem[] = [
  { label: "Inciar sesión", href: "/login", icon: faRightToBracket },
  { label: "Crear cuenta", href: "/register", icon: faUserPlus },
];

export const MainLayout = () => {
  const { isLoggedIn } = useAuth();

  const content = isLoggedIn ? TopNavContentAuth : TopNavContent;

  return (
    <>
      <div className="bg-neutral-950 text-neutral-50 min-h-svh">
        <TopNav content={content} />
        <div className="h-full relative mx-auto">
          <img
            src="/logo.png"
            alt="logo"
            className="w-full opacity-[4%] pointer-events-none fixed z-1 -bottom-1/12 left-1/3 md:bg-red-200"
          />
          <div className="z-2 relative">
            <Outlet />
          </div>
        </div>
      </div>
      <NetworkStatusBanner />
    </>
  );
};
