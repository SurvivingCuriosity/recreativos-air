import type {
  ActualizarTemporadaBody,
  CrearTemporadaBody,
  TemporadaDTO,
} from "recreativos-air-core/temporada";
import api from "../http";

export const TemporadasAPI = {
  async getTemporadas(): Promise<TemporadaDTO[]> {
    const res = await api.get("/temporadas");
    return res.data.data;
  },

  async getTemporadaActual(): Promise<TemporadaDTO | null> {
    const res = await api.get("/temporadas/actual");
    return res.data.data;
  },

  async getTemporadaById(id: string): Promise<TemporadaDTO> {
    const res = await api.get(`/temporadas/${id}`);
    return res.data.data;
  },

  async crearTemporada(data: CrearTemporadaBody): Promise<TemporadaDTO> {
    const res = await api.post("/temporadas", data);
    return res.data.data;
  },

  async actualizarTemporada(
    id: string,
    data: ActualizarTemporadaBody
  ): Promise<TemporadaDTO> {
    const res = await api.put(`/temporadas/${id}`, data);
    return res.data.data;
  },

  async marcarActual(id: string): Promise<TemporadaDTO> {
    const res = await api.patch(`/temporadas/${id}/actual`);
    return res.data.data;
  },

  async eliminarTemporada(id: string): Promise<TemporadaDTO> {
    const res = await api.delete(`/temporadas/${id}`);
    return res.data.data;
  },
};
