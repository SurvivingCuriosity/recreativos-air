import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { LigasAPI } from "./api";
import type { CrearLigaBody, LigaDTO } from "recreativos-air-core/liga";

// 🔁 Obtener todas las ligas
export const useLigas = () => {
  return useQuery<LigaDTO[]>({
    queryKey: ["ligas"],
    queryFn: LigasAPI.getLigas,
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
    },
    onError: () => toast.error("Error al actualizar la inscripción"),
  });
};

// 🔄 Cambiar estado liga
export const useCambiarEstadoLiga = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ligaId,
      nuevoEstado,
    }: {
      ligaId: string;
      nuevoEstado: string;
    }) => LigasAPI.cambiarEstado(ligaId, nuevoEstado),
    onSuccess: (_, { ligaId }) => {
      toast.success("Estado de la liga actualizado");
      queryClient.invalidateQueries({ queryKey: ["ligas", ligaId] });
    },
    onError: () => toast.error("Error al cambiar el estado de la liga"),
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
