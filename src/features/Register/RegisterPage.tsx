import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { Button } from "../../packages/components/Button/Button";
import { FormField } from "../../packages/components/Form/FormField";
import { FormLabel } from "../../packages/components/Form/FormLabel";
import { PasswordInput } from "../../packages/components/TextInput/PasswordInput";
import { TextInput } from "../../packages/components/TextInput/TextInput";
import { useRegister } from "../../shared/api/auth/hooks";

export const RegisterPage = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [movil, setMovil] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { mutate: register, isPending } = useRegister();

  const navigate = useNavigate();

  const handleSubmit = () => {
    register(
      { username, nombre, email, password, movil },
      {
        onSuccess: (res) => {
          if (res.success) {
            toast.success("Te enviamos un código de verificación a tu correo");
            navigate("/verify-email", { state: { email } });
          } else {
            toast.error(res.message);
          }
        },
        onError: (e) => {
          const error:AxiosError = e as AxiosError;
          // @ts-expect-error Algo con los tipos
          toast.error((error.response as unknown).data.error[0].message);
        },
      }
    );
  };

  return (
    <main className="h-full w-full p-4 max-w-screen-lg mx-auto">
      <form className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-center">Registro</h1>

        <FormField>
          <FormLabel>Email</FormLabel>
          <TextInput
            placeholder="test@test.com"
            value={email}
            onChange={(e) => setEmail(e)}
          />
        </FormField>

        <FormField>
          <FormLabel>Movil</FormLabel>
          <TextInput
            placeholder="666666666"
            value={movil}
            onChange={setMovil}
          />
        </FormField>

        <FormField>
          <FormLabel>Nombre</FormLabel>
          <TextInput
            placeholder="Fernando"
            value={nombre}
            onChange={(e) => setNombre(e)}
          />
        </FormField>

        <FormField>
          <FormLabel>Nickname</FormLabel>
          <TextInput
            placeholder="fer99"
            value={username}
            onChange={(e) => setUsername(e)}
          />
        </FormField>

        <FormField>
          <FormLabel>Contraseña</FormLabel>
          <PasswordInput
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e)}
          />
        </FormField>

        <FormField>
          <FormLabel>Confirmar contraseña</FormLabel>
          <PasswordInput
            placeholder="********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e)}
          />
        </FormField>

        <Button onClick={handleSubmit} disabled={isPending}>Registrarme</Button>

        <Link to="/login" className="mx-auto underline mt-4">
          Ya tengo una cuenta
        </Link>
      </form>
    </main>
  );
};
