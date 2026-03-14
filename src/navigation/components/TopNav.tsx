import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { BotonRefrescar } from "../../features/DetalleLiga/DetalleLigaLayout";
import { useAuth } from "../../shared/api/auth/useAuth";
import { TopNavItem as TopNavItemComponent } from "./TopNavItem";
import type {
  AuthNavContent,
  GuestNavContent,
} from "../../shared/layouts/MainLayout";

export interface TopNavItem {
  label: string;
  href: string;
  icon?: IconDefinition;
  descripcion?: string;
  onlyAdmin?: boolean;
}

export const TopNav = ({
  content,
}: {
  content: AuthNavContent | GuestNavContent;
}) => {
  const { user } = useAuth();
  const isAdmin = user?.admin;
  return (
    <header
      className={`h-14 p-2 border-b ${
        isAdmin ? "border-primary" : "border-neutral-700"
      } w-full block`}
    >
      <nav className="max-w-screen-lg mx-auto flex items-center justify-between z-6">
        <Link to="/" className="z-6 relative">
          <img src={"/logo.png"} alt="logo" className="size-10" />
        </Link>
        <HamburgerMenu content={content} />
      </nav>
    </header>
  );
};

export const HamburgerMenu = ({
  content,
}: {
  content: AuthNavContent | GuestNavContent;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user, isLoggedIn } = useAuth();
  const isAdmin = user?.admin;

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const authContent = content as AuthNavContent;
  const guestContent = content as GuestNavContent;

  return (
    <div>
      <button
        aria-label="Botón abrir menú lateral"
        onClick={toggleMenu}
        className="z-6 text-primary flex size-6 flex-col justify-center gap-2 lg:hidden relative"
      >
        <span
          className={`${
            isOpen ? "rotate-[45deg] scale-[120%]" : "rotate-0"
          } h-[3px] w-full rounded-lg transition-all duration-200 origin-top-left ${
            isAdmin ? "bg-primary" : "bg-neutral-200"
          } `}
        ></span>
        <span
          className={`${
            isOpen ? "opacity-0" : "opacity-100"
          } h-[3px] w-full rounded-lg transition-all duration-200 origin-bottom-left ${
            isAdmin ? "bg-primary" : "bg-neutral-200"
          } `}
        ></span>
        <span
          className={`${
            isOpen ? "-rotate-[45deg] scale-[120%]" : "rotate-0"
          } h-[3px] w-full rounded-lg transition-all duration-200 origin-bottom-left ${
            isAdmin ? "bg-primary" : "bg-neutral-200"
          } `}
        ></span>
      </button>

      {isLoggedIn ? (
        <ul className="z-10 relative hidden lg:flex lg:flex-row lg:gap-6 *:text-primary">
          <Link to="/mi-perfil">Mi perfil</Link>
          <Link to="/competiciones">Competiciones</Link>
        </ul>
      ) : (
        <ul className="z-10 relative hidden lg:flex lg:flex-row lg:gap-6 *:text-primary">
          <Link to="/login">Iniciar sesión</Link>
          <Link to="/register">Crear cuenta</Link>
          <Link to="/competiciones">Competiciones</Link>
        </ul>
      )}

      <div
        className={`z-5 flex flex-col justify-between lg:hidden fixed top-0 h-dvh w-screen bg-neutral-950/95 ${
          isOpen ? "left-0" : "left-full"
        } transition-all duration-200 pt-20 pb-4`}
      >
        <ul className={`w-full px-7 space-y-2 *:text-xl text-neutral-300 h-full flex flex-col`}>
          <BotonRefrescar onClick={() => setIsOpen(false)} />

          {isLoggedIn ? (
            <>
              <TopNavItemComponent
                item={authContent.miPerfil}
                isAdmin={!!isAdmin}
                setIsOpen={setIsOpen}
              />
              <TopNavItemComponent
                item={authContent.competiciones}
                isAdmin={!!isAdmin}
                setIsOpen={setIsOpen}
              />
              <TopNavItemComponent
                item={authContent.crearEquipo}
                isAdmin={!!isAdmin}
                setIsOpen={setIsOpen}
              />
            </>
          ) : (
            <>
              <TopNavItemComponent
                item={guestContent.login}
                isAdmin={!!isAdmin}
                setIsOpen={setIsOpen}
              />
              <TopNavItemComponent
                item={guestContent.register}
                isAdmin={!!isAdmin}
                setIsOpen={setIsOpen}
              />
              <TopNavItemComponent
                item={guestContent.competiciones}
                isAdmin={!!isAdmin}
                setIsOpen={setIsOpen}
              />
            </>
          )}

          <div className="flex gap-2">
            <TopNavItemComponent
              item={authContent.usuarios}
              isAdmin={!!isAdmin}
              setIsOpen={setIsOpen}
            />
            <TopNavItemComponent
              item={authContent.equipos}
              isAdmin={!!isAdmin}
              setIsOpen={setIsOpen}
            />
          </div>

          <a
            href="https://www.futbolin.app"
            target="_blank"
            className="bg-neutral-900 block rounded-2xl mt-auto ml-auto"
          >
            <img
              src="/logo-futbol-in.png"
              alt="logo"
              className="w-40 p-2 px-5"
            />
          </a>
        </ul>
      </div>
    </div>
  );
};
