import { useEffect, useState } from "react";
import { SelectorEstadoEnfrentamiento } from "../../../shared/components/SelectorEstadoEnfrentamiento/SelectorEstadoEnfrentamiento";
import { EstadoEnfrentamientoOpcionCualquiera } from "../../../shared/enum/EstadoEnfrentamiento";

type Props = {
  onChangeSoloEquiposUser: (mostrarTodos: boolean) => void;
  onChangeEstado: (estado: EstadoEnfrentamientoOpcionCualquiera) => void;
};

export const FiltrosJornadas = ({
  onChangeSoloEquiposUser,
  onChangeEstado,
}: Props) => {
  const [estadoEnfrentamiento, setEstadoEnfrentamiento] =
    useState<EstadoEnfrentamientoOpcionCualquiera>(
      EstadoEnfrentamientoOpcionCualquiera.Cualquiera
    );
  const [mostrarTodos, setMostrarTodos] = useState(false);

  useEffect(() => {
    onChangeEstado(estadoEnfrentamiento);
  }, [estadoEnfrentamiento]);

  useEffect(() => {
    onChangeSoloEquiposUser(mostrarTodos);
  }, [mostrarTodos]);

  return (
    <div className="flex gap-2 items-center justify-between">
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs text-neutral-500">Equipos:</p>
        <label className="flex items-center gap-2 w-full">
          <input
            type="checkbox"
            checked={mostrarTodos}
            onChange={(e) => setMostrarTodos(e.target.checked)}
            className="size-5"
          />
          Mostrar todos
        </label>
      </div>
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs text-neutral-500">Estado:</p>
        <SelectorEstadoEnfrentamiento
          value={estadoEnfrentamiento}
          onSelect={setEstadoEnfrentamiento}
        />
      </div>
    </div>
  );
};
