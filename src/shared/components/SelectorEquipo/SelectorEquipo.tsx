import { memo } from "react";
import { CustomSelect } from "../../../packages/components/Select/Select";
import type { EquipoDTO } from "recreativos-air-core/equipos";

export interface SelectorEquipo {
  equipos: EquipoDTO[];
  idEquipoSelected?: string;
  onSelect: (idEquipoSelected: string) => void;
  disabled?: boolean;
  incluirOpcionTodos?: boolean;
}

export const SelectorEquipo = memo((props: SelectorEquipo) => {
  const {
    equipos,
    idEquipoSelected,
    onSelect,
    disabled = false,
    incluirOpcionTodos = true
  } = props;


  const equiposValues = equipos.map(e => ({
    value: e.id,
    label: e.nombre,
  }))

    const equiposValuesConCualquiera = [
      { value: "-1", label: "Cualquiera" },
      ...equiposValues,
    ]


  return (
    <CustomSelect
      value={equiposValuesConCualquiera.find((o) => o.value === idEquipoSelected)}
      onSelect={(selectedOption) => {
        onSelect(selectedOption.value);
      }}
      options={incluirOpcionTodos ? equiposValuesConCualquiera : equiposValues}
      disabled={disabled}
      placeholder="Buscar equipo"
    />
  );
});