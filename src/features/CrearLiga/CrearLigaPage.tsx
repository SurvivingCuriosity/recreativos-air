import { Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  EstadoLiga,
  SIN_TEMPORADA,
  TipoFutbolin,
} from "recreativos-air-core/liga";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/shared/lib/toast";
import { Button } from "../../packages/components/Button/Button";
import { FormField } from "../../packages/components/Form/FormField";
import { FormLabel } from "../../packages/components/Form/FormLabel";
import { TextArea } from "../../packages/components/TextInput/TextArea";
import { TextInput } from "../../packages/components/TextInput/TextInput";
import { useCrearLiga } from "../../shared/api/ligas/useLigas";
import {
  useTemporadaActual,
  useTemporadas,
} from "../../shared/api/temporadas/useTemporadas";
import { EditorUbicaciones } from "../../shared/components/EditorUbicaciones/EditorUbicaciones";
import { SelectorTemporada } from "../../shared/components/SelectorTemporada/SelectorTemporada";
import { SelectorTipoFutbolin } from "../../shared/components/SelectorTipoFutbolin/SelectorTipoFutbolin";
import { PageTitle } from "../../shared/components/Titulos/Titulos";

const numInputClass =
  "h-11 w-16 rounded-[10px] border border-border bg-muted text-center font-display text-base font-bold text-foreground outline-none transition-[border-color,box-shadow] focus-visible:border-primary dark:focus-visible:shadow-glow-focus";

export const CrearLigaPage = () => {
  const navigate = useNavigate();
  const { mutate: crearLiga, isPending } = useCrearLiga();
  const { data: temporadas } = useTemporadas();
  const { data: temporadaActual } = useTemporadaActual();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipoFutbolin, setTipoFutbolin] = useState<TipoFutbolin>(TipoFutbolin.Tsunami);
  const [normas, setNormas] = useState("");
  const [temporada, setTemporada] = useState<string | null>(null);
  const temporadaValue = temporada ?? temporadaActual?.id ?? SIN_TEMPORADA;
  const [premio, setPremio] = useState("");
  const [ubicaciones, setUbicaciones] = useState<string[]>([]);

  const [partidosPorEnfrentamiento, setPartidosPorEnfrentamiento] = useState(4);
  const [golesParaGanar, setGolesParaGanar] = useState(10);
  const [idaYVuelta, setIdaYVuelta] = useState(true);

  const handleCrearLiga = () => {
    if (!nombre.trim()) return toast.error("Introduce un nombre válido");

    crearLiga(
      {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        tipoFutbolin,
        estadoLiga: EstadoLiga.SinEmpezar,
        ubicaciones,
        premio: premio.trim(),
        normas: normas.trim(),
        configuracion: {
          partidosPorEnfrentamiento,
          golesParaGanar,
          idaYVuelta,
        },
        temporada: temporadaValue === SIN_TEMPORADA ? null : temporadaValue,
      },
      {
        onSuccess: () => {
          navigate("/competiciones");
        },
      }
    );
  };

  return (
    <main className="mx-auto flex w-full max-w-screen-sm flex-col gap-4 px-4 pt-[18px] pb-5">
      <PageTitle color="primary">Crear liga</PageTitle>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCrearLiga();
        }}
        className="flex flex-col gap-4"
      >
        <FormField>
          <FormLabel htmlFor="liga-nombre">Nombre</FormLabel>
          <TextInput
            id="liga-nombre"
            placeholder="Nombre de la liga"
            value={nombre}
            onChangeText={setNombre}
          />
        </FormField>

        <FormField>
          <FormLabel htmlFor="liga-descripcion">Descripción</FormLabel>
          <TextArea
            id="liga-descripcion"
            placeholder="Breve descripción"
            value={descripcion}
            onChange={setDescripcion}
          />
        </FormField>

        <FormField>
          <FormLabel>Tipo de futbolín</FormLabel>
          <SelectorTipoFutbolin value={tipoFutbolin} onSelect={(value) => setTipoFutbolin(value)} />
        </FormField>

        <FormField>
          <FormLabel>Temporada</FormLabel>
          <SelectorTemporada
            temporadas={temporadas ?? []}
            value={temporadaValue}
            onSelect={setTemporada}
            incluirOpcionSinTemporada
          />
        </FormField>

        {/* Configuración (design/screens/CrearLiga.html) */}
        <div className="flex flex-col gap-2.5 rounded-button border border-border bg-card-2 p-3">
          <FormLabel>Configuración de la liga</FormLabel>

          <div className="flex items-center justify-between gap-2">
            <label htmlFor="liga-partidos" className="text-sm text-foreground-soft">
              Partidos por enfrentamiento:
            </label>
            <input
              id="liga-partidos"
              type="number"
              inputMode="numeric"
              min={1}
              value={partidosPorEnfrentamiento}
              onChange={(e) => setPartidosPorEnfrentamiento(Number(e.target.value))}
              className={numInputClass}
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <label htmlFor="liga-goles" className="text-sm text-foreground-soft">
              Goles para ganar:
            </label>
            <input
              id="liga-goles"
              type="number"
              inputMode="numeric"
              min={1}
              value={golesParaGanar}
              onChange={(e) => setGolesParaGanar(Number(e.target.value))}
              className={numInputClass}
            />
          </div>

          <label className="flex min-h-11 cursor-pointer items-center justify-between gap-2 text-sm text-foreground-soft">
            <span>Ida y vuelta:</span>
            <Checkbox
              checked={idaYVuelta}
              onCheckedChange={(v) => setIdaYVuelta(v === true)}
              className="size-[22px] rounded-[6px] border-input data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
          </label>
        </div>

        <EditorUbicaciones ubicaciones={ubicaciones} onChange={setUbicaciones} id="liga-ubicacion" />

        <FormField>
          <FormLabel htmlFor="liga-normas">Normas</FormLabel>
          <TextArea
            id="liga-normas"
            placeholder="Introduce normas de la liga (opcional)"
            value={normas}
            onChange={setNormas}
          />
        </FormField>

        <FormField>
          <FormLabel htmlFor="liga-premio">Premio</FormLabel>
          <TextArea
            id="liga-premio"
            placeholder="Premios de la liga (opcional)"
            value={premio}
            onChange={setPremio}
          />
        </FormField>

        <Button type="submit" icon={Plus} disabled={isPending}>
          {isPending ? "Creando..." : "Crear liga"}
        </Button>
      </form>
    </main>
  );
};
