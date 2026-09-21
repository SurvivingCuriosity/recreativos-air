import { cn } from "@/lib/utils";
import { Tabla } from "../../../packages/components/Tabla/Tabla";
import type { Column } from "../../../packages/components/Tabla/types";
import { ChipTu } from "../../../shared/components/TarjetaEquipo/TarjetaEquipo";

export interface TableRow {
  pos: number;
  equipoId: string;
  nombre: string;
  jj: number;
  pp: number;
  gf: number;
  gc: number;
  pts: number;
}

/** Colores de podio (DESIGN.md §4). */
const colorPodio = (pos: number) =>
  pos === 1
    ? "text-podium-1"
    : pos === 2
      ? "text-podium-2"
      : pos === 3
        ? "text-podium-3"
        : "text-foreground-soft";

/** Tabla de clasificación (design/screens/LigaClasificacion.html): fila propia resaltada + «Tú». */
export const TablaClasificacionLiga = ({
  data,
  miEquipoId,
}: {
  data: TableRow[];
  miEquipoId?: string;
}) => {
  const columns: Column<TableRow>[] = [
    {
      key: "pos",
      header: "#",
      accessor: (r) => r.pos,
      sortable: true,
      className: "w-10 px-1.5",
      cell: ({ row }) => (
        <span className={cn("font-display font-bold", colorPodio(row.pos))}>{row.pos}</span>
      ),
    },
    {
      key: "nombre",
      header: "Equipo",
      accessor: (r) => r.nombre,
      align: "left",
      className: "max-w-0 px-1.5",
      cell: ({ row }) => (
        <span className="flex min-w-0 items-center gap-1.5">
          <span
            className={cn(
              "truncate font-semibold",
              row.pos <= 3 ? colorPodio(row.pos) : "text-foreground"
            )}
          >
            {row.nombre}
          </span>
          {row.equipoId === miEquipoId && (
            <span className="shrink-0 rounded-[4px] bg-primary px-1.5 py-px text-[11px] font-bold text-primary-foreground">
              Tú
            </span>
          )}
        </span>
      ),
    },
    {
      key: "pts",
      header: "PTS",
      accessor: (r) => r.pts,
      sortable: true,
      className: "w-12 px-1.5",
      cell: ({ row }) => (
        <span className="font-display font-bold text-foreground">{row.pts}</span>
      ),
    },
    { key: "jj", header: "J", accessor: (r) => r.jj, sortable: true, className: "w-9 px-1.5" },
    { key: "pp", header: "PP", accessor: (r) => r.pp, sortable: true, className: "w-9 px-1.5" },
    {
      key: "dif",
      header: "DIF",
      accessor: (r) => r.gf - r.gc,
      sortable: true,
      className: "w-12 px-1.5",
      cell: ({ row }) => {
        const dif = row.gf - row.gc;
        return <span>{dif > 0 ? `+${dif}` : dif}</span>;
      },
    },
  ];

  return (
    <Tabla
      data={data}
      columns={columns}
      rowClassName={(row) => (row.equipoId === miEquipoId ? "bg-primary/12" : undefined)}
    />
  );
};

export { ChipTu };
