import { useParams } from "react-router";
import { useLigaById } from "../../../shared/api/ligas/useLigas";

export const InfoLigaPage = () => {
  const params = useParams();
  const { id: idLiga } = params;
  const { data: liga } = useLigaById(idLiga || "");

  return (
    <>
      <div>
        <p className="text-neutral-400">
          {liga?.descripcion || "Sin información disponible"}
        </p>

        {liga?.normas && (
          <>
            <p className="mt-4 z-2 font-cool text-xl py-1 font-neutral-950">
              Normas
            </p>
            <p className="text-neutral-400 whitespace-pre-wrap">{liga?.normas}</p>
          </>
        )}

        {liga?.ubicaciones && liga.ubicaciones.length > 0 && (
          <>
            <p className="mt-4 z-2 font-cool text-xl py-1 font-neutral-950">
              Ubicaciones
            </p>
            {liga?.ubicaciones.map((ubicacion, index) => (
              <p key={index} className="text-neutral-400">
                {ubicacion}
              </p>
            ))}
          </>
        )}
        {liga?.premio && (
          <>
            <p className="mt-4 z-2 font-cool text-xl py-1 font-neutral-950">
              Premio
            </p>
            <p className="text-neutral-400 whitespace-pre-wrap">{liga?.premio}</p>
          </>
        )}
      </div>
    </>
  );
};
