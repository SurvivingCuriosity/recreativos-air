import { useMemo, useState } from "react";
import { debounce } from "../../packages/utils/debounce";
import { useGetAllEquipos } from "../../shared/api/equipos/hooks/useGetEquipos";
import { useLigas } from "../../shared/api/ligas/useLigas";
import { Buscador } from "../../shared/components/Buscador/Buscador";
import { EstadoVacio, SkeletonLista } from "../../shared/components/Estados/Estados";
import { PageTitle } from "../../shared/components/Titulos/Titulos";
import { TarjetaEquipoAdmin } from "./TarjetaEquipoAdmin";

const normalize = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

export const AdminEquiposPage = () => {
  const { data: equipos, isLoading } = useGetAllEquipos();
  const { data: ligas } = useLigas();

  const [search, setSearch] = useState("");

  const handleSearch = useMemo(() => debounce((val: string) => setSearch(val), 300), []);

  const equiposFiltrados = useMemo(() => {
    if (!equipos) return [];
    if (!search.trim()) return equipos;

    const term = normalize(search);
    return equipos.filter(
      (u) => normalize(u.id).includes(term) || normalize(u.nombre).includes(term)
    );
  }, [equipos, search]);

  return (
    <main className="mx-auto flex w-full max-w-screen-sm flex-col gap-3 px-4 pt-[18px] pb-5">
      <PageTitle color="primary" className="text-2xl">
        Lista de equipos
      </PageTitle>
      <Buscador placeholder="Buscar equipo..." onChangeText={handleSearch} />

      {/* §6.13: no mostrar el vacío mientras carga */}
      {isLoading ? (
        <SkeletonLista count={3} height="h-36" label="Cargando equipos..." />
      ) : equiposFiltrados.length === 0 ? (
        <EstadoVacio className="mt-6 border-0 bg-transparent">No se encontraron equipos</EstadoVacio>
      ) : (
        <ul className="flex flex-col gap-3">
          {equiposFiltrados.map((equipo) => {
            const ligasEnLasQueEstaInscrito = ligas?.filter((liga) =>
              liga.equipos.some((e) => e.equipo.id === equipo.id)
            );
            return (
              <li key={equipo.id}>
                <TarjetaEquipoAdmin equipo={equipo} ligas={ligasEnLasQueEstaInscrito || []} />
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
};
