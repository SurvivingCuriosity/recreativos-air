import type { SearchUserDTO } from "recreativos-air-core/user";
import { CustomAsyncSelect } from "../../../packages/components/Select/AsyncSelect";
import { fetchUsers } from "./fetchUsuarios";

export interface OptionType {
  value: string | number;
  label: string;
}

export type UserEnSelector = OptionType & SearchUserDTO;

export default function SelectorUsuario({
  onSelect,
  disabled,
  placeholder = "Escribe para buscar...",
}: {
  onSelect: (val: SearchUserDTO) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const handleSelect = async (user: UserEnSelector) => {
    return onSelect({
      nombre: user.nombre,
      email: user.email,
      id: user.id,
      username: user.username,
    });
  };

  return (
    <CustomAsyncSelect<UserEnSelector>
      onSelect={handleSelect}
      loadOptions={fetchUsers}
      disabled={disabled}
      placeholder={placeholder}
      noOptionsMessage="No hay resultados"
      loadingMessage="Cargando..."
    />
  );
}
