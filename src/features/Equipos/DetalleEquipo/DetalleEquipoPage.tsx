import { useNavigate, useParams } from "react-router";
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
      <div className="border-l border-neutral-700 flex flex-col items-start justify-center pl-2 py-1">
        {equipo.jugadores.map((jugador) => (
          <p key={jugador.nombre} className="text-neutral-400 text-sm py-0.5">
            {jugador.nombre}
          </p>
        ))}
      </div>
    </div>
  );
};
