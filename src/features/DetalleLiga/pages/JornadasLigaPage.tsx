import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../../../shared/api/auth/useAuth";
import { useEnfrentamientosLiga } from "../../../shared/api/enfrentamientos/hooks";
import { useGetEquiposUsuario } from "../../../shared/api/equipos/hooks/useGetEquipos";
import { useLigaById } from "../../../shared/api/ligas/useLigas";
import { TarjetaEnfrentamiento } from "../../../shared/components/TarjetaEnfrentamiento/TarjetaEnfrentamiento";
import { EstadoEnfrentamientoOpcionCualquiera } from "../../../shared/enum/EstadoEnfrentamiento";
import { FiltrosJornadas } from "../components/FiltrosJornadas";

export const JornadasLigaPage = () => {
  const navigate = useNavigate();
  const { id: idLiga } = useParams();
  const { data: liga } = useLigaById(idLiga || "");
  const { data: enfrentamientos } = useEnfrentamientosLiga(liga?.id || "");
  const { user } = useAuth();
  const { data: equiposUsuario } = useGetEquiposUsuario(user?.id || "");

  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [estadoFiltro, setEstadoFiltro] =
    useState<EstadoEnfrentamientoOpcionCualquiera>(
      EstadoEnfrentamientoOpcionCualquiera.Cualquiera
    );

  // 🔹 Cálculo memoizado de enfrentamientos filtrados
  const enfrentamientosFiltrados = useMemo(() => {
    if (!enfrentamientos) return [];

    return enfrentamientos.filter((ex) => {
      const perteneceAUser =
        equiposUsuario?.some((e) => e.id === ex.equipoA.id) ||
        equiposUsuario?.some((e) => e.id === ex.equipoB.id);

      const coincideEstado =
        estadoFiltro === EstadoEnfrentamientoOpcionCualquiera.Cualquiera ||
        ex.estado === estadoFiltro;

      // si mostrarTodos es true, ignora el filtro de equipos
      return (mostrarTodos || perteneceAUser) && coincideEstado;
    });
  }, [enfrentamientos, equiposUsuario, mostrarTodos, estadoFiltro]);

  // 🔹 Handlers de filtros
  const handleFilterEquipos = useCallback(
    (mostrar: boolean) => setMostrarTodos(mostrar),
    []
  );

  const handleFilterEstado = useCallback(
    (estado: EstadoEnfrentamientoOpcionCualquiera) => setEstadoFiltro(estado),
    []
  );

  return (
    <div className="flex flex-col gap-3 pb-20">
      <FiltrosJornadas
        onChangeSoloEquiposUser={handleFilterEquipos}
        onChangeEstado={handleFilterEstado}
      />

      {enfrentamientosFiltrados.length === 0 ? (
        <p className="text-center p-10 text-white">Sin resultados</p>
      ) : (
        enfrentamientosFiltrados.map((enf) => (
          <TarjetaEnfrentamiento
            key={enf.id}
            enfrentamiento={enf}
            onClick={() => navigate("/jornadas/" + enf.id)}
          />
        ))
      )}
    </div>
  );
};
