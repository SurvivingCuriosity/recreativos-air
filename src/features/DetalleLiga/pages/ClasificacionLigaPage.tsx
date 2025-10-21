import { useParams } from "react-router";
import { useClasificacionLiga } from "../../../shared/api/ligas/useLigas";
import { TablaClasificacionLiga } from "../components/ClasificacionLiga";

export const ClasificacionLigaPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: clasificacion, isLoading } = useClasificacionLiga(id!);

  if (isLoading) return <p className="text-neutral-500 p-10 text-center">Cargando clasificación...</p>

  if (!clasificacion?.length)
    return <p className="text-center p-10">Sin datos de clasificación</p>;

  return (
    <div className="animate-fade-in-top">
      <TablaClasificacionLiga data={clasificacion} />
    </div>
  );
};
