import { FileDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  EstadoEnfrentamiento,
  EstadoEnfrentamientoConOpcionCualquiera,
} from "recreativos-air-core/enfrentamiento";
import { EstadoLiga } from "recreativos-air-core/liga";
import { toast } from "@/shared/lib/toast";
import { Button } from "../../../packages/components/Button/Button";
import { useAuth } from "../../../shared/api/auth/useAuth";
import { useEnfrentamientosLiga } from "../../../shared/api/enfrentamientos/hooks";
import { useGetEquiposUsuario } from "../../../shared/api/equipos/hooks/useGetEquipos";
import { useLigaById } from "../../../shared/api/ligas/useLigas";
import { useTemporadas } from "../../../shared/api/temporadas/useTemporadas";
import { EstadoVacio, SkeletonLista } from "../../../shared/components/Estados/Estados";
import {
  SIN_JORNADA,
  agruparPorJornada,
  jornadaActual,
} from "../../../shared/lib/jornadas";
import { DialogEditarJornada } from "../components/DialogEditarJornada";
import { FiltrosJornadas } from "../components/FiltrosJornadas";
import { TarjetaJornada } from "../components/TarjetaJornada";
import { exportarCalendarioPdf } from "../pdf/exportarCalendarioPdf";

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
  const { data: temporadas } = useTemporadas();

  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [estadoFiltro, setEstadoFiltro] =
    useState<EstadoEnfrentamientoConOpcionCualquiera>(
      EstadoEnfrentamientoConOpcionCualquiera.Cualquiera
    );
  const [abiertas, setAbiertas] = useState<Set<number>>(new Set());
  const [jornadaEnEdicion, setJornadaEnEdicion] = useState<number | null>(null);
  const [exportando, setExportando] = useState(false);
  const inicializadas = useRef(false);

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

  const grupos = useMemo(
    () => agruparPorJornada(liga, enfrentamientos ?? [], enfrentamientosFiltrados),
    [liga, enfrentamientos, enfrentamientosFiltrados]
  );

  // Abierta por defecto: la jornada en curso; si no, la primera con pendientes; si no, la última
  useEffect(() => {
    if (inicializadas.current || !liga || !enfrentamientos?.length) return;
    inicializadas.current = true;

    const numeros = [...new Set(enfrentamientos.map((e) => e.jornada ?? SIN_JORNADA))];
    const actual = jornadaActual(liga.jornadas);
    const pendiente = enfrentamientos
      .filter((e) => e.estado !== EstadoEnfrentamiento.Jugado && e.jornada !== null)
      .map((e) => e.jornada!)
      .sort((a, b) => a - b)[0];
    const ultima = Math.max(...numeros);
    const soloSinJornada = numeros.length === 1 && numeros[0] === SIN_JORNADA;

    setAbiertas(new Set([soloSinJornada ? SIN_JORNADA : (actual ?? pendiente ?? ultima)]));
  }, [liga, enfrentamientos]);

  const toggleAbierta = (numero: number, open: boolean) =>
    setAbiertas((prev) => {
      const next = new Set(prev);
      if (open) next.add(numero);
      else next.delete(numero);
      return next;
    });

  const handleExportar = async () => {
    if (!liga || !enfrentamientos?.length) return toast.error("No hay enfrentamientos");
    setExportando(true);
    try {
      await exportarCalendarioPdf({
        liga,
        temporadaNombre: temporadas?.find((t) => t.id === liga.temporada)?.nombre,
        enfrentamientos,
      });
    } catch {
      toast.error("No se pudo generar el PDF");
    } finally {
      setExportando(false);
    }
  };

  if (liga?.estadoLiga === EstadoLiga.SinEmpezar && !user?.admin)
    return (
      <EstadoVacio className="border-0 bg-transparent py-10">La liga no ha comenzado</EstadoVacio>
    );

  // §6.13: no mostrar el vacío mientras carga (placeholderData = [])
  const cargando = (isPlaceholderData && isFetching) || cargandoEquipos;
  const jornadaEditando = liga?.jornadas.find((j) => j.numero === jornadaEnEdicion) ?? null;

  return (
    <div className="flex flex-col gap-3">
      <FiltrosJornadas
        mostrarTodos={mostrarTodos}
        onChangeMostrarTodos={setMostrarTodos}
        estado={estadoFiltro}
        onChangeEstado={setEstadoFiltro}
      />

      {liga && liga.estadoLiga !== EstadoLiga.SinEmpezar && (
        <Button
          icon={FileDown}
          variant="outline-neutral"
          onClick={handleExportar}
          disabled={exportando || !enfrentamientos?.length}
        >
          {exportando ? "Generando PDF..." : "Exportar calendario en PDF"}
        </Button>
      )}

      {cargando ? (
        <SkeletonLista count={3} height="h-[118px]" label="Cargando jornadas..." />
      ) : grupos.length === 0 ? (
        <EstadoVacio className="border-0 bg-transparent py-10">Sin resultados</EstadoVacio>
      ) : (
        <ul className="flex flex-col gap-3">
          {grupos.map((grupo) => (
            <li key={grupo.numero}>
              <TarjetaJornada
                grupo={grupo}
                cfgLiga={liga?.configuracion}
                open={abiertas.has(grupo.numero)}
                onOpenChange={(open) => toggleAbierta(grupo.numero, open)}
                onEditar={user?.admin ? () => setJornadaEnEdicion(grupo.numero) : undefined}
                onClickEnfrentamiento={(id) => navigate("/enfrentamientos/" + id)}
              />
            </li>
          ))}
        </ul>
      )}

      {liga && user?.admin && (
        <DialogEditarJornada
          ligaId={liga.id}
          jornada={jornadaEditando}
          onClose={() => setJornadaEnEdicion(null)}
        />
      )}
    </div>
  );
};
