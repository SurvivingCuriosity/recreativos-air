import { useMemo, useState } from "react";
import { TextInput } from "../../packages/components/TextInput/TextInput";
import { useGetAllUsers } from "../../shared/api/user/hooks";
import { TarjetaUsuarioAdmin } from "./TarjetaUsuarioAdmin";
import { debounce } from "../../packages/utils/debounce";

export const AdminUsuariosPage = () => {
  const { data: usuarios, isLoading } = useGetAllUsers();
  const [search, setSearch] = useState("");

  // 🧠 Debounce para no recalcular el filtro a cada tecla
  const handleSearch = useMemo(
    () =>
      debounce((val: string) => {
        setSearch(val);
      }, 300),
    []
  );

  // 🔤 Función para normalizar (quita tildes y mayúsculas)
  const normalize = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  // 🔍 Filtrado memoizado
  const usuariosFiltrados = useMemo(() => {
    if (!usuarios) return [];
    if (!search.trim()) return usuarios;

    const term = normalize(search);
    return usuarios.filter(
      (u) =>
        normalize(u.username).includes(term) ||
        normalize(u.nombre ?? "").includes(term) ||
        normalize(u.email).includes(term)
    );
  }, [usuarios, search]);

  if (isLoading)
    return (
      <p className="text-center text-neutral-400 p-6 animate-pulse">
        Cargando usuarios...
      </p>
    );

  return (
    <div className="p-3">
      <div className="sticky top-0 z-10 bg-neutral-950 pb-2">
        <h1 className="font-cool text-2xl text-primary">Lista de usuarios</h1>
        <div className="mt-2">
          <TextInput
            onChangeText={handleSearch}
            placeholder="Buscar usuario..."
          />
        </div>
      </div>

      {usuariosFiltrados.length === 0 ? (
        <p className="text-center text-neutral-500 mt-10">
          No se encontraron usuarios
        </p>
      ) : (
        <ul className="space-y-3 mt-3">
          {usuariosFiltrados.map((u) => (
            <TarjetaUsuarioAdmin user={u} key={u.id} />
          ))}
        </ul>
      )}
    </div>
  );
};
