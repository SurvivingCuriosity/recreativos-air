import { useState } from "react";
import { Window } from "../../../../packages/components/Window/Window";
import { EstadoEnfrentamiento } from "../../../../shared/enum/EstadoEnfrentamiento";
import type { Enfrentamiento } from "../../../../shared/interfaces/Enfrentamiento";
import type { Jugador } from "../../../../shared/interfaces/Equipo";
import { IntroducirResultadoForm } from "../../../DetalleLiga/components/IntroducirResultadoForm";

export const BotonIntroducirResultado = ({
  usuarioParticipa,
  enfrentamiento,
  onUpdateEnfrentamiento,
}: {
  usuarioParticipa: Jugador | undefined;
  enfrentamiento: Enfrentamiento;
  onUpdateEnfrentamiento: (updated: Enfrentamiento) => void;
}) => {
  const [showWindow, setShowWindow] = useState(false);

  const handleUpdateEnfrentamiento = (updated: Enfrentamiento | null) => {
    
    setShowWindow(false);
    if (!updated) return;
    onUpdateEnfrentamiento(updated);
  };

  return (
    <>
      {showWindow && (
        <Window onClose={() => setShowWindow(false)}>
          <IntroducirResultadoForm
            enfrentamiento={enfrentamiento}
            onUpdate={handleUpdateEnfrentamiento}
          />
        </Window>
      )}
      {usuarioParticipa !== undefined &&
        enfrentamiento.estado === EstadoEnfrentamiento.SinJugar && (
          <button
            onClick={() => setShowWindow(true)}
            className=" flex items-center justify-center gap-2 text-green-600 border rounded-lg bg-green-600/5 p-1 px-4"
          >
            Jugar
          </button>
        )}
    </>
  );
};
