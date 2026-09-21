import { Check, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/shared/lib/toast";
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
          icon={X}
        >
          Rechazar
        </Button>
        <Button
          onClick={handleConfirmar}
          disabled={confirmando || rechazando}
          icon={Check}
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
    <section className="flex w-full flex-col gap-2.5 text-base">
      <div className="flex items-center gap-2">
        <h2 className="font-display text-base font-bold tracking-[0.06em] text-foreground uppercase">
          Pendientes de confirmar
        </h2>
        <span className="ml-auto inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-destructive-solid px-1.5 text-xs font-extrabold text-white">
          {enfrentamientos.length}
        </span>
      </div>
      <ul className="flex flex-col gap-4">
        {enfrentamientos.map((enf) => (
          <FilaEnfrentamiento key={enf.id} enfrentamiento={enf} />
        ))}
      </ul>
    </section>
  );
};

