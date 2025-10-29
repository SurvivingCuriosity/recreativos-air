import { EstadoLiga, type LigaDTO } from "recreativos-air-core/liga";
import { Button } from "../../../packages/components/Button/Button";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { useConfirmDialog } from "../../../shared/context/UIProvider/hooks/useUI";
import { useCambiarEstadoLiga } from "../../../shared/api/ligas/useLigas";

export const BotonArrancarLiga = ({ liga }: { liga: LigaDTO }) => {
  const {confirm} = useConfirmDialog()
  
  const {mutate:cambiarEstadoLiga, isPending} = useCambiarEstadoLiga()

  const handleComenzarLiga = async () => {
    const arrancar = await confirm({
      title: "¿Estás seguro?",
      description: "Se generarán los enfrentamientos y los usuarios podrán comenzar a introducir resultados",
      confirmText: "Arrancar liga",
    });
    if(arrancar){
      cambiarEstadoLiga({
        ligaId: liga.id,
        nuevoEstado: EstadoLiga.EnCurso
      })
    }
  };


  if (liga.estadoLiga !== EstadoLiga.SinEmpezar) {
    return null;
  }

  return (
    <Button onClick={handleComenzarLiga} icon={faPlay}>
      {isPending ? "Arrancando liga..." : "Arrancar liga"}
    </Button>
  );
};
