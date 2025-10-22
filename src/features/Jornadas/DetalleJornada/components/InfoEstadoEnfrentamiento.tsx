import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faHand,
  faInfoCircle,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { EstadoEnfrentamiento, type EnfrentamientoDTO } from "recreativos-air-core/enfrentamiento";
import { useAuth } from "../../../../shared/api/auth/useAuth";

export const InfoEstadoEnfrentamiento = ({
  enfrentamiento,
}: {
  enfrentamiento: EnfrentamientoDTO;
}) => {

  const {user:loggedInUser} = useAuth();
  const equipoDelUsuario = enfrentamiento.equipoA.jugadores.some(
    (j) => j.idUsuario === loggedInUser?.id
  )
    ? enfrentamiento.equipoA
    : enfrentamiento.equipoB;

  const propuestoPorEquipoDeUsuario = enfrentamiento.resultadoPropuestoPor !== null && enfrentamiento.resultadoPropuestoPor === equipoDelUsuario.id

  const containerClassName: Record<EstadoEnfrentamiento, string> = {
    [EstadoEnfrentamiento.SinJugar]: "bg-red-500/10",
    [EstadoEnfrentamiento.CorroborarResultado]: "bg-orange-500/10",
    [EstadoEnfrentamiento.ConfirmarResultado]: "bg-yellow-500/10",
    [EstadoEnfrentamiento.Jugado]: "bg-green-500/10",
  };
  const textClassName: Record<EstadoEnfrentamiento, string> = {
    [EstadoEnfrentamiento.SinJugar]: "text-red-400",
    [EstadoEnfrentamiento.CorroborarResultado]: "text-orange-400",
    [EstadoEnfrentamiento.ConfirmarResultado]: "text-yellow-400",
    [EstadoEnfrentamiento.Jugado]: "text-green-400",
  };

  const title: Record<EstadoEnfrentamiento, string> = {
    [EstadoEnfrentamiento.SinJugar]: "Sin jugar",
    [EstadoEnfrentamiento.CorroborarResultado]: "Pendiente de confirmación",
    [EstadoEnfrentamiento.ConfirmarResultado]: "Pendiente de finalización",
    [EstadoEnfrentamiento.Jugado]: "Jugado",
  };

  const description: Record<EstadoEnfrentamiento, string> = {
    [EstadoEnfrentamiento.SinJugar]: "Este partido no ha sido jugado aún.",
    [EstadoEnfrentamiento.CorroborarResultado]:
      propuestoPorEquipoDeUsuario ? "El resultado debe ser confirmado por la otra pareja." : "Debes aceptar o rechazar el resultado",
    [EstadoEnfrentamiento.ConfirmarResultado]:
      "El administrador debe confirmar finalmente el resultado.",
    [EstadoEnfrentamiento.Jugado]: "El partido ha finalizado.",
  };

  const icon: Record<EstadoEnfrentamiento, IconDefinition> = {
    [EstadoEnfrentamiento.SinJugar]: faInfoCircle,
    [EstadoEnfrentamiento.CorroborarResultado]: faHand,
    [EstadoEnfrentamiento.ConfirmarResultado]: faHand,
    [EstadoEnfrentamiento.Jugado]: faCheckCircle,
  };

  return (
    <div
      className={
        `flex items-center gap-3 rounded-lg p-2 px-4 w-fit ` + containerClassName[enfrentamiento.estado]
      }
    >
      <FontAwesomeIcon icon={icon[enfrentamiento.estado]} className={textClassName[enfrentamiento.estado]} />
      <div className="flex flex-col">
        <p className={`font-extrabold ` + textClassName[enfrentamiento.estado]}>{title[enfrentamiento.estado]}</p>
        <p className={`text-xs ` + textClassName[enfrentamiento.estado]}>
          {description[enfrentamiento.estado]}
        </p>
      </div>
    </div>
  );
};
