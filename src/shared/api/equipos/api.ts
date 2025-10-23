import type { CrearEquipoBody, EquipoDTO, InvitacionEquipoBody } from "recreativos-air-core/equipos";
import api from "../http";
import type { ApiResponse } from "../types";

// Crear equipo

export const getAllEquipos = async (): Promise<ApiResponse<EquipoDTO[]>> => {
  const { data } = await api.get<ApiResponse<EquipoDTO[]>>("/equipos");
  return data;
};

export const crearEquipo = async (payload: CrearEquipoBody): Promise<ApiResponse<EquipoDTO>> => {
  const { data } = await api.post<ApiResponse<EquipoDTO>>("/equipos", payload);
  return data;
};

// Obtener equipos del usuario
export const getEquiposUsuario = async (userId: string): Promise<ApiResponse<EquipoDTO[]>> => {
  const { data } = await api.get<ApiResponse<EquipoDTO[]>>(`/equipos/usuario/${userId}`);
  return data;
};

// Aceptar/rechazar invitación
export const responderInvitacion = async (payload: InvitacionEquipoBody): Promise<ApiResponse<null>> => {
  const { data } = await api.patch<ApiResponse<null>>(`/equipos/invitacion`, payload);
  return data;
};

export const getEquipoById = async (id: string): Promise<ApiResponse<EquipoDTO>> => {
  const { data } = await api.get<ApiResponse<EquipoDTO>>(`/equipos/${id}`);
  return data;
};