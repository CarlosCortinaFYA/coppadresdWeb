import type { ProgramDefinition, ProgramId } from "./types";
import { weightSupportPlus } from "./weight-support-plus";
import { longevityProgram } from "./longevity-program";
import { pepMimetic } from "./pep-mimetic";
export { l } from "./types";
export type {
  Localized,
  ProgramId,
  ProgramDefinition,
  ProgramSection,
  ContentItem,
} from "./types";
export { programUI } from "./ui";
export const programs: Record<ProgramId, ProgramDefinition> = {
  coppAdresd: {
    id: "coppAdresd",
    name: "Copp Adresd",
    status: "available",
    institutional: true,
    sections: [],
  },
  // KAN-104: revisión de Meta. Weight Support Plus y Pep Mimetic se ocultan
  // temporalmente (suplementos/péptidos) sin borrar su contenido. Al quitar
  // `published: false` vuelven a aparecer en la navegación.
  weightSupportPlus: { ...weightSupportPlus, published: false },
  longevityProgram,
  pepMimetic: { ...pepMimetic, published: false },
};

export const programList = Object.values(programs).filter(
  (program) => program.published !== false,
);

export const DEFAULT_PROGRAM_ID: ProgramId = programList[0]?.id ?? "coppAdresd";
