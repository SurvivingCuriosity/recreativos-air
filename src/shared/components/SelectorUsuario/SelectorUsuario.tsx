import type { SearchUserDTO } from "recreativos-air-core/user";
import { CustomAsyncSelect } from "../../../packages/components/Select/AsyncSelect";
import { fetchUsers } from "./fetchUsuarios";
import { useAuth } from "../../../shared/api/auth/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

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
  const { user } = useAuth();

  const handleSelect = (user: UserEnSelector) => {
    onSelect({
      nombre: user.nombre,
      email: user.email,
      id: user.id,
      username: user.username,
    });
  };

  const handleLoadOptions = async (input: string | number) => {
    const users = await fetchUsers(input);

    return users.filter((u) => u.id !== user?.id);
  };

  return (
    <CustomAsyncSelect<UserEnSelector>
      onSelect={handleSelect}
      loadOptions={handleLoadOptions}
      disabled={disabled}
      placeholder={placeholder}
      noOptionsMessage="No hay resultados"
      loadingMessage="Cargando..."
      renderOption={(e)=>{
        return (
          <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-neutral-900">
            <FontAwesomeIcon icon={faUser} className="text-neutral-300" />
            <div className="flex flex-col">
              <p className="text-neutral-300">{e.label}</p>
              <p className="text-neutral-500">{e.nombre}</p>
            </div>

          </div>
        )
      }}
    />
  );
}
