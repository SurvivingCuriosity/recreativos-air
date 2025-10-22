import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { Button } from "../../packages/components/Button/Button";
import { FormField } from "../../packages/components/Form/FormField";
import { FormLabel } from "../../packages/components/Form/FormLabel";
import { TextInput } from "../../packages/components/TextInput/TextInput";
import { Titulo } from "../../packages/components/Titulo/Titulo";
import { useAuth } from "../../shared/api/auth/useAuth";
import { useCrearEquipo } from "../../shared/api/equipos/hooks/useCrearEquipo";
import SelectorUsuario from "../../shared/components/SelectorUsuario/SelectorUsuario";
import {
  EstadoJugadorEnEquipo,
  type CrearEquipoBody,
  type JugadorDTO,
} from "recreativos-air-core/equipos";
import type { SearchUserDTO } from "recreativos-air-core/user";

export const CrearEquipoPage = () => {
  const { user: loggedInUser } = useAuth();
  const { mutate: crearEquipo, isPending } = useCrearEquipo();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [equipoNombre, setEquipoNombre] = useState("");
  const [color, setColor] = useState("");
  const [jugadores, setJugadores] = useState<JugadorDTO[]>([]);

  const [modoAgregar, setModoAgregar] = useState<"registrado" | "manual">(
    "registrado"
  );
  const [nombreManual, setNombreManual] = useState("");

  const esAdmin = loggedInUser?.admin === true;

  /** 🧠 Inicializa con el creador si NO es admin */
  useEffect(() => {
    if (!esAdmin && loggedInUser) {
      setJugadores([
        {
          nombre: loggedInUser.nombre || loggedInUser.username || "Sin nombre",
          idUsuario: loggedInUser.id,
          estado: EstadoJugadorEnEquipo.ACEPTADO,
          suplente: false,
        },
      ]);
    }
  }, [loggedInUser, esAdmin]);

  /** 🧹 Limpia nombre manual cuando cambia modo */
  useEffect(() => {
    setNombreManual("");
  }, [modoAgregar]);

  /** ✅ Marca automáticamente al último jugador como suplente */
  const markLastAsSuplente = (lista: JugadorDTO[]): JugadorDTO[] => {
    if (lista.length <= 2) return lista.map((j) => ({ ...j, suplente: false }));

    // Todos suplente:false excepto el último
    return lista.map((j, idx) => ({
      ...j,
      suplente: idx === lista.length - 1,
    }));
  };

  /** ✅ Agregar jugador */
  const handleAgregarJugador = (nuevoJugador: JugadorDTO) => {
    if (jugadores.length >= 3) return alert("Máximo 3 jugadores por equipo");

    const actualizados = markLastAsSuplente([...jugadores, nuevoJugador]);
    setJugadores(actualizados);
    setNombreManual("");
  };

  /** ✅ Selector de usuario registrado */
  const handleSelectUsuario = (u: SearchUserDTO) => {
    if (jugadores.some((j) => j.idUsuario === u.id))
      return alert("Ese usuario ya está en el equipo");

    const esElUltimoAgregado = jugadores.length === 2;

    handleAgregarJugador({
      nombre: u.nombre,
      idUsuario: u.id,
      estado: EstadoJugadorEnEquipo.PENDIENTE,
      suplente: esElUltimoAgregado ? true : false,
    });
  };

  /** ✅ Agregar jugador manual (sin cuenta) */
  const handleAgregarManual = () => {
    const esElUltimoAgregado = jugadores.length === 2;
    if (!nombreManual.trim()) return alert("Introduce un nombre válido");
    if (
      jugadores.some(
        (j) => j.nombre.toLowerCase() === nombreManual.trim().toLowerCase()
      )
    )
      return alert("Ese nombre ya está en el equipo");

    handleAgregarJugador({
      nombre: nombreManual.trim(),
      idUsuario: null,
      estado: EstadoJugadorEnEquipo.ACEPTADO,
      suplente: esElUltimoAgregado ? true : false,
    });
  };

  /** ✅ Eliminar jugador */
  const handleEliminarJugador = (index: number) => {
    const jugador = jugadores[index];
    if (!esAdmin && jugador.idUsuario === loggedInUser?.id) {
      toast.custom("No puedes eliminarte del equipo");
      return;
    }

    const nuevaLista = jugadores.filter((_, i) => i !== index);
    setJugadores(markLastAsSuplente(nuevaLista));
  };

  /** ✅ Crear equipo */
  const handleCrearEquipo = () => {
    if (!equipoNombre.trim()) {
      toast.error("El nombre del equipo es obligatorio");
      return;
    }
    if (jugadores.length < 2) {
      toast.error("Debe haber al menos 2 jugadores por equipo");
      return;
    }

    const payload: CrearEquipoBody = {
      nombre: equipoNombre.trim(),
      color: color.trim(),
      jugadores: jugadores.map((j) => ({
        nombre: j.nombre,
        idUsuario: j.idUsuario,
        estado: j.estado,
        suplente: j.suplente ?? false,
      })),
    };

    crearEquipo(payload, {
      onSuccess: () => {
        navigate(-1);
        queryClient.invalidateQueries({
          queryKey: ["equipos", loggedInUser?.id],
        });
      },
    });
  };

  return (
    <div className="max-w-screen-md mx-auto p-4 space-y-4 pt-1">
      <Titulo variant="h2" className="mb-2 text-center font-extrabold">
        Crear equipo
      </Titulo>

      {/* NOMBRE DEL EQUIPO */}
      <FormField>
        <FormLabel>Nombre del equipo</FormLabel>
        <TextInput
          placeholder="Ej: Los Titanes"
          value={equipoNombre}
          onChangeText={setEquipoNombre}
        />
      </FormField>

      {/* COLOR */}
      <FormField>
        <FormLabel>Color identificativo (opcional)</FormLabel>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="overflow-hidden size-12 rounded-lg border-0"
        />
      </FormField>

      {/* JUGADORES */}
      <FormLabel>Jugadores ({jugadores.length}/3)</FormLabel>
      <div className="mt-2 space-y-3">
        {/* RADIO: Selección de tipo */}
        <div className="flex flex-col gap-3 mb-2">
          {/* Usuario registrado */}
          <div className="bg-neutral-800 p-2 rounded-md flex flex-col">
            <label className="flex items-center gap-2 cursor-pointer pb-2">
              <input
                type="radio"
                name="modoAgregar"
                value="registrado"
                checked={modoAgregar === "registrado"}
                onChange={() => setModoAgregar("registrado")}
                className="accent-primary"
              />
              <span className="text-xs text-neutral-400">
                Usuario registrado
              </span>
            </label>
            <SelectorUsuario
              onSelect={handleSelectUsuario}
              disabled={isPending || modoAgregar === "manual"}
              placeholder="Buscar usuario..."
            />
          </div>

          {/* Usuario no registrado */}
          <div className="bg-neutral-800 p-2 rounded-md flex flex-col">
            <label className="flex items-center gap-2 cursor-pointer pb-2">
              <input
                type="radio"
                name="modoAgregar"
                value="manual"
                className="accent-primary"
                checked={modoAgregar === "manual"}
                onChange={() => setModoAgregar("manual")}
              />
              <span className="text-xs text-neutral-400">
                Usuario no registrado
              </span>
            </label>
            <div className="flex items-center gap-2">
              <TextInput
                placeholder="Nombre del jugador sin cuenta"
                value={nombreManual}
                onChangeText={setNombreManual}
                disabled={modoAgregar !== "manual"}
              />
              <div className="w-12">
                <Button
                  onClick={handleAgregarManual}
                  disabled={isPending || modoAgregar === "registrado"}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de jugadores */}
        {jugadores.length > 0 && (
          <ul className="mt-3 divide-y divide-neutral-800">
            {jugadores.map((j, i) => (
              <li
                key={i}
                className={`flex justify-between items-center py-2 text-sm rounded-md px-2 hover:bg-neutral-800/50 relative`}
              >
                <div className="">
                  <p className="text-neutral-200 font-medium">
                    {j.nombre}
                    {j.suplente && (
                      <span className="ml-2 text-primary text-xs font-semibold">
                        (Suplente)
                      </span>
                    )}
                  </p>

                  <p className="text-xs text-neutral-500">
                    {j.idUsuario ? "Registrado" : "Sin cuenta"}
                  </p>
                </div>
                {loggedInUser?.id === j.idUsuario && (
                  <p className="bg-primary text-black p-1 px-2 text-sm rounded mr-auto mx-2">
                    Tú
                  </p>
                )}
                {j.idUsuario !== loggedInUser?.id && (
                  <div className="w-fit">
                    <Button
                      onClick={() => handleEliminarJugador(i)}
                      disabled={isPending}
                      variant="outline"
                      icon={faTrash}
                    >
                      <></>
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* CREAR */}
      <Button
        variant="primary"
        onClick={handleCrearEquipo}
        disabled={isPending}
        icon={faPlus}
      >
        {isPending ? "Creando equipo..." : "Crear equipo"}
      </Button>
    </div>
  );
};
