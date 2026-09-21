import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import {
  ForgotPasswordSchema,
  ResetPasswordSchema,
  type ForgotPasswordBody,
  type ResetPasswordBody,
} from "recreativos-air-core/auth";
import { toast } from "@/shared/lib/toast";
import { Button } from "../../packages/components/Button/Button";
import { FormField } from "../../packages/components/Form/FormField";
import { FormLabel } from "../../packages/components/Form/FormLabel";
import { PasswordInput } from "../../packages/components/TextInput/PasswordInput";
import { TextInput } from "../../packages/components/TextInput/TextInput";
import { useForgotPassword, useResetPassword } from "../../shared/api/auth/hooks";
import type { ErrorResponse } from "../../shared/api/http";
import {
  AuthCard,
  AuthMain,
  AuthText,
  AuthTitle,
  FieldError,
  StepIndicator,
  authLinkClass,
} from "../../shared/components/Auth/AuthCard";
import { CodeInput } from "../../shared/components/Auth/CodeInput";

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
    <AuthCard onSubmit={handleSubmit(onSubmit)}>
      <AuthTitle>Recuperar contraseña</AuthTitle>
      <AuthText>Introduce tu correo y te enviaremos un código de recuperación</AuthText>
      <StepIndicator step={1} />

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
        <FieldError>{errors.email?.message}</FieldError>
      </FormField>

      <Button disabled={isPending} type="submit">
        Enviar código
      </Button>

      <Link to="/login" className={`${authLinkClass} self-center`}>
        Volver al inicio de sesión
      </Link>
    </AuthCard>
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
    <AuthCard onSubmit={handleSubmit(onSubmit)}>
      <AuthTitle>Nueva contraseña</AuthTitle>
      <AuthText>
        Hemos enviado un código de 6 dígitos a <strong>{email}</strong>
      </AuthText>
      <StepIndicator step={2} />

      <FormField>
        <FormLabel htmlFor="reset-code">Código</FormLabel>
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <CodeInput
              id="reset-code"
              value={field.value}
              onChange={field.onChange}
              hasError={!!errors.code}
              autoFocus
            />
          )}
        />
        <FieldError>{errors.code?.message}</FieldError>
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
        <FieldError>{errors.password?.message}</FieldError>
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
        <FieldError>{errors.confirmPassword?.message}</FieldError>
      </FormField>

      <Button disabled={isPending} type="submit">
        Cambiar contraseña
      </Button>

      <button type="button" onClick={onBack} className={`${authLinkClass} self-center`}>
        Volver a introducir el correo
      </button>
    </AuthCard>
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
    <AuthMain className="max-w-md">
      {step === "email" ? (
        <StepEmail onSuccess={handleEmailSuccess} />
      ) : (
        <StepReset email={email} onBack={() => setStep("email")} />
      )}
    </AuthMain>
  );
};
