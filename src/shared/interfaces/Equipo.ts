export interface Equipo {
  id: string;
  nombre: string;
  jugadores: Jugador[];
}

export interface Jugador {
  nombre: string;
  idUsuario: string | null;
}
