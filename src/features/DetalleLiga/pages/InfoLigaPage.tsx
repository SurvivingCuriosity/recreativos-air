import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { use } from "react";
import Fab from "../../../packages/components/FAB/FAB";
import { DetalleLigaContext } from "../context/DetalleLigaContext";
import { useAppSelector } from "../../../shared/store/hooks";

export const InfoLigaPage = () => {
  const { liga } = use(DetalleLigaContext);

  const { user } = useAppSelector((state) => state.auth);

  return (
    <>
      <div>
        <p className="text-neutral-400">{liga?.descripcion}</p>

        <p className="mt-4 z-2 font-cool text-xl py-1 font-neutral-950 bg-neutral-950">
          Normas
        </p>
        <p className="text-neutral-400">{liga?.normas}</p>

        <p className="mt-4 z-2 font-cool text-xl py-1 font-neutral-950 bg-neutral-950">
          Ubicaciones
        </p>
        {liga?.ubicaciones.map((ubicacion, index) => (
          <p key={index} className="text-neutral-400">
            {ubicacion}
          </p>
        ))}

        <p className="mt-4 z-2 font-cool text-xl py-1 font-neutral-950 bg-neutral-950">
          Premio
        </p>
        <p className="text-neutral-400">{liga?.premio}</p>
      </div>

      {user?.admin && (
        <Fab
          openIcon={faPencil}
          items={[
            {
              label: "Editar info",
              icon: <FontAwesomeIcon icon={faPencil} />,
            },
          ]}
          showLabels={true}
        />
      )}
    </>
  );
};
