import { Tabla } from "../../../packages/components/Tabla/Tabla";
import type { Column } from "../../../packages/components/Tabla/types";
import type { Equipo } from "../../../shared/interfaces/Equipo";
import { useAppSelector } from "../../../shared/store/hooks";

export const TablaClasificacionLiga = ({
  equipos,
  enfrentamientos,
}: {
  equipos: Equipo[];
  enfrentamientos: string[];
}) => {
  interface TableRow {
    pos: number;
    equipo: string;
    idequipo: string;
    pj: number;
    pg: number;
    pp: number;
    gf: number;
    gc: number;
    pts: number;
  }

  const { equiposUsuario } = useAppSelector((state) => state.user);

  const sampleDataClasificacion: TableRow[] = equipos.map((e, i) => ({
    pos: i + 1,
    equipo: e.nombre,
    idequipo: e.id,
    pj: 0,
    pg: 0,
    pp: 0,
    gf: 0,
    gc: 0,
    pts: 0,
  }));

  console.log(enfrentamientos)

  const columns: Column<TableRow>[] = [
    {
      key: "posicion",
      header: () => <span>#</span>,
      accessor: (row) => row.pos,
      sortable: true,
      sortFn: (a, b) => a.pos - b.pos,
      cell: ({ row }) => <strong>{row.pos}</strong>,
    },
    {
      key: "equipo",
      header: "Equipo",
      accessor: (row) => row.equipo,
      sortable: false,
      cell: ({ row }) => {
        return (
          <div
            className={`truncate max-w-20 p-1 ${
              equiposUsuario.some((e) => e.id === row.idequipo)
                ? "text-primary"
                : ""
            }`}
          >
            {row.equipo}
          </div>
        );
      },
    },
    {
      key: "pj",
      header: (sortState) => (
        <span>
          PJ
          {sortState.columnKey === "pj" && (
            <span className="ml-1">
              {sortState.direction === "asc" ? "▲" : "▼"}
            </span>
          )}
        </span>
      ),
      accessor: (row) => row.pj,
      sortable: true,
      sortFn: (a, b) => a.pj - b.pj,
    },
    {
      key: "pg",
      header: (sortState) => (
        <span>
          PG
          {sortState.columnKey === "pg" && (
            <span className="ml-1">
              {sortState.direction === "asc" ? "▲" : "▼"}
            </span>
          )}
        </span>
      ),
      accessor: (row) => row.pg,
      sortable: true,
      sortFn: (a, b) => a.pg - b.pg,
    },
    {
      key: "pp",
      header: (sortState) => (
        <span>
          PP
          {sortState.columnKey === "pp" && (
            <span className="ml-1">
              {sortState.direction === "asc" ? "▲" : "▼"}
            </span>
          )}
        </span>
      ),
      accessor: (row) => row.pp,
      sortable: true,
      sortFn: (a, b) => a.pp - b.pp,
    },
    {
      key: "gf",
      header: (sortState) => (
        <span>
          GF
          {sortState.columnKey === "gf" && (
            <span className="ml-1">
              {sortState.direction === "asc" ? "▲" : "▼"}
            </span>
          )}
        </span>
      ),
      accessor: (row) => row.gf,
      sortable: true,
      sortFn: (a, b) => a.gf - b.gf,
    },
    {
      key: "gc",
      header: (sortState) => (
        <span>
          GC
          {sortState.columnKey === "gc" && (
            <span className="ml-1">
              {sortState.direction === "asc" ? "▲" : "▼"}
            </span>
          )}
        </span>
      ),
      accessor: (row) => row.gc,
      sortable: true,
      sortFn: (a, b) => a.gc - b.gc,
    },
    {
      key: "pts",
      header: (sortState) => (
        <span>
          PTS
          {sortState.columnKey === "pts" && (
            <span className="ml-1">
              {sortState.direction === "asc" ? "▲" : "▼"}
            </span>
          )}
        </span>
      ),
      accessor: (row) => row.pts,
      sortable: true,
      sortFn: (a, b) => a.pts - b.pts,
    },
  ];

  return <Tabla data={sampleDataClasificacion} columns={columns} />;
};
