import { faSave } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import type { UserDTO } from "recreativos-air-core/user";
import { Button } from "../../packages/components/Button/Button";
import { FormField } from "../../packages/components/Form/FormField";
import { FormLabel } from "../../packages/components/Form/FormLabel";
import { TextInput } from "../../packages/components/TextInput/TextInput";
import { Titulo } from "../../packages/components/Titulo/Titulo";
import { useAuth } from "../../shared/api/auth/useAuth";
import { useUpdateMe } from "../../shared/api/user/hooks";

export const EditarPerfilPage = () => {
  const { user } = useAuth();

  if (!user)
    return (
      <p className="text-neutral-400 text-center p-10 animate-pulse">
        Cargando perfil...
      </p>
    );

  return <EditarPerfilForm key={user.id} user={user} />;
};

const EditarPerfilForm = ({ user }: { user: UserDTO }) => {
  const navigate = useNavigate();
  const { mutate: updateMe, isPending } = useUpdateMe();

  const [username, setUsername] = useState(user.username);
  const [nombre, setNombre] = useState(user.nombre ?? "");
  const [movil, setMovil] = useState(user.movil);

  const handleGuardar = () => {
    if (username.trim().length < 3)
      return toast.error("El nombre de usuario debe tener al menos 3 caracteres");
    if (nombre.trim().length < 2)
      return toast.error("El nombre debe tener al menos 2 caracteres");
    if (!movil.trim()) return toast.error("Introduce un número de móvil");

    updateMe(
      {
        username: username.trim().toLowerCase(),
        nombre: nombre.trim(),
        movil: movil.trim(),
      },
      { onSuccess: () => navigate("/mi-perfil") }
    );
  };

  return (
    <div className="max-w-screen-sm mx-auto p-4 w-full">
      <title>Editar perfil | Recreativos Air</title>
      <Titulo variant="h1" className="mb-4">
        Editar perfil
      </Titulo>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleGuardar();
        }}
        className="space-y-4"
      >
        <FormField>
          <FormLabel>Nombre de usuario</FormLabel>
          <TextInput
            placeholder="Nombre de usuario"
            value={username}
            onChangeText={setUsername}
          />
        </FormField>

        <FormField>
          <FormLabel>Nombre</FormLabel>
          <TextInput
            placeholder="Tu nombre"
            value={nombre}
            onChangeText={setNombre}
          />
        </FormField>

        <FormField>
          <FormLabel>Móvil</FormLabel>
          <TextInput
            type="tel"
            placeholder="Número de móvil"
            value={movil}
            onChangeText={setMovil}
          />
        </FormField>

        <FormField>
          <FormLabel>Email</FormLabel>
          <TextInput value={user.email} onChangeText={() => {}} disabled />
        </FormField>

        <Button onClick={handleGuardar} icon={faSave} disabled={isPending}>
          {isPending ? "Guardando..." : "Guardar cambios"}
        </Button>
      </form>
    </div>
  );
};
