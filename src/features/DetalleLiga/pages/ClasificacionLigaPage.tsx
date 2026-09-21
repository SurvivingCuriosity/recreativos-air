import { useParams } from "react-router";
import { EstadoLiga } from "recreativos-air-core/liga";
import { useAuth } from "../../../shared/api/auth/useAuth";
import {
  useClasificacionLiga,
  useLigaById,
} from "../../../shared/api/ligas/useLigas";
import { EstadoVacio, SkeletonLista } from "../../../shared/components/Estados/Estados";
import { PosicionUsuarioChip } from "../../../shared/components/TarjetaLiga/PosicionUsuarioChip";
import { TablaClasificacionLiga } from "../components/ClasificacionLiga";

export const ClasificacionLigaPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: clasificacion, isLoading } = useClasificacionLiga(id!);
  const { data: liga } = useLigaById(id!);
  const { user } = useAuth();

  if (isLoading)
    return <SkeletonLista count={1} height="h-56" label="Cargando clasificación..." />;

  if (!clasificacion?.length)
    return (
      <EstadoVacio className="border-0 bg-transparent py-10">
        No hay equipos para la clasificación
      </EstadoVacio>
    );

  if (liga?.estadoLiga === EstadoLiga.SinEmpezar && !user?.admin)
    return (
      <EstadoVacio className="border-0 bg-transparent py-10">La liga no ha comenzado</EstadoVacio>
    );

  const equipoUsuario = liga?.equipos?.find((e) =>
    e.equipo?.jugadores?.some((j) => j.idUsuario === user?.id)
  );

  return (
    <div className="flex animate-fade-in-top flex-col gap-3">
      {liga?.estadoLiga === EstadoLiga.Finalizada && equipoUsuario && (
        <div className="flex justify-center lg:hidden">
          <PosicionUsuarioChip
            ligaId={liga.id}
            equipoId={equipoUsuario.equipo.id}
            finalizada
          />
        </div>
      )}
      <TablaClasificacionLiga data={clasificacion} miEquipoId={equipoUsuario?.equipo?.id} />
    </div>
  );
};
