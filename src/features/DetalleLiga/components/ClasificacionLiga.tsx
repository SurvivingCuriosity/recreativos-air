import { Tabla } from "../../../packages/components/Tabla/Tabla";
import type { Column } from "../../../packages/components/Tabla/types";

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

export const TablaClasificacionLiga = ({ data }: { data: TableRow[] }) => {
  const columns: Column<TableRow>[] = [
    { key: "pos", header: "#", accessor: (r) => r.pos, sortable: true },
    { key: "nombre", header: "Equipo", accessor: (r) => r.nombre },
    { key: "jj", header: "J", accessor: (r) => r.jj, sortable: true },
    { key: "pp", header: "PP", accessor: (r) => r.pp, sortable: true },
    { key: "gf", header: "GF", accessor: (r) => r.gf, sortable: true },
    { key: "gc", header: "GC", accessor: (r) => r.gc, sortable: true },
    { key: "pts", header: "PTS", accessor: (r) => r.pts, sortable: true },
  ];

  return <Tabla data={data} columns={columns} />;
};
