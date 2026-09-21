import { CircleCheck, CircleX, Info } from "lucide-react";
import {
  EstadoEnfrentamiento,
  type EnfrentamientoDTO,
} from "recreativos-air-core/enfrentamiento";
import type { ConfiguracionLigaDTO } from "recreativos-air-core/liga";
import { cn } from "@/lib/utils";
import { useAuth } from "../../../../shared/api/auth/useAuth";
import { equiposDelUsuarioEnEnfrentamiento } from "../../../../shared/components/TarjetaEnfrentamiento/estadoEnfrentamiento";

const Aviso = ({
  tono,
  icon: IconComp,
  children,
}: {
  tono: "neutral" | "success" | "destructive";
  icon: typeof Info;
  children: React.ReactNode;
}) => (
  <div
    className={cn(
      "flex items-center gap-2 rounded-input border px-3 py-2.5 text-sm",
      tono === "neutral" && "border-border bg-card text-foreground-soft",
      tono === "success" && "border-success/35 bg-success/13 text-success",
      tono === "destructive" && "border-destructive/35 bg-destructive/13 text-destructive"
    )}
  >
    <IconComp size={16} className="shrink-0" aria-hidden="true" />
    <p>{children}</p>
  </div>
);

/** Tabla de resultado del detalle (design/screens/DetalleJornada.html) + avisos. */
export const ResultadoEnfrentamiento = ({
  enfrentamiento,
  cfgLiga,
}: {
  enfrentamiento: EnfrentamientoDTO;
  cfgLiga?: ConfiguracionLigaDTO;
}) => {
  const { user } = useAuth();
  const misEquipos = equiposDelUsuarioEnEnfrentamiento(enfrentamiento, user?.id);
  const sinJugar = enfrentamiento.estado === EstadoEnfrentamiento.SinJugar;
  const numPartidos = enfrentamiento.partidos.length;

  const esGanadora = (goles: number | null | undefined) =>
    !sinJugar &&
    goles != null &&
    cfgLiga?.golesParaGanar !== undefined &&
    goles === cfgLiga.golesParaGanar;

  const equipoQuePropuso =
    enfrentamiento.equipoA.id === enfrentamiento.resultadoPropuestoPor
      ? enfrentamiento.equipoA
      : enfrentamiento.equipoB;

  const equipoQueAcepta =
    enfrentamiento.equipoA.id === enfrentamiento.resultadoAceptadoPor
      ? enfrentamiento.equipoA
      : enfrentamiento.equipoB;

  const equipoQueRechaza =
    enfrentamiento.equipoA.id === enfrentamiento.resultadoRechazadoPor
      ? enfrentamiento.equipoA
      : enfrentamiento.equipoB;

  const Celda = ({
    goles,
    ultimaFila,
    ultimaCol,
  }: {
    goles: number | null | undefined;
    ultimaFila?: boolean;
    ultimaCol?: boolean;
  }) => (
    <div
      className={cn(
        "flex min-h-13 items-center justify-center border-border py-3.5",
        !ultimaFila && "border-b",
        !ultimaCol && "border-r",
        esGanadora(goles)
          ? "bg-primary/14 text-foreground dark:[text-shadow:0_0_8px_rgb(235_138_31/0.35)]"
          : "text-muted-foreground"
      )}
    >
      {goles ?? "-"}
    </div>
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex overflow-hidden rounded-card border border-border bg-card font-semibold">
        <div className="flex w-[42%] shrink-0 flex-col">
          <div
            className={cn(
              "flex min-h-13 items-center truncate border-b border-border px-3 py-3.5",
              misEquipos.includes(enfrentamiento.equipoA.id) ? "text-primary-text" : "text-foreground"
            )}
          >
            <span className="truncate">{enfrentamiento.equipoA.nombre}</span>
          </div>
          <div
            className={cn(
              "flex min-h-13 items-center truncate px-3 py-3.5",
              misEquipos.includes(enfrentamiento.equipoB.id) ? "text-primary-text" : "text-foreground"
            )}
          >
            <span className="truncate">{enfrentamiento.equipoB.nombre}</span>
          </div>
        </div>
        <div
          className="grid flex-1 border-l border-border font-display text-lg font-bold tabular-nums"
          style={{ gridTemplateColumns: `repeat(${numPartidos}, minmax(0, 1fr))` }}
        >
          {enfrentamiento.partidos.map((p, i) => (
            <Celda key={`a${i}`} goles={p.golesA} ultimaCol={i === numPartidos - 1} />
          ))}
          {enfrentamiento.partidos.map((p, i) => (
            <Celda key={`b${i}`} goles={p.golesB} ultimaFila ultimaCol={i === numPartidos - 1} />
          ))}
        </div>
      </div>

      {enfrentamiento.estado !== EstadoEnfrentamiento.Jugado && (
        <>
          {enfrentamiento.resultadoPropuestoPor !== null && (
            <Aviso tono="neutral" icon={Info}>
              Resultado propuesto por {equipoQuePropuso.nombre}
            </Aviso>
          )}
          {enfrentamiento.resultadoAceptadoPor !== null && (
            <Aviso tono="success" icon={CircleCheck}>
              Resultado aceptado por {equipoQueAcepta.nombre}
            </Aviso>
          )}
          {enfrentamiento.resultadoRechazadoPor !== null && (
            <Aviso tono="destructive" icon={CircleX}>
              Resultado rechazado por {equipoQueRechaza.nombre}
            </Aviso>
          )}
        </>
      )}
    </div>
  );
};
