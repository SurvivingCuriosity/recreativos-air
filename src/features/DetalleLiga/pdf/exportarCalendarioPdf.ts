import {
  EstadoEnfrentamiento,
  type EnfrentamientoDTO,
} from "recreativos-air-core/enfrentamiento";
import type { LigaDTO } from "recreativos-air-core/liga";
import {
  agruparPorJornada,
  formatMarcador,
  formatRangoJornada,
  nombreJornada,
} from "../../../shared/lib/jornadas";

type Params = {
  liga: LigaDTO;
  temporadaNombre?: string;
  enfrentamientos: EnfrentamientoDTO[];
};

const slug = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const capitalizar = (texto: string) =>
  texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();

/** Calendario de jornadas en PDF (A4). Las librerías se cargan bajo demanda. */
export async function exportarCalendarioPdf({ liga, temporadaNombre, enfrentamientos }: Params) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margen = 14;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(liga.nombre, margen, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(
    `${temporadaNombre ?? "Sin temporada"} · ${capitalizar(liga.tipoFutbolin)}`,
    margen,
    25
  );
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(`Generado el ${new Date().toLocaleDateString("es-ES")}`, margen, 30);
  doc.setTextColor(0);

  let startY = 36;
  const grupos = agruparPorJornada(liga, enfrentamientos, enfrentamientos);

  for (const grupo of grupos) {
    autoTable(doc, {
      startY,
      margin: { left: margen, right: margen },
      head: [[`${nombreJornada(grupo.numero)} · ${formatRangoJornada(grupo.jornada)}`, "Resultado"]],
      body: grupo.enfrentamientos.map((enf) => [
        `${enf.equipoA.nombre} vs ${enf.equipoB.nombre}`,
        enf.estado === EstadoEnfrentamiento.Jugado ? formatMarcador(enf) : "—",
      ]),
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [40, 40, 40] },
      columnStyles: { 1: { halign: "center", cellWidth: 50 } },
    });
    startY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;
  }

  doc.save(`calendario-${slug(liga.nombre)}.pdf`);
}
