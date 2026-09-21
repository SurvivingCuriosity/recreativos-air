import {
  EstadoJugadorEnEquipo,
  type EquipoDTO,
  type JugadorDTO,
} from "recreativos-air-core/equipos";
import { cn } from "@/lib/utils";
import { Button } from "../../../packages/components/Button/Button";
import { useAuth } from "../../api/auth/useAuth";
import { useResponderInvitacion } from "../../api/equipos/hooks/useResponderInvitacion";
import { EscudoEquipo } from "../EscudoEquipo/EscudoEquipo";

interface Props {
  equipo: EquipoDTO;
  onClick: () => void;
}

/** Chip «Tú» junto al nombre del usuario. */
export const ChipTu = () => (
  <span className="rounded-[4px] bg-muted px-1.5 py-px text-[11px] font-bold text-foreground-soft">
    Tú
  </span>
);

/**
 * TarjetaEquipo (design/screens/MiPerfil.html): escudo + nombre, lista de jugadores,
 * y estado de invitación con Aceptar / Rechazar.
 */
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

  const isMiInvitacionPendiente =
    !soyCreador && miRegistro?.estado === EstadoJugadorEnEquipo.PENDIENTE;

  const esperandoCompañero =
    soyCreador &&
    hayPendientes &&
    !pendientes.some((p) => p.idUsuario === user.id);

  const completado = !hayPendientes;
  const clicable = !isMiInvitacionPendiente;

  return (
    <div
      onClick={clicable ? onClick : undefined}
      role={clicable ? "link" : undefined}
      tabIndex={clicable ? 0 : undefined}
      onKeyDown={(e) => {
        if (clicable && (e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "flex min-w-62 flex-col gap-2.5 rounded-card border border-border px-3.5 py-3 text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        isMiInvitacionPendiente ? "bg-muted" : "bg-card",
        clicable && "cursor-pointer hover:border-primary"
      )}
    >
      <div className="flex items-center gap-2.5">
        <EscudoEquipo nombre={equipo.nombre} color={equipo.color} size={40} />
        <p
          className={cn(
            "truncate font-display text-lg font-bold",
            esperandoCompañero
              ? "text-warning"
              : completado
                ? "text-primary-text"
                : "text-foreground"
          )}
        >
          {equipo.nombre}
        </p>
      </div>

      {isMiInvitacionPendiente && (
        <p className="text-sm text-warning">Has sido invitado a este equipo</p>
      )}

      <div className="flex flex-col gap-2 border-t border-border pt-2.5 text-sm">
        {equipo.jugadores.map((j: JugadorDTO) => {
          const soyYo = user.id === j.idUsuario;
          const mostrarPendiente =
            equipo.idCreador !== j.idUsuario &&
            j.estado === EstadoJugadorEnEquipo.PENDIENTE;
          return (
            <div
              key={j.idUsuario ?? j.nombre}
              className="flex items-center justify-between gap-2"
            >
              <span
                className={cn(
                  "inline-flex min-w-0 items-center gap-1.5",
                  soyYo ? "text-primary-text" : "text-foreground-soft"
                )}
              >
                <span className="truncate">{j.nombre}</span>
                {j.suplente && <span className="text-xs text-warning">(Suplente)</span>}
                {soyYo && <ChipTu />}
              </span>
              {mostrarPendiente && (
                <span className="text-xs font-bold text-warning">{j.estado}</span>
              )}
            </div>
          );
        })}
      </div>

      {isMiInvitacionPendiente && (
        <div className="flex gap-2 pt-1">
          <Button
            onClick={() => handleResponderInvitacion(true)}
            disabled={isPending}
            variant="primary"
            className="flex-1"
          >
            Aceptar
          </Button>
          <Button
            onClick={() => handleResponderInvitacion(false)}
            disabled={isPending}
            variant="outline"
            className="flex-1"
          >
            Rechazar
          </Button>
        </div>
      )}
    </div>
  );
};
