import { useParams } from "react-router";
import {
  useClasificacionLiga,
  useLigaById,
} from "../../../shared/api/ligas/useLigas";
import { TablaClasificacionLiga } from "../components/ClasificacionLiga";
import { EstadoLiga } from "recreativos-air-core/liga";
import { useAuth } from "../../../shared/api/auth/useAuth";
import { PosicionUsuarioChip } from "../../../shared/components/TarjetaLiga/PosicionUsuarioChip";

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

  const equipoUsuario = liga?.equipos?.find((e) =>
    e.equipo?.jugadores?.some((j) => j.idUsuario === user?.id)
  );

  return (
    <div className="animate-fade-in-top">
      {liga?.estadoLiga === EstadoLiga.Finalizada && equipoUsuario && (
        <div className="flex justify-center my-3">
          <PosicionUsuarioChip
            ligaId={liga.id}
            equipoId={equipoUsuario.equipo.id}
            finalizada
          />
        </div>
      )}
      <TablaClasificacionLiga data={clasificacion} />
    </div>
  );
};
