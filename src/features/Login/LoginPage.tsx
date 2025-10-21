import { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "../../packages/components/Button/Button";
import { FormField } from "../../packages/components/Form/FormField";
import { FormLabel } from "../../packages/components/Form/FormLabel";
import { PasswordInput } from "../../packages/components/TextInput/PasswordInput";
import { TextInput } from "../../packages/components/TextInput/TextInput";
import { useLogin } from "../../shared/api/auth/hooks";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutateAsync: login, isPending } = useLogin();

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || "/competiciones";

  const handleSubmit = async () => {
    try {
      
      const res = await login({ email, password });

      if (res.message.includes("no verificado")) {
        toast.error("Tu correo no está verificado");
        navigate("/verify-email", { state: { email } });
      }
      
      if (res.success) {
        toast.success("Inicio de sesión correcto");
        navigate(from, { replace: true });
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Ups hubo algun error" + String(err));
    }
  };

  return (
    <main className="h-full w-full p-4 max-w-screen-sm mx-auto flex flex-col justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-neutral-900 shadow-md rounded-xl p-6 border border-neutral-800"
      >
        <h1 className="text-2xl font-bold text-center">Iniciar sesión</h1>

        <FormField>
          <FormLabel>Email</FormLabel>
          <TextInput
            placeholder="test@test.com"
            value={email}
            onChange={(e) => setEmail(e)}
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

        <Button disabled={isPending} onClick={handleSubmit}>
          Entrar
        </Button>

        <Link
          to="/register"
          className="mx-auto underline text-sm text-gray-600 mt-2"
        >
          ¿No tienes cuenta? Regístrate
        </Link>
      </form>
    </main>
  );
};
