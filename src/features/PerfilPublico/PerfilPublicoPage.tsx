import { Link, useNavigate, useParams } from "react-router";
import { Titulo } from "../../packages/components/Titulo/Titulo";
import { TarjetaEquipo } from "../../shared/components/TarjetaEquipo/TarjetaEquipo";
import { TarjetaLiga } from "../../shared/components/TarjetaLiga/TarjetaLiga";
import { Equipos } from "../../shared/store/tmp/Equipos";
import { ligas } from "../../shared/store/tmp/Ligas";
import { Users } from "../../shared/store/tmp/Users";

export const PerfilPublicoPage = () => {
  const { id } = useParams();
  const user = Users.find((u) => u.id === id);

  const equiposUsuario = Equipos.filter(e => e.jugadores.some(j => j.idUsuario === user?.id));

  const ligasEnLasQueEstaInscrito = ligas.filter((liga) =>
    equiposUsuario?.find((equipo) => equipo.id === liga.id)
  );

  const navigate = useNavigate();

  const handleNavigateLiga = (idLiga: string) => {
    navigate(`/competiciones/${idLiga}/clasificacion`);
  };

  return (
    <div className="p-4 flex flex-col gap-4 justify-start h-full">
      <div className="flex justify-between border-neutral-700 relative border p-3">
        <span>
          <Titulo variant="h2" className="font-cool">
            {user?.username}
          </Titulo>
          <p>{user?.nombre}</p>
        </span>
        <span className="text-sm text-neutral-600 my-auto text-right">
          <p>27 goles a favor</p>
          <p>#1 en la liga</p>
        </span>
        {user?.admin && (
          <p className="text-primary text-xs absolute top-2 right-2">ADMIN</p>
        )}
      </div>

      <div className="my-2">
        <Titulo
          variant="h4"
          className="font-cool text-neutral-600! tracking-widest underline underline-offset-2 mb-2"
        >
          Premios
        </Titulo>
        <ul className="flex gap-2 items-center flex-wrap">
          <li className="p-1 px-3 text-sm rounded-xl bg-primary/10 text-primary">
            Puto amo
          </li>
          <li className="p-1 px-3 text-sm rounded-xl bg-blue-400/10 text-blue-400">
            Mejor 'L'
          </li>
          <li className="p-1 px-3 text-sm rounded-xl bg-green-500/10 text-green-500">
            Ganador
          </li>
          <li className="p-1 px-3 text-sm rounded-xl bg-amber-500/10 text-amber-500">
            Mejor delantero 2025
          </li>
          <li className="p-1 px-3 text-sm rounded-xl bg-red-500/10 text-red-500">
            Mejor portero 2025
          </li>
          <li className="p-1 px-3 text-sm rounded-xl bg-neutral-400/10 text-neutral-400">
            Ganador Infinity Parado 2023
          </li>
        </ul>
      </div>

      <div className="my-2">
        <Titulo
          variant="h4"
          className="font-cool text-neutral-600! tracking-widest underline underline-offset-2 mb-2"
        >
          Equipos
        </Titulo>
        {equiposUsuario.length > 0 ? (
          equiposUsuario.map((equipo, index) => (
            <TarjetaEquipo key={index} equipo={equipo} onClick={() => {}} />
          ))
        ) : (
          <div className="text-neutral-500 p-4 text-center">
            <p>No tiene equipos</p>
          </div>
        )}
      </div>

      <div className="my-2">
        <Titulo
          variant="h4"
          className="font-cool text-neutral-600! tracking-widest underline underline-2xl!"
        >
          Competiciones
        </Titulo>
        {ligasEnLasQueEstaInscrito.length > 0 ? (
          <ul className="pb-3 flex overflow-x-auto gap-4 mt-2 snap-x rounded-lg ">
            {ligasEnLasQueEstaInscrito.map((l) => (
              <div
                key={l.id}
                className="w-[87%] max-w-96 shrink-0 snap-center rounded-xl shadow-xl shadow-neutral-800"
              >
                <TarjetaLiga
                  key={l.id}
                  liga={l}
                  onClick={() => handleNavigateLiga(l.id)}
                />
              </div>
            ))}
          </ul>
        ) : (
          <div className="text-neutral-500 p-4 text-center">
            <p>No estas inscrito a ninguna competición</p>
            <Link to="/competiciones" className="text-primary underline">
              Ver competiciones
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
