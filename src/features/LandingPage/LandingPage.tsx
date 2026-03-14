import { Link, useNavigate } from "react-router";
import { useAuth } from "../../shared/api/auth/useAuth";
import fondo from "../../shared/assets/tsunami.jpg";
import { TarjetaLiga } from "../../shared/components/TarjetaLiga/TarjetaLiga";
import { TELEFONO_ALBERTO } from "../../shared/db/telefono";
import { useLigasDeUsuario } from "../../shared/hooks/useLigasDeUsuario";
import { ButtonWhatsapp } from "./ButtonWhatsapp";
import { Button } from "../../packages/components/Button/Button";

export const LandingPage = () => {
  const navigate = useNavigate();

  const { ligas, loadingLigas, errorLigas } = useLigasDeUsuario();
  const { isLoggedIn } = useAuth();

  const handleNavigateLiga = (idLiga: string) => {
    navigate(`/competiciones/${idLiga}/clasificacion`);
  };

  return (
    <main className="p-4 h-full w-full relative flex-1 flex flex-col items-center justify-between pb-18">
      <img
        src={fondo}
        alt="fondo"
        style={{
          objectPosition: "bottom 0px right -520px",
        }}
        className="h-svh w-full bottom-0 object-cover fixed pointer-events-none -z-1"
      />

      <h1
        className="
          font-black
          text-neutral-50/60
          text-center font-neutral-950
          bg-center bg-cover bg-no-repeat
          bg-clip-text
          leading-none
          text-4xl
          md:text-4xl
          xl:text-5xl
          2xl:text-6xl
          animate-fade-in-top
        "
      >
        Recreativos AIR
      </h1>
      <p className="text-neutral-200 text-balance text-center animate-fade-in-top text-sm mt-4">
        Empresa especializada en futbolines Tsunami e Infinity en la provincia
        de Salamanca.
      </p>

      {isLoggedIn ? (
        <div className="max-w-11/12 md:min-w-md md:max-w-3xl">
          <p className="font-cool text-primary text-2xl font-black my-3">
            Mis ligas
          </p>
          {loadingLigas ? (
            <ul className="pb-3 flex overflow-x-auto gap-2 snap-x rounded-lg">
              {["qwe", "qweo", "qweu"]?.map((l) => (
                <div
                  key={l}
                  className="w-11/12 md:w-full shrink-0 snap-center rounded-xl"
                >
                  <div className="animate-pulse max-w-80 h-30 shrink-0 justify-between border overflow-hidden md:p-4 p-1.5 relative bg-neutral-900 rounded-lg border-neutral-800 z-0">
                    Cargando...
                  </div>
                </div>
              ))}
            </ul>
          ) : errorLigas ? (
            <p className="text-red-500 text-center">
              Error al cargar las ligas: {errorLigas.message}
            </p>
          ) : (
            <ul className="pb-3 flex overflow-x-auto gap-2 snap-x rounded-lg">
              {ligas?.map((l) => (
                <div
                  key={l.id}
                  className={`${ligas.length > 1 ? "w-11/12" : "w-full"} md:w-full shrink-0 snap-center rounded-xl`}
                >
                  <TarjetaLiga
                    key={l.id}
                    liga={l}
                    onClick={() => handleNavigateLiga(l.id)}
                  />
                </div>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="mt-20 w-full max-w-60 flex flex-col gap-2">
          <Button>
            <Link to="/login">Iniciar sesión</Link>
          </Button>
          <Button variant="outline">
            <Link to="/register">No tengo una cuenta</Link>
          </Button>
        </div>
      )}

      <a
        href="https://www.futbolin.app"
        target="_blank"
        className="bg-neutral-900 block rounded-xl font-cool p-3 text-center text-sm mt-auto"
      >
        ¡ Encuentra futbolines cerca !
        <img
          src="/logo-futbol-in.png"
          alt="logo"
          className="w-fit max-w-42 mx-auto"
        />
      </a>

      {!isLoggedIn && <ButtonWhatsapp numero={TELEFONO_ALBERTO} />}
    </main>
  );
};
