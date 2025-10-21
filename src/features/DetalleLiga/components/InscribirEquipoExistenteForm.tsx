import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../../packages/components/Button/Button";
import { useAuth } from "../../../shared/api/auth/useAuth";
import { useGetEquiposUsuario } from "../../../shared/api/equipos/hooks/useGetEquipos";
import {
  useInscribirEquipo,
  useLigaById,
} from "../../../shared/api/ligas/useLigas";
import { SelectorEquipo } from "../../../shared/components/SelectorEquipo/SelectorEquipo";

export const InscribirEquipoExistenteForm = ({
  idLiga,
  onCloseWindow,
}: {
  idLiga: string;
  onCloseWindow: () => void;
}) => {
  const { mutate: inscribirEquipo } = useInscribirEquipo();

  const { data: liga } = useLigaById(idLiga);

  const { user } = useAuth();

  const { data: equipos } = useGetEquiposUsuario(user?.id || "");

  const [idEquipoSelected, setIdEquipoSelected] = useState<string | undefined>(
    undefined
  );

  const handleAgregarEquipo = () => {
    if (!liga) {
      toast.error("No se encontró la liga");
      return;
    }
    const equipo = equipos?.find((e) => e.id === idEquipoSelected);

    if (!equipo) {
      toast.error("No se encontró el equipo");
      return;
    }

    if (liga.equipos.find((e) => e.equipo.id === equipo.id)) {
      toast.error("El equipo ya está en la liga");
      return;
    }
    inscribirEquipo({
      equipoId: equipo.id,
      ligaId: liga.id,
    });

    onCloseWindow();
  };

  return (
    <div className="h-40 flex flex-col justify-between">
      <div>
        <SelectorEquipo
          equipos={equipos || []}
          idEquipoSelected={idEquipoSelected}
          onSelect={(id) => {
            setIdEquipoSelected(id === "-1" ? undefined : id);
          }}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={handleAgregarEquipo} disabled={!idEquipoSelected}>
          Agregar
        </Button>
        <Button variant="outline" onClick={onCloseWindow}>
          Cancelar
        </Button>
      </div>
    </div>
  );
};
