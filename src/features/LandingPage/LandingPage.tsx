import { Link } from "react-router";
import fondo from "../../shared/assets/fondo-tsunami-full.jpg";
import fondo_text from "../../shared/assets/fondo-tsunami.jpg";
import { TELEFONO_ALBERTO } from "../../shared/db/telefono";
import { ButtonWhatsapp } from "./ButtonWhatsapp";

export const LandingPage = () => {
  // force push dev 2
  return (
    <div>
      <main className="z-0 p-4 h-[calc(100dvh-4rem)] w-full relative bg-black flex flex-col items-center justify-start">
        <img
          src={fondo}
          alt="fondo"
          className="h-[80dvh] w-full bottom-0 object-cover absolute pointer-events-none -z-1"
        />

        <h1
          className="
          mt-20
          text-white/20
          text-center text-5xl font-black
          bg-center bg-cover bg-no-repeat
          bg-clip-text
          leading-none
          md:text-6xl
          xl:text-9xl
          2xl:text-8xl
          animate-fade-in-top
        "
          style={{ backgroundImage: `url(${fondo_text})` }}
        >
          Recreativos{" "}
          <span className="text-[40vw] md:text-[20vw] lg:text-[15vw] tracking-widest block text-white/20">
            AIR
          </span>
        </h1>
        <p className="italic text-neutral-300 text-balance text-center animate-fade-in-top">
          Empresa especializada en futbolines Tsunami en la provincia de
          Salamanca.
        </p>

        <Link
          to="/competiciones"
          style={{ boxShadow: "-1px 1px 15px -5px rgba(255,255,255,1)" }}
          className="text-primary animate-fade-in-top flex items-center gap-2 bg-neutral-950/80 text-xl mt-10 p-2 px-4 rounded-lg border border-primary"
        >
          <svg
            version="1.0"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            enableBackground="new 0 0 64 64"
            fill="#000000"
            className="size-6"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                fill="var(--color-primary)"
                d="M60,4H48c0-2.215-1.789-4-4-4H20c-2.211,0-4,1.785-4,4H4C1.789,4,0,5.785,0,8v8c0,8.836,7.164,16,16,16 c0.188,0,0.363-0.051,0.547-0.059C17.984,37.57,22.379,41.973,28,43.43V56h-8c-2.211,0-4,1.785-4,4v4h32v-4c0-2.215-1.789-4-4-4h-8 V43.43c5.621-1.457,10.016-5.859,11.453-11.488C47.637,31.949,47.812,32,48,32c8.836,0,16-7.164,16-16V8C64,5.785,62.211,4,60,4z M8,16v-4h8v12C11.582,24,8,20.414,8,16z M56,16c0,4.414-3.582,8-8,8V12h8V16z"
              ></path>{" "}
            </g>
          </svg>
          Competiciones
        </Link>

        <ButtonWhatsapp numero={TELEFONO_ALBERTO} />
      </main>
      <section
        id="seccion1"
        className="flex items-center justify-center flex-col h-screen w-full text-2xl font-bold bg-neutral-900"
      >
        Seccion 1
      </section>
      <section
        id="seccion2"
        className="flex items-center justify-center flex-col h-screen w-full text-2xl font-bold bg-neutral-950"
      >
        Seccion 2
      </section>
      <section
        id="seccion3"
        className="flex items-center justify-center flex-col h-screen w-full text-2xl font-bold bg-neutral-900"
      >
        Seccion 3
      </section>
      <section
        id="seccion4"
        className="flex items-center justify-center flex-col h-screen w-full text-2xl font-bold bg-neutral-950"
      >
        Seccion 4
      </section>

      <footer className="bg-neutral-950 shadow-sm">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <a
              href="https://recreativosair.com/"
              className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
            >
              <img src="logo.png" className="h-8" alt="Recreativos AIR Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Recreativos AIR
              </span>
            </a>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  Política de privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2025{" "}
            <a href="https://recreativosair.com/" className="hover:underline">
              Recreativos AIR™
            </a>
            . Todos los derechos reservados.
          </span>
        </div>
      </footer>
    </div>
  );
};
