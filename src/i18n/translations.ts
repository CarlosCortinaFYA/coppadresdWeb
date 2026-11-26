/**
 * Textos globales mínimos del sitio (metadatos por idioma).
 * Cada página gestiona su propio contenido bilingüe en su módulo.
 */
export type Language = "es" | "en";

export const translations: Record<Language, { metaTitle: string; metaDescription: string }> = {
  es: {
    metaTitle: "Agentic Wellness AI | Tu agente de bienestar con inteligencia artificial",
    metaDescription:
      "Agentic Wellness AI: un agente de bienestar con IA que une nutrición, ejercicio y adherencia en un plan diario, en tu móvil y tu reloj.",
  },
  en: {
    metaTitle: "Agentic Wellness AI | Your AI-powered wellness agent",
    metaDescription:
      "Agentic Wellness AI: an AI wellness agent that brings nutrition, exercise and adherence together in a daily plan, on your phone and your watch.",
  },
};
