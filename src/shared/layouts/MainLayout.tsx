import { Outlet } from "react-router";
import { AppHeader } from "../../navigation/components/AppHeader";
import { BottomNav } from "../../navigation/components/BottomNav";
import { AvisoPerfilSinNombre } from "../components/AvisoPerfilSinNombre/AvisoPerfilSinNombre";
import { NetworkStatusBanner } from "../components/NetworkStatusBanner/NetworkStatusBanner";

/**
 * Shell de la app (brief §2.1 + DESIGN.md §6.2/§6.3):
 * header → aviso de perfil sin nombre → contenido (contenedor 1024 px) → barra inferior (móvil).
 * Marca de agua del logo fija bajo el contenido.
 */
export const MainLayout = () => {
  return (
    <>
      <div className="flex min-h-svh flex-col bg-background text-foreground">
        <AppHeader />
        <AvisoPerfilSinNombre />
        <div className="relative mx-auto flex w-full flex-1 flex-col items-center">
          <img
            src="/logo.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none fixed -bottom-1/12 left-1/3 z-[1] w-full opacity-[4%] md:left-20 md:w-90"
          />
          <div className="relative z-[2] flex w-full max-w-5xl flex-1 flex-col pb-[calc(76px+env(safe-area-inset-bottom,0px))] lg:pb-0">
            <Outlet />
          </div>
        </div>
        <BottomNav />
      </div>
      <NetworkStatusBanner />
    </>
  );
};
