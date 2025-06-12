import type { Equipo } from "../../interfaces/Equipo";
import { useAppSelector } from "../../store/hooks";

export const TarjetaEquipo = ({
  equipo,
  onClick,
}: {
  equipo: Equipo;
  onClick: () => void;
}) => {
  const { equiposUsuario } = useAppSelector((state) => state.user);

  const esEquipoDelUsuario = equiposUsuario.find(
    (e) => e.id === equipo.id
  );

  return (
    <div onClick={onClick} className="flex gap-4 items-center bg-neutral-900 border border-neutral-700 rounded-lg">
      <p
        className={`font-black p-2 pr-1 w-30 truncate ${
          esEquipoDelUsuario ? "text-primary" : "text-neutral-200"
        }`}
      >
        {equipo.nombre}
      </p>
      <div
        className="border-l border-neutral-700 flex flex-col items-start justify-center pl-2 py-1"
        
      >
        {equipo.jugadores.map((jugador) => (
          <p key={jugador.nombre} className="text-neutral-400 text-sm py-0.5">
            {jugador.nombre}
          </p>
        ))}
      </div>
    </div>
  );
};
