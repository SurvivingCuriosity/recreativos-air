import { useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import {
  EstadoEnfrentamiento,
  type EnfrentamientoDTO,
} from "recreativos-air-core/enfrentamiento";
import { toast } from "@/shared/lib/toast";
import { Button } from "../../../../packages/components/Button/Button";
import { useAuth } from "../../../../shared/api/auth/useAuth";
import {
  useConfirmarResultadoAdmin,
  useRechazarResultadoAdmin,
} from "../../../../shared/api/enfrentamientos/hooks";
import { useConfirmDialog } from "../../../../shared/context/UIProvider/hooks/useUI";

type Props = {
  enfrentamiento: EnfrentamientoDTO;
};

export const BotonesAdmin = ({ enfrentamiento }: Props) => {
  const qc = useQueryClient();
  const { user: loggedInUser } = useAuth();
  const { confirm } = useConfirmDialog();

  const { mutate: confirmarAdmin, isPending: confirmandoAdmin } = useConfirmarResultadoAdmin();
  const { mutate: rechazarAdmin, isPending: rechazandoAdmin } = useRechazarResultadoAdmin();

  const mostrarBotonAdmin =
    loggedInUser?.admin && enfrentamiento.estado === EstadoEnfrentamiento.ConfirmarResultado;

  const handleConfirmarAdmin = () => {
    confirmarAdmin(
      { enfrentamientoId: enfrentamiento.id },
      {
        onSuccess: () => {
          toast.success("Resultado confirmado");
          qc.invalidateQueries({ queryKey: ["enfrentamientos", enfrentamiento.id] });
        },
      }
    );
  };

  // DESIGN.md §6.7: confirmación y toast corregido
  const handleRechazarAdmin = async () => {
    const ok = await confirm({
      title: "¿Rechazar y reiniciar?",
      description: "El resultado se descartará y el partido volverá a estar sin jugar.",
      confirmText: "Rechazar y reiniciar",
    });
    if (!ok) return;
    rechazarAdmin(
      { enfrentamientoId: enfrentamiento.id },
      {
        onSuccess: () => {
          toast.success("Resultado rechazado y reiniciado");
          qc.invalidateQueries({ queryKey: ["enfrentamientos", enfrentamiento.id] });
        },
      }
    );
  };

  return (
    mostrarBotonAdmin && (
      <div className="flex flex-col gap-2">
        <Button onClick={handleConfirmarAdmin} disabled={confirmandoAdmin} icon={Check}>
          Confirmar resultado
        </Button>
        <Button
          onClick={handleRechazarAdmin}
          disabled={rechazandoAdmin}
          variant="outline"
          icon={X}
        >
          Rechazar y reiniciar
        </Button>
      </div>
    )
  );
};
