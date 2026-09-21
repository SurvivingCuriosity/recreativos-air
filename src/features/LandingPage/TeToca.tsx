import { ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { ContadorSeccion, SectionTitle } from "../../shared/components/Titulos/Titulos";
import { SkeletonLista } from "../../shared/components/Estados/Estados";
import { useTeToca, type ItemTeToca } from "./useTeToca";

const ItemTeTocaRow = ({ item }: { item: ItemTeToca }) => {
  const neon = item.tipo === "invitacion";
  return (
    <Link
      to={item.href}
      className="flex min-h-15 items-center gap-3 rounded-button border border-border bg-card px-3 py-2.5 text-foreground transition-colors hover:border-input focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <span
        className={cn(
          "inline-flex size-[38px] shrink-0 items-center justify-center rounded-[10px] border",
          neon
            ? "border-secondary-neon/35 bg-secondary-neon/13 text-secondary-neon"
            : "border-primary/35 bg-primary/13 text-primary-text"
        )}
      >
        <item.icon size={18} aria-hidden="true" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className={cn("font-bold", neon ? "text-secondary-neon" : "text-primary-text")}>
          {item.titulo}
        </span>
        <span className="truncate text-[13px] text-foreground-soft">{item.descripcion}</span>
      </span>
      <ChevronRight size={18} className="shrink-0 text-muted-foreground" aria-hidden="true" />
    </Link>
  );
};

/** Sección «Te toca» de la Home con sesión (DESIGN.md §6.1). */
export const TeToca = () => {
  const { items, isLoading } = useTeToca();

  if (!isLoading && items.length === 0) return null;

  return (
    <section className="flex w-full flex-col gap-2.5">
      <SectionTitle right={!isLoading ? <ContadorSeccion value={items.length} /> : undefined}>
        Te toca
      </SectionTitle>
      {isLoading ? (
        <SkeletonLista count={2} height="h-15" label="Cargando pendientes..." />
      ) : (
        items.map((item) => <ItemTeTocaRow key={item.id} item={item} />)
      )}
    </section>
  );
};
