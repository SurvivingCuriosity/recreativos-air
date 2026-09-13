import {
  faFlagCheckered,
  faPlay,
  faSave,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useNavigate, useParams } from "react-router";
import {
  EstadoLiga,
  SIN_TEMPORADA,
  TipoFutbolin,
  type LigaDTO,
} from "recreativos-air-core/liga";
import { Button } from "../../../packages/components/Button/Button";
import { FormField } from "../../../packages/components/Form/FormField";
import { FormLabel } from "../../../packages/components/Form/FormLabel";
import { TextArea } from "../../../packages/components/TextInput/TextArea";
import { TextInput } from "../../../packages/components/TextInput/TextInput";
import { useAuth } from "../../../shared/api/auth/useAuth";
import {
  useActualizarLiga,
  useCambiarEstadoLiga,
  useEliminarLiga,
  useLigaById,
} from "../../../shared/api/ligas/useLigas";
import { useTemporadas } from "../../../shared/api/temporadas/useTemporadas";
import { SelectorTemporada } from "../../../shared/components/SelectorTemporada/SelectorTemporada";
import { SelectorTipoFutbolin } from "../../../shared/components/SelectorTipoFutbolin/SelectorTipoFutbolin";
import { useConfirmDialog } from "../../../shared/context/UIProvider/hooks/useUI";

export const AjustesLigaPage = () => {
  const { id = "" } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: liga, isLoading } = useLigaById(id);

  if (!user?.admin) return <Navigate to={`/competiciones/${id}/clasificacion`} replace />;
  if (isLoading || !liga)
    return (
      <p className="text-neutral-400 text-center p-10 animate-pulse">
        Cargando ajustes...
      </p>
    );

  return <AjustesLigaForm key={liga.id} liga={liga} />;
};

const AjustesLigaForm = ({ liga }: { liga: LigaDTO }) => {
  const navigate = useNavigate();
  const { confirm } = useConfirmDialog();
  const { data: temporadas } = useTemporadas();

  const { mutate: actualizarLiga, isPending: guardando } = useActualizarLiga();
  const { mutate: cambiarEstadoLiga, isPending: cambiandoEstado } =
    useCambiarEstadoLiga();
  const { mutate: eliminarLiga, isPending: eliminando } = useEliminarLiga();

  const sinEmpezar = liga.estadoLiga === EstadoLiga.SinEmpezar;

  const [nombre, setNombre] = useState(liga.nombre);
  const [descripcion, setDescripcion] = useState(liga.descripcion);
  const [tipoFutbolin, setTipoFutbolin] = useState<TipoFutbolin>(
    liga.tipoFutbolin
  );
  const [normas, setNormas] = useState(liga.normas);
  const [premio, setPremio] = useState(liga.premio);
  const [ubicaciones, setUbicaciones] = useState<string[]>(liga.ubicaciones);
  const [ubicacionActual, setUbicacionActual] = useState("");
  const [temporada, setTemporada] = useState(liga.temporada ?? SIN_TEMPORADA);

  const handleAgregarUbicacion = () => {
    const trimmed = ubicacionActual.trim();
    if (!trimmed) return toast.error("Introduce una ubicación válida");
    if (ubicaciones.includes(trimmed))
      return toast.error("Esa ubicación ya está añadida");
    setUbicaciones([...ubicaciones, trimmed]);
    setUbicacionActual("");
  };

  const handleGuardar = () => {
    if (!nombre.trim()) return toast.error("Introduce un nombre válido");

    actualizarLiga({
      ligaId: liga.id,
      data: {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        normas: normas.trim(),
        premio: premio.trim(),
        ubicaciones,
        temporada: temporada === SIN_TEMPORADA ? null : temporada,
        ...(sinEmpezar && { tipoFutbolin }),
      },
    });
  };

  const handleArrancar = async () => {
    const ok = await confirm({
      title: "¿Arrancar la liga?",
      description:
        "Se generarán los enfrentamientos y los usuarios podrán comenzar a introducir resultados",
      confirmText: "Arrancar liga",
    });
    if (ok) cambiarEstadoLiga({ ligaId: liga.id, nuevoEstado: EstadoLiga.EnCurso });
  };

  const handleFinalizar = async () => {
    const ok = await confirm({
      title: "¿Finalizar la liga?",
      description:
        "La clasificación quedará como definitiva y no se podrán introducir más resultados",
      confirmText: "Finalizar liga",
    });
    if (ok)
      cambiarEstadoLiga({ ligaId: liga.id, nuevoEstado: EstadoLiga.Finalizada });
  };

  const handleReanudar = async () => {
    const ok = await confirm({
      title: "¿Reanudar la liga?",
      description: "La liga volverá a estar en curso",
      confirmText: "Reanudar liga",
    });
    if (ok) cambiarEstadoLiga({ ligaId: liga.id, nuevoEstado: EstadoLiga.EnCurso });
  };

  const handleEliminar = async () => {
    const ok = await confirm({
      title: "¿Eliminar la liga?",
      description: `Se eliminará "${liga.nombre}" junto con todos sus enfrentamientos. Esta acción no se puede deshacer.`,
      confirmText: "Eliminar liga",
    });
    if (ok)
      eliminarLiga(liga.id, { onSuccess: () => navigate("/competiciones") });
  };

  return (
    <div className="animate-fade-in-top space-y-6 pb-6">
      <section className="space-y-3">
        <p className="font-cool text-lg text-primary">Estado</p>
        {sinEmpezar && (
          <Button onClick={handleArrancar} icon={faPlay} disabled={cambiandoEstado}>
            {cambiandoEstado ? "Arrancando liga..." : "Arrancar liga"}
          </Button>
        )}
        {liga.estadoLiga === EstadoLiga.EnCurso && (
          <Button
            onClick={handleFinalizar}
            icon={faFlagCheckered}
            variant="outline"
            disabled={cambiandoEstado}
          >
            {cambiandoEstado ? "Finalizando liga..." : "Finalizar liga"}
          </Button>
        )}
        {liga.estadoLiga === EstadoLiga.Finalizada && (
          <Button
            onClick={handleReanudar}
            icon={faPlay}
            variant="outline"
            disabled={cambiandoEstado}
          >
            {cambiandoEstado ? "Reanudando liga..." : "Reanudar liga"}
          </Button>
        )}
      </section>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleGuardar();
        }}
        className="space-y-4"
      >
        <p className="font-cool text-lg text-primary">Datos de la liga</p>

        <FormField>
          <FormLabel>Nombre</FormLabel>
          <TextInput
            placeholder="Nombre de la liga"
            value={nombre}
            onChangeText={setNombre}
          />
        </FormField>

        <FormField>
          <FormLabel>Descripción</FormLabel>
          <TextArea
            placeholder="Breve descripción"
            value={descripcion}
            onChange={setDescripcion}
          />
        </FormField>

        <FormField>
          <FormLabel>Temporada</FormLabel>
          <SelectorTemporada
            temporadas={temporadas ?? []}
            value={temporada}
            onSelect={setTemporada}
            incluirOpcionSinTemporada
          />
        </FormField>

        <FormField>
          <FormLabel>Tipo de futbolín</FormLabel>
          <SelectorTipoFutbolin
            value={tipoFutbolin}
            onSelect={setTipoFutbolin}
            disabled={!sinEmpezar}
          />
        </FormField>

        <div className="bg-neutral-900 border border-neutral-700 p-3 rounded-md">
          <FormLabel>Ubicaciones</FormLabel>

          <div className="flex items-center gap-2 mb-3">
            <TextInput
              placeholder="Añadir ubicación..."
              value={ubicacionActual}
              onChangeText={setUbicacionActual}
            />
            <Button onClick={handleAgregarUbicacion} variant="outline">
              +
            </Button>
          </div>

          {ubicaciones.length > 0 && (
            <ul className="space-y-2">
              {ubicaciones.map((u, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center bg-neutral-800 px-3 py-1.5 rounded-md text-sm text-neutral-300"
                >
                  <span>{u}</span>
                  <button
                    type="button"
                    className="text-red-500 text-xs hover:text-red-400"
                    onClick={() =>
                      setUbicaciones(ubicaciones.filter((_, j) => j !== i))
                    }
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <FormField>
          <FormLabel>Normas</FormLabel>
          <TextArea
            placeholder="Introduce normas de la liga (opcional)"
            value={normas}
            onChange={setNormas}
          />
        </FormField>

        <FormField>
          <FormLabel>Premio</FormLabel>
          <TextArea
            placeholder="Premios de la liga (opcional)"
            value={premio}
            onChange={setPremio}
          />
        </FormField>

        <Button onClick={handleGuardar} icon={faSave} disabled={guardando}>
          {guardando ? "Guardando..." : "Guardar cambios"}
        </Button>
      </form>

      <section className="border border-red-500/30 rounded-md p-3 space-y-2">
        <p className="font-cool text-lg text-red-400">Zona de peligro</p>
        <p className="text-xs text-neutral-500">
          Se eliminará la liga y todos sus enfrentamientos.
        </p>
        <Button
          onClick={handleEliminar}
          icon={faTrash}
          variant="outline-danger"
          disabled={eliminando}
        >
          {eliminando ? "Eliminando..." : "Eliminar liga"}
        </Button>
      </section>
    </div>
  );
};
