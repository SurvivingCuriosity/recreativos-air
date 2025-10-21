import {
  faCalendarDays,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import { Button } from "../../../packages/components/Button/Button";
import { useAuth } from "../../../shared/api/auth/useAuth";
import {
  useAceptarResultado,
  useConfirmarResultadoAdmin,
  useEnfrentamientoById,
  useRechazarResultado,
} from "../../../shared/api/enfrentamientos/hooks";
import { EstadoEnfrentamiento } from "../../../shared/enum/EstadoEnfrentamiento";
import { BotonIntroducirResultado } from "./components/BotonIntroducirResultado";
import { InfoEstadoEnfrentamiento } from "./components/InfoEstadoEnfrentamiento";

export const DetalleJornadaPage = () => {
  const params = useParams();
  const { id: idEnfrentamiento } = params;
  const qc = useQueryClient();
  const { data: enfrentamiento, isLoading } = useEnfrentamientoById(
    idEnfrentamiento || ""
  );

  const { user: loggedInUser } = useAuth();
  const { mutate: aceptarResultado, isPending: aceptando } =
    useAceptarResultado();
  const { mutate: rechazarResultado, isPending: rechazando } =
    useRechazarResultado();
  const { mutate: confirmarAdmin, isPending: confirmandoAdmin } =
    useConfirmarResultadoAdmin();

  if (isLoading) {
    return (
      <p className="text-center p-10 text-neutral-500">Cargando liga...</p>
    );
  }
  if (enfrentamiento === undefined) {
    return (
      <p className="text-center p-10 text-red-500">
        Ups...Esta liga ya no existe
      </p>
    );
  }

  const usuarioParticipa =
    enfrentamiento.equipoA.jugadores.some(
      (j) => j.idUsuario === loggedInUser?.id
    ) ||
    enfrentamiento.equipoB.jugadores.some(
      (j) => j.idUsuario === loggedInUser?.id
    );

  const equipoDelUsuario = enfrentamiento.equipoA.jugadores.some(
    (j) => j.idUsuario === loggedInUser?.id
  )
    ? enfrentamiento.equipoA
    : enfrentamiento.equipoB;

  const otroEquipo =
    equipoDelUsuario.id === enfrentamiento.equipoA.id
      ? enfrentamiento.equipoB
      : enfrentamiento.equipoA;
  console.log(otroEquipo);

  const handleAceptar = () => {
    aceptarResultado(
      { enfrentamientoId: enfrentamiento.id, equipoId: equipoDelUsuario.id },
      {
        onSuccess: () => {
          toast.success("Resultado aceptado");
          qc.invalidateQueries({
            queryKey: ["enfrentamientos", enfrentamiento.id],
          });
        },
      }
    );
  };

  const handleRechazar = () => {
    rechazarResultado(
      { enfrentamientoId: enfrentamiento.id, equipoId: equipoDelUsuario.id },
      {
        onSuccess: () => {
          toast.success("Resultado rechazado");
          qc.invalidateQueries({
            queryKey: ["enfrentamientos", enfrentamiento.id],
          });
        },
      }
    );
  };

  const handleConfirmarAdmin = () => {
    confirmarAdmin(
      { enfrentamientoId: enfrentamiento.id },
      {
        onSuccess: () => {
          toast.success("Resultado confirmado");
          qc.invalidateQueries({
            queryKey: ["enfrentamientos", enfrentamiento.id],
          });
        },
      }
    );
  };

  const mostrarAceptarRechazar =
    enfrentamiento.estado === EstadoEnfrentamiento.CorroborarResultado &&
    usuarioParticipa &&
    (enfrentamiento.resultadoPropuestoPor !== equipoDelUsuario.id ||
      loggedInUser?.admin);

  const mostrarBotonAdmin =
    loggedInUser?.admin &&
    enfrentamiento.estado === EstadoEnfrentamiento.ConfirmarResultado;

  return (
    <div className="p-4 flex flex-col gap-3">
      <h1 className="text-2xl font-black font-cool">Detalle Jornada</h1>

      {/* Datos básicos */}
      <div className="text-neutral-400">
        <FontAwesomeIcon icon={faCalendarDays} className="mr-1" />
        {enfrentamiento.fecha ? new Date(enfrentamiento.fecha).toLocaleDateString() : "-"}
      </div>

      <div className="text-neutral-400">
        <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
        {enfrentamiento.ubicacion || "-"}
      </div>

      {/* Estado visual */}
      <InfoEstadoEnfrentamiento estado={enfrentamiento.estado} />

      {/* Resultado */}
      <div className="flex text-xl justify-between w-full">
        <div className="border-neutral-700 flex flex-col">
          <p className="border-b border-neutral-700 py-2 px-2 truncate font-semibold">
            {enfrentamiento.equipoA.nombre}
          </p>
          <p className="py-2 px-2 truncate font-semibold">
            {enfrentamiento.equipoB.nombre}
          </p>
        </div>

        <div className="flex flex-row w-full justify-center overflow-x-auto">
          {enfrentamiento.partidos.map((p, index) => (
            <div
              key={`${index}-${enfrentamiento.id}`}
              className="text-xl flex flex-col border-neutral-700 text-neutral-400"
            >
              <p className="py-2 px-3 border-b border-neutral-700 text-center">
                {p.golesA ?? "-"}
              </p>
              <p className="py-2 px-3 text-center">{p.golesB ?? "-"}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 🧍‍♂️ Botones para jugadores */}
      {usuarioParticipa && (
        <>
          {mostrarAceptarRechazar && (
            <div className="flex gap-2 mt-3">
              <Button
                onClick={handleAceptar}
                disabled={aceptando}
                variant="outline"
              >
                Aceptar resultado
              </Button>
              <Button onClick={handleRechazar} disabled={rechazando}>
                Rechazar
              </Button>
            </div>
          )}

          {/* Equipo puede proponer si no hay resultado aún */}
          {enfrentamiento.estado === EstadoEnfrentamiento.SinJugar && (
            <BotonIntroducirResultado
              enfrentamiento={enfrentamiento}
              idEquipo={equipoDelUsuario.id}
            />
          )}
        </>
      )}

      {/* 🧑‍⚖️ Botón para admin */}
      {mostrarBotonAdmin && (
        <div className="flex gap-2 mt-3">
          <Button
            onClick={handleConfirmarAdmin}
            disabled={confirmandoAdmin}
            variant="outline"
          >
            Confirmar resultado
          </Button>
          <Button onClick={handleRechazar} disabled={rechazando}>
            Rechazar y reiniciar
          </Button>
        </div>
      )}
    </div>
  );
};
