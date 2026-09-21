import { useMemo, useState } from "react";
import { debounce } from "../../packages/utils/debounce";
import { useGetAllUsers } from "../../shared/api/user/hooks";
import { Buscador } from "../../shared/components/Buscador/Buscador";
import { EstadoVacio, SkeletonLista } from "../../shared/components/Estados/Estados";
import { PageTitle } from "../../shared/components/Titulos/Titulos";
import { TarjetaUsuarioAdmin } from "./TarjetaUsuarioAdmin";

const normalize = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

export const AdminUsuariosPage = () => {
  const { data: usuarios, isLoading } = useGetAllUsers();
  const [search, setSearch] = useState("");

  const handleSearch = useMemo(() => debounce((val: string) => setSearch(val), 300), []);

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

  return (
    <main className="mx-auto flex w-full max-w-screen-sm flex-col gap-3 px-4 pt-[18px] pb-5">
      <PageTitle color="primary" className="text-2xl">
        Lista de usuarios
      </PageTitle>
      <Buscador placeholder="Buscar usuario..." onChangeText={handleSearch} />

      {isLoading ? (
        <SkeletonLista count={3} height="h-24" label="Cargando usuarios..." />
      ) : usuariosFiltrados.length === 0 ? (
        <EstadoVacio className="mt-6 border-0 bg-transparent">No se encontraron usuarios</EstadoVacio>
      ) : (
        <ul className="flex flex-col gap-3">
          {usuariosFiltrados.map((u) => (
            <li key={u.id}>
              <TarjetaUsuarioAdmin user={u} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};
