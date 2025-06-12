import { memo } from "react";
import { CustomSelect } from "../../../packages/components/Select/Select";
import type { Equipo } from "../../interfaces/Equipo";

export interface SelectorEquipo {
  equipos: Equipo[];
  idEquipoSelected: string;
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
      options={equiposValuesConCualquiera}
      disabled={disabled}
      placeholder="Cualquiera"
    />
  );
});