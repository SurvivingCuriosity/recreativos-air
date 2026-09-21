import type { SearchUserDTO } from "recreativos-air-core/user";
import { CustomAsyncSelect } from "../../../packages/components/Select/AsyncSelect";
import { fetchUsers } from "./fetchUsuarios";
import { useAuth } from "../../../shared/api/auth/useAuth";
import { Icon } from "@/shared/ui/Icon";
import { User } from "lucide-react";

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
      emptyInputMessage="Escribe el nombre de tu compañero..."
      loadingMessage="Cargando..."
      renderOption={(e)=>{
        return (
          <div className="flex min-h-11 items-center gap-3 py-1">
            <Icon icon={User} className="text-muted-foreground" />
            <div className="flex flex-col">
              <p className="text-foreground">{e.label}</p>
              <p className="text-xs text-muted-foreground">{e.nombre}</p>
            </div>

          </div>
        )
      }}
    />
  );
}
