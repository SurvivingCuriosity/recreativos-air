"use client";
import {
  useState,
  useMemo,
  useCallback,
  type MouseEvent,
} from "react";
import type { Column, DataTableProps, SortState } from "./types";

export function Tabla<T extends object>({
  data,
  columns,
  initialSortState,
}: DataTableProps<T>) {
  const [sortState, setSortState] = useState<SortState>(
    initialSortState || { columnKey: null, direction: "asc" }
  );

  const handleSort = useCallback(
    (col: Column<T>) => (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!col.sortable) return;

      setSortState((prev) => {
        if (prev.columnKey === col.key) {
          return {
            columnKey: col.key,
            direction: prev.direction === "asc" ? "desc" : "asc",
          };
        }
        return { columnKey: col.key, direction: "asc" };
      });
    },
    []
  );

  const sortedData = useMemo(() => {
    const { columnKey, direction } = sortState;
    if (!columnKey) return data;

    const columnToSort = columns.find((c) => c.key === columnKey);
    if (!columnToSort || !columnToSort.sortable) {
      return data;
    }

    const accessor = columnToSort.accessor || ((row: T) => row);
    const customSortFn = columnToSort.sortFn;

    const cloned = [...data];
    cloned.sort((a, b) => {
      if (customSortFn) {
        return direction === "asc" ? customSortFn(a, b) : customSortFn(b, a);
      } else {
        const valA = accessor(a);
        const valB = accessor(b);
        if (valA < valB) return direction === "asc" ? -1 : 1;
        if (valA > valB) return direction === "asc" ? 1 : -1;
        return 0;
      }
    });

    return cloned;
  }, [data, sortState, columns]);

  return (
    <table
      className="
        w-full
        table-auto
        border-separate
        border-spacing-0
        rounded-lg
        overflow-hidden
        shadow-sm
        text-left
        text-neutral-400
        border-neutral-800
        border
      "
    >
      <thead>
        <tr>
          {columns.map((col) => {
            const isSortable = Boolean(col.sortable);
            const currentDirection =
              sortState.columnKey === col.key ? sortState.direction : null;

            const renderHeader =
              typeof col.header === "function"
                ? col.header(sortState)
                : col.header;

            return (
              <th
                key={col.key}
                className="text-center p-1 font-semibold text-sm border-b border-neutral-800 border-r"
              >
                {isSortable ? (
                  <button
                    onClick={handleSort(col)}
                    className="mx-auto text-center flex items-center space-x-1 group"
                  >
                    <span>{renderHeader}</span>
                    {sortState.columnKey === col.key && (
                      <span className="text-xs leading-none">
                        {currentDirection === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </button>
                ) : (
                  <span>{renderHeader}</span>
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row, rowIndex) => (
          <tr key={rowIndex} className="transition-colors">
            {columns.map((col) => {
              // Render personalizado si hay 'cell', si no, usamos 'accessor'.
              if (col.cell) {
                if (typeof col.cell === "function") {
                  return (
                    <td
                      key={col.key}
                      className={`${col.header === "Equipo" ? 'max-w-27 truncate text-left' : ''} p-1 border-r text-center text-sm border-b border-neutral-800`}
                    >
                      {col.cell({ row, rowIndex, column: col })}
                    </td>
                  );
                }
                return (
                  <td
                    key={col.key}
                    className="p-1 border-r text-sm text-center border-b border-neutral-800"
                  >
                    {col.cell}
                  </td>
                );
              }

              const val = col.accessor ? col.accessor(row) : null;
              return (
                <td
                  key={col.key}
                  className="p-1 text-sm border-b border-r text-center border-neutral-800"
                >
                  {String(val)}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}