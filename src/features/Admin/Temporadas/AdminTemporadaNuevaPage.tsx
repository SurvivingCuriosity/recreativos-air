import { useNavigate } from "react-router";
import { Titulo } from "../../../packages/components/Titulo/Titulo";
import { useCrearTemporada } from "../../../shared/api/temporadas/useTemporadas";
import { TemporadaForm } from "./TemporadaForm";

export const AdminTemporadaNuevaPage = () => {
  const navigate = useNavigate();
  const { mutate: crearTemporada, isPending } = useCrearTemporada();

  return (
    <div className="max-w-screen-sm mx-auto p-4 w-full">
      <title>Nueva temporada | Recreativos Air</title>
      <Titulo variant="h1" className="mb-4">
        Nueva temporada
      </Titulo>
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
    </div>
  );
};
