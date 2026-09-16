import type { ProgramSection } from "./types";
import { l } from "./types";
import { item } from "./content";
export const weightAdditionalSections: ProgramSection[] = [
  {
    id: "weight-synergies",
    kind: "content",
    eyebrow: l(
      "LECTURA AMPLIADA / COMPLEMENTARIEDAD",
      "FURTHER READING / COMPLEMENTARITY",
    ),
    title: l(
      "Cómo se relacionan\nlos componentes.",
      "How the components\nrelate to one another.",
    ),
    description: l(
      "El dossier propone interacciones mecanísticas entre ingredientes. Estas relaciones explican el diseño de la fórmula; no prueban una sinergia clínica del producto terminado.",
      "The dossier proposes mechanistic interactions between ingredients. These relationships explain the formula’s design; they do not establish a clinical synergy for the finished product.",
    ),
    items: [
      item(
        "Energía y adaptación",
        "Energy and adaptation",
        "Berberina y resveratrol convergen en el eje AMPK–SIRT1–PGC-1α, estudiado en regulación energética y biogénesis mitocondrial.",
        "Berberine and resveratrol converge on the AMPK–SIRT1–PGC-1α axis, studied in energy regulation and mitochondrial biogenesis.",
        "AMPK ↔ SIRT1",
      ),
      item(
        "Utilización de ácidos grasos",
        "Fatty acid utilization",
        "La L-carnitina interviene en su transporte hacia la mitocondria; el dossier relaciona este proceso con las vías de regulación energética de berberina y resveratrol.",
        "L-carnitine participates in fatty acid transport into mitochondria; the dossier connects this process with the energy-regulation pathways of berberine and resveratrol.",
        "L-CARNITINA / L-CARNITINE",
      ),
      item(
        "Señalización de insulina",
        "Insulin signaling",
        "Picolinato de cromo, berberina y resveratrol se integran en el modelo de señalización de insulina y transporte de glucosa.",
        "Chromium picolinate, berberine and resveratrol are integrated into the model of insulin signaling and glucose transport.",
        "PI3K / AKT · GLUT-4",
      ),
      item(
        "Biodisponibilidad",
        "Bioavailability",
        "La piperina puede modificar la exposición a determinados fitoquímicos. La magnitud depende de la formulación y requiere evaluar interacciones.",
        "Piperine may alter exposure to selected phytochemicals. The magnitude depends on the formulation and requires interaction assessment.",
        "PIPERINA / PIPERINE",
      ),
    ],
  },
  {
    id: "weight-systems",
    kind: "overview",
    eyebrow: l("BIOLOGÍA DE SISTEMAS", "SYSTEMS BIOLOGY"),
    title: l(
      "Una perspectiva\nque conecta órganos y procesos.",
      "A perspective connecting\norgans and processes.",
    ),
    description: l(
      "El atlas organiza el fundamento del programa a escala celular y multiorgánica. Estas áreas describen el modelo de investigación, no indicaciones terapéuticas demostradas de Plus.",
      "The atlas organizes the program rationale at cellular and multi-organ levels. These areas describe the research model, not established therapeutic indications for Plus.",
    ),
    items: [
      item(
        "Hígado y tejido adiposo",
        "Liver and adipose tissue",
        "El modelo estudia metabolismo de lípidos, producción hepática de glucosa y señalización inflamatoria del tejido adiposo.",
        "The model examines lipid metabolism, hepatic glucose production and inflammatory signaling in adipose tissue.",
        undefined,
        "pulse",
      ),
      item(
        "Músculo y mitocondrias",
        "Muscle and mitochondria",
        "Incluye captación de glucosa, utilización de ácidos grasos y producción celular de energía.",
        "It includes glucose uptake, fatty acid utilization and cellular energy production.",
        undefined,
        "chart",
      ),
      item(
        "Intestino y sistema cardiovascular",
        "Gut and cardiovascular system",
        "Explora microbiota, barrera intestinal, comunicación intestino–hígado y función endotelial.",
        "It explores the microbiota, intestinal barrier, gut–liver communication and endothelial function.",
        undefined,
        "link",
      ),
    ],
  },
  {
    id: "weight-quality",
    kind: "faq",
    eyebrow: l("CRITERIOS DE DESARROLLO", "DEVELOPMENT CRITERIA"),
    title: l(
      "Calidad y evidencia,\ncon contexto.",
      "Quality and evidence,\nin context.",
    ),
    items: [
      item(
        "¿Qué controles de calidad propone el dossier?",
        "What quality controls does the dossier propose?",
        "Identificación botánica, estandarización mediante HPLC, control de metales pesados, microorganismos, disolventes y, para resveratrol, pesticidas. También recomienda buenas prácticas de fabricación y certificados de análisis por lote. Son requisitos propuestos, no certificaciones concedidas al producto.",
        "Botanical identification, HPLC standardization, testing for heavy metals, microorganisms, solvents and, for resveratrol, pesticides. It also recommends good manufacturing practices and batch certificates of analysis. These are proposed requirements, not certifications granted to the product.",
      ),
      item(
        "¿Por qué importa la biodisponibilidad?",
        "Why does bioavailability matter?",
        "El dossier describe absorción limitada de berberina y metabolismo rápido del resveratrol. Revisa tecnologías de formulación y potenciadores de absorción, sin confirmar que la propuesta Plus utilice una presentación liposomal o nanotecnológica.",
        "The dossier describes limited berberine absorption and rapid resveratrol metabolism. It reviews formulation technologies and absorption enhancers without confirming that the Plus proposal uses a liposomal or nanotechnology presentation.",
      ),
      item(
        "¿Por qué no aparece quercetina en la composición?",
        "Why is quercetin absent from the composition?",
        "Algunos capítulos y figuras discuten quercetina dentro del fundamento científico. La tabla final de Plus–BR de la página 63 no la incluye: por eso la composición mostrada mantiene nueve ingredientes y no incorpora quercetina.",
        "Some chapters and figures discuss quercetin as part of the scientific rationale. The final Plus–BR table on page 63 does not include it, so the composition shown retains nine ingredients and does not add quercetin.",
      ),
    ],
  },
];
