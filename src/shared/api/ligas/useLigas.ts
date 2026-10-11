import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/shared/lib/toast";
import type {
  ActualizarJornadaBody,
  ActualizarLigaBody,
  CambiarEstadoLigaBody,
  CrearLigaBody,
  GetLigasQuery,
  LigaDTO,
  RecalcularJornadasBody,
} from "recreativos-air-core/liga";
import { LigasAPI } from "./api";

type ErrorConMensaje = { response?: { data?: { message?: string } } };
const mensajeError = (e: ErrorConMensaje, fallback: string) =>
  e?.response?.data?.message || fallback;

// 🔁 Obtener todas las ligas
export const useLigas = (
  filtro?: GetLigasQuery,
  options: { enabled?: boolean } = {}
) => {
  return useQuery<LigaDTO[]>({
    queryKey: filtro?.temporada ? ["ligas", filtro] : ["ligas"],
    queryFn: () => LigasAPI.getLigas(filtro),
    ...options,
  });
};

// 🔍 Obtener una liga específica
export const useLiga = (id: string) => {
  return useQuery<LigaDTO>({
    queryKey: ["ligas", id],
    queryFn: () => LigasAPI.getLigaById(id),
    enabled: !!id,
  });
};

// 🏗 Crear liga
export const useCrearLiga = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CrearLigaBody) => LigasAPI.crearLiga(data),
    onSuccess: () => {
      toast.success("Liga creada correctamente");
      queryClient.invalidateQueries({ queryKey: ["ligas"] });
    },
    onError: () => {
      toast.error("Error al crear la liga");
    },
  });
};

export const useActualizarLiga = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ligaId, data }: { ligaId: string; data: ActualizarLigaBody }) =>
      LigasAPI.actualizarLiga(ligaId, data),
    onSuccess: () => {
      toast.success("Liga actualizada");
      queryClient.invalidateQueries({ queryKey: ["ligas"] });
    },
    onError: () => toast.error("Error al actualizar la liga"),
  });
};

export const useEliminarLiga = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ligaId: string) => LigasAPI.eliminarLiga(ligaId),
    onSuccess: () => {
      toast.success("Liga eliminada");
      queryClient.invalidateQueries({ queryKey: ["ligas"] });
    },
    onError: () => toast.error("Error al eliminar la liga"),
  });
};

// 🏅 Inscribir equipo
export const useInscribirEquipo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ligaId, equipoId }: { ligaId: string; equipoId: string }) =>
      LigasAPI.inscribirEquipo(ligaId, equipoId),
    onSuccess: (_, { ligaId }) => {
      toast.success("Equipo inscrito correctamente");
      queryClient.invalidateQueries({ queryKey: ["ligas", ligaId] });
      queryClient.invalidateQueries({ queryKey: ["ligas"] });
    },
    onError: () => toast.error("No se pudo inscribir el equipo"),
  });
};

// ✅ Aprobar inscripción
export const useAprobarInscripcion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ligaId,
      equipoId,
      aprobar,
    }: {
      ligaId: string;
      equipoId: string;
      aprobar: boolean;
    }) => LigasAPI.aprobarInscripcion(ligaId, equipoId, aprobar),
    onSuccess: (_, { ligaId }) => {
      toast.success("Inscripción actualizada");
      queryClient.invalidateQueries({ queryKey: ["ligas", ligaId] });
      queryClient.invalidateQueries({ queryKey: ["enfrentamientosliga", ligaId] });
    },
    onError: () => toast.error("Error al actualizar la inscripción"),
  });
};

// 🔄 Cambiar estado liga
export const useCambiarEstadoLiga = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ligaId, data }: { ligaId: string; data: CambiarEstadoLigaBody }) =>
      LigasAPI.cambiarEstado(ligaId, data),
    onSuccess: (_, { ligaId }) => {
      toast.success("Estado de la liga actualizado");
      queryClient.invalidateQueries({ queryKey: ["ligas", ligaId] });
      queryClient.invalidateQueries({ queryKey: ["enfrentamientosliga", ligaId] });
      queryClient.invalidateQueries({ queryKey: ["clasificacion", ligaId] });
    },
    onError: (e: ErrorConMensaje) =>
      toast.error(mensajeError(e, "Error al cambiar el estado de la liga")),
  });
};

export const useActualizarJornada = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ligaId,
      numero,
      data,
    }: {
      ligaId: string;
      numero: number;
      data: ActualizarJornadaBody;
    }) => LigasAPI.actualizarJornada(ligaId, numero, data),
    onSuccess: (_, { ligaId }) => {
      toast.success("Jornada actualizada");
      queryClient.invalidateQueries({ queryKey: ["ligas", ligaId] });
    },
    onError: (e: ErrorConMensaje) =>
      toast.error(mensajeError(e, "Error al actualizar la jornada")),
  });
};

export const useRecalcularJornadas = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ligaId, data }: { ligaId: string; data: RecalcularJornadasBody }) =>
      LigasAPI.recalcularJornadas(ligaId, data),
    onSuccess: (_, { ligaId }) => {
      toast.success("Fechas de jornadas recalculadas");
      queryClient.invalidateQueries({ queryKey: ["ligas", ligaId] });
      queryClient.invalidateQueries({ queryKey: ["enfrentamientosliga", ligaId] });
    },
    onError: (e: ErrorConMensaje) =>
      toast.error(mensajeError(e, "Error al recalcular las jornadas")),
  });
};

export const useEliminarEquipoDeLiga = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ligaId, equipoId }: { ligaId: string; equipoId: string }) =>
      LigasAPI.eliminarEquipoLiga(ligaId, equipoId),
    onSuccess: (_, { ligaId }) => {
      toast.success("Equipo eliminado correctamente");
      queryClient.invalidateQueries({ queryKey: ["ligas", ligaId] });
      queryClient.invalidateQueries({ queryKey: ["enfrentamientosliga", ligaId] });
    },
    onError: () => toast.error("Error al eliminar el equipo de la liga"),
  });
};

// 💰 Marcar pagado
export const useMarcarPagado = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ligaId, equipoId }: { ligaId: string; equipoId: string }) =>
      LigasAPI.marcarPagado(ligaId, equipoId),
    onSuccess: (_, { ligaId }) => {
      toast.success("Equipo marcado como pagado");
      queryClient.invalidateQueries({ queryKey: ["ligas", ligaId] });
    },
    onError: () => toast.error("Error al marcar como pagado"),
  });
};

export const useLigaById = (id: string, options = {}) => {
  return useQuery({
    queryKey: ["ligas", id],
    queryFn: () => LigasAPI.getLigaById(id),
    ...options,
  });
};

export const useGetEquiposLiga = (ligaId: string) => {
  return useQuery({
    queryKey: ["ligas", ligaId, "equipos"],
    queryFn: () => LigasAPI.obtenerEquipos(ligaId),
    enabled: !!ligaId,
  });
};

export const useClasificacionLiga = (ligaId: string) =>
  useQuery({
    queryKey: ["clasificacion", ligaId],
    queryFn: () => LigasAPI.getClasificacion(ligaId),
    enabled: !!ligaId,
  });
