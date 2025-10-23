import { useParams } from "react-router";
import {
  useClasificacionLiga,
  useLigaById,
} from "../../../shared/api/ligas/useLigas";
import { TablaClasificacionLiga } from "../components/ClasificacionLiga";
import { EstadoLiga } from "recreativos-air-core/liga";
import { useAuth } from "../../../shared/api/auth/useAuth";

export const ClasificacionLigaPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: clasificacion, isLoading } = useClasificacionLiga(id!);
  const { data: liga } = useLigaById(id!);
  const { user } = useAuth();

  if (isLoading)
    return (
      <p className="text-neutral-500 p-10 text-center">
        Cargando clasificación...
      </p>
    );

  if (!clasificacion?.length)
    return (
      <p className="text-center p-10">No hay equipos para la clasificación</p>
    );

  if (liga?.estadoLiga === EstadoLiga.SinEmpezar && !user?.admin)
    return (
      <p className="text-center p-10 text-neutral-500">
        La liga no ha comenzado
      </p>
    );

  return (
    <div className="animate-fade-in-top">
      <TablaClasificacionLiga data={clasificacion} />
    </div>
  );
};
