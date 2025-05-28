import { useMemo, useState } from "react";
import { TarjetaEnfrentamiento } from "../../../shared/components/TarjetaEnfrentamiento/TarjetaEnfrentamiento";
import type { Enfrentamiento } from "../../../shared/interfaces/Enfrentamiento";
import type { Partido } from "../../../shared/interfaces/Partido";

export const JornadasLigaPage = () => {
  const [idEnfrentamientoOpen, setIdEnfrentamientoOpen] = useState<
    number | null
  >(null);

  function generarEnfrentamientos(
    cantidadEnfrentamientos: number,
    partidosPorEnfrentamiento: number
  ): Enfrentamiento[] {
    const enfrentamientos: Enfrentamiento[] = [];

    for (let i = 1; i <= cantidadEnfrentamientos; i++) {
      const equipoA = `Equipo A ${i}`;
      const equipoB = `Equipo B ${i}`;

      const partidos: Partido[] = [];
      for (let j = 1; j <= partidosPorEnfrentamiento; j++) {
        partidos.push({
          id: j,
          equipoA,
          equipoB,
          golesA: Math.floor(Math.random() * 5).toString(),
          golesB: Math.floor(Math.random() * 5).toString(),
          terminado: true,
        });
      }

      enfrentamientos.push({
        id: i,
        equipoA,
        equipoB,
        partidos,
        fecha: new Date(),
      });
    }

    return enfrentamientos;
  }

  const enfrentamientos = useMemo(() => generarEnfrentamientos(12, 4), []);

  return (
    <div className="flex flex-col gap-3 pb-20">
      {enfrentamientos.map((enfrentamiento) => (
        <TarjetaEnfrentamiento
          key={enfrentamiento.id}
          enfrentamiento={enfrentamiento}
          optionsOpen={idEnfrentamientoOpen === enfrentamiento.id}
          onOptionsClick={setIdEnfrentamientoOpen}
        />
      ))}
    </div>
  );
};
