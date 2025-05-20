import fondo_text from "../../assets/fondo-tsunami.jpg";
import fondo from "../../assets/fondo-tsunami-full.jpg";
import { ButtonWhatsapp } from "./ButtonWhatsapp";
import { TELEFONO_ALBERTO } from "../../shared/db/telefono";
import { Link } from "react-router";

export const LandingPage = () => {
  return (
    <main className="z-0 p-4 h-[calc(100dvh-4rem)] w-full relative bg-black flex flex-col items-center justify-start">
      <img
        src={fondo}
        alt="fondo"
        className="h-[80dvh] w-full bottom-0 object-cover absolute pointer-events-none -z-1"
      />

      <h1
        className="
          mt-20
          text-center text-5xl font-black
          bg-center bg-cover bg-no-repeat
          bg-clip-text text-transparent
          leading-none
          md:text-6xl
          xl:text-9xl
          2xl:text-8xl
        "
        style={{ backgroundImage: `url(${fondo_text})` }}
      >
        Recreativos{" "}
        <span className="text-[40vw] md:text-[20vw] lg:text-[15vw] tracking-widest block">
          AIR
        </span>
      </h1>
      <p className="italic text-neutral-300 text-balance text-center">
        Empresa especializada en futbolines Tsunami en la provincia de
        Salamanca.
      </p>

      <Link
        to="/competiciones"
        style={{ boxShadow: "-1px 1px 15px -5px rgba(255,255,255,1)" }}
        className="flex items-center gap-2 bg-neutral-950/60 text-white text-xl mt-10 p-2 px-4 rounded-lg border border-white"
      >
        <svg
          version="1.0"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          enable-background="new 0 0 64 64"
          fill="#000000"
          className="size-6"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <path
              fill="var(--color-neutral-200)"
              d="M60,4H48c0-2.215-1.789-4-4-4H20c-2.211,0-4,1.785-4,4H4C1.789,4,0,5.785,0,8v8c0,8.836,7.164,16,16,16 c0.188,0,0.363-0.051,0.547-0.059C17.984,37.57,22.379,41.973,28,43.43V56h-8c-2.211,0-4,1.785-4,4v4h32v-4c0-2.215-1.789-4-4-4h-8 V43.43c5.621-1.457,10.016-5.859,11.453-11.488C47.637,31.949,47.812,32,48,32c8.836,0,16-7.164,16-16V8C64,5.785,62.211,4,60,4z M8,16v-4h8v12C11.582,24,8,20.414,8,16z M56,16c0,4.414-3.582,8-8,8V12h8V16z"
            ></path>{" "}
          </g>
        </svg>
        Competiciones
      </Link>

      <ButtonWhatsapp numero={TELEFONO_ALBERTO} />
    </main>
  );
};
