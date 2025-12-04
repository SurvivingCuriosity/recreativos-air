import { useAuth } from "../api/auth/useAuth";
import { useLigas } from "../api/ligas/useLigas";

export const useLigasDeUsuario = () => {
    const { user } = useAuth();
    const { data: ligas, isLoading: loadingLigas } = useLigas();

    if (loadingLigas)
        return {
            ligas: undefined,
            loadingLigas: true,
            errorLigas: undefined,
        };

    if (user === undefined)
        return {
            ligas: undefined,
            loadingLigas: false,
            errorLigas: undefined,
        };

    return {
        ligas: ligas?.filter((l) =>
            l.equipos.some((e) =>
                e.equipo.jugadores.some((j) => j.idUsuario === user?.id)
            )
        ),
        loadingLigas: false,
        errorLigas: undefined,
    };

}