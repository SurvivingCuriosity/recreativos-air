import { Link, useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { Button } from "../../packages/components/Button/Button";
import { useAuth } from "../../shared/api/auth/useAuth";
import fondo from "../../shared/assets/tsunami.jpg";
import { authLinkClass } from "../../shared/components/Auth/AuthCard";
import { TELEFONO_ALBERTO } from "../../shared/db/telefono";
import { HomePage } from "../Home/HomePage";
import { ButtonWhatsapp } from "./ButtonWhatsapp";
import { FooterFutbolin } from "./FooterFutbolin";

/** Landing: con sesión renderiza la Home v3; sin sesión, la portada de invitado. */
export const LandingPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="flex flex-1 items-center justify-center" role="status" aria-label="Cargando">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </main>
    );
  }

  if (isLoggedIn) {
    return (
      <main className="mx-auto flex w-full max-w-screen-sm flex-1 flex-col px-4 pt-[22px] pb-5 lg:max-w-3xl lg:pt-8">
        <HomePage />
      </main>
    );
  }

  return (
    <main className="relative flex w-full flex-1 flex-col">
      {/* Hero de invitado: foto con degradado (design/screens/LandingInvitado.html), solo en oscuro */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden overflow-hidden dark:block"
      >
        <img src={fondo} alt="" className="h-full w-full object-cover object-[72%_center] opacity-80" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(from_var(--background)_r_g_b/0.55),rgb(from_var(--background)_r_g_b/0.2)_45%,rgb(from_var(--background)_r_g_b/0.85))]" />
      </div>

      <div className="relative flex w-full flex-1 flex-col items-center gap-[22px] px-4 pt-10 pb-5">
        <div className="flex flex-col items-center gap-2.5 text-center">
          <h1 className="animate-fade-in-top font-display text-[38px] leading-none font-bold tracking-[0.01em] text-foreground uppercase lg:text-6xl">
            Recreativos{" "}
            <span className="text-primary-text text-glow-brand dark:[text-shadow:0_0_14px_rgb(235_138_31/0.45)]">
              AIR
            </span>
          </h1>
          <p className="max-w-80 animate-fade-in-top text-sm leading-[1.45] text-balance text-foreground-soft lg:max-w-none lg:text-[15px]">
            Empresa especializada en futbolines Tsunami e Infinity en la provincia
            de Salamanca.
          </p>
        </div>

        <div className="flex w-full max-w-lg flex-col items-center gap-2">
          <div className="mt-2 flex w-full gap-2">
            <Button as="a" href="/login" onClick={() => navigate("/login")}>
              Entrar 🚀
            </Button>
            <Button
              as="a"
              href="/register"
              variant="outline"
              onClick={() => navigate("/register")}
              className={cn("bg-background/60")}
            >
              No tengo cuenta
            </Button>
          </div>
          <Link to="/reset-password" className={`${authLinkClass} text-foreground`}>
            He olvidado mi contraseña
          </Link>
        </div>

        <FooterFutbolin />

        <ButtonWhatsapp numero={TELEFONO_ALBERTO} />
      </div>
    </main>
  );
};
