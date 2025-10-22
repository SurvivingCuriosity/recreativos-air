import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { type EnfrentamientoDTO } from "recreativos-air-core/enfrentamiento";
import { EnfrentamientosAPI } from "./api";

export const useEnfrentamientosLiga = (ligaId: string) => {
  return useQuery<EnfrentamientoDTO[]>({
    placeholderData: [],
    queryKey: ["enfrentamientosliga", ligaId],
    queryFn: () => EnfrentamientosAPI.getPorLiga(ligaId),
    enabled: !!ligaId,
  });
};

export const useEnfrentamientoById = (id: string) => {
  return useQuery<EnfrentamientoDTO>({
    queryKey: ["enfrentamientos", id],
    queryFn: () => EnfrentamientosAPI.getEnfrentamiento(id),
    enabled: !!id,
  });
};

export const useProponerResultado = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: EnfrentamientosAPI.proponerResultado,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ligas"] }),
    onError: (error) => toast.error("Ups..." + String(error)),
  });
};

export const useAceptarResultado = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: EnfrentamientosAPI.aceptarResultado,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ligas"] }),
  });
};

export const useRechazarResultado = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: EnfrentamientosAPI.rechazarResultado,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ligas"] }),
  });
};

export const useConfirmarResultadoAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: EnfrentamientosAPI.confirmarResultadoAdmin,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ligas"] });
    },
  });
};

export const useRechazarResultadoAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: EnfrentamientosAPI.rechazarResultadoAdmin,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ligas"] });
    },
  });
};
