import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "../../packages/components/Button/Button";
import { FormField } from "../../packages/components/Form/FormField";
import { FormLabel } from "../../packages/components/Form/FormLabel";
import { PasswordInput } from "../../packages/components/TextInput/PasswordInput";
import { TextInput } from "../../packages/components/TextInput/TextInput";
import { useAppDispatch } from "../../shared/store/hooks";
import { loginSucceeded, setearUser } from "../../shared/store/slices/authSlice";

export const RegisterPage = () => {

  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || "/competiciones";

  const handleSubmit = () => {
    const fakeToken = "123abc";
    dispatch(
      setearUser({
        id: "1",
        nombre: nombre,
        username: username,
        admin: isAdmin,
      })
    );
    dispatch(loginSucceeded(fakeToken));
    navigate(from, { replace: true });
  };

  return (
    <main className="h-full w-full p-4 max-w-screen-lg mx-auto">
      <form className="flex flex-col">
        <h1 className="text-2xl font-bold text-center">Registro</h1>

        <FormField>
          <FormLabel>Nombre</FormLabel>
          <TextInput
            placeholder="Fernando"
            value={nombre}
            onChange={(e) => setNombre(e)}
          />
        </FormField>

        <FormField>
          <FormLabel>Usuario (para iniciar sesión)</FormLabel>
          <TextInput
            placeholder="fer99"
            value={username}
            onChange={(e) => setUsername(e)}
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

        <FormField>
          <FormLabel>Confirmar contraseña</FormLabel>
          <PasswordInput
            placeholder="********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e)}
          />
        </FormField>

        <label>
          Es admin
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
        </label>

        <Button onClick={handleSubmit}>Registrarme</Button>

        <Link to="/login" className="mx-auto underline mt-4">
          Ya tengo una cuenta
        </Link>
      </form>
    </main>
  );
};
