import { use } from "react";
import toast from "react-hot-toast";
import { Button } from "../../../packages/components/Button/Button";
import { useAppDispatch, useAppSelector } from "../../../shared/store/hooks";
import { agregarEquipoALiga } from "../../../shared/store/slices/ligasSlice";
import { DetalleLigaContext } from "../context/DetalleLigaContext";

export const InscribirEquipoExistenteForm = () => {
  const dispatch = useAppDispatch();

  const { liga } = use(DetalleLigaContext);

  const { equiposUsuario } = useAppSelector((state) => state.user);

  const handleAgregarEquipo = () => {
    if (!liga) {
      toast.error("No se encontró la liga");
      return;
    }
    if (!equiposUsuario[0]) {
      toast.error("El usuario no tiene equipos");
      return;
    }

    dispatch(
      agregarEquipoALiga({
        idLiga: liga.id,
        equipo: equiposUsuario[0],
      })
    );
  };

  return (
    <div className="h-40 flex flex-col justify-between">
      <div>
        <p className="text-neutral-400 text-center py-10">Not implemented</p>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={handleAgregarEquipo}>Agregar</Button>
        <Button variant="outline" onClick={handleAgregarEquipo}>
          Cancelar
        </Button>
      </div>
    </div>
  );
};
