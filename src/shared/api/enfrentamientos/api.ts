
import type { EnfrentamientoDTO } from "recreativos-air-core/enfrentamiento";
import api from "../http";


export const EnfrentamientosAPI = {
  async getPendientesAdmin(): Promise<EnfrentamientoDTO[]> {
    const res = await api.get(`/enfrentamientos/pendientes-admin`);
    return res.data.data;
  },

  async getPorLiga(ligaId: string): Promise<EnfrentamientoDTO[]> {
    const res = await api.get(`/enfrentamientos/liga/${ligaId}`);
    return res.data.data
  },

  async getEnfrentamiento(id: string): Promise<EnfrentamientoDTO> {
    const res = await api.get(`/enfrentamientos/${id}`);
    return res.data.data
  },

  async proponerResultado(payload: {
    partidos: { golesA: number; golesB: number }[];
    equipoId: string;
    enfrentamientoId: string;
  }): Promise<EnfrentamientoDTO> {
    const res = await api.post(
      `/enfrentamientos/${payload.enfrentamientoId}/proponer`,
      payload
    );
    return res.data.data;
  },

  async aceptarResultado(data: {
    enfrentamientoId: string;
    equipoId: string;
  }): Promise<EnfrentamientoDTO> {
    const res = await api.post(
      `/enfrentamientos/${data.enfrentamientoId}/aceptar`,
      data
    );
    return res.data.data;
  },

  async rechazarResultado(data: {
    enfrentamientoId: string;
    equipoId: string;
  }): Promise<EnfrentamientoDTO> {
    const res = await api.post(
      `/enfrentamientos/${data.enfrentamientoId}/rechazar`,
      data
    );
    return res.data.data;
  },

  async confirmarResultadoAdmin(data: {
    enfrentamientoId: string;
  }): Promise<EnfrentamientoDTO> {
    const res = await api.post(
      `/enfrentamientos/${data.enfrentamientoId}/confirmar-admin`,
      data
    );
    return res.data.data;
  },

    async rechazarResultadoAdmin(data: {
    enfrentamientoId: string;
  }): Promise<EnfrentamientoDTO> {
    const res = await api.post(
      `/enfrentamientos/${data.enfrentamientoId}/rechazar-admin`,
      data
    );
    return res.data.data;
  },
};
