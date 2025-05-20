import { useState } from 'react';
import { useAppDispatch } from '../../shared/store/hooks';
import { useLocation, useNavigate } from 'react-router';
import { loginSucceeded } from '../../shared/store/slices/authSlice';

export const LoginPage = () => { 
  const [user, setUser] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/dashboard';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fakeToken = '123abc';

    dispatch(loginSucceeded(fakeToken));
    navigate(from, { replace: true });
  };

  return (
    <main className="grid place-content-center h-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center">Iniciar sesión</h1>

        <input
          required
          placeholder="Usuario"
          value={user}
          onChange={e => setUser(e.target.value)}
          className="border rounded p-2"
        />

        <button type="submit" className="rounded bg-blue-600 text-white p-2">
          Entrar
        </button>
      </form>
    </main>
  );
}
