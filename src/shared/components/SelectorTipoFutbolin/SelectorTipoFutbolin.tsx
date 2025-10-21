import { memo } from "react";
import { CustomSelect } from "../../../packages/components/Select/Select";
import { TipoFutbolin } from "recreativos-air-core/liga";

export interface SelectorTipoFutbolin {
  value: TipoFutbolin;
  onSelect: (selectedOption: TipoFutbolin) => void;
  disabled?: boolean;
  incluirOpcionTodos?: boolean;
}

export const SelectorTipoFutbolin = memo((props: SelectorTipoFutbolin) => {
  const {
    value,
    onSelect,
    disabled = false,
  } = props;


  const futbolinOptionsTodos = [
    { value: TipoFutbolin.Infinity, label: "Infinity" },
    { value: TipoFutbolin.Tsunami, label: "Tsunami" },
  ];


  return (
    <CustomSelect
      value={futbolinOptionsTodos.find((o) => o.value === value)}
      onSelect={(selectedOption) => {
        onSelect(selectedOption.value as TipoFutbolin);
      }}
      options={futbolinOptionsTodos}
      disabled={disabled}
    />
  );
});