import { faStar, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router";
import { Button } from "../../../packages/components/Button/Button";
import { Titulo } from "../../../packages/components/Titulo/Titulo";
import { useLigas } from "../../../shared/api/ligas/useLigas";
import {
  useActualizarTemporada,
  useEliminarTemporada,
  useMarcarTemporadaActual,
  useTemporada,
} from "../../../shared/api/temporadas/useTemporadas";
import { useConfirmDialog } from "../../../shared/context/UIProvider/hooks/useUI";
import { TemporadaForm } from "./TemporadaForm";

export const AdminTemporadaDetallePage = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { confirm } = useConfirmDialog();

  const { data: temporada, isLoading } = useTemporada(id);
  const { data: ligas } = useLigas();
  const { mutate: actualizar, isPending } = useActualizarTemporada();
  const { mutate: marcarActual, isPending: marcando } =
    useMarcarTemporadaActual();
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
      <p className="text-center text-neutral-400 p-6 animate-pulse">
        Cargando temporada...
      </p>
    );

  if (!temporada)
    return (
      <p className="text-center text-neutral-500 mt-10">
        Temporada no encontrada
      </p>
    );

  return (
    <div className="max-w-screen-sm mx-auto p-4 w-full">
      <title>{temporada.nombre} | Recreativos Air</title>
      <div className="flex items-center gap-3 mb-4">
        <Titulo variant="h1">{temporada.nombre}</Titulo>
        {temporada.actual && (
          <p className="px-1 text-green-400 bg-green-500/20 text-xs rounded-md">
            Actual
          </p>
        )}
      </div>

      <TemporadaForm
        key={temporada.id}
        initial={temporada}
        isPending={isPending}
        submitLabel="Guardar cambios"
        onSubmit={(data) => actualizar({ id, data })}
      />

      <div className="flex gap-2 mt-6">
        <Button
          variant="outline"
          icon={faStar}
          disabled={temporada.actual || marcando}
          onClick={() => marcarActual(id)}
        >
          {temporada.actual ? "Es la actual" : "Marcar como actual"}
        </Button>
        <Button
          variant="outline-danger"
          icon={faTrash}
          disabled={eliminando}
          onClick={handleEliminar}
        >
          Eliminar
        </Button>
      </div>
    </div>
  );
};
