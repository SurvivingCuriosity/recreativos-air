import { useCallback, useMemo, useState } from "react";
import { SheetContext, ConfirmContext, ModalContext } from "../context/UIContexts";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { Modal } from "../../../components/Modal";
import { BottomSheetDrawer } from "../../../components/BottomSheetDrawer";

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
  // ---- Bottom Sheet ----
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetContent, setSheetContent] = useState<React.ReactNode>(null);
  const [sheetTitle, setSheetTitle] = useState<string | undefined>();

  const openSheet = (content: React.ReactNode, title?: string) => {
    setSheetContent(content);
    setSheetTitle(title);
    setSheetOpen(true);
  };
  const closeSheet = () => setSheetOpen(false);

  // ---- Confirm ----
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOptions, setDialogOptions] = useState({});
  const [resolver, setResolver] = useState<(result: boolean) => void>();

  const confirm = (options = {}): Promise<boolean> => {
    setDialogOptions(options);
    setDialogOpen(true);
    return new Promise((resolve) => setResolver(() => resolve));
  };
  const handleConfirm = () => {
    setDialogOpen(false);
    resolver?.(true);
  };
  const handleCancel = () => {
    setDialogOpen(false);
    resolver?.(false);
  };

  // ---- Modal genérico ----
  type ModalRenderer =
    | React.ReactNode
    | ((controls: { close: () => void; resolve: (value: unknown) => void }) => React.ReactNode);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState<string | undefined>();
  const [modalOptions, setModalOptions] = useState<{
    size?: "sm" | "md" | "lg" | "xl";
    closeOnOverlay?: boolean;
    closeOnEsc?: boolean;
    showCloseButton?: boolean;
  }>({});
  const [modalContent, setModalContent] = useState<ModalRenderer>(null);
  const [modalResolver, setModalResolver] = useState<(v?: unknown) => void>();

  const closeModal = useCallback(() => {
    setModalOpen(false);
    // Si se cierra sin resolver explícito, resolvemos undefined
    modalResolver?.(undefined);
    setModalResolver(undefined);
  }, [modalResolver]);

  const openModal = useCallback(
    <T,>(
      content:
        | React.ReactNode
        | ((controls: { close: () => void; resolve: (value: T) => void }) => React.ReactNode),
      options?: {
        title?: string;
        size?: "sm" | "md" | "lg" | "xl";
        closeOnOverlay?: boolean;
        closeOnEsc?: boolean;
        showCloseButton?: boolean;
      }
    ) => {
      setModalTitle(options?.title);
      setModalOptions({
        size: options?.size ?? "md",
        closeOnOverlay: options?.closeOnOverlay ?? true,
        closeOnEsc: options?.closeOnEsc ?? true,
        showCloseButton: options?.showCloseButton ?? true,
      });
      setModalContent(() => content as ModalRenderer);
      setModalOpen(true);
      return new Promise<T | undefined>((resolve) => {
        setModalResolver(() => resolve as (v?: unknown) => void);
      });
    },
    []
  );

  // Render del contenido (si es render-prop le pasamos controles)
  const renderedModalContent = useMemo(() => {
    if (typeof modalContent === "function") {
      return (modalContent)({
        close: closeModal,
        resolve: (value: unknown) => {
          setModalOpen(false);
          modalResolver?.(value);
          setModalResolver(undefined);
        },
      });
    }
    return modalContent;
  }, [modalContent, closeModal, modalResolver]);

  return (
    <SheetContext.Provider value={{ openSheet, closeSheet }}>
      <ConfirmContext.Provider value={{ confirm }}>
        <ModalContext.Provider value={{ openModal, closeModal }}>
          {children}

          {/* Bottom Sheet */}
          <BottomSheetDrawer isOpen={sheetOpen} onClose={closeSheet} title={sheetTitle}>
            {sheetContent}
          </BottomSheetDrawer>

          {/* Confirm */}
          <ConfirmDialog
            isOpen={dialogOpen}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            {...dialogOptions}
          />

          {/* Modal */}
          <Modal
            isOpen={modalOpen}
            onClose={closeModal}
            title={modalTitle}
            size={modalOptions.size}
            closeOnOverlay={modalOptions.closeOnOverlay}
            closeOnEsc={modalOptions.closeOnEsc}
            showCloseButton={modalOptions.showCloseButton}
          >
            {renderedModalContent}
          </Modal>
        </ModalContext.Provider>
      </ConfirmContext.Provider>
    </SheetContext.Provider>
  );
};
