import {
  faCalendarDays,
  faLocationDot
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import toast from "react-hot-toast";
import { IntroducirResultadoForm } from "../../../features/DetalleLiga/components/IntroducirResultadoForm";
import { Window } from "../../../packages/components/Window/Window";
import { EstadoEnfrentamiento } from "../../enum/EstadoEnfrentamiento";
import type { Enfrentamiento } from "../../interfaces/Enfrentamiento";
import { useAppSelector } from "../../store/hooks";

export const TarjetaEnfrentamiento = ({
  enfrentamiento,
  onClick,
}: {
  enfrentamiento: Enfrentamiento;
  optionsOpen: boolean;
  onOptionsClick: (idEnfrentamiento: number | null) => void;
  onClick?:() => void;
}) => {

  const {equiposUsuario} = useAppSelector(state => state.user)

  const [enfrentamientoState, setEnfrentamientoState] =
    useState<Enfrentamiento>(enfrentamiento);

  const [introduciendoResultado, setIntroduciendoResultado] = useState(false);

  const handleUpdateEnfrentamiento = (updated: Enfrentamiento | null) => {
    setIntroduciendoResultado(false)

    if (!updated) return;

    toast.success('Resultado actualizado')
    setEnfrentamientoState(updated);
  };

  return (
    <>
      {introduciendoResultado && (
        <Window
          titulo="Introducir resultado"
          onClose={() => setIntroduciendoResultado(false)}
        >
          <IntroducirResultadoForm
            enfrentamiento={enfrentamientoState}
            onUpdate={handleUpdateEnfrentamiento}
          />
        </Window>
      )}
      <div onClick={onClick} className="border rounded-md bg-neutral-900/50 border-neutral-700">
        <div className="flex justify-between p-1 text-xs bg-neutral-800 rounded-t-md text-neutral-300">
          <div className="text-neutral-300 w-3/12">
            <FontAwesomeIcon icon={faCalendarDays} className="mr-1" />
            {enfrentamiento.fecha ? enfrentamiento.fecha.toLocaleDateString() : '-'}
          </div>

          <div className="text-neutral-300 w-6/12 text-center">
            <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
            {enfrentamiento.ubicacion}
          </div>

          {enfrentamiento.estado === EstadoEnfrentamiento.SinJugar ? (
            <div className="text-green-600 text-right w-3/12">No jugado</div>
          ) : enfrentamiento.estado === EstadoEnfrentamiento.Jugado ?(
            <div className="text-red-600 text-right w-3/12">Jugado</div>
          ) : <div className="text-orange-300 text-right w-3/12">Pendiente</div>}
        </div>
        <div className="flex text-sm justify-between">
          <div className={`flex flex-col w-full`}>
            <p
              title={enfrentamientoState.equipoA.nombre}
              className={`${equiposUsuario.some(e => e.id === enfrentamientoState.equipoA.id) ? 'text-neutral-200 bg-primary/20' : ''}  border-b border-neutral-700 py-2 px-2 truncate`}
            >
              {enfrentamientoState.equipoA.nombre}
            </p>
            <p
              title={enfrentamientoState.equipoB.nombre}
              className={`${equiposUsuario.some(e => e.id === enfrentamientoState.equipoB.id) ? 'text-neutral-200 bg-primary/20' : ''} py-2 px-2 truncate`}
            >
              {enfrentamientoState.equipoB.nombre}
            </p>
          </div>

          <div className="flex flex-row border-l border-neutral-700">
            {enfrentamientoState.partidos.map((p, index) => (
              <div
                key={index + p.equipoA.nombre + p.equipoB.nombre}
                className="flex flex-col border-r border-neutral-700 text-neutral-300"
              >
                <p className="py-2 px-3 border-b border-neutral-700">
                  {p.golesA}
                </p>
                <p className="py-2 px-3">{p.golesB}</p>
              </div>
            ))}
          </div>

          {/* <ContextButton
            open={optionsOpen}
            className="p-2 ml-3 my-auto bg-neutral-800 rounded-full"
            openIcon={faEllipsisVertical}
            onClick={() =>
              onOptionsClick(optionsOpen ? null : enfrentamientoState.id)
            }
            onClose={() => onOptionsClick(null)}
            items={[
              {
                icon: <FontAwesomeIcon icon={faEdit} />,
                label: "Introducir resultado",
                onClick: () => setIntroduciendoResultado(true),
              },
              {
                icon: <FontAwesomeIcon icon={faCheck} />,
                label: "Confirmar result. sugerido",
                onClick: () => console.log("Editar"),
              },
            ]}
          /> */}
        </div>
      </div>
    </>
  );
};
