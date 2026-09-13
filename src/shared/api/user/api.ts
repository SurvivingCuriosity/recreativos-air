import type { UpdateUserBody, UserDTO } from "recreativos-air-core/user";
import api from "../http";

export const UserApi = {
  async getAll(): Promise<UserDTO[]> {
    const res = await api.get(`/users`);
    return res.data.data;
  },

  async updateMe(data: UpdateUserBody): Promise<UserDTO> {
    const res = await api.put(`/users/me`, data);
    return res.data.data;
  },

  async getUserById(id: string): Promise<UserDTO> {
    const res = await api.get(`/users/${id}`);
    return res.data.data;
  },
};
