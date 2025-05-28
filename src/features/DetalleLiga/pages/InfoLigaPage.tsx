import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { use } from "react";
import Fab from "../../../packages/components/FAB/FAB";
import { DetalleLigaContext } from "../context/DetalleLigaContext";

export const InfoLigaPage = () => {
  const { liga } = use(DetalleLigaContext);
  return (
    <>
      <div>
        <p className="text-neutral-400">{liga?.descripcion}</p>
      </div>
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
    </>
  );
};
