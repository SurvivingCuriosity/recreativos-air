import { use } from "react"
import { DetalleLigaContext } from "../context/DetalleLigaContext"

export const InfoLigaPage = () => {
  const {liga} = use(DetalleLigaContext)
  return (
    <div>
      <p className="text-neutral-400">
        {liga?.descripcion}
      </p>
    </div>
  )
}
