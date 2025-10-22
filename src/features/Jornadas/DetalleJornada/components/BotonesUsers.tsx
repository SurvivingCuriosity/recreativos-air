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
  useAceptarResultado,
  useRechazarResultado,
} from "../../../../shared/api/enfrentamientos/hooks";
import { BotonIntroducirResultado } from "./BotonIntroducirResultado";

type Props = {
  enfrentamiento: EnfrentamientoDTO;
};
export const BotonesUser = ({ enfrentamiento }: Props) => {
  const { user: loggedInUser } = useAuth();
  const qc = useQueryClient();

  const { mutate: aceptarResultado, isPending: aceptando } =
    useAceptarResultado();

  const handleAceptar = () => {
    aceptarResultado(
      { enfrentamientoId: enfrentamiento.id, equipoId: equipoDelUsuario.id },
      {
        onSuccess: () => {
          toast.success("Resultado aceptado");
          qc.invalidateQueries({
            queryKey: ["enfrentamientos", enfrentamiento.id],
          });
        },
      }
    );
  };

  const { mutate: rechazarResultado, isPending: rechazando } =
    useRechazarResultado();

  const handleRechazar = () => {
    rechazarResultado(
      { enfrentamientoId: enfrentamiento.id, equipoId: equipoDelUsuario.id },
      {
        onSuccess: () => {
          toast.success("Resultado rechazado");
          qc.invalidateQueries({
            queryKey: ["enfrentamientos", enfrentamiento.id],
          });
        },
      }
    );
  };

  const equipoDelUsuario = enfrentamiento.equipoA.jugadores.some(
    (j) => j.idUsuario === loggedInUser?.id
  )
    ? enfrentamiento.equipoA
    : enfrentamiento.equipoB;
  const usuarioParticipa =
    enfrentamiento.equipoA.jugadores.some(
      (j) => j.idUsuario === loggedInUser?.id
    ) ||
    enfrentamiento.equipoB.jugadores.some(
      (j) => j.idUsuario === loggedInUser?.id
    );

  const mostrarAceptarRechazar =
    enfrentamiento.estado === EstadoEnfrentamiento.CorroborarResultado &&
    usuarioParticipa &&
    (enfrentamiento.resultadoPropuestoPor !== equipoDelUsuario.id ||
      loggedInUser?.admin);

  return (
    usuarioParticipa && (
      <>
        {mostrarAceptarRechazar && (
          <div className="flex flex-col gap-2 mt-3">
            <Button
              onClick={handleRechazar}
              disabled={rechazando}
              variant="outline"
              icon={faXmark}
            >
              Rechazar
            </Button>
            <Button onClick={handleAceptar} disabled={aceptando} icon={faCheck}>
              Aceptar resultado
            </Button>
          </div>
        )}

        {/* Equipo puede proponer si no hay resultado aún */}
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
