import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../../packages/components/Button/Button";
import { FormLabel } from "../../../packages/components/Form/FormLabel";
import { useAuth } from "../../api/auth/useAuth";
import { useGetEquiposUsuario } from "../../api/equipos/hooks/useGetEquipos";
import { SelectorEquipo } from "../SelectorEquipo/SelectorEquipo";

export const SelectorEquipoUsuario = ({
  onSelect,
  onCancel,
}: {
  onSelect: (equipoId: string) => void;
  onCancel: () => void;
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    data: equiposUsuario,
    isLoading,
    error,
  } = useGetEquiposUsuario(user?.id || "");
  const [idEquipoSelected, setIdEquipoSelected] = useState<string>("");

  if (isLoading) {
    return <p className="text-muted-foreground">Cargando equipos...</p>;
  }

  if (error) {
    return <p className="text-destructive">Error al cargar equipos</p>;
  }

  if (equiposUsuario?.length === 0)
    return (
      <>
        <p className="p-2 text-foreground-soft">Ups... no tienes ningún equipo</p>
        <Button
          onClick={() => {
            navigate("/crear-equipo");
            onCancel();
          }}
        >
          Crear equipo
        </Button>
      </>
    );
  return (
    <div className="flex flex-col gap-3">
      <FormLabel>Selecciona tu equipo para inscribirte</FormLabel>
      <SelectorEquipo
        equipos={equiposUsuario || []}
        idEquipoSelected={idEquipoSelected}
        onSelect={(id) => setIdEquipoSelected(id)}
        incluirOpcionTodos={false}
      />
      <div className="flex justify-end gap-2 mt-2">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          disabled={!idEquipoSelected}
          onClick={() => onSelect(idEquipoSelected)}
        >
          Inscribirme
        </Button>
      </div>
    </div>
  );
};
