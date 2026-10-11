import { CalendarDays, Flag, Play, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "@/shared/lib/toast";
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
  useRecalcularJornadas,
} from "../../../shared/api/ligas/useLigas";
import { useTemporadas } from "../../../shared/api/temporadas/useTemporadas";
import { EditorUbicaciones } from "../../../shared/components/EditorUbicaciones/EditorUbicaciones";
import { SelectorTemporada } from "../../../shared/components/SelectorTemporada/SelectorTemporada";
import { SelectorTipoFutbolin } from "../../../shared/components/SelectorTipoFutbolin/SelectorTipoFutbolin";
import { useConfirmDialog } from "../../../shared/context/UIProvider/hooks/useUI";
import { SkeletonLista } from "../../../shared/components/Estados/Estados";
import { hoyISO } from "../../../shared/lib/jornadas";
import { DialogArrancarLiga } from "../components/DialogArrancarLiga";

const TituloAjustes = ({ children, tono = "primary" }: { children: React.ReactNode; tono?: "primary" | "danger" }) => (
  <h2
    className={
      tono === "danger"
        ? "font-display text-[17px] font-bold tracking-[0.06em] text-destructive uppercase"
        : "font-display text-[17px] font-bold tracking-[0.06em] text-primary-text uppercase"
    }
  >
    {children}
  </h2>
);

export const AjustesLigaPage = () => {
  const { id = "" } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: liga, isLoading } = useLigaById(id);

  if (!user?.admin) return <Navigate to={`/competiciones/${id}/clasificacion`} replace />;
  if (isLoading || !liga)
    return (
      <SkeletonLista count={4} height="h-12" label="Cargando ajustes..." />
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
  const { mutate: recalcularJornadas, isPending: recalculando } =
    useRecalcularJornadas();

  const sinEmpezar = liga.estadoLiga === EstadoLiga.SinEmpezar;
  const [dialogoArrancar, setDialogoArrancar] = useState(false);
  const [fechaPrimeraJornada, setFechaPrimeraJornada] = useState(
    liga.jornadas[0]?.fechaInicio ?? hoyISO()
  );
  const [duracionJornada, setDuracionJornada] = useState(
    String(liga.duracionJornadaDias ?? 7)
  );

  const [nombre, setNombre] = useState(liga.nombre);
  const [descripcion, setDescripcion] = useState(liga.descripcion);
  const [tipoFutbolin, setTipoFutbolin] = useState<TipoFutbolin>(
    liga.tipoFutbolin
  );
  const [normas, setNormas] = useState(liga.normas);
  const [premio, setPremio] = useState(liga.premio);
  const [ubicaciones, setUbicaciones] = useState<string[]>(liga.ubicaciones);
  const [temporada, setTemporada] = useState(liga.temporada ?? SIN_TEMPORADA);

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

  const handleArrancar = (datos: {
    fechaPrimeraJornada: string;
    duracionJornadaDias: number;
  }) => {
    cambiarEstadoLiga(
      { ligaId: liga.id, data: { nuevoEstado: EstadoLiga.EnCurso, ...datos } },
      { onSuccess: () => setDialogoArrancar(false) }
    );
  };

  const handleRecalcularJornadas = async () => {
    const dias = Number(duracionJornada);
    if (!fechaPrimeraJornada) return toast.error("Indica la fecha de la primera jornada");
    if (!Number.isInteger(dias) || dias < 1)
      return toast.error("La duración debe ser de al menos 1 día");

    const ok = await confirm({
      title: "¿Recalcular las fechas de todas las jornadas?",
      description: liga.jornadas.length
        ? "Se sobrescribirán las fechas editadas manualmente"
        : "Esta liga no tiene calendario: se numerarán sus enfrentamientos por jornadas",
      confirmText: "Recalcular",
      variant: "default",
    });
    if (ok)
      recalcularJornadas({
        ligaId: liga.id,
        data: { fechaPrimeraJornada, duracionJornadaDias: dias },
      });
  };

  const handleFinalizar = async () => {
    const ok = await confirm({
      title: "¿Finalizar la liga?",
      description:
        "La clasificación quedará como definitiva y no se podrán introducir más resultados",
      confirmText: "Finalizar liga",
    });
    if (ok)
      cambiarEstadoLiga({
        ligaId: liga.id,
        data: { nuevoEstado: EstadoLiga.Finalizada },
      });
  };

  const handleReanudar = async () => {
    const ok = await confirm({
      title: "¿Reanudar la liga?",
      description: "La liga volverá a estar en curso",
      confirmText: "Reanudar liga",
      variant: "default",
    });
    if (ok)
      cambiarEstadoLiga({ ligaId: liga.id, data: { nuevoEstado: EstadoLiga.EnCurso } });
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
    <div className="flex animate-fade-in-top flex-col gap-[22px] pb-6">
      <section className="flex flex-col gap-2.5">
        <TituloAjustes>Estado</TituloAjustes>
        {sinEmpezar && (
          <>
            <Button
              onClick={() => setDialogoArrancar(true)}
              icon={Play}
              disabled={cambiandoEstado}
            >
              {cambiandoEstado ? "Arrancando liga..." : "Arrancar liga"}
            </Button>
            <DialogArrancarLiga
              open={dialogoArrancar}
              onOpenChange={setDialogoArrancar}
              onConfirmar={handleArrancar}
              pending={cambiandoEstado}
            />
          </>
        )}
        {liga.estadoLiga === EstadoLiga.EnCurso && (
          <Button
            onClick={handleFinalizar}
            icon={Flag}
            variant="outline"
            disabled={cambiandoEstado}
          >
            {cambiandoEstado ? "Finalizando liga..." : "Finalizar liga"}
          </Button>
        )}
        {liga.estadoLiga === EstadoLiga.Finalizada && (
          <Button
            onClick={handleReanudar}
            icon={Play}
            variant="outline"
            disabled={cambiandoEstado}
          >
            {cambiandoEstado ? "Reanudando liga..." : "Reanudar liga"}
          </Button>
        )}
      </section>

      {!sinEmpezar && (
        <section className="flex flex-col gap-4">
          <TituloAjustes>Jornadas</TituloAjustes>
          <p className="text-[13px] text-foreground-soft">
            {liga.jornadas.length
              ? `${liga.jornadas.length} jornadas. Recalcular asigna las fechas de todas a partir de la primera.`
              : "Esta liga no tiene calendario de jornadas. Recalcular numerará sus enfrentamientos."}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <FormField>
              <FormLabel>Primera jornada</FormLabel>
              <TextInput
                type="date"
                value={fechaPrimeraJornada}
                onChangeText={setFechaPrimeraJornada}
              />
            </FormField>
            <FormField>
              <FormLabel>Duración (días)</FormLabel>
              <TextInput
                type="number"
                inputMode="numeric"
                min={1}
                max={365}
                value={duracionJornada}
                onChangeText={setDuracionJornada}
              />
            </FormField>
          </div>
          <Button
            onClick={handleRecalcularJornadas}
            icon={CalendarDays}
            variant="outline"
            disabled={recalculando}
          >
            {recalculando ? "Recalculando..." : "Recalcular fechas"}
          </Button>
        </section>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleGuardar();
        }}
        className="flex flex-col gap-4"
      >
        <TituloAjustes>Datos de la liga</TituloAjustes>

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

        <EditorUbicaciones ubicaciones={ubicaciones} onChange={setUbicaciones} id="liga-ubicacion" />

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

        <Button type="submit" icon={Save} disabled={guardando}>
          {guardando ? "Guardando..." : "Guardar cambios"}
        </Button>
      </form>

      <section className="flex flex-col gap-2.5 rounded-button border border-destructive/40 bg-destructive/4 p-3.5">
        <TituloAjustes tono="danger">Zona de peligro</TituloAjustes>
        <p className="text-[13px] text-foreground-soft">
          Se eliminará la liga y todos sus enfrentamientos.
        </p>
        <Button
          onClick={handleEliminar}
          icon={Trash2}
          variant="outline-danger"
          disabled={eliminando}
        >
          {eliminando ? "Eliminando..." : "Eliminar liga"}
        </Button>
      </section>
    </div>
  );
};
