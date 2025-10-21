import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { responderInvitacion } from "../api";

export const useResponderInvitacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: responderInvitacion,
    onSuccess: () => {
      toast.success("Invitación actualizada");
      queryClient.invalidateQueries({ queryKey: ["equipos"] });
    },
    onError: () => toast.error("Error al actualizar invitación"),

  });
};
