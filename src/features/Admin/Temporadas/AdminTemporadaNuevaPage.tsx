import { useNavigate } from "react-router";
import { useCrearTemporada } from "../../../shared/api/temporadas/useTemporadas";
import { PageTitle } from "../../../shared/components/Titulos/Titulos";
import { TemporadaForm } from "./TemporadaForm";

/** Nueva temporada = formulario de Detalle temporada con botón «Crear temporada» (DESIGN.md §8). */
export const AdminTemporadaNuevaPage = () => {
  const navigate = useNavigate();
  const { mutate: crearTemporada, isPending } = useCrearTemporada();

  return (
    <main className="mx-auto flex w-full max-w-screen-sm flex-col gap-4 px-4 pt-[18px] pb-5">
      <title>Nueva temporada | Recreativos Air</title>
      <PageTitle color="primary">Nueva temporada</PageTitle>
      <TemporadaForm
        isPending={isPending}
        submitLabel="Crear temporada"
        onSubmit={(data) =>
          crearTemporada(
            { ...data, actual: false },
            { onSuccess: () => navigate("/admin-temporadas") }
          )
        }
      />
    </main>
  );
};
