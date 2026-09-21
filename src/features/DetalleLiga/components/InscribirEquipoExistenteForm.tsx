import { useState } from "react";
import { toast } from "@/shared/lib/toast";
import { Button } from "../../../packages/components/Button/Button";
import { useAuth } from "../../../shared/api/auth/useAuth";
import { useGetAllEquipos } from "../../../shared/api/equipos/hooks/useGetEquipos";
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
  const { user } = useAuth();

  const { mutate: inscribirEquipo } = useInscribirEquipo();

  const { data: liga } = useLigaById(idLiga);

  const { data: equipos } = useGetAllEquipos();

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

  if (!user?.admin) return <p className="text-sm text-muted-foreground">No eres admin </p>;

  return (
    <div className="flex flex-col gap-4">
      <SelectorEquipo
        equipos={equipos || []}
        idEquipoSelected={idEquipoSelected}
        onSelect={(id) => {
          setIdEquipoSelected(id === "-1" ? undefined : id);
        }}
      />
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onCloseWindow} className="flex-1">
          Cancelar
        </Button>
        <Button onClick={handleAgregarEquipo} disabled={!idEquipoSelected} className="flex-1">
          Agregar
        </Button>
      </div>
    </div>
  );
};
