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
import { SelectorTipoFutbolin } from "../../shared/components/SelectorTipoFutbolin/SelectorTipoFutbolin";
import { TipoFutbolin } from "../../shared/enum/TipoFutbolin";
import type { Liga } from "../../shared/interfaces/Liga";
import { useAppDispatch } from "../../shared/store/hooks";
import { crearLiga } from "../../shared/store/slices/ligasSlice";

export const CrearLigaPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [ligaEnCreacion, setLigaEnCreacion] = useState<Omit<Liga, "id">>({
    nombre: "",
    descripcion: "",
    tipoFutbolin: TipoFutbolin.Infinity,
    equipos: [],
    premio: "",
    normas: "",
  });

  const updateLigaField = (
    field: keyof typeof ligaEnCreacion,
    value: string
  ) => {
    setLigaEnCreacion({ ...ligaEnCreacion, [field]: value });
  };

  const handleCrearLiga = () => {
    dispatch(
      crearLiga({
        ...ligaEnCreacion,
        id: new Date().getTime().toString(),
      })
    );
    toast.success("Liga creada");
    navigate("/competiciones");
  };

  return (
    <div className="max-w-screen-sm mx-auto p-4 h-full">
      <Titulo variant="h1" className="mb-4">
        Crear liga
      </Titulo>
      <form className="flex flex-col justify-between h-11/12 pb-2">
        <div className="overflow-y-auto px-1 h-full">
          <FormField>
            <FormLabel>Nombre</FormLabel>
            <TextInput
              placeholder="Nombre de la liga"
              value={ligaEnCreacion.nombre}
              onChange={(value) => updateLigaField("nombre", value)}
            />
          </FormField>

          <FormField>
            <FormLabel>Descripción</FormLabel>
            <TextArea
              placeholder="Nombre de la liga"
              value={ligaEnCreacion.descripcion}
              onChange={(value) => updateLigaField("descripcion", value)}
            />
          </FormField>
          <div className="overflow-visible my-2">
            <FormLabel>Tipo de futbolin</FormLabel>
            <SelectorTipoFutbolin
              onSelect={() => {}}
              value={ligaEnCreacion.tipoFutbolin}
            />
          </div>

          <FormField>
            <FormLabel>Normas</FormLabel>
            <TextArea
              placeholder="Introduce normas de la liga (opcional)"
              value={ligaEnCreacion.normas}
              onChange={(value) => updateLigaField("normas", value)}
            />
          </FormField>

          <FormField>
            <FormLabel>Premio</FormLabel>
            <TextArea
              placeholder="Especifica premios de la liga (opcional)"
              value={ligaEnCreacion.premio}
              onChange={(value) => updateLigaField("premio", value)}
            />
          </FormField>
        </div>
        <Button onClick={handleCrearLiga} icon={faPlus}>
          Crear liga
        </Button>
      </form>
    </div>
  );
};
