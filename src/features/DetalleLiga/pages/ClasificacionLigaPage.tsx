import { use } from "react";
import { TablaClasificacionLiga } from "../components/ClasificacionLiga";
import { DetalleLigaContext } from "../context/DetalleLigaContext";

export const ClasificacionLigaPage = () => {
  const { liga } = use(DetalleLigaContext);

  if (!liga) return <p>No hay liga seleccionada</p>;

  return (
    <div className="animate-fade-in-top">
      <TablaClasificacionLiga equipos={liga?.equipos} enfrentamientos={[""]} />
    </div>
  );
};
