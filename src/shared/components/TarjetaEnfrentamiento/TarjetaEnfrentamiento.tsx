import {
  faCalendarDays,
  faCheck,
  faEdit,
  faEllipsisVertical,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo, useState } from "react";
import { IntroducirResultadoForm } from "../../../features/DetalleLiga/components/IntroducirResultadoForm";
import { ContextButton } from "../../../packages/components/ContextButton/ContextButton";
import { Window } from "../../../packages/components/Window/Window";
import type { Enfrentamiento } from "../../interfaces/Enfrentamiento";
import toast from "react-hot-toast";

export const TarjetaEnfrentamiento = ({
  enfrentamiento,
  optionsOpen,
  onOptionsClick,
}: {
  enfrentamiento: Enfrentamiento;
  optionsOpen: boolean;
  onOptionsClick: (idEnfrentamiento: number | null) => void;
}) => {
  const [enfrentamientoState, setEnfrentamientoState] =
    useState<Enfrentamiento>(enfrentamiento);

  const [introduciendoResultado, setIntroduciendoResultado] = useState(false);

  const rand = useMemo(() => Math.random() > 0.5, []);

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
      <div className="border rounded-md bg-neutral-900 border-neutral-700">
        <div className="flex justify-between p-1 text-xs bg-neutral-800 rounded-t-md text-neutral-400">
          <div className="text-neutral-400">
            <FontAwesomeIcon icon={faCalendarDays} className="mr-1" />
            10/20/2025
          </div>

          <div className="text-neutral-400">
            <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
            Retiro del campus
          </div>

          {rand ? (
            <div className="text-green-600">Pendiente</div>
          ) : (
            <div className="text-red-600">Jugado</div>
          )}
        </div>
        <div className="flex  text-sm">
          <div className="border-r border-neutral-700 flex flex-col w-30">
            <p
              title={enfrentamientoState.equipoA}
              className="border-b border-neutral-700 py-2 px-2 truncate"
            >
              {enfrentamientoState.equipoA}
            </p>
            <p
              title={enfrentamientoState.equipoB}
              className="py-2 px-2 truncate"
            >
              {enfrentamientoState.equipoB}
            </p>
          </div>

          <div className="flex flex-row">
            {enfrentamientoState.partidos.map((p, index) => (
              <div
                key={index + p.equipoA + p.equipoB}
                className="flex flex-col border-r border-neutral-700 text-neutral-400"
              >
                <p className="py-2 px-3 border-b border-neutral-700">
                  {p.golesA}
                </p>
                <p className="py-2 px-3">{p.golesB}</p>
              </div>
            ))}
          </div>

          <ContextButton
            open={optionsOpen}
            className="p-2 ml-auto my-auto"
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
          />
        </div>
      </div>
    </>
  );
};
