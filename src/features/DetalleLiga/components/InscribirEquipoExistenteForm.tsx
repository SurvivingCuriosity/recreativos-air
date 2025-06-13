import { use, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../../packages/components/Button/Button";
import { SelectorEquipo } from "../../../shared/components/SelectorEquipo/SelectorEquipo";
import { useAppDispatch } from "../../../shared/store/hooks";
import { agregarEquipoALiga } from "../../../shared/store/slices/ligasSlice";
import { Equipos } from "../../../shared/store/tmp/Equipos";
import { DetalleLigaContext } from "../context/DetalleLigaContext";

export const InscribirEquipoExistenteForm = ({onCloseWindow}: {onCloseWindow: () => void}) => {
  const dispatch = useAppDispatch();

  const { liga } = use(DetalleLigaContext);

  const [idEquipoSelected, setIdEquipoSelected] = useState<string | undefined>(
    undefined
  );

  const handleAgregarEquipo = () => {
    if (!liga) {
      toast.error("No se encontró la liga");
      return;
    }
    const equipo = Equipos.find((e) => e.id === idEquipoSelected);

    if (!equipo) {
      toast.error("No se encontró el equipo");
      return;
    }

    if(liga.equipos.find((e) => e.id === equipo.id)) {
      toast.error("El equipo ya está en la liga");
      return;
    }

    dispatch(
      agregarEquipoALiga({
        idLiga: liga.id,
        equipo,
      })
    );
    onCloseWindow()
  };

  return (
    <div className="h-40 flex flex-col justify-between">
      <div>
        <SelectorEquipo
          equipos={Equipos}
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
