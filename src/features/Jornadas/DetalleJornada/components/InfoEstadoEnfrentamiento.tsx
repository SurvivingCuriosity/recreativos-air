import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EstadoEnfrentamiento } from "../../../../shared/enum/EstadoEnfrentamiento";
import { faCheckCircle, faHand, faInfoCircle, type IconDefinition } from "@fortawesome/free-solid-svg-icons";

export const InfoEstadoEnfrentamiento = ({
  estado,
}: {
  estado: EstadoEnfrentamiento;
}) => {
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
    [EstadoEnfrentamiento.CorroborarResultado]: "El resultado debe ser confirmado por la otra pareja.",
    [EstadoEnfrentamiento.ConfirmarResultado]: "El administrador debe confirmar finalmente el resultado.",
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
      className={`rounded-lg p-3 ` + containerClassName[estado]}
    >
      <div className="flex items-center gap-2 mb-2">
        <FontAwesomeIcon icon={icon[estado]} className={textClassName[estado]} />
        <p className={`` + textClassName[estado]}>{title[estado]}</p>
      </div>
      <p className={`text-sm ` + textClassName[estado]}>{description[estado]}</p>
    </div>
  );
};
