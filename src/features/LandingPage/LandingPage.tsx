import { use } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../shared/api/auth/useAuth";
import { useLigas } from "../../shared/api/ligas/useLigas";
import fondoLight from "../../shared/assets/fondo-tsunami-full-light.jpg";
import fondo from "../../shared/assets/fondo-tsunami-full.jpg";
import fondo_text from "../../shared/assets/fondo-tsunami.jpg";
import { TarjetaLiga } from "../../shared/components/TarjetaLiga/TarjetaLiga";
import { ThemeContext } from "../../shared/context/ThemeContext";
import { TELEFONO_ALBERTO } from "../../shared/db/telefono";
import { ButtonWhatsapp } from "./ButtonWhatsapp";

export const LandingPage = () => {
  const navigate = useNavigate();
  const { darkMode } = use(ThemeContext);
  const { data: ligas } = useLigas();
  const { isLoggedIn } = useAuth();

  const handleNavigateLiga = (idLiga: string) => {
    navigate(`/competiciones/${idLiga}/clasificacion`);
  };

  return (
    <main className="z-0 p-4 h-full w-full relative bg-neutral-950 flex flex-col items-center justify-start">
      <img
        src={darkMode ? fondo : fondoLight}
        alt="fondo"
        className="h-svh w-full bottom-0 object-cover fixed pointer-events-none -z-1"
      />

      <h1
        className="
          font-black
          text-neutral-50/60
          text-center text-5xl font-neutral-950
          bg-center bg-cover bg-no-repeat
          bg-clip-text
          leading-none
          md:text-4xl
          xl:text-5xl
          2xl:text-6xl
          animate-fade-in-top
        "
        style={{ backgroundImage: `url(${fondo_text})` }}
      >
        Recreativos{" "}
        <span className="text-9xl md:text-[18vw] lg:text-[10vw] tracking-widest block text-neutral-50/60">
          AIR
        </span>
      </h1>
      <p className="italic text-neutral-200 text-balance text-center animate-fade-in-top">
        Empresa especializada en futbolines Tsunami e Infinity en la provincia
        de Salamanca.
      </p>

      <div className="max-w-11/12 md:min-w-md md:max-w-3xl">
        <p className="font-cool text-primary text-2xl font-black my-3">
          Ligas disponibles
        </p>
        <ul className="pb-3 flex overflow-x-auto gap-2 snap-x rounded-lg">
          {ligas?.map((l) => (
            <div
              key={l.id}
              className="w-11/12 md:w-full max-w-96 shrink-0 snap-center rounded-xl"
            >
              <TarjetaLiga
                key={l.id}
                liga={l}
                onClick={() => handleNavigateLiga(l.id)}
              />
            </div>
          ))}
        </ul>
      </div>

      {!isLoggedIn && <ButtonWhatsapp numero={TELEFONO_ALBERTO} />}
    </main>
  );
};
