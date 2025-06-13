import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { use } from "react";
import { Link, useNavigate } from "react-router";
import fondoLight from "../../shared/assets/fondo-tsunami-full-light.jpg";
import fondo from "../../shared/assets/fondo-tsunami-full.jpg";
import fondo_text from "../../shared/assets/fondo-tsunami.jpg";
import { TarjetaLiga } from "../../shared/components/TarjetaLiga/TarjetaLiga";
import { ThemeContext } from "../../shared/context/ThemeContext";
import { TELEFONO_ALBERTO } from "../../shared/db/telefono";
import { useAppSelector } from "../../shared/store/hooks";
import { selectIsAuthenticated } from "../../shared/store/slices/authSlice";
import { ButtonWhatsapp } from "./ButtonWhatsapp";

export const LandingPage = () => {
  // force push dev 2
  const navigate = useNavigate()
  const { darkMode } = use(ThemeContext);
  const isLoggedIn = useAppSelector(selectIsAuthenticated);
  const { ligas } = useAppSelector((state) => state.ligas);

  const handleNavigateLiga = (idLiga: string) => {
    navigate(`/competiciones/${idLiga}/clasificacion`);
  };

  return (
    <div>
      <main className="z-0 p-4 h-[calc(100svh-4rem)] w-full relative bg-neutral-950 flex flex-col items-center justify-start">
        <img
          src={darkMode ? fondo : fondoLight}
          alt="fondo"
          className="h-[80svh] w-full bottom-0 object-cover absolute pointer-events-none -z-1"
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
          xl:text-9xl
          2xl:text-8xl
          animate-fade-in-top
        "
          style={{ backgroundImage: `url(${fondo_text})` }}
        >
          Recreativos{" "}
          <span className="text-[40vw] md:text-[20vw] lg:text-[15vw] tracking-widest block text-neutral-50/60">
            AIR
          </span>
        </h1>
        <p className="italic text-neutral-200 text-balance text-center animate-fade-in-top">
          Empresa especializada en futbolines Tsunami en la provincia de
          Salamanca.
        </p>
        {isLoggedIn ? (
          <div className="max-xl mx-auto">
            <ul className="pb-3 flex overflow-x-auto gap-4 mt-8 snap-x rounded-lg">
              {ligas.map((l) => (
                <div key={l.id} className="w-[87%] max-w-96 shrink-0 snap-center rounded-xl">
                  <TarjetaLiga key={l.id} liga={l} onClick={()=>handleNavigateLiga(l.id)}/>
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
              <span className="self-center text-2xl font-semibold whitespace-nowrap text-neutral-50">
                Recreativos AIR
              </span>
            </a>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-neutral-500 sm:mb-0 dark:text-neutral-400">
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
          <hr className="my-6 border-neutral-200 sm:mx-auto dark:border-neutral-700 lg:my-8" />
          <span className="block text-sm text-neutral-500 sm:text-center dark:text-neutral-400">
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
