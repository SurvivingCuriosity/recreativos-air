import { useEffect, useState } from "react";
import { Link } from "react-router";

export const TopNav = () => {
  return (
    <header className="h-14 p-2 border-b border-neutral-700 z-1 w-full">
      <nav className="max-w-screen-lg mx-auto flex items-center justify-between">
        <Link to="/">
          <img src={"logo.png"} alt="logo" className="size-10" />
        </Link>
        <HamburgerMenu />
      </nav>
    </header>
  );
};

export const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
        className="z-3 text-neutral-200 flex size-6 flex-col justify-center gap-2 lg:hidden relative"
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

      <ul className="hidden lg:flex lg:flex-row lg:gap-6 *:text-neutral-200">
        <li>
          <Link
            className="rounded-md p-2 transition-all duration-200 hover:bg-neutral-300 dark:hover:bg-neutral-800"
            to="/proyectos"
          >
            Projects
          </Link>
        </li>
        <li>
          <Link
            className="rounded-md p-2 transition-all duration-200 hover:bg-neutral-300 dark:hover:bg-neutral-800"
            to="/experiencia"
          >
            Work experience
          </Link>
        </li>
      </ul>

      <div
        className={`z-2 flex flex-col justify-between lg:hidden fixed top-0 h-dvh w-screen bg-black/95 ${
          isOpen ? "left-0" : "left-full"
        } transition-all duration-200 pt-20 pb-4`}
      >
        <ul
          className={`w-full px-7 *:mb-8 *:border-b *:border-neutral-800 *:text-2xl *:dark:border-neutral-200 text-neutral-200`}
        >
          <li
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <Link to="/">Home</Link>
          </li>
          <li
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <Link to="/proyectos">Projects</Link>
          </li>
          <li
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <Link to="/experiencia">Work experience</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
