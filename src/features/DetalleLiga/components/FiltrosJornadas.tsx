import { EstadoEnfrentamientoConOpcionCualquiera } from "recreativos-air-core/enfrentamiento";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SelectorEstadoEnfrentamiento } from "../../../shared/components/SelectorEstadoEnfrentamiento/SelectorEstadoEnfrentamiento";

type Props = {
  mostrarTodos: boolean;
  onChangeMostrarTodos: (mostrarTodos: boolean) => void;
  estado: EstadoEnfrentamientoConOpcionCualquiera;
  onChangeEstado: (estado: EstadoEnfrentamientoConOpcionCualquiera) => void;
};

const toggleItemClass =
  "h-full flex-1 rounded-[9px] px-2 text-[13px] font-semibold text-muted-foreground data-[state=on]:bg-primary/16 data-[state=on]:font-bold data-[state=on]:text-primary-text hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring";

/** Filtros de jornadas: ToggleGroup «Mis partidos | Todos» + estado (DESIGN.md §6.5). */
export const FiltrosJornadas = ({
  mostrarTodos,
  onChangeMostrarTodos,
  estado,
  onChangeEstado,
}: Props) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-muted-foreground">Equipos:</span>
        <ToggleGroup
          type="single"
          value={mostrarTodos ? "todos" : "mios"}
          onValueChange={(v) => {
            if (v) onChangeMostrarTodos(v === "todos");
          }}
          aria-label="Equipos"
          className="grid h-[46px] w-full grid-cols-2 gap-[3px] rounded-input border border-border bg-card p-[3px]"
        >
          <ToggleGroupItem value="mios" className={toggleItemClass}>
            Mis partidos
          </ToggleGroupItem>
          <ToggleGroupItem value="todos" className={toggleItemClass}>
            Todos
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="flex min-w-0 flex-col gap-1.5">
        <span className="text-xs text-muted-foreground">Estado:</span>
        <SelectorEstadoEnfrentamiento value={estado} onSelect={onChangeEstado} />
      </div>
    </div>
  );
};
