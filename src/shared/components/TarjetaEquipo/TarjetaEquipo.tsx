import  { type EquipoDTO, EstadoJugadorEnEquipo, type JugadorDTO } from "recreativos-air-core/equipos";
import { Button } from "../../../packages/components/Button/Button";
import { useAuth } from "../../api/auth/useAuth";
import { useResponderInvitacion } from "../../api/equipos/hooks/useResponderInvitacion";

interface Props {
  equipo: EquipoDTO;
  onClick: () => void;
}

export const TarjetaEquipo = ({ equipo, onClick }: Props) => {
  const { user } = useAuth();

  const { mutate: responderInvitacion, isPending } = useResponderInvitacion();

  if (!user) return null;

  const soyCreador = equipo.idCreador === user.id;
  const miRegistro = equipo.jugadores.find((j) => j.idUsuario === user.id);
  const pendientes = equipo.jugadores.filter(
    (j) => j.estado === EstadoJugadorEnEquipo.PENDIENTE
  );

  const hayPendientes = pendientes.length > 0;

  const handleResponderInvitacion = (aceptar: boolean) => {
    responderInvitacion({ equipoId: equipo.id, aceptar });
  };

  const renderEstado = (estado: EstadoJugadorEnEquipo) => {
    const colors = {
      [EstadoJugadorEnEquipo.ACEPTADO]: "text-green-500",
      [EstadoJugadorEnEquipo.PENDIENTE]: "text-amber-500",
      [EstadoJugadorEnEquipo.RECHAZADO]: "text-neutral-400",
    };
    if (estado === EstadoJugadorEnEquipo.RECHAZADO) return null;
    if (estado === EstadoJugadorEnEquipo.ACEPTADO) return null;
    return <p className={`${colors[estado]} text-sm`}>{estado}</p>;
  };

  // 🎯 Determinar estado visual de la tarjeta
  const isMiInvitacionPendiente =
    !soyCreador && miRegistro?.estado === EstadoJugadorEnEquipo.PENDIENTE;

  const esperandoCompañero =
    soyCreador &&
    hayPendientes &&
    !pendientes.some((p) => p.idUsuario === user.id);

  const completado = !hayPendientes;

  // 🧱 Render principal (estructura común)
  return (
    <div
      onClick={!isMiInvitacionPendiente ? onClick : undefined}
      className={`border border-neutral-700 relative p-2 px-4 rounded-lg transition-all overflow-hidden min-w-62 
        ${
          isMiInvitacionPendiente
            ? "bg-neutral-800"
            : esperandoCompañero
            ? "bg-neutral-900"
            : "bg-neutral-900 hover:border-primary cursor-pointer"
        }`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <p
          className={`font-cool text-lg font-bold ${
            esperandoCompañero
              ? "text-amber-400"
              : completado
              ? "text-primary"
              : "text-neutral-200"
          }`}
        >
          {equipo.nombre}
        </p>
        {equipo.color && (
          <span
            className="absolute left-0 top-0 w-2 h-full"
            style={{ backgroundColor: equipo.color }}
          />
        )}
      </div>

      {/* ESTADO GENERAL */}
      {isMiInvitacionPendiente && (
        <p className="text-sm text-amber-400 mb-3">
          Has sido invitado a este equipo
        </p>
      )}

      {/* LISTA DE JUGADORES */}
      <div className="border-t border-neutral-700 pt-2 space-y-1">
        {equipo.jugadores.map((j: JugadorDTO) => (
          <div
            key={j.idUsuario ?? j.nombre}
            className="flex justify-between items-center text-sm"
          >
            <p className={`${user.id === j.idUsuario ? 'text-primary' : 'text-neutral-300'} truncate mr-2`}>
              {j.nombre}
              {j.suplente && (
                <span className="ml-1 text-amber-400 text-xs">(Suplente)</span>
              )}
            </p>
            {user.id === j.idUsuario && <p className="w-min mr-auto bg-neutral-800 text-neutral-400 text-xs px-2 p-0.5 rounded">Tú</p>}
            {equipo.idCreador !== j.idUsuario && renderEstado(j.estado)}
          </div>
        ))}
      </div>

      {/* INVITACIÓN BOTONES */}
      {isMiInvitacionPendiente && (
        <div className="flex gap-2 items-center mt-4">
          <Button
            onClick={() => handleResponderInvitacion(true)}
            disabled={isPending}
            variant="primary"
          >
            Aceptar
          </Button>
          <Button
            onClick={() => handleResponderInvitacion(false)}
            disabled={isPending}
            variant="outline"
          >
            Rechazar
          </Button>
        </div>
      )}
    </div>
  );
};
