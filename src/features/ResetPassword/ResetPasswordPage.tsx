import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import {
  ForgotPasswordSchema,
  ResetPasswordSchema,
  type ForgotPasswordBody,
  type ResetPasswordBody,
} from "recreativos-air-core/auth";
import { Button } from "../../packages/components/Button/Button";
import { FormField } from "../../packages/components/Form/FormField";
import { FormLabel } from "../../packages/components/Form/FormLabel";
import { PasswordInput } from "../../packages/components/TextInput/PasswordInput";
import { TextInput } from "../../packages/components/TextInput/TextInput";
import { useForgotPassword, useResetPassword } from "../../shared/api/auth/hooks";
import type { ErrorResponse } from "../../shared/api/http";

// ─── Paso 1: solicitar código ────────────────────────────────────────────────

type StepEmailProps = {
  onSuccess: (email: string) => void;
};

const StepEmail = ({ onSuccess }: StepEmailProps) => {
  const { mutateAsync: forgotPassword, isPending } = useForgotPassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordBody>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordBody) => {
    try {
      await forgotPassword(data);
      toast.success("Si el correo existe, recibirás un código en breve");
      onSuccess(data.email);
    } catch (err: unknown) {
      toast.error((err as ErrorResponse).message ?? "Error del servidor");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 bg-neutral-900 shadow-md rounded-xl p-6 border border-neutral-800 max-w-md mx-auto w-full"
    >
      <h1 className="text-2xl font-bold text-center">Recuperar contraseña</h1>
      <p className="text-center text-neutral-500 text-sm">
        Introduce tu correo y te enviaremos un código de recuperación
      </p>

      <FormField>
        <FormLabel htmlFor="forgot-email">Email</FormLabel>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextInput
              id="forgot-email"
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
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}
      </FormField>

      <Button disabled={isPending} type="submit">
        Enviar código
      </Button>

      <Link to="/login" className="mx-auto underline text-sm text-neutral-600 mt-2">
        Volver al inicio de sesión
      </Link>
    </form>
  );
};

// ─── Paso 2: introducir código + nueva contraseña ────────────────────────────

type StepResetProps = {
  email: string;
  onBack: () => void;
};

const StepReset = ({ email, onBack }: StepResetProps) => {
  const { mutateAsync: resetPassword, isPending } = useResetPassword();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordBody>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { email, code: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetPasswordBody) => {
    try {
      const res = await resetPassword(data);
      if (res.success) {
        toast.success("Contraseña actualizada correctamente");
        navigate("/login");
      } else {
        toast.error(res.message);
      }
    } catch (err: unknown) {
      toast.error((err as ErrorResponse).message ?? "Error del servidor");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 bg-neutral-900 shadow-md rounded-xl p-6 border border-neutral-800 max-w-md mx-auto w-full"
    >
      <h1 className="text-2xl font-bold text-center">Nueva contraseña</h1>
      <p className="text-center text-neutral-500 text-sm">
        Hemos enviado un código de 6 dígitos a <strong>{email}</strong>
      </p>

      <FormField>
        <FormLabel htmlFor="reset-code">Código</FormLabel>
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <TextInput
              id="reset-code"
              autoComplete="one-time-code"
              placeholder="123456"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={field.value}
              onChangeText={field.onChange}
              hasError={!!errors.code}
              autoFocus
            />
          )}
        />
        {errors.code && (
          <p className="text-red-500 text-xs">{errors.code.message}</p>
        )}
      </FormField>

      <FormField>
        <FormLabel htmlFor="reset-password">Nueva contraseña</FormLabel>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <PasswordInput
              id="reset-password"
              name="password"
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
        <FormLabel htmlFor="reset-confirm-password">Confirmar contraseña</FormLabel>
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <PasswordInput
              id="reset-confirm-password"
              name="confirmPassword"
              placeholder="********"
              autoComplete="new-password"
              value={field.value}
              onChangeText={field.onChange}
              hasError={!!errors.confirmPassword}
            />
          )}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>
        )}
      </FormField>

      <Button disabled={isPending} type="submit">
        Cambiar contraseña
      </Button>

      <button
        type="button"
        onClick={onBack}
        className="mx-auto underline text-sm text-neutral-600 mt-2"
      >
        Volver a introducir el correo
      </button>
    </form>
  );
};

// ─── Componente principal ────────────────────────────────────────────────────

export const ResetPasswordPage = () => {
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");

  const handleEmailSuccess = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setStep("reset");
  };

  return (
    <main className="h-full w-full p-4 max-w-screen-lg mx-auto flex flex-col justify-center">
      {step === "email" ? (
        <StepEmail onSuccess={handleEmailSuccess} />
      ) : (
        <StepReset email={email} onBack={() => setStep("email")} />
      )}
    </main>
  );
};
