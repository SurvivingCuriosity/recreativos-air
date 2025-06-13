import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ThemeSwitcher } from "../../shared/components/ThemeSwitcher/ThemeSwitcher";

export interface TopNavItem {
  label: string;
  href: string;
}

export const TopNav = ({content}:{content:TopNavItem[]}) => {

  return (
    <header className="h-14 p-2 absolute border-b border-neutral-700 w-full block">
      <nav className="max-w-screen-lg mx-auto flex items-center justify-between z-6">
        <Link to="/" className="z-6">
          <img src={"/logo.png"} alt="logo" className="size-10" />
        </Link>
        <HamburgerMenu content={content}/>
      </nav>
    </header>
  );
};

export const HamburgerMenu = ({content}:{content:TopNavItem[]}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate()

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
          } h-[3px] w-full rounded-lg transition-all duration-200 origin-top-left bg-neutral-200`}
        ></span>
        <span
          className={`${
            isOpen ? "opacity-0" : "opacity-100"
          } h-[3px] w-full rounded-lg transition-all duration-200 origin-bottom-left bg-neutral-200`}
        ></span>
        <span
          className={`${
            isOpen ? "-rotate-[45deg] scale-[120%]" : "rotate-0"
          } h-[3px] w-full rounded-lg transition-all duration-200 origin-bottom-left bg-neutral-200`}
        ></span>
      </button>

      <ul className="z-10 relative hidden lg:flex lg:flex-row lg:gap-6 *:text-primary">
        <li>
          <a
            className="rounded-md p-2 transition-all duration-200 hover:bg-neutral-300"
            href="#seccion1"
          >
            Seccion 1
          </a>
        </li>
        <li>
          <a
            className="rounded-md p-2 transition-all duration-200 hover:bg-neutral-300"
            href="#seccion2"
          >
            Seccion 2
          </a>
        </li>
        <li>
          <a
            className="rounded-md p-2 transition-all duration-200 hover:bg-neutral-300"
            href="#seccion3"
          >
            Seccion 3
          </a>
        </li>
        <li>
          <a
            className="rounded-md p-2 transition-all duration-200 hover:bg-neutral-300"
            href="#seccion4"
          >
            Seccion 4
          </a>
        </li>
      </ul>

      <div
        className={`z-5 flex flex-col justify-between lg:hidden fixed top-0 h-dvh w-screen bg-neutral-950/95 ${
          isOpen ? "left-0" : "left-full"
        } transition-all duration-200 pt-20 pb-4`}
      >
        <ul
          className={`w-full px-7 *:mb-8 *:border-b *:border-neutral-800 *:text-2xl *:dark:border-neutral-200 text-neutral-200`}
        >
          {content.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                setIsOpen(false);
                if(item.href.startsWith('#')){
                  const element = document.getElementById(item.href.substring(1));
                  element?.scrollIntoView({ behavior: "smooth", block: "start" });
                } else {
                  navigate(item.href);
                }
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
        <ThemeSwitcher />
      </div>
    </div>
  );
};
