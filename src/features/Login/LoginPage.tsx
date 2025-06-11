import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "../../packages/components/Button/Button";
import { TextInput } from "../../packages/components/TextInput/TextInput";
import { useAppDispatch } from "../../shared/store/hooks";
import { loginSucceeded } from "../../shared/store/slices/authSlice";
import { FormField } from "../../packages/components/Form/FormField";
import { FormLabel } from "../../packages/components/Form/FormLabel";

export const LoginPage = () => {
  const [user, setUser] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || "/competiciones";

  const handleSubmit = () => {
    const fakeToken = "123abc";

    dispatch(loginSucceeded(fakeToken));
    navigate(from, { replace: true });
  };

  return (
    <main className="h-full w-full p-4 max-w-screen-lg mx-auto">
      <form className="flex flex-col">
        <h1 className="text-2xl font-bold text-center">Iniciar sesión</h1>

        <FormField>
          <FormLabel>Usuario</FormLabel>
          <TextInput
            required
            placeholder=""
            value={user}
            onChange={(e) => setUser(e)}
          />
        </FormField>

        <FormField>
          <FormLabel>Contraseña</FormLabel>
          <TextInput placeholder="" value={user} onChange={(e) => setUser(e)} />
        </FormField>

        <Button onClick={handleSubmit}>Entrar</Button>

        <Link to="/register" className="mx-auto underline mt-4">
          ¿No tienes una cuenta?
        </Link>
      </form>
    </main>
  );
};
