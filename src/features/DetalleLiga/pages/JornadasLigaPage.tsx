import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { EstadoEnfrentamientoConOpcionCualquiera } from "recreativos-air-core/enfrentamiento";
import { EstadoLiga } from "recreativos-air-core/liga";
import { useAuth } from "../../../shared/api/auth/useAuth";
import { useEnfrentamientosLiga } from "../../../shared/api/enfrentamientos/hooks";
import { useGetEquiposUsuario } from "../../../shared/api/equipos/hooks/useGetEquipos";
import { useLigaById } from "../../../shared/api/ligas/useLigas";
import { EstadoVacio, SkeletonLista } from "../../../shared/components/Estados/Estados";
import { TarjetaEnfrentamiento } from "../../../shared/components/TarjetaEnfrentamiento/TarjetaEnfrentamiento";
import { FiltrosJornadas } from "../components/FiltrosJornadas";

export const JornadasLigaPage = () => {
  const navigate = useNavigate();
  const { id: idLiga } = useParams();
  const { data: liga } = useLigaById(idLiga || "");
  const {
    data: enfrentamientos,
    isPlaceholderData,
    isFetching,
  } = useEnfrentamientosLiga(liga?.id || "");
  const { user } = useAuth();
  const { data: equiposUsuario, isLoading: cargandoEquipos } = useGetEquiposUsuario(
    user?.id || ""
  );

  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [estadoFiltro, setEstadoFiltro] =
    useState<EstadoEnfrentamientoConOpcionCualquiera>(
      EstadoEnfrentamientoConOpcionCualquiera.Cualquiera
    );

  const enfrentamientosFiltrados = useMemo(() => {
    if (!enfrentamientos) return [];

    return enfrentamientos.filter((ex) => {
      const perteneceAUser =
        equiposUsuario?.some((e) => e.id === ex.equipoA.id) ||
        equiposUsuario?.some((e) => e.id === ex.equipoB.id);

      const coincideEstado =
        estadoFiltro === EstadoEnfrentamientoConOpcionCualquiera.Cualquiera ||
        ex.estado === (estadoFiltro as unknown as typeof ex.estado);

      return (mostrarTodos || perteneceAUser) && coincideEstado;
    });
  }, [enfrentamientos, equiposUsuario, mostrarTodos, estadoFiltro]);

  if (liga?.estadoLiga === EstadoLiga.SinEmpezar && !user?.admin)
    return (
      <EstadoVacio className="border-0 bg-transparent py-10">La liga no ha comenzado</EstadoVacio>
    );

  // §6.13: no mostrar el vacío mientras carga (placeholderData = [])
  const cargando = (isPlaceholderData && isFetching) || cargandoEquipos;

  return (
    <div className="flex flex-col gap-3">
      <FiltrosJornadas
        mostrarTodos={mostrarTodos}
        onChangeMostrarTodos={setMostrarTodos}
        estado={estadoFiltro}
        onChangeEstado={setEstadoFiltro}
      />

      {cargando ? (
        <SkeletonLista count={3} height="h-[118px]" label="Cargando jornadas..." />
      ) : enfrentamientosFiltrados.length === 0 ? (
        <EstadoVacio className="border-0 bg-transparent py-10">Sin resultados</EstadoVacio>
      ) : (
        <ul className="flex flex-col gap-3">
          {enfrentamientosFiltrados.map((enf) => (
            <li key={enf.id}>
              <TarjetaEnfrentamiento
                enfrentamiento={enf}
                onClick={() => navigate("/jornadas/" + enf.id)}
                cfgLiga={liga?.configuracion}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
