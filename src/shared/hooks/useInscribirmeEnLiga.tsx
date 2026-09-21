import type { LigaDTO } from "recreativos-air-core/liga";
import { toast } from "@/shared/lib/toast";
import { useAuth } from "../api/auth/useAuth";
import { useGetEquiposUsuario } from "../api/equipos/hooks/useGetEquipos";
import { useInscribirEquipo } from "../api/ligas/useLigas";
import { SelectorEquipoUsuario } from "../components/SelectorEquipoUsuario/SelectorEquipoUsuario";
import { useConfirmDialog } from "../context/UIProvider/hooks/useUI";
import { useWindow } from "../context/WindowProvider";

/**
 * Flujo «Inscribirme» compartido por TarjetaLiga y el detalle de liga (DESIGN.md §6.9):
 * con un solo equipo se salta el selector y se confirma «¿Inscribir a {equipo}?»;
 * si hay varios, se abre el Dialog «Elige un equipo».
 */
export const useInscribirmeEnLiga = (liga?: LigaDTO) => {
  const { user } = useAuth();
  const { close, show } = useWindow();
  const { confirm } = useConfirmDialog();
  const { data: equiposUsuario } = useGetEquiposUsuario(user?.id || "");
  const { mutate: inscribirEquipo, isPending } = useInscribirEquipo();

  const inscribirme = async () => {
    if (!liga) {
      toast.error("Error al cargar liga");
      return;
    }
    if (equiposUsuario?.length === 1) {
      const equipo = equiposUsuario[0];
      const ok = await confirm({
        title: `¿Inscribir a ${equipo.nombre}?`,
        description: `Se inscribirá a ${equipo.nombre} en ${liga.nombre}.`,
        confirmText: "Inscribirme",
        variant: "default",
      });
      if (ok) inscribirEquipo({ equipoId: equipo.id, ligaId: liga.id });
      return;
    }
    show(
      <SelectorEquipoUsuario
        onSelect={(equipoId) => {
          inscribirEquipo({ equipoId, ligaId: liga.id });
          close();
        }}
        onCancel={() => close()}
      />,
      "Elige un equipo"
    );
  };

  return { inscribirme, isPending };
};
