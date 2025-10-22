import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  EstadoEnfrentamiento,
  type EnfrentamientoDTO,
} from "recreativos-air-core/enfrentamiento";
import { Button } from "../../../../packages/components/Button/Button";
import { useAuth } from "../../../../shared/api/auth/useAuth";
import {
  useConfirmarResultadoAdmin,
  useRechazarResultadoAdmin,
} from "../../../../shared/api/enfrentamientos/hooks";

type Props = {
  enfrentamiento: EnfrentamientoDTO;
};
export const BotonesAdmin = ({ enfrentamiento }: Props) => {
  const qc = useQueryClient();
  const { user: loggedInUser } = useAuth();
  
  const { mutate: confirmarAdmin, isPending: confirmandoAdmin } =
    useConfirmarResultadoAdmin();

  const { mutate: rechazarAdmin, isPending: rechazandoAdmin } =
    useRechazarResultadoAdmin();

  const mostrarBotonAdmin =
    loggedInUser?.admin &&
    enfrentamiento.estado === EstadoEnfrentamiento.ConfirmarResultado;

  const handleConfirmarAdmin = () => {
    confirmarAdmin(
      { enfrentamientoId: enfrentamiento.id },
      {
        onSuccess: () => {
          toast.success("Resultado confirmado");
          qc.invalidateQueries({
            queryKey: ["enfrentamientos", enfrentamiento.id],
          });
        },
      }
    );
  };

  const handleRechazarAdmin = () => {
    rechazarAdmin(
      { enfrentamientoId: enfrentamiento.id },
      {
        onSuccess: () => {
          toast.success("Resultado confirmado");
          qc.invalidateQueries({
            queryKey: ["enfrentamientos", enfrentamiento.id],
          });
        },
      }
    );
  };

  return (
    mostrarBotonAdmin && (
      <div className="flex flex-col gap-2 mt-3">
        <Button
          onClick={handleRechazarAdmin}
          disabled={rechazandoAdmin}
          variant="outline"
          icon={faXmark}
        >
          Rechazar y reiniciar
        </Button>
        <Button
          onClick={handleConfirmarAdmin}
          disabled={confirmandoAdmin}
          icon={faCheck}
        >
          Confirmar resultado
        </Button>
      </div>
    )
  );
};
