import { Link, useNavigate, useParams } from "react-router";
import { useAppSelector } from "../../../shared/store/hooks";

export const DetalleEquipoPage = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const equipo = useAppSelector((state) =>
    state.ligas.ligas[0].equipos.find((e) => e.id === id)
  );

  if (!equipo) return <div>Equipo no encontrado</div>;

  return (
    <div className="max-w-screen-sm mx-auto p-4 h-full z-4">
      <button onClick={() => navigate(-1)}>Volver</button>
      <h1 className="text-2xl font-bold text-primary mb-4">{equipo.nombre}</h1>
      <ul className="border-neutral-700 flex flex-col items-start justify-center gap-3">
        {equipo.jugadores.map((jugador) => (
          <Link
            to={"/user/" + jugador.idUsuario}
            key={jugador.nombre}
            className="h-auto bg-neutral-800 min-w-40 p-2 px-4 rounded-md text-neutral-400"
          >
            {jugador.nombre}
          </Link>
        ))}
      </ul>
    </div>
  );
};
