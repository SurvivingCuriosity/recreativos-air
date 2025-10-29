import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { BotonRefrescar } from "../../features/DetalleLiga/DetalleLigaLayout";
import { useAuth } from "../../shared/api/auth/useAuth";
import { ThemeSwitcher } from "../../shared/components/ThemeSwitcher/ThemeSwitcher";

export interface TopNavItem {
  label: string;
  href: string;
  icon?: IconDefinition;
  descripcion?: string;
  onlyAdmin?: boolean;
}

export const TopNav = ({ content }: { content: TopNavItem[] }) => {
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

export const HamburgerMenu = ({ content }: { content: TopNavItem[] }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();
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
        <ul className={`w-full px-7 space-y-2 *:text-xl text-neutral-300`}>
          <BotonRefrescar onClick={()=>setIsOpen(false)} />
          {content.map((item, index) => {
            if (item.onlyAdmin && !isAdmin) return null;
            return (
              <div
                key={index}
                onClick={() => {
                  setIsOpen(false);
                  navigate(item.href);
                }}
                className="flex items-center gap-2 p-3 bg-neutral-900 rounded-lg relative overflow-hidden"
              >
                {item.icon && <FontAwesomeIcon icon={item.icon} />}
                {item.icon && (
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="text-6xl opacity-5 absolute -top-1 -right-1 -rotate-12"
                  />
                )}
                <div>
                  <p className="font-cool">{item.label}</p>
                  {item.descripcion && <p>{item.descripcion}</p>}
                </div>
              </div>
            );
          })}
        </ul>
        <ThemeSwitcher />
      </div>
    </div>
  );
};
