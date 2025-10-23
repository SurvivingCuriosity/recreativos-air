import { use } from "react";
import toast from "react-hot-toast";
import { Outlet, useParams } from "react-router";
import { EstadoEquipoEnLiga } from "recreativos-air-core/liga";
import { Button } from "../../packages/components/Button/Button";
import { FullPageSpinner } from "../../packages/components/FullPageSpinner/FullPageSpinner";
import { Titulo } from "../../packages/components/Titulo/Titulo";
import { useAuth } from "../../shared/api/auth/useAuth";
import {
  useInscribirEquipo,
  useLigaById,
} from "../../shared/api/ligas/useLigas";
import { SelectorEquipoUsuario } from "../../shared/components/SelectorEquipoUsuario/SelectorEquipoUsuario";
import { ThemeContext } from "../../shared/context/ThemeContext";
import { useWindow } from "../../shared/context/WindowProvider";
import {
  logoFutbolinMap,
  logoFutbolinMapLight,
} from "../../shared/db/logoFutbolinMap";
import { NavDetalleLiga } from "./NavDetalleLiga";

export const DetalleLigaLayout = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { darkMode } = use(ThemeContext);
  const { close, show } = useWindow();

  const { data: liga, isLoading, error } = useLigaById(id!);

  const { mutate: inscribirEquipo, isPending } = useInscribirEquipo();

  const handleClickInscribir = () => {
    if (!liga) {
      toast.error("Error al cargar liga");
      return;
    }
    show(
      <SelectorEquipoUsuario
        onSelect={(equipoId) => {
          inscribirEquipo({
            equipoId,
            ligaId: liga.id,
          });
          close();
        }}
        onCancel={() => close()}
      />
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <FullPageSpinner />
        <p className="text-neutral-400 mt-3">Cargando liga...</p>
      </div>
    );
  }

  if (error || !liga) {
    return (
      <div className="text-center p-10 text-neutral-400">
        <Titulo variant="h2" className="text-primary mb-2">
          Liga no encontrada
        </Titulo>
        <p>No se ha podido cargar la información de esta liga.</p>
      </div>
    );
  }

  // ✅ Determinar si el usuario ya está inscrito
  const userYaInscrito = liga.equipos?.some((e) =>
    e.equipo.jugadores?.some((j) => j.idUsuario === user?.id)
  );

  const equipoUsuario = liga.equipos?.find((e) =>
    e.equipo.jugadores?.some((j) => j.idUsuario === user?.id)
  );

  return (
    <>
      <div className="max-w-screen-sm mx-auto p-4 pt-2 h-full overflow-y-auto relative">
        <div className="flex items-center gap-2 sticky top-0 bg-neutral-950 z-2 pt-2 animate-fade-in-top">
          <img
            src={
              darkMode
                ? logoFutbolinMap[liga.tipoFutbolin]
                : logoFutbolinMapLight[liga.tipoFutbolin]
            }
            alt={liga.nombre}
            className="size-9"
          />
          <h1 className="font-cool text-2xl font-bold text-primary">
            {liga.nombre}
          </h1>
        </div>
        {userYaInscrito ? (
          equipoUsuario?.estado === EstadoEquipoEnLiga.Pendiente && (
            <p className="p-1 bg-neutral-500/20 w-fit rounded text-sm text-primary my-2">
              Esperando confirmación...
            </p>
          )
        ) : (
          <div className="flex justify-center my-4">
            <Button onClick={handleClickInscribir} disabled={isPending}>
              Inscribirme
            </Button>
          </div>
        )}
        <NavDetalleLiga />
        <Outlet />
      </div>
    </>
  );
};
