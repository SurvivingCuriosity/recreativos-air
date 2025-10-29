import type { EquipoDTO } from "recreativos-air-core/equipos";
import type { CrearLigaBody, LigaDTO } from "recreativos-air-core/liga";
import type { TableRow } from "../../../features/DetalleLiga/components/ClasificacionLiga";
import api from "../http";

export const LigasAPI = {
  async crearLiga(data: CrearLigaBody): Promise<LigaDTO> {
    const res = await api.post("/ligas", data);
    return res.data.data;
  },

  async getLigas(): Promise<LigaDTO[]> {
    const res = await api.get("/ligas");
    return res.data.data;
  },

  async getLigaById(id: string): Promise<LigaDTO> {
    const res = await api.get(`/ligas/${id}`);
    return res.data.data;
  },

  async inscribirEquipo(ligaId: string, equipoId: string): Promise<LigaDTO> {
    const res = await api.post(`/ligas/${ligaId}/inscribir`, { equipoId });
    return res.data.data;
  },

  async aprobarInscripcion(
    ligaId: string,
    equipoId: string,
    aprobar: boolean
  ): Promise<LigaDTO> {
    const res = await api.patch(`/ligas/${ligaId}/equipo/${equipoId}`, {
      aprobar,
    });
    return res.data.data;
  },

  async eliminarEquipoLiga(
    ligaId: string,
    equipoId: string,
  ): Promise<LigaDTO> {
    const res = await api.delete(`/ligas/${ligaId}/equipo/${equipoId}`);
    return res.data.data;
  },

  async cambiarEstado(ligaId: string, nuevoEstado: string): Promise<LigaDTO> {
    const res = await api.patch(`/ligas/${ligaId}/estado`, { nuevoEstado });
    return res.data.data;
  },

  async marcarPagado(ligaId: string, equipoId: string): Promise<LigaDTO> {
    const res = await api.patch(`/ligas/${ligaId}/equipo/${equipoId}/pagado`);
    return res.data.data;
  },

  async obtenerEquipos(ligaId: string): Promise<EquipoDTO[]> {
    const res = await api.get(`/ligas/${ligaId}/equipos`);
    return res.data.data;
  },

  async getClasificacion(ligaId: string): Promise<TableRow[]> {
    const res = await api.get(`/ligas/${ligaId}/clasificacion`);
    return res.data.data;
  },
};
