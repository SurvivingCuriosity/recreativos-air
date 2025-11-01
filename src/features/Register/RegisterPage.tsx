import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { RegisterSchema, type RegisterBody } from "recreativos-air-core/auth";
import { Button } from "../../packages/components/Button/Button";
import { FormField } from "../../packages/components/Form/FormField";
import { FormLabel } from "../../packages/components/Form/FormLabel";
import { PasswordInput } from "../../packages/components/TextInput/PasswordInput";
import { TextInput } from "../../packages/components/TextInput/TextInput";
import { useRegister } from "../../shared/api/auth/hooks";
import { handleApiErrors } from "../../shared/api/utils";

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

  console.log(errors);

  const onSubmit = (data: RegisterBody) => {
    registerUser(data, {
      onSuccess: (res) => {
        if (res.success) {
          toast.success("Te enviamos un código de verificación a tu correo");
          navigate("/verify-email", { state: { email: data.email } });
          return;
        }

        // Manejo de errores de validación o negocio
        handleApiErrors<RegisterBody>(res.error ?? "", setError);

        if (res.message) {
          toast.error(res.message);
        }
      },
      onError: (error) => {
        toast.error(
          error.message ??
            "Error del servidor. Inténtalo de nuevo más tarde."
        );
      },
    });
  };

  console.log(isPending)

  return (
    <>
      <title>Registro | Recreativos Air</title>
      <main className="h-full w-full p-4 max-w-screen-lg mx-auto flex flex-col justify-center">
        <form
          className="flex flex-col gap-4 bg-neutral-900 shadow-md rounded-xl p-6 border border-neutral-800 max-w-md mx-auto w-full"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)();
          }}
        >
          <h1 className="text-2xl font-bold text-center">Registro</h1>

          <FormField>
            <FormLabel htmlFor="register-email">Email</FormLabel>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextInput
                  id="register-email"
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
            {errors.movil && (
              <p className="text-red-500 text-xs">{errors.movil.message}</p>
            )}
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
            {errors.nombre && (
              <p className="text-red-500 text-xs">{errors.nombre.message}</p>
            )}
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
            {errors.username && (
              <p className="text-red-500 text-xs">{errors.username.message}</p>
            )}
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
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </FormField>

          <FormField>
            <FormLabel htmlFor="register-confirm-pass">
              Confirmar contraseña
            </FormLabel>
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
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </FormField>

          <Button type="submit" disabled={isPending}>
            Registrarme
          </Button>

          <Link to="/login" className="mx-auto underline mt-4">
            Ya tengo una cuenta
          </Link>
        </form>
      </main>
    </>
  );
};
