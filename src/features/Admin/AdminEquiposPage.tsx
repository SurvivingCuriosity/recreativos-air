import { useMemo, useState } from "react";
import { useGetAllEquipos } from "../../shared/api/equipos/hooks/useGetEquipos";
import { useLigas } from "../../shared/api/ligas/useLigas";
import { TarjetaEquipoAdmin } from "./TarjetaEquipoAdmin";
import { debounce } from "../../packages/utils/debounce";
import { TextInput } from "../../packages/components/TextInput/TextInput";

export const AdminEquiposPage = () => {
  const { data: equipos } = useGetAllEquipos();

  const { data: ligas } = useLigas();

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
  const equiposFiltrados = useMemo(() => {
    if (!equipos) return [];
    if (!search.trim()) return equipos;

    const term = normalize(search);
    return equipos.filter(
      (u) =>
        normalize(u.id).includes(term) || normalize(u.nombre).includes(term)
    );
  }, [equipos, search]);

  return (
    <div className="p-3">
      <h1 className="font-cool text-2xl text-primary sticky top-0 z-10 bg-neutral-950 pb-2">
        Lista de equipos
      </h1>
      <div className="mt-2">
        <TextInput onChangeText={handleSearch} placeholder="Buscar equipo..." />
      </div>
      {equiposFiltrados.length === 0 ? (
        <p className="text-center text-neutral-500 mt-10">
          No se encontraron equipos
        </p>
      ) : (
        <ul className="space-y-3 mt-3">
          {equiposFiltrados?.map((equipo) => {
            const ligasEnLasQueEstaInscrito = ligas?.filter((liga) =>
              liga.equipos.some((e) => e.equipo.id === equipo.id)
            );

            return (
              <TarjetaEquipoAdmin
                equipo={equipo}
                key={equipo.id}
                ligas={ligasEnLasQueEstaInscrito || []}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
};
