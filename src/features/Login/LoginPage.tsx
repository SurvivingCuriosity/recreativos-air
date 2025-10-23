import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router";
import { LoginSchema, type LoginBody } from "recreativos-air-core/auth";
import { Button } from "../../packages/components/Button/Button";
import { FormField } from "../../packages/components/Form/FormField";
import { FormLabel } from "../../packages/components/Form/FormLabel";
import { PasswordInput } from "../../packages/components/TextInput/PasswordInput";
import { TextInput } from "../../packages/components/TextInput/TextInput";
import { useLogin } from "../../shared/api/auth/hooks";
import type { ErrorResponse } from "../../shared/api/http";

export const LoginPage = () => {
  const { mutateAsync: login, isPending } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || "/competiciones";

  // Inicializamos el form con validación de Zod
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginBody>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginBody) => {
    try {
      const res = await login(data);

      if (res.message?.includes("no verificado")) {
        toast.error("Tu correo no está verificado");
        navigate("/verify-email", { state: { email: data.email } });
        return;
      }

      if (res.success) {
        toast.success("Inicio de sesión correcto");
        navigate(from, { replace: true });
      } else {
        toast.error(res.message);
      }
    } catch (err:unknown) {
      console.log(err)
      toast.error((err as ErrorResponse).message);
    }
  };

  return (
    <>

      <main className="h-full w-full p-4 max-w-screen-lg mx-auto flex flex-col justify-center">
        <form
          autoComplete="on"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 bg-neutral-900 shadow-md rounded-xl p-6 border border-neutral-800 max-w-md mx-auto w-full"
        >
          <h1 className="text-2xl font-bold text-center">Iniciar sesión</h1>

          <FormField>
            <FormLabel htmlFor="login-email">Email</FormLabel>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextInput
                  id="login-email"
                  name="email"
                  placeholder="test@test.com"
                  autoComplete="email"
                  value={field.value}
                  onChangeText={field.onChange}
                  hasError={!!errors.email}
                  autoFocus
                />
              )}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </FormField>

          <FormField>
            <FormLabel htmlFor="login-password">Contraseña</FormLabel>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <PasswordInput
                  id="login-password"
                  name="password"
                  placeholder="********"
                  autoComplete="current-password"
                  value={field.value}
                  onChangeText={field.onChange}
                  hasError={!!errors.password}
                />
              )}
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </FormField>

          <Button disabled={isPending} type="submit">
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
    </>
  );
};
