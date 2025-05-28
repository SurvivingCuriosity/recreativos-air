import fondo from "../../shared/assets/fondo-tsunami-full.jpg";
import fondo_text from "../../shared/assets/fondo-tsunami.jpg";
import { TELEFONO_ALBERTO } from "../../shared/db/telefono";
import { ButtonWhatsapp } from "./ButtonWhatsapp";

export const FakeLandingPage = () => {
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
