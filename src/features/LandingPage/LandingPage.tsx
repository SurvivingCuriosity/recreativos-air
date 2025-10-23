import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { use } from "react";
import { Link, useNavigate } from "react-router";
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
  const { isLoggedIn } = useAuth();
  const { data: ligas } = useLigas();

  const handleNavigateLiga = (idLiga: string) => {
    navigate(`/competiciones/${idLiga}/clasificacion`);
  };

  return (
    <>
      <meta property="og:title" content="Recreativos AIR" />
      <meta
        property="og:description"
        content="Ligas de futbolin Tsunami e Infinity en Salamanca, ¡apúntate!"
      />
      <meta property="og:url" content="https://recreativosair.com/" />

      <meta property="twitter:title" content="Recreativos AIR" />
      <meta
        property="twitter:description"
        content="Ligas de futbolin Tsunami e Infinity en Salamanca, ¡apúntate!"
      />
      <div>
        <main className="z-0 p-4 h-[calc(100svh-4rem)] w-full relative bg-neutral-950 flex flex-col items-center justify-start">
          <img
            src={darkMode ? fondo : fondoLight}
            alt="fondo"
            className="h-svh w-full bottom-0 object-cover absolute pointer-events-none -z-1"
          />

          <h1
            className="
          sm:mt-20
          font-black
          text-neutral-50/60
          text-center text-5xl font-neutral-950
          bg-center bg-cover bg-no-repeat
          bg-clip-text
          leading-none
          md:text-6xl
          xl:text-7xl
          2xl:text-8xl
          animate-fade-in-top
        "
            style={{ backgroundImage: `url(${fondo_text})` }}
          >
            Recreativos{" "}
            <span className="text-9xl md:text-[20vw] lg:text-[15vw] tracking-widest block text-neutral-50/60">
              AIR
            </span>
          </h1>
          <p className="italic text-neutral-200 text-balance text-center animate-fade-in-top">
            Empresa especializada en futbolines Tsunami e Infinity en la
            provincia de Salamanca.
          </p>
          {isLoggedIn ? (
            <div className="max-xl mx-auto">
              <ul className="pb-3 flex overflow-x-auto gap-4 mt-8 snap-x rounded-lg">
                {ligas?.map((l) => (
                  <div
                    key={l.id}
                    className="w-full max-w-96 shrink-0 snap-center rounded-xl"
                  >
                    <TarjetaLiga
                      key={l.id}
                      liga={l}
                      onClick={() => handleNavigateLiga(l.id)}
                    />
                  </div>
                ))}
              </ul>
              <Link
                to="/competiciones"
                className="text-sm underline text-primary ml-auto mt-2 w-fit block"
              >
                Todas las ligas
              </Link>
            </div>
          ) : (
            <Link
              to="/competiciones"
              style={{ boxShadow: "-1px 1px 15px -5px rgba(255,255,255,1)" }}
              className="text-primary animate-fade-in-top flex items-center gap-2 bg-neutral-950/80 text-xl mt-10 p-2 px-4 rounded-lg border border-primary"
            >
              <FontAwesomeIcon icon={faTrophy} />
              Competiciones
            </Link>
          )}

          <ButtonWhatsapp numero={TELEFONO_ALBERTO} />
        </main>
      </div>
    </>
  );
};
