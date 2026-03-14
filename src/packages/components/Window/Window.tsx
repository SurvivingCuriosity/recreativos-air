import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useRef } from "react"

export interface WindowProps {
    titulo?: string
    children: React.ReactNode
    onClose?: () => void
}

export const Window = ({titulo = "", children, onClose}: WindowProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="mt-20 ms-auto me-auto bg-transparent w-11/12 md:w-1/2 xl:w-1/4 backdrop:bg-neutral-950/90 backdrop:backdrop-blur-xs"
    >
      <div className="animate-fade-in-top pt-6 relative bg-neutral-900 w-full border border-neutral-700 p-3 rounded-2xl">
        <button onClick={onClose} className="flex items-center justify-center size-6 absolute top-2 right-2 text-neutral-400 hover:text-neutral-500 transition-colors">
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <p className="text-primary font-bold text-xl truncate w-full mb-5">{titulo}</p>
        {children}
      </div>
    </dialog>
  )
}
