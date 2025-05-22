import type { Enfrentamiento } from "../../interfaces/Enfrentamiento";

export const TarjetaEnfrentamiento = ({
  enfrentamiento,
}: {
  enfrentamiento: Enfrentamiento;
}) => {
  return (
    <div className="flex border rounded-md bg-neutral-900 border-neutral-700">
      
      <div className="border-r border-neutral-700 flex flex-col w-32">
        <p title={enfrentamiento.equipoA} className="border-b border-neutral-700 py-2 px-2 truncate">{enfrentamiento.equipoA}</p>
        <p title={enfrentamiento.equipoB} className="py-2 px-2 truncate">{enfrentamiento.equipoB}</p>
      </div>

      <div className="flex flex-row">
        {enfrentamiento.partidos.map((p) => (
          <div className="flex flex-col border-r border-neutral-700">
            <p className="py-2 px-3 border-b border-neutral-700">{p.golesA}</p>
            <p className="py-2 px-3">{p.golesB}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
