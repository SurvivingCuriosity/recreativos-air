import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Button } from "../../../../packages/components/Button/Button";
import {
  useConfirmarResultadoAdmin,
  useEnfrentamientosPendientesAdmin,
  useRechazarResultadoAdmin,
} from "../../../../shared/api/enfrentamientos/hooks";
import { TarjetaEnfrentamiento } from "../../../../shared/components/TarjetaEnfrentamiento/TarjetaEnfrentamiento";
import type { EnfrentamientoDTO } from "recreativos-air-core/enfrentamiento";

const FilaEnfrentamiento = ({
  enfrentamiento,
}: {
  enfrentamiento: EnfrentamientoDTO;
}) => {
  const qc = useQueryClient();

  const { mutate: confirmarAdmin, isPending: confirmando } =
    useConfirmarResultadoAdmin();

  const { mutate: rechazarAdmin, isPending: rechazando } =
    useRechazarResultadoAdmin();

  const handleConfirmar = () => {
    confirmarAdmin(
      { enfrentamientoId: enfrentamiento.id },
      {
        onSuccess: () => {
          toast.success("Resultado confirmado");
          qc.invalidateQueries({
            queryKey: ["enfrentamientos", enfrentamiento.id],
          });
        },
        onError: () => {
          toast.error("Error al confirmar el resultado");
        },
      }
    );
  };

  const handleRechazar = () => {
    rechazarAdmin(
      { enfrentamientoId: enfrentamiento.id },
      {
        onSuccess: () => {
          toast.success("Resultado rechazado y reiniciado");
          qc.invalidateQueries({
            queryKey: ["enfrentamientos", enfrentamiento.id],
          });
        },
        onError: () => {
          toast.error("Error al rechazar el resultado");
        },
      }
    );
  };

  return (
    <li className="flex flex-col gap-2">
      <TarjetaEnfrentamiento enfrentamiento={enfrentamiento} />
      <div className="flex gap-2">
        <Button
          onClick={handleRechazar}
          disabled={rechazando || confirmando}
          variant="outline"
          icon={faXmark}
        >
          Rechazar
        </Button>
        <Button
          onClick={handleConfirmar}
          disabled={confirmando || rechazando}
          icon={faCheck}
        >
          Confirmar
        </Button>
      </div>
    </li>
  );
};

export const EnfrentamientosPendientes = () => {
  const { data: enfrentamientos } = useEnfrentamientosPendientesAdmin();

  if (!enfrentamientos || enfrentamientos.length === 0) return null;

  return (
    <li className="text-base">
      <p className="text-sm text-neutral-400 mb-2 font-semibold uppercase tracking-wide">
        Pendientes de confirmar
      </p>
      <ul className="flex flex-col gap-4">
        {enfrentamientos.map((enf) => (
          <FilaEnfrentamiento key={enf.id} enfrentamiento={enf} />
        ))}
      </ul>
    </li>
  );
};

