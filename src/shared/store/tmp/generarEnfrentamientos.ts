import { EstadoEnfrentamiento } from "../../enum/EstadoEnfrentamiento";
import type { Enfrentamiento } from "../../interfaces/Enfrentamiento";
import type { Partido } from "../../interfaces/Partido";
import type { Equipo } from "../../interfaces/Equipo";

/**
 * Genera todos los enfrentamientos de una liga.
 *
 * @param equipos                Lista de equipos inscritos en la liga.
 * @param idaYVuelta             true → ida y vuelta · false → solo ida.
 * @param partidosPorEnfrentamiento  Número de partidos dentro de cada enfrentamiento
 *                                   (propiedad que ahora vive en `Liga`, pero la
 *                                   pasamos aquí para que la función siga siendo pura).
 */
export function generarEnfrentamientos(
  equipos: Equipo[],
  idaYVuelta: boolean,
  partidosPorEnfrentamiento = 1
): Enfrentamiento[] {
  if (equipos.length < 2) return [];

  const enfrentamientos: Enfrentamiento[] = [];
  let idSeed = Date.now(); // garantiza unicidad aun en tests rápidos

  /**
   * Crea un enfrentamiento entre dos equipos, generando los partidos y
   * asignando un estado aleatorio (igual que en la versión de datos de prueba).
   */
  function crearEnfrentamiento(
    equipoA: Equipo,
    equipoB: Equipo
  ): Enfrentamiento {
    // Aleatoriedad de estado exactamente igual que antes
    const rand = Math.random();
    console.log(rand)
    const estado =
      rand >= 0.0 && rand <= 0.3
        ? EstadoEnfrentamiento.Jugado
        : rand > 0.3 && rand <= 0.6
        ? EstadoEnfrentamiento.SinJugar
        : EstadoEnfrentamiento.ConfirmarResultado;

    const partidos: Partido[] = Array.from(
      { length: partidosPorEnfrentamiento },
      (_, idx) => ({
        id: idx + 1,
        equipoA,
        equipoB,
        golesA:
          estado === EstadoEnfrentamiento.SinJugar
            ? "-"
            : Math.floor(Math.random() * 5).toString(),
        golesB:
          estado === EstadoEnfrentamiento.SinJugar
            ? "-"
            : Math.floor(Math.random() * 5).toString(),
        terminado: estado !== EstadoEnfrentamiento.SinJugar,
      })
    );

    return {
      id: ++idSeed,
      equipoA,
      equipoB,
      partidos,
      fecha: estado === EstadoEnfrentamiento.SinJugar ? null : new Date(),
      estado,
      ubicacion:
        Math.random() > 0.5 ? "La pinta y la loca" : "Retiro del campus",
    };
  }

  // --- 1) Ida --------------------------------------------------------------
  for (let i = 0; i < equipos.length; i++) {
    for (let j = i + 1; j < equipos.length; j++) {
      enfrentamientos.push(crearEnfrentamiento(equipos[i], equipos[j]));

      // --- 2) Vuelta -------------------------------------------------------
      if (idaYVuelta) {
        enfrentamientos.push(crearEnfrentamiento(equipos[j], equipos[i]));
      }
    }
  }

  // Ordenamos por estado para conservar el “look & feel” anterior
  return enfrentamientos.sort((a, b) => a.estado.localeCompare(b.estado));
}
