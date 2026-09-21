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
  useAceptarResultado,
  useRechazarResultado,
} from "../../../../shared/api/enfrentamientos/hooks";
import { useConfirmDialog } from "../../../../shared/context/UIProvider/hooks/useUI";
import { BotonIntroducirResultado } from "./BotonIntroducirResultado";

type Props = {
  enfrentamiento: EnfrentamientoDTO;
};

export const BotonesUser = ({ enfrentamiento }: Props) => {
  const { user: loggedInUser } = useAuth();
  const qc = useQueryClient();
  const { confirm } = useConfirmDialog();

  const { mutate: aceptarResultado, isPending: aceptando } = useAceptarResultado();
  const { mutate: rechazarResultado, isPending: rechazando } = useRechazarResultado();

  const equipoDelUsuario = enfrentamiento.equipoA.jugadores.some(
    (j) => j.idUsuario === loggedInUser?.id
  )
    ? enfrentamiento.equipoA
    : enfrentamiento.equipoB;
  const usuarioParticipa =
    enfrentamiento.equipoA.jugadores.some((j) => j.idUsuario === loggedInUser?.id) ||
    enfrentamiento.equipoB.jugadores.some((j) => j.idUsuario === loggedInUser?.id);

  const handleAceptar = () => {
    aceptarResultado(
      { enfrentamientoId: enfrentamiento.id, equipoId: equipoDelUsuario.id },
      {
        onSuccess: () => {
          toast.success("Resultado aceptado");
          qc.invalidateQueries({ queryKey: ["enfrentamientos", enfrentamiento.id] });
        },
      }
    );
  };

  // DESIGN.md §6.7: confirmación en Rechazar
  const handleRechazar = async () => {
    const ok = await confirm({
      title: "¿Rechazar el resultado?",
      description: "El resultado propuesto se descartará y el partido volverá a estar sin jugar.",
      confirmText: "Rechazar",
    });
    if (!ok) return;
    rechazarResultado(
      { enfrentamientoId: enfrentamiento.id, equipoId: equipoDelUsuario.id },
      {
        onSuccess: () => {
          toast.success("Resultado rechazado");
          qc.invalidateQueries({ queryKey: ["enfrentamientos", enfrentamiento.id] });
        },
      }
    );
  };

  const mostrarAceptarRechazar =
    enfrentamiento.estado === EstadoEnfrentamiento.CorroborarResultado &&
    usuarioParticipa &&
    (enfrentamiento.resultadoPropuestoPor !== equipoDelUsuario.id || loggedInUser?.admin);

  return (
    usuarioParticipa && (
      <>
        {mostrarAceptarRechazar && (
          <div className="flex flex-col gap-2">
            <Button onClick={handleAceptar} disabled={aceptando} icon={Check}>
              Aceptar resultado
            </Button>
            <Button onClick={handleRechazar} disabled={rechazando} variant="outline" icon={X}>
              Rechazar
            </Button>
          </div>
        )}

        {enfrentamiento.estado === EstadoEnfrentamiento.SinJugar && (
          <BotonIntroducirResultado
            enfrentamiento={enfrentamiento}
            idEquipo={equipoDelUsuario.id}
          />
        )}
      </>
    )
  );
};
