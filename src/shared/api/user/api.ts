import api from "../http";
import type { UserDTO } from "recreativos-air-core/user";

export const UserApi = {
  async getUserById(id: string): Promise<UserDTO> {
    const res = await api.get(`/users/${id}`);
    return res.data.data;
  },
};
