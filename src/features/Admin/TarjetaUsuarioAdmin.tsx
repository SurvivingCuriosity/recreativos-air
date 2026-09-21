import { Mail, Phone } from "lucide-react";
import type { UserDTO } from "recreativos-air-core/user";
import { ButtonWhatsapp2 } from "../LandingPage/ButtonWhatsapp";

/** TarjetaUsuarioAdmin (design/screens/AdminUsuarios.html). */
export const TarjetaUsuarioAdmin = ({ user }: { user: UserDTO }) => {
  return (
    <div className="flex gap-3 rounded-card border border-border bg-card px-3.5 py-3 text-foreground">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="flex min-w-0 flex-wrap items-baseline gap-x-1.5">
          <span className="truncate font-display text-[19px] font-bold text-primary-text">
            {user.username}
          </span>
          {user.nombre && <span className="text-xs text-muted-foreground">({user.nombre})</span>}
        </span>
        <span className="inline-flex items-center gap-2 text-sm text-foreground-soft">
          <Phone size={14} className="shrink-0" aria-hidden="true" />
          <span>{user.movil}</span>
        </span>
        <span className="inline-flex min-w-0 items-center gap-2 text-sm text-foreground-soft">
          <Mail size={14} className="shrink-0" aria-hidden="true" />
          <span className="truncate">{user.email}</span>
        </span>
        {!user.verified && (
          <span className="text-xs font-semibold text-destructive">Debe verificar correo</span>
        )}
      </div>
      <ButtonWhatsapp2 numero={user.movil} className="shrink-0 self-start" />
    </div>
  );
};
