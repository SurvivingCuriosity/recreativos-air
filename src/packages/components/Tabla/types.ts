import type { ReactNode } from "react";

/**
 * Estado de ordenaciÃ³n de la tabla.
 */
export interface SortState {
  columnKey: string | null;
  direction: "asc" | "desc";
}

/**
 * ParÃ¡metros opcionales para renderizar el encabezado.
 * Si 'header' es una funciÃ³n, puede recibir el estado de ordenaciÃ³n.
 */
export type HeaderRender = ReactNode | ((sortState: SortState) => ReactNode);

/**
 * ParÃ¡metros opcionales para renderizar la celda.
 */
export interface CellRenderParams<T> {
  row: T;
  rowIndex: number;
  column: Column<T>;
}

export type CellRender<T> =
  | ReactNode
  | ((params: CellRenderParams<T>) => ReactNode);

/**
 * DefiniciÃ³n de cada columna.
 */
export interface Column<T> {
  /**
   * Identificador Ãºnico de la columna (usado para la ordenaciÃ³n).
   */
  key: string;

  /**
   * Contenido del encabezado. Puede ser un texto, JSX
   * o una funciÃ³n que reciba el estado de ordenaciÃ³n.
   */
  header?: HeaderRender;

  /**
   * CÃ³mo se obtiene el valor de la columna para cada fila.
   */
  accessor?: (row: T) => string | number;

  /**
   * Render personalizado para la celda. Puede ser
   * un ReactNode o una funciÃ³n que recibe el row y la columna.
   */
  cell?: CellRender<T>;

  /**
   * Indica si la columna admite ordenaciÃ³n.
   */
  sortable?: boolean;

  /**
   * FunciÃ³n de ordenaciÃ³n personalizada.
   * (Se usarÃ¡ si la columna es 'sortable'.)
   */
  sortFn?: (a: T, b: T) => number;

  /** Alineación del contenido de la columna (por defecto, centrado). */
  align?: "left" | "center";

  /** Clases extra para cabecera y celdas de la columna. */
  className?: string;
}

/**
 * Props principales del DataTable.
 */
export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  initialSortState?: SortState;
  /** Clases extra por fila (p. ej. resaltar la fila propia). */
  rowClassName?: (row: T, rowIndex: number) => string | undefined;
}
