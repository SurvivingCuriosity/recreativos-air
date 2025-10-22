import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { Button } from "../../packages/components/Button/Button";
import { FormField } from "../../packages/components/Form/FormField";
import { FormLabel } from "../../packages/components/Form/FormLabel";
import { TextArea } from "../../packages/components/TextInput/TextArea";
import { TextInput } from "../../packages/components/TextInput/TextInput";
import { Titulo } from "../../packages/components/Titulo/Titulo";
import { useCrearLiga } from "../../shared/api/ligas/useLigas";
import { SelectorTipoFutbolin } from "../../shared/components/SelectorTipoFutbolin/SelectorTipoFutbolin";
import { EstadoLiga, TipoFutbolin } from "recreativos-air-core/liga";

export const CrearLigaPage = () => {
  const navigate = useNavigate();
  const { mutate: crearLiga, isPending } = useCrearLiga();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipoFutbolin, setTipoFutbolin] = useState<TipoFutbolin>(
    TipoFutbolin.Tsunami
  );
  const [normas, setNormas] = useState("");
  const [premio, setPremio] = useState("");
  const [ubicaciones, setUbicaciones] = useState<string[]>([]);
  const [ubicacionActual, setUbicacionActual] = useState("");

  const [partidosPorEnfrentamiento, setPartidosPorEnfrentamiento] = useState(4);
  const [golesParaGanar, setGolesParaGanar] = useState(10);
  const [idaYVuelta, setIdaYVuelta] = useState(true);

  // ✅ Manejar añadir y eliminar ubicaciones
  const handleAgregarUbicacion = () => {
    const trimmed = ubicacionActual.trim();
    if (!trimmed) return toast.error("Introduce una ubicación válida");
    if (ubicaciones.includes(trimmed))
      return toast.error("Esa ubicación ya está añadida");
    setUbicaciones([...ubicaciones, trimmed]);
    setUbicacionActual("");
  };

  const handleEliminarUbicacion = (index: number) => {
    setUbicaciones(ubicaciones.filter((_, i) => i !== index));
  };

  // ✅ Crear liga
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
      },
      {
        onSuccess: () => {
          navigate("/competiciones");
        },
      }
    );
  };

  return (
    <div className="max-w-screen-sm mx-auto p-4 h-full">
      <Titulo variant="h1" className="mb-4">
        Crear liga
      </Titulo>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCrearLiga();
        }}
        className="flex flex-col justify-between h-11/12 pb-2"
      >
        <div className="overflow-y-auto px-1 h-full space-y-4">
          {/* 🏷 Nombre */}
          <FormField>
            <FormLabel>Nombre</FormLabel>
            <TextInput
              placeholder="Nombre de la liga"
              value={nombre}
              onChangeText={setNombre}
            />
          </FormField>

          {/* 📝 Descripción */}
          <FormField>
            <FormLabel>Descripción</FormLabel>
            <TextArea
              placeholder="Breve descripción"
              value={descripcion}
              onChange={setDescripcion}
            />
          </FormField>

          {/* ⚽ Tipo de futbolín */}
          <FormField>
            <FormLabel>Tipo de futbolín</FormLabel>
            <SelectorTipoFutbolin
              value={tipoFutbolin}
              onSelect={(value) => setTipoFutbolin(value)}
            />
          </FormField>

          {/* ⚙️ Configuración */}
          <div className="bg-neutral-900 border border-neutral-700 p-3 rounded-md">
            <FormLabel>
              Configuración de la liga
            </FormLabel>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-neutral-400">
                  Partidos por enfrentamiento:
                </label>
                <input
                  type="number"
                  min={1}
                  value={partidosPorEnfrentamiento}
                  onChange={(e) =>
                    setPartidosPorEnfrentamiento(Number(e.target.value))
                  }
                  className="w-16 bg-neutral-800 rounded-md text-center py-1"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-neutral-400">
                  Goles para ganar:
                </label>
                <input
                  type="number"
                  min={1}
                  value={golesParaGanar}
                  onChange={(e) => setGolesParaGanar(Number(e.target.value))}
                  className="w-16 bg-neutral-800 rounded-md text-center py-1"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-neutral-400">
                  Ida y vuelta:
                </label>
                <input
                  type="checkbox"
                  checked={idaYVuelta}
                  onChange={(e) => setIdaYVuelta(e.target.checked)}
                  className="accent-primary w-5 h-5"
                />
              </div>
            </div>
          </div>

          {/* 📍 Ubicaciones */}
          <div className="bg-neutral-900 border border-neutral-700 p-3 rounded-md">
            <FormLabel>
              Ubicaciones
            </FormLabel>

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
                      onClick={() => handleEliminarUbicacion(i)}
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 📖 Normas */}
          <FormField>
            <FormLabel>Normas</FormLabel>
            <TextArea
              placeholder="Introduce normas de la liga (opcional)"
              value={normas}
              onChange={setNormas}
            />
          </FormField>

          {/* 🏆 Premio */}
          <FormField>
            <FormLabel>Premio</FormLabel>
            <TextArea
              placeholder="Premios de la liga (opcional)"
              value={premio}
              onChange={setPremio}
            />
          </FormField>
        </div>

        <Button
          onClick={handleCrearLiga}
          icon={faPlus}
          disabled={isPending}
        >
          {isPending ? "Creando..." : "Crear liga"}
        </Button>
      </form>
    </div>
  );
};
