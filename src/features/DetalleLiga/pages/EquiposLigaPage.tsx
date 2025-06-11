import { faPeopleGroup, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { use, useState } from "react";
import Fab from "../../../packages/components/FAB/FAB";
import { Window } from "../../../packages/components/Window/Window";
import { TarjetaEquipo } from "../../../shared/components/TarjetaEquipo/TarjetaEquipo";
import { InscribirEquipoExistenteForm } from "../components/InscribirEquipoExistenteForm";
import { DetalleLigaContext } from "../context/DetalleLigaContext";
import { useAppSelector } from "../../../shared/store/hooks";

export const EquiposLigaPage = () => {
  const { liga } = use(DetalleLigaContext);

  const { user } = useAppSelector((state) => state.auth);

  const [inscribiendoEquipoExistente, setInscribiendoEquipoExistente] =
    useState(false);

  const [creandoNuevoEquipo, setCreandoNuevoEquipo] = useState(false);

  return (
    <>
      {inscribiendoEquipoExistente && (
        <Window
          onClose={() => setInscribiendoEquipoExistente(false)}
          titulo="Buscar equipo"
        >
          <InscribirEquipoExistenteForm />
        </Window>
      )}

      {creandoNuevoEquipo && (
        <Window
          onClose={() => setInscribiendoEquipoExistente(false)}
          titulo="Buscar equipo"
        >
          <InscribirEquipoExistenteForm />
        </Window>
      )}

      <ul className="flex flex-col gap-2">
        {liga?.equipos.map((equipo, index) => (
          <TarjetaEquipo
            key={index}
            equipo={equipo}
            onClick={() => console.log(equipo)}
          />
        ))}
      </ul>
      {user?.admin && (
        <Fab
          items={[
            {
              label: "Crear nuevo equipo",
              icon: <FontAwesomeIcon icon={faPlus} />,
              onClick: () => setCreandoNuevoEquipo(true),
            },
            {
              label: "Inscribir equipo existente",
              icon: <FontAwesomeIcon icon={faPeopleGroup} />,
              onClick: () => setInscribiendoEquipoExistente(true),
            },
          ]}
          showLabels={true}
        />
      )}
    </>
  );
};
