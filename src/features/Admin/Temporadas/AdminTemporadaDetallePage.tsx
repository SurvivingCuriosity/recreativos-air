import { Star, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../../../packages/components/Button/Button";
import { useLigas } from "../../../shared/api/ligas/useLigas";
import {
  useActualizarTemporada,
  useEliminarTemporada,
  useMarcarTemporadaActual,
  useTemporada,
} from "../../../shared/api/temporadas/useTemporadas";
import { ChipEstado } from "../../../shared/components/ChipEstado/ChipEstado";
import { EstadoVacio, SkeletonLista } from "../../../shared/components/Estados/Estados";
import { PageTitle } from "../../../shared/components/Titulos/Titulos";
import { useConfirmDialog } from "../../../shared/context/UIProvider/hooks/useUI";
import { TemporadaForm } from "./TemporadaForm";

export const AdminTemporadaDetallePage = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { confirm } = useConfirmDialog();

  const { data: temporada, isLoading } = useTemporada(id);
  const { data: ligas } = useLigas();
  const { mutate: actualizar, isPending } = useActualizarTemporada();
  const { mutate: marcarActual, isPending: marcando } = useMarcarTemporadaActual();
  const { mutate: eliminar, isPending: eliminando } = useEliminarTemporada();

  const handleEliminar = async () => {
    const numLigas = ligas?.filter((l) => l.temporada === id).length ?? 0;
    const ok = await confirm({
      title: "Eliminar temporada",
      description: `Se eliminará "${temporada?.nombre}". ${numLigas} liga(s) quedarán sin temporada.`,
      confirmText: "Eliminar",
    });
    if (ok) eliminar(id, { onSuccess: () => navigate("/admin-temporadas") });
  };

  if (isLoading || !ligas)
    return (
      <main className="mx-auto w-full max-w-screen-sm px-4 pt-[18px]">
        <SkeletonLista count={4} height="h-12" label="Cargando temporada..." />
      </main>
    );

  if (!temporada)
    return (
      <main className="mx-auto w-full max-w-screen-sm px-4 pt-10">
        <EstadoVacio className="border-0 bg-transparent">Temporada no encontrada</EstadoVacio>
      </main>
    );

  return (
    <main className="mx-auto flex w-full max-w-screen-sm flex-col gap-4 px-4 pt-[18px] pb-5">
      <title>{temporada.nombre} | Recreativos Air</title>
      <div className="flex items-center gap-3">
        <PageTitle color="primary" className="truncate">
          {temporada.nombre}
        </PageTitle>
        {temporada.actual && <ChipEstado color="success">Actual</ChipEstado>}
      </div>

      <TemporadaForm
        key={temporada.id}
        initial={temporada}
        isPending={isPending}
        submitLabel="Guardar cambios"
        onSubmit={(data) => actualizar({ id, data })}
      />

      <div className="mt-2 flex gap-2">
        <Button
          variant="outline"
          icon={Star}
          disabled={temporada.actual || marcando}
          onClick={() => marcarActual(id)}
          className="flex-1"
        >
          {temporada.actual ? "Es la actual" : "Marcar como actual"}
        </Button>
        <Button
          variant="outline-danger"
          icon={Trash2}
          disabled={eliminando}
          onClick={handleEliminar}
          className="flex-1"
        >
          Eliminar
        </Button>
      </div>
    </main>
  );
};
