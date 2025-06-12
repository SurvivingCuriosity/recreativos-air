import { useEffect, useState } from "react";
import { SelectorEquipo } from "../../../shared/components/SelectorEquipo/SelectorEquipo";
import { SelectorEstadoEnfrentamiento } from "../../../shared/components/SelectorEstadoEnfrentamiento/SelectorEstadoEnfrentamiento";
import { EstadoEnfrentamientoOpcionCualquiera } from "../../../shared/enum/EstadoEnfrentamiento";
import { Equipos } from "../../../shared/store/tmp/Equipos";

export const FiltrosJornadas = ({
  onChangeEquipos,
  onChangeEstado,
}: {
  onChangeEquipos: (idEquipo: string) => void;
  onChangeEstado: (
    estadoEnfrentamiento: EstadoEnfrentamientoOpcionCualquiera
  ) => void;
}) => {
  const [estadoEnfrentamiento, setEstadoEnfrentamiento] =
    useState<EstadoEnfrentamientoOpcionCualquiera>(
      EstadoEnfrentamientoOpcionCualquiera.Cualquiera
    );
  const [idEquipo, setIdEquipo] = useState<string>('-1');

  useEffect(() => {
    onChangeEquipos(idEquipo || '-1');
  }, [idEquipo]);

    useEffect(() => {
    onChangeEstado(estadoEnfrentamiento);
  }, [estadoEnfrentamiento]);

  return (
    <div className="flex gap-2 items-center justify-between border-b pb-2">
      <div className="w-full flex flex-col gap-0.5">
        <p className="text-xs">Equipo</p>
        <SelectorEquipo
          equipos={Equipos}
          idEquipoSelected={idEquipo || "-1"}
          onSelect={setIdEquipo}
        />
      </div>
      <div className="w-full flex flex-col gap-0.5">
        <p className="text-xs">Estado</p>
        <SelectorEstadoEnfrentamiento
          value={estadoEnfrentamiento}
          onSelect={setEstadoEnfrentamiento}
        />
      </div>
    </div>
  );
};
