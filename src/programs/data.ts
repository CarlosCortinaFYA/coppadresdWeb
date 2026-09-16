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
  weightSupportPlus,
  longevityProgram,
  pepMimetic,
};
export const programList = Object.values(programs);
