import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export interface WindowProps {
    titulo?: string
    children: React.ReactNode
    onClose?: () => void
}

export const Window = ({titulo = "", children, onClose}: WindowProps) => {
  return (
    <div className="z-50 fixed w-screen h-dvh top-0 left-0 bg-neutral-950/90 flex items-start justify-center backdrop-blur-xs">
        <div className="mt-20 animate-fade-in-top pt-6 relative bg-neutral-900 w-11/12 md:w-1/2 xl:w-1/4 border border-neutral-700 p-2 rounded-md">
            <button onClick={onClose} className="flex items-center justify-center size-6 absolute top-2 right-2 text-neutral-400 hover:text-neutral-500 transition-colors">
                <FontAwesomeIcon icon={faXmark} />
            </button>
            <p className="text-primary font-bold text-xl truncate w-full mb-5">{titulo}</p>
            {children}  
        </div>
    </div>
  )
}
