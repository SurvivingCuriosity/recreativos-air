import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { RegisterSchema, type RegisterBody } from "recreativos-air-core/auth";
import { toast } from "@/shared/lib/toast";
import { Button } from "../../packages/components/Button/Button";
import { FormField } from "../../packages/components/Form/FormField";
import { FormLabel } from "../../packages/components/Form/FormLabel";
import { PasswordInput } from "../../packages/components/TextInput/PasswordInput";
import { TextInput } from "../../packages/components/TextInput/TextInput";
import { useRegister } from "../../shared/api/auth/hooks";
import { handleApiErrors } from "../../shared/api/utils";
import {
  AuthCard,
  AuthMain,
  AuthTitle,
  FieldError,
  authLinkClass,
} from "../../shared/components/Auth/AuthCard";

export const RegisterPage = () => {
  const { mutate: registerUser, isPending } = useRegister();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterBody>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      nombre: "",
      username: "",
      password: "",
      confirmPassword: "",
      movil: "",
    },
  });

  const onSubmit = (data: RegisterBody) => {
    // DESIGN.md §6.12: validar en cliente que las contraseñas coinciden
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", { message: "Las contraseñas no coinciden" });
      return;
    }

    registerUser(data, {
      onSuccess: (res) => {
        if (res.success) {
          toast.success("Te enviamos un código de verificación a tu correo");
          navigate("/verify-email", { state: { email: data.email } });
          return;
        }

        handleApiErrors<RegisterBody>(res.error ?? "", setError);

        if (res.message) {
          toast.error(res.message);
        }
      },
      onError: (error) => {
        toast.error(
          error.message ?? "Error del servidor. Inténtalo de nuevo más tarde."
        );
      },
    });
  };

  return (
    <>
      <title>Registro | Recreativos Air</title>
      <AuthMain className="max-w-md">
        <AuthCard
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)();
          }}
        >
          <AuthTitle>Registro</AuthTitle>

          <FormField>
            <FormLabel htmlFor="register-email">Email</FormLabel>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextInput
                  id="register-email"
                  type="email"
                  placeholder="test@test.com"
                  autoComplete="email"
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
            <FormLabel htmlFor="register-phone">Móvil</FormLabel>
            <Controller
              name="movil"
              control={control}
              render={({ field }) => (
                <TextInput
                  id="register-phone"
                  placeholder="666666666"
                  autoComplete="tel-national"
                  inputMode="tel"
                  value={field.value}
                  onChangeText={field.onChange}
                  hasError={!!errors.movil}
                />
              )}
            />
            <FieldError>{errors.movil?.message}</FieldError>
          </FormField>

          <FormField>
            <FormLabel htmlFor="register-username">Nickname</FormLabel>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <TextInput
                  id="register-username"
                  placeholder="fer99"
                  autoComplete="username"
                  value={field.value}
                  onChangeText={field.onChange}
                  hasError={!!errors.username}
                />
              )}
            />
            <FieldError>{errors.username?.message}</FieldError>
          </FormField>

          <FormField>
            <FormLabel htmlFor="register-nombre">Nombre (opcional)</FormLabel>
            <Controller
              name="nombre"
              control={control}
              render={({ field }) => (
                <TextInput
                  id="register-nombre"
                  placeholder="Fernando"
                  autoComplete="given-name"
                  value={field.value}
                  onChangeText={field.onChange}
                  hasError={!!errors.nombre}
                />
              )}
            />
            <FieldError>{errors.nombre?.message}</FieldError>
          </FormField>

          <FormField>
            <FormLabel htmlFor="register-pass">Contraseña</FormLabel>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <PasswordInput
                  id="register-pass"
                  placeholder="********"
                  autoComplete="new-password"
                  value={field.value}
                  onChangeText={field.onChange}
                  hasError={!!errors.password}
                />
              )}
            />
            <FieldError>{errors.password?.message}</FieldError>
          </FormField>

          <FormField>
            <FormLabel htmlFor="register-confirm-pass">Confirmar contraseña</FormLabel>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <PasswordInput
                  id="register-confirm-pass"
                  placeholder="********"
                  autoComplete="new-password"
                  value={field.value}
                  onChangeText={field.onChange}
                  hasError={!!errors.confirmPassword}
                />
              )}
            />
            <FieldError>{errors.confirmPassword?.message}</FieldError>
          </FormField>

          <Button type="submit" disabled={isPending}>
            Registrarme
          </Button>

          <Link to="/login" className={`${authLinkClass} self-center`}>
            Ya tengo una cuenta
          </Link>
        </AuthCard>
      </AuthMain>
    </>
  );
};
