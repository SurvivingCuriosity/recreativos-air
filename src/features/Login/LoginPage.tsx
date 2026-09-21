import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { LoginSchema, type LoginBody } from "recreativos-air-core/auth";
import { toast } from "@/shared/lib/toast";
import { Button } from "../../packages/components/Button/Button";
import { FormField } from "../../packages/components/Form/FormField";
import { FormLabel } from "../../packages/components/Form/FormLabel";
import { PasswordInput } from "../../packages/components/TextInput/PasswordInput";
import { TextInput } from "../../packages/components/TextInput/TextInput";
import { useLogin } from "../../shared/api/auth/hooks";
import type { ErrorResponse } from "../../shared/api/http";
import {
  AuthCard,
  AuthMain,
  AuthTitle,
  FieldError,
  authLinkClass,
} from "../../shared/components/Auth/AuthCard";

export const LoginPage = () => {
  const { mutateAsync: login, isPending } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || "/competiciones";

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
    } catch (err: unknown) {
      toast.error((err as ErrorResponse).message);
    }
  };

  return (
    <AuthMain>
      <AuthCard autoComplete="on" onSubmit={handleSubmit(onSubmit)}>
        <AuthTitle>Iniciar sesión</AuthTitle>

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
                autoComplete="username"
                value={field.value}
                onChangeText={field.onChange}
                hasError={!!errors.email}
                autoFocus
              />
            )}
          />
          <FieldError>{errors.email?.message}</FieldError>
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
          <FieldError>{errors.password?.message}</FieldError>
        </FormField>

        <Link to="/reset-password" className={`${authLinkClass} self-start`}>
          He olvidado mi contraseña
        </Link>

        <Button disabled={isPending} type="submit">
          Entrar
        </Button>

        <Link to="/register" className={`${authLinkClass} self-center`}>
          ¿No tienes cuenta? Regístrate
        </Link>
      </AuthCard>
    </AuthMain>
  );
};
