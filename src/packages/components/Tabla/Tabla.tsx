import { ChevronDown, ChevronUp } from "lucide-react";
import { useCallback, useMemo, useState, type MouseEvent } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Column, DataTableProps, SortState } from "./types";

export function Tabla<T extends object>({
  data,
  columns,
  initialSortState,
  rowClassName,
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

  const renderCell = (col: Column<T>, row: T, rowIndex: number) => {
    if (col.cell) {
      return typeof col.cell === "function"
        ? col.cell({ row, rowIndex, column: col })
        : col.cell;
    }
    const val = col.accessor ? col.accessor(row) : null;
    return String(val);
  };

  return (
    <div className="overflow-hidden rounded-card border border-border bg-card">
      <Table className="text-sm">
        <TableHeader className="bg-card-2">
          <TableRow className="hover:bg-transparent">
            {columns.map((col) => {
              const isSortable = Boolean(col.sortable);
              const isActive = sortState.columnKey === col.key;
              const renderHeader =
                typeof col.header === "function" ? col.header(sortState) : col.header;

              return (
                <TableHead
                  key={col.key}
                  aria-sort={
                    isActive ? (sortState.direction === "asc" ? "ascending" : "descending") : undefined
                  }
                  className={cn(
                    "h-11 px-2 text-center text-xs font-semibold tracking-wide text-muted-foreground uppercase",
                    col.className
                  )}
                >
                  {isSortable ? (
                    <button
                      type="button"
                      onClick={handleSort(col)}
                      className={cn(
                        "mx-auto flex min-h-11 items-center gap-1 rounded-sm px-1 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring",
                        isActive && "text-primary-text",
                        col.align === "left" && "mx-0"
                      )}
                    >
                      <span>{renderHeader}</span>
                      {isActive &&
                        (sortState.direction === "asc" ? (
                          <ChevronUp size={12} aria-hidden="true" />
                        ) : (
                          <ChevronDown size={12} aria-hidden="true" />
                        ))}
                    </button>
                  ) : (
                    <span>{renderHeader}</span>
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              className={cn("border-border", rowClassName?.(row, rowIndex))}
            >
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  className={cn(
                    "h-11 px-2 text-center",
                    col.align === "left" && "text-left",
                    col.className
                  )}
                >
                  {renderCell(col, row, rowIndex)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
