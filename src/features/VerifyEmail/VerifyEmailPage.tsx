import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { useVerifyEmail } from "../../shared/api/auth/hooks";
import { FormField } from "../../packages/components/Form/FormField";
import { FormLabel } from "../../packages/components/Form/FormLabel";
import { TextInput } from "../../packages/components/TextInput/TextInput";
import { Button } from "../../packages/components/Button/Button";
import { setAccessToken } from "../../shared/api/auth/authStorage";

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
    <main className="h-full w-full p-4 max-w-screen-sm mx-auto flex flex-col justify-center">
      <form
        className="flex flex-col gap-4 bg-neutral-900 shadow-md rounded-xl p-6 border border-neutral-800"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <h1 className="text-2xl font-bold text-center">Verifica tu correo</h1>
        <p className="text-center text-neutral-500 text-sm">
          Hemos enviado un código de 6 dígitos a <strong>{email}</strong>
        </p>

        <FormField>
          <FormLabel htmlFor="verify-email-code">Código</FormLabel>
          <TextInput
            id="verify-email-code"
            autoComplete="one-time-code"
            placeholder="123456"
            inputMode="numeric"
            pattern="[0-9]*"
            value={code}
            onChangeText={setCode}
            maxLength={6}
          />
        </FormField>

        <Button disabled={isPending} onClick={handleSubmit}>
          Verificar
        </Button>
      </form>
    </main>
  );
};
