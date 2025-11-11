import { use } from "react";
import toast from "react-hot-toast";
import { Button } from "../../../packages/components/Button/Button";
import { useAuth } from "../../api/auth/useAuth";
import { useInscribirEquipo } from "../../api/ligas/useLigas";
import { ThemeContext } from "../../context/ThemeContext";
import { useWindow } from "../../context/WindowProvider";
import {
  fondoFutbolinMap,
  fondoFutbolinMapLight,
} from "../../db/fondoFutbolinMap";
import {
  logoFutbolinMap,
  logoFutbolinMapLight,
} from "../../db/logoFutbolinMap";
import { useIsInscritoALiga } from "../../hooks/useIsInscritoALiga";
import { SelectorEquipoUsuario } from "../SelectorEquipoUsuario/SelectorEquipoUsuario";
import {
  EstadoEquipoEnLiga,
  EstadoLiga,
  type LigaDTO,
} from "recreativos-air-core/liga";
import { useNavigate } from "react-router";

export interface TarjetaLigaProps {
  liga: LigaDTO;
  onClick?: () => void;
}

export const TarjetaLiga = ({ liga, onClick }: TarjetaLigaProps) => {
  const { darkMode } = use(ThemeContext);
  const { user, isLoggedIn } = useAuth();
  const { close, show } = useWindow();
  const navigate = useNavigate()

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
      />,
      "Elige un equipo"
    );
  };

  const estaInscrito = useIsInscritoALiga(liga);
  const equipoUsuario = liga.equipos?.find((e) =>
    e.equipo?.jugadores?.some((j) => j.idUsuario === user?.id)
  );
  const pendienteDeAceptar =
    equipoUsuario?.estado === EstadoEquipoEnLiga.Pendiente;

  const { mutate: inscribirEquipo } = useInscribirEquipo();

  return (
    <>
      <div
        onClick={onClick}
        className="max-w-80 h-full hover:border-neutral-700 shrink-0 justify-between border overflow-hidden md:p-4 p-1.5 relative bg-neutral-900 rounded-lg border-neutral-800 z-0"
      >
        <div className="relative z-2 flex flex-col justify-between h-full gap-1">
          <div className="flex items-center gap-2">
            <img
              src={
                darkMode
                  ? logoFutbolinMap[liga.tipoFutbolin]
                  : logoFutbolinMapLight[liga.tipoFutbolin]
              }
              alt={liga.nombre}
              className="size-9"
            />
            <p className="text-lg lg:text-2xl font-bold text-primary font-cool">
              {liga.nombre}
            </p>
          </div>
          <p className="text-sm text-neutral-500">
            Equipos inscritos:{" "}
            {
              liga.equipos.filter(
                (e) => e.estado === EstadoEquipoEnLiga.Aprobado
              ).length
            }
          </p>
          {liga.estadoLiga === EstadoLiga.EnCurso && (
            <div className="relative z-3 min-w-20 w-min text-orange-500 text-xs rounded-md">
              En curso
            </div>
          )}
          {liga.estadoLiga === EstadoLiga.SinEmpezar && (
            <p className="relative z-3 min-w-20 w-min text-green-400 text-xs rounded-md whitespace-nowrap">
              Aún no ha comenzado
            </p>
          )}
          {liga.descripcion && (
            <p className="text-neutral-400 bg-neutral-950/50 rounded-lg text-xs md:text-base max-w-10/12 line-clamp-2">
              {liga.descripcion}
            </p>
          )}
          {isLoggedIn ? (
            !estaInscrito && liga.estadoLiga === EstadoLiga.SinEmpezar && (
              <div className="mt-3">
                <Button
                  onClick={handleClickInscribir}
                  variant="outline-neutral"
                >
                  Inscribirme
                </Button>
              </div>
            )
          ) : (
            <div className="mt-3">
              <Button onClick={()=>navigate('/login')} variant="outline-neutral">
                Inscribirme
              </Button>
            </div>
          )}
          {pendienteDeAceptar && (
            <div className="mt-3">
              <p className="p-1 bg-neutral-500/20 w-fit rounded text-sm text-primary">
                Esperando confirmación...
              </p>
            </div>
          )}
        </div>

        <img
          src={
            darkMode
              ? fondoFutbolinMap[liga.tipoFutbolin]
              : fondoFutbolinMapLight[liga.tipoFutbolin]
          }
          alt={liga.nombre}
          className={`h-full object-cover z-0 object-right absolute right-0 top-0`}
        />
        <span
          className="absolute inset-0 z-0
               pointer-events-none
               bg-gradient-to-r from-neutral-900 via-neutral-900/60 to-transparent"
        />
      </div>
    </>
  );
};
