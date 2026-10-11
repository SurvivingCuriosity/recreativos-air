import {
  EstadoEnfrentamiento,
  type EnfrentamientoDTO,
} from "recreativos-air-core/enfrentamiento";
import type { JornadaDTO, LigaDTO } from "recreativos-air-core/liga";

/** Clave del grupo de enfrentamientos sin jornada (ligas anteriores al calendario). */
export const SIN_JORNADA = 0;

export interface GrupoJornada {
  numero: number;
  jornada?: JornadaDTO;
  enfrentamientos: EnfrentamientoDTO[];
  total: number;
  jugados: number;
}

/**
 * Agrupa por jornada. `total` y `jugados` se calculan sobre todos los
 * enfrentamientos de la jornada; `enfrentamientos` son solo los visibles tras
 * filtrar. Los grupos sin visibles se omiten y «Sin jornada» va al final.
 */
export const agruparPorJornada = (
  liga: LigaDTO | undefined,
  todos: EnfrentamientoDTO[],
  visibles: EnfrentamientoDTO[]
): GrupoJornada[] => {
  const grupos = new Map<number, GrupoJornada>();
  const grupo = (numero: number) => {
    let g = grupos.get(numero);
    if (!g) {
      g = {
        numero,
        jornada: liga?.jornadas.find((j) => j.numero === numero),
        enfrentamientos: [],
        total: 0,
        jugados: 0,
      };
      grupos.set(numero, g);
    }
    return g;
  };

  for (const enf of todos) {
    const g = grupo(enf.jornada ?? SIN_JORNADA);
    g.total += 1;
    if (enf.estado === EstadoEnfrentamiento.Jugado) g.jugados += 1;
  }
  for (const enf of visibles) grupo(enf.jornada ?? SIN_JORNADA).enfrentamientos.push(enf);

  return [...grupos.values()]
    .filter((g) => g.enfrentamientos.length > 0)
    .sort((a, b) => {
      if (a.numero === SIN_JORNADA) return 1;
      if (b.numero === SIN_JORNADA) return -1;
      return a.numero - b.numero;
    });
};

export const nombreJornada = (numero: number) =>
  numero === SIN_JORNADA ? "Sin jornada" : `Jornada ${numero}`;

export const formatFechaCorta = (iso: string | null | undefined) =>
  iso
    ? new Date(iso).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        timeZone: "UTC",
      })
    : null;

export const formatRangoJornada = (jornada?: JornadaDTO) =>
  jornada?.fechaInicio && jornada?.fechaFin
    ? `${formatFechaCorta(jornada.fechaInicio)} – ${formatFechaCorta(jornada.fechaFin)}`
    : "Sin fechas";

export const hoyISO = () => new Date().toISOString().slice(0, 10);

export const jornadaActual = (jornadas: JornadaDTO[], hoy = hoyISO()) =>
  jornadas.find(
    (j) => j.fechaInicio && j.fechaFin && j.fechaInicio <= hoy && hoy <= j.fechaFin
  )?.numero;

/** Marcador «10–7 · 8–10 · …» (guion corto, tabular en la UI). */
export const formatMarcador = (enf: EnfrentamientoDTO) =>
  enf.partidos.map((p) => `${p.golesA}–${p.golesB}`).join(" · ");
