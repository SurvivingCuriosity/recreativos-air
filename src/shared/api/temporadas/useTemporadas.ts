import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type {
  ActualizarTemporadaBody,
  CrearTemporadaBody,
  TemporadaDTO,
} from "recreativos-air-core/temporada";
import { TemporadasAPI } from "./api";

export const useTemporadas = () => {
  return useQuery<TemporadaDTO[]>({
    queryKey: ["temporadas"],
    queryFn: TemporadasAPI.getTemporadas,
  });
};

export const useTemporadaActual = () => {
  return useQuery<TemporadaDTO | null>({
    queryKey: ["temporadas", "actual"],
    queryFn: TemporadasAPI.getTemporadaActual,
  });
};

export const useTemporada = (id: string) => {
  return useQuery<TemporadaDTO>({
    queryKey: ["temporadas", id],
    queryFn: () => TemporadasAPI.getTemporadaById(id),
    enabled: !!id,
  });
};

export const useCrearTemporada = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CrearTemporadaBody) => TemporadasAPI.crearTemporada(data),
    onSuccess: () => {
      toast.success("Temporada creada correctamente");
      queryClient.invalidateQueries({ queryKey: ["temporadas"] });
      queryClient.invalidateQueries({ queryKey: ["ligas"] });
    },
    onError: () => toast.error("Error al crear la temporada"),
  });
};

export const useActualizarTemporada = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ActualizarTemporadaBody }) =>
      TemporadasAPI.actualizarTemporada(id, data),
    onSuccess: () => {
      toast.success("Temporada actualizada");
      queryClient.invalidateQueries({ queryKey: ["temporadas"] });
      queryClient.invalidateQueries({ queryKey: ["ligas"] });
    },
    onError: () => toast.error("Error al actualizar la temporada"),
  });
};

export const useMarcarTemporadaActual = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TemporadasAPI.marcarActual(id),
    onSuccess: () => {
      toast.success("Temporada marcada como actual");
      queryClient.invalidateQueries({ queryKey: ["temporadas"] });
    },
    onError: () => toast.error("Error al marcar la temporada como actual"),
  });
};

export const useEliminarTemporada = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TemporadasAPI.eliminarTemporada(id),
    onSuccess: () => {
      toast.success("Temporada eliminada");
      queryClient.invalidateQueries({ queryKey: ["temporadas"] });
      queryClient.invalidateQueries({ queryKey: ["ligas"] });
    },
    onError: () => toast.error("Error al eliminar la temporada"),
  });
};
