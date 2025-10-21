import { memo } from "react";
import { CustomSelect } from "../../../packages/components/Select/Select";
import { EstadoEnfrentamientoOpcionCualquiera } from "../../enum/EstadoEnfrentamiento";

export interface SelectorEstadoEnfrentamiento {
  value: EstadoEnfrentamientoOpcionCualquiera;
  onSelect: (selectedOption: EstadoEnfrentamientoOpcionCualquiera) => void;
  disabled?: boolean;
  incluirOpcionTodos?: boolean;
}

export const SelectorEstadoEnfrentamiento = memo(
  (props: SelectorEstadoEnfrentamiento) => {
    const { value, onSelect, disabled = false } = props;

    const estadoEnfrentamientoOptions = [
      { value: EstadoEnfrentamientoOpcionCualquiera.Cualquiera, label: "Cualquiera" }, 
      { value: EstadoEnfrentamientoOpcionCualquiera.ConfirmarResultado, label: "Pendiente" },
      { value: EstadoEnfrentamientoOpcionCualquiera.Jugado, label: "Jugado" },
      { value: EstadoEnfrentamientoOpcionCualquiera.SinJugar, label: "No jugado" },
    ];

    return (
      <CustomSelect
        value={estadoEnfrentamientoOptions.find((o) => o.value === value)}
        onSelect={(selectedOption) => {
          onSelect(selectedOption.value);
        }}
        options={estadoEnfrentamientoOptions}
        disabled={disabled}
        placeholder="Cualquiera"
      />
    );
  }
);
