import { Plus, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "@/shared/lib/toast";
import { useNavigate } from "react-router";
import {
  EstadoJugadorEnEquipo,
  type CrearEquipoBody,
  type JugadorDTO,
} from "recreativos-air-core/equipos";
import type { SearchUserDTO } from "recreativos-air-core/user";
import { Button } from "../../packages/components/Button/Button";
import { FormLabel } from "../../packages/components/Form/FormLabel";
import { TextInput } from "../../packages/components/TextInput/TextInput";
import { PageTitle } from "../../shared/components/Titulos/Titulos";
import { RadioCards } from "../../shared/components/RadioCard/RadioCard";
import { useAuth } from "../../shared/api/auth/useAuth";
import { useCrearEquipo } from "../../shared/api/equipos/hooks/useCrearEquipo";
import SelectorUsuario from "../../shared/components/SelectorUsuario/SelectorUsuario";

export const CrearEquipoPage = () => {
  const { user: loggedInUser } = useAuth();
  const { mutate: crearEquipo, isPending } = useCrearEquipo();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [equipoNombre, setEquipoNombre] = useState("");
  const [color, setColor] = useState("#333333");
  const [jugadores, setJugadores] = useState<JugadorDTO[]>([]);

  const [modoAgregar, setModoAgregar] = useState<"registrado" | "manual">(
    "registrado"
  );
  const [modoCrearEquipo, setModoCrearEquipo] = useState<"bots" | "normal">(
    "normal"
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

  useEffect(() => {
    if (!esAdmin) return;
    if (modoCrearEquipo === "bots") {
      setJugadores([]);
      setModoAgregar("manual");
    } else {
      setJugadores([
        {
          nombre: loggedInUser.nombre || loggedInUser.username || "Sin nombre",
          idUsuario: loggedInUser.id,
          estado: EstadoJugadorEnEquipo.ACEPTADO,
          suplente: false,
        },
      ]);
    }
  }, [modoCrearEquipo]);

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
    if (jugadores.length >= 3) return toast.error("Máximo 3 jugadores por equipo");

    const actualizados = markLastAsSuplente([...jugadores, nuevoJugador]);
    setJugadores(actualizados);
    setNombreManual("");
  };

  /** ✅ Selector de usuario registrado */
  const handleSelectUsuario = (u: SearchUserDTO) => {
    if (jugadores.some((j) => j.idUsuario === u.id))
      return toast.error("Ese usuario ya está en el equipo");

    const esElUltimoAgregado = jugadores.length === 2;

    handleAgregarJugador({
      nombre: u.nombre || u.username,
      idUsuario: u.id,
      estado: EstadoJugadorEnEquipo.PENDIENTE,
      suplente: esElUltimoAgregado ? true : false,
    });
  };

  /** ✅ Agregar jugador manual (sin cuenta) */
  const handleAgregarManual = () => {
    const esElUltimoAgregado = jugadores.length === 2;
    if (!nombreManual.trim()) return toast.error("Introduce un nombre válido");
    if (
      jugadores.some(
        (j) => j.nombre.toLowerCase() === nombreManual.trim().toLowerCase()
      )
    )
      return toast.error("Ese nombre ya está en el equipo");

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
      toast.error("No puedes eliminarte del equipo");
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
    <main className="mx-auto flex w-full max-w-screen-md flex-1 flex-col gap-[18px] px-4 pt-[18px] pb-5">
      <PageTitle color="primary" align="center">
        Crear equipo
      </PageTitle>

      {esAdmin && (
        <RadioCards
          name="modoCrearEquipo"
          ariaLabel="Tipo de equipo"
          value={modoCrearEquipo}
          onChange={setModoCrearEquipo}
          options={[
            { value: "bots", label: "Equipo de bots" },
            { value: "normal", label: "Equipo para mi" },
          ]}
        />
      )}

      {/* NOMBRE DEL EQUIPO */}
      <div className="flex items-center gap-3 border-b border-border pb-3.5">
        <FormLabel htmlFor="equipo-nombre">Nombre: </FormLabel>
        <TextInput
          id="equipo-nombre"
          placeholder="Ej: Los Titanes"
          value={equipoNombre}
          onChangeText={setEquipoNombre}
          className="min-w-0 flex-1"
        />
      </div>

      {/* COLOR */}
      <div className="flex items-center gap-3 border-b border-border pb-3.5">
        <FormLabel htmlFor="equipo-color">Color (opcional): </FormLabel>
        <input
          id="equipo-color"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="size-11 cursor-pointer rounded-[10px] border border-input bg-card p-0 [&::-webkit-color-swatch]:rounded-[8px] [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-1"
        />
      </div>

      {/* AGREGAR JUGADORES */}
      <div className="flex flex-col gap-2.5 border-b border-border pb-3.5">
        <FormLabel>Agregar jugadores</FormLabel>
        <RadioCards
          name="modoAgregar"
          ariaLabel="Tipo de jugador"
          value={modoAgregar}
          onChange={setModoAgregar}
          options={[
            ...(modoCrearEquipo !== "bots"
              ? [{ value: "registrado" as const, label: "Usuario registrado" }]
              : []),
            { value: "manual" as const, label: "Usuario no registrado" },
          ]}
        />
        {modoAgregar === "registrado" ? (
          <SelectorUsuario
            onSelect={handleSelectUsuario}
            disabled={isPending}
            placeholder="Buscar usuario..."
          />
        ) : (
          <div className="flex items-center gap-2">
            <TextInput
              placeholder="Nombre del jugador sin cuenta"
              aria-label="Nombre del jugador sin cuenta"
              value={nombreManual}
              onChangeText={setNombreManual}
              disabled={modoAgregar !== "manual"}
              className="min-w-0 flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAgregarManual();
                }
              }}
            />
            <Button
              onClick={handleAgregarManual}
              disabled={isPending}
              icon={Plus}
              variant="outline-neutral"
              aria-label="Añadir jugador"
            />
          </div>
        )}
      </div>

      {/* JUGADORES */}
      <div className="flex flex-col gap-2.5">
        <FormLabel>Jugadores ({jugadores.length}/3)</FormLabel>
        {jugadores.length === 0 ? (
          <p className="p-4 text-center text-xs text-muted-foreground">Agrega jugadores</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {jugadores.map((j, i) => {
              const soyYo = loggedInUser?.id === j.idUsuario;
              return (
                <li
                  key={i}
                  className="flex min-h-15 items-center gap-3 rounded-input border border-border bg-card py-2 pr-2 pl-3 text-sm"
                >
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="max-w-40 truncate font-semibold text-foreground">
                      {j.nombre}
                      {j.suplente && (
                        <span className="ml-1.5 text-xs font-semibold text-primary-text">
                          (Suplente)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {j.idUsuario ? "Registrado" : "Sin cuenta"}
                    </p>
                  </div>
                  {soyYo ? (
                    <span className="rounded-chip bg-primary px-2 py-[3px] text-xs font-bold text-primary-foreground">
                      Tú
                    </span>
                  ) : (
                    <Button
                      onClick={() => handleEliminarJugador(i)}
                      disabled={isPending}
                      variant="outline"
                      icon={Trash2}
                      aria-label={`Eliminar a ${j.nombre}`}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-auto flex pt-2">
        <Button
          variant="primary"
          onClick={handleCrearEquipo}
          disabled={isPending}
          icon={Plus}
        >
          {isPending ? "Creando equipo..." : "Crear equipo"}
        </Button>
      </div>
    </main>
  );
};
