import { useState } from "react";
import { FormField } from "../../packages/components/Form/FormField";
import { FormLabel } from "../../packages/components/Form/FormLabel";
import { TextInput } from "../../packages/components/TextInput/TextInput";
import { Titulo } from "../../packages/components/Titulo/Titulo";
import { Button } from "../../packages/components/Button/Button";
import type { Equipo } from "../../shared/interfaces/Equipo";
import { useAppDispatch, useAppSelector } from "../../shared/store/hooks";
import { agregarEquipo } from "../../shared/store/slices/userSlice";
import { useNavigate } from "react-router";

export const CrearEquipoPage = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.user);

  const [equipo, setEquipo] = useState<Equipo>({
    id: "1",
    nombre: "",
    jugadores: [],
  });

  const updateField = (field: keyof Equipo, value: string) => {
    setEquipo((prevEquipo) => ({ ...prevEquipo, [field]: value }));
  };

  const handleCrearEquipo = () => {
    dispatch(
      agregarEquipo({
        ...equipo,
        jugadores: [
          {
            idUsuario: null,
            nombre: "Compañero",
          },
          {
            idUsuario: user?.id ?? null,
            nombre: user?.nombre ?? "Jugador",
          },
        ],
      })
    );
    navigate(-1);
  };

  return (
    <div className="p-2">
      <title>Crear equipo</title>

      <Titulo variant="h2" className="mb-2">
        Crear equipo
      </Titulo>
      <form>
        <FormField>
          <FormLabel>Nombre del equipo</FormLabel>
          <TextInput
            placeholder="Nombre del equipo"
            value={equipo.nombre}
            onChange={(nuevoNombre) => updateField("nombre", nuevoNombre)}
          />
        </FormField>
        <Button onClick={handleCrearEquipo}>Crear</Button>
      </form>
    </div>
  );
};
