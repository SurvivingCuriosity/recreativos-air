import { Link } from "react-router";
import { Titulo } from "../../packages/components/Titulo/Titulo";
import { TarjetaEquipo } from "../../shared/components/TarjetaEquipo/TarjetaEquipo";
import { useAppDispatch, useAppSelector } from "../../shared/store/hooks";
import { logout } from "../../shared/store/slices/authSlice";
import { use } from "react";
import { ThemeContext } from "../../shared/context/ThemeContext";

export const MiPerfilPage = () => {
  const dispatch = useAppDispatch();

  const { equiposUsuario } = useAppSelector((state) => state.user);
  const { user } = useAppSelector((state) => state.auth);
  const { ligas } = useAppSelector((state) => state.ligas);
  const {darkMode, setDarkMode} = use(ThemeContext);
  const ligasEnLasQueEstaInscrito = ligas.filter((liga) =>
    equiposUsuario.find((equipo) => equipo.id === liga.id)
  );

  return (
    <div className="p-4 flex flex-col gap-4 justify-between h-full">
      <div className="bg-neutral-800 p-3 py-2 rounded-lg border border-neutral-700">
        <Titulo variant="h4" className="font-cool">
          Mi perfil
        </Titulo>
        <p>{user?.nombre}</p>
        <p>{user?.username}</p>
        {user?.admin ? <p className="text-green-300">admin</p> : <p className="text-red-300">no admin</p>}
      </div>
      <div className="bg-neutral-800 p-3 py-2 rounded-lg border border-neutral-700">
        <Titulo variant="h4" className="font-cool">
          Mis equipos
        </Titulo>
        {equiposUsuario.length > 0 ? (
          equiposUsuario.map((equipo, index) => (
            <TarjetaEquipo key={index} equipo={equipo} onClick={() => {}} />
          ))
        ) : (
          <div className="text-neutral-500 p-4 text-center">
            <p>No tienes equipos</p>
            <Link to="/crear-equipo" className="text-primary underline">
              Crear equipo
            </Link>
          </div>
        )}
      </div>

      <div className="bg-neutral-800 p-3 py-2 rounded-lg border border-neutral-700">
        <Titulo variant="h4" className="font-cool">
          Mis competiciones
        </Titulo>
        {ligasEnLasQueEstaInscrito.length > 0 ? (
          ligasEnLasQueEstaInscrito.map((liga, index) => (
            <p key={index}>{liga.nombre}</p>
          ))
        ) : (
          <div className="text-neutral-500 p-4 text-center">
            <p>No estas inscrito a ninguna competición</p>
            <Link to="/competiciones" className="text-primary underline">
              Ver competiciones
            </Link>
          </div>
        )}
      </div>

      <div className="bg-neutral-800 p-3 py-2 rounded-lg border border-neutral-700">
        <Titulo variant="h4" className="font-cool">
          Tema
        </Titulo>
        <input type="checkbox" className="mr-2" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        <p className="text-neutral-400">Oscuro</p>
      </div>

      <button
        onClick={() => dispatch(logout())}
        className="rounded text-red-600 bg-neutral-950 border border-red-600  px-3 py-1 mt-auto z-1"
      >
        Cerrar sesión
      </button>
    </div>
  );
};
