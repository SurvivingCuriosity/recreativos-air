import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "@/shared/lib/toast";
import { Button } from "../../packages/components/Button/Button";
import { FormField } from "../../packages/components/Form/FormField";
import { FormLabel } from "../../packages/components/Form/FormLabel";
import { setAccessToken } from "../../shared/api/auth/authStorage";
import { useVerifyEmail } from "../../shared/api/auth/hooks";
import {
  AuthCard,
  AuthMain,
  AuthText,
  AuthTitle,
} from "../../shared/components/Auth/AuthCard";
import { CodeInput } from "../../shared/components/Auth/CodeInput";

export const VerifyEmailPage = () => {
  const [code, setCode] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  // El email viene desde RegisterPage (navigate("/verify-email", { state: { email } }))
  const email = (location.state as { email?: string })?.email ?? "";

  const { mutateAsync: verifyEmail, isPending } = useVerifyEmail();

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Falta el correo electrónico");
      return;
    }

    try {
      const res = await verifyEmail({ email, code });
      if (res.success) {
        toast.success("Correo verificado correctamente");
        if (res.data?.token) setAccessToken(res.data.token);
        navigate("/");
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Código inválido o expirado " + String(err));
    }
  };

  return (
    <AuthMain className="max-w-md">
      <AuthCard
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <AuthTitle>Verifica tu correo</AuthTitle>
        <AuthText>
          Hemos enviado un código de 6 dígitos a <strong>{email}</strong>
        </AuthText>

        <FormField>
          <FormLabel htmlFor="verify-email-code">Código</FormLabel>
          <CodeInput id="verify-email-code" value={code} onChange={setCode} />
        </FormField>

        <Button disabled={isPending} onClick={handleSubmit}>
          Verificar
        </Button>
      </AuthCard>
    </AuthMain>
  );
};
