import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router";
import Fab from "../../../packages/components/FAB/FAB";
import { useAuth } from "../../../shared/api/auth/useAuth";
import { useLigaById } from "../../../shared/api/ligas/useLigas";

export const InfoLigaPage = () => {
  const params = useParams();
  const { id: idLiga } = params;
  const { data: liga } = useLigaById(idLiga || "");

  const { user } = useAuth();

  return (
    <>
      <div>
        <p className="text-neutral-400">{liga?.descripcion}</p>

        <p className="mt-4 z-2 font-cool text-xl py-1 font-neutral-950">
          Normas
        </p>
        <p className="text-neutral-400">{liga?.normas}</p>

        <p className="mt-4 z-2 font-cool text-xl py-1 font-neutral-950">
          Ubicaciones
        </p>
        {liga?.ubicaciones.map((ubicacion, index) => (
          <p key={index} className="text-neutral-400">
            {ubicacion}
          </p>
        ))}

        <p className="mt-4 z-2 font-cool text-xl py-1 font-neutral-950">
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
