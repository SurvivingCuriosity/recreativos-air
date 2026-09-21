import { Save } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import type { UserDTO } from "recreativos-air-core/user";
import { toast } from "@/shared/lib/toast";
import { Button } from "../../packages/components/Button/Button";
import { FormField } from "../../packages/components/Form/FormField";
import { FormLabel } from "../../packages/components/Form/FormLabel";
import { TextInput } from "../../packages/components/TextInput/TextInput";
import { useAuth } from "../../shared/api/auth/useAuth";
import { useUpdateMe } from "../../shared/api/user/hooks";
import { SkeletonLista } from "../../shared/components/Estados/Estados";
import { PageTitle } from "../../shared/components/Titulos/Titulos";

export const EditarPerfilPage = () => {
  const { user } = useAuth();

  if (!user)
    return (
      <main className="mx-auto w-full max-w-screen-sm px-4 pt-[18px]">
        <SkeletonLista count={4} height="h-12" label="Cargando perfil..." />
      </main>
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
    <main className="mx-auto flex w-full max-w-screen-sm flex-col gap-4 px-4 pt-[18px] pb-5">
      <title>Editar perfil | Recreativos Air</title>
      <PageTitle color="primary">Editar perfil</PageTitle>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleGuardar();
        }}
        className="flex flex-col gap-4"
      >
        <FormField>
          <FormLabel htmlFor="perfil-username">Nombre de usuario</FormLabel>
          <TextInput
            id="perfil-username"
            placeholder="Nombre de usuario"
            autoComplete="username"
            value={username}
            onChangeText={setUsername}
          />
        </FormField>

        <FormField>
          <FormLabel htmlFor="perfil-nombre">Nombre</FormLabel>
          <TextInput
            id="perfil-nombre"
            placeholder="Tu nombre"
            autoComplete="given-name"
            value={nombre}
            onChangeText={setNombre}
          />
        </FormField>

        <FormField>
          <FormLabel htmlFor="perfil-movil">Móvil</FormLabel>
          <TextInput
            id="perfil-movil"
            type="tel"
            placeholder="Número de móvil"
            autoComplete="tel-national"
            value={movil}
            onChangeText={setMovil}
          />
        </FormField>

        <FormField>
          <FormLabel htmlFor="perfil-email">Email</FormLabel>
          <TextInput
            id="perfil-email"
            value={user.email}
            onChangeText={() => {}}
            disabled
            className="bg-muted text-muted-foreground opacity-100"
          />
        </FormField>

        <Button type="submit" icon={Save} disabled={isPending}>
          {isPending ? "Guardando..." : "Guardar cambios"}
        </Button>
      </form>
    </main>
  );
};
