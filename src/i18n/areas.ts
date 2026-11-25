import type { Language } from "./translations";

export type Area = {
  brand: string;
  icon: string;
  color: string;
  es: { name: string; text: string };
  en: { name: string; text: string };
};
export const areas: Area[] = [
  {
    brand: "HEALTH GATE",
    icon: "heart",
    color: "#023467",
    es: {
      name: "Salud",
      text: "Productos, soluciones y servicios de salud que conectan prevención y cuidado integral.",
    },
    en: {
      name: "Health",
      text: "Health products, solutions and services connecting prevention and integrated care.",
    },
  },
  {
    brand: "FOOD LIFE",
    icon: "bowl",
    color: "#035d4d",
    es: {
      name: "Alimentación",
      text: "Comercialización de alimentos y soluciones de alimentación para instituciones y personas.",
    },
    en: {
      name: "Food",
      text: "Food distribution and food solutions for institutions and individuals.",
    },
  },
  {
    brand: "BIOGATE",
    icon: "leaf",
    color: "#0c4c6b",
    es: {
      name: "Aseo y cuidado",
      text: "Productos y soluciones de aseo para el cuidado de los entornos cotidianos.",
    },
    en: {
      name: "Hygiene & care",
      text: "Hygiene products and solutions for the care of everyday environments.",
    },
  },
  {
    brand: "ABH",
    icon: "shirt",
    color: "#3d7b72",
    es: {
      name: "Vestuario",
      text: "Productos y soluciones de vestuario para el mercado institucional y las personas.",
    },
    en: {
      name: "Apparel",
      text: "Clothing products and solutions for institutional and individual needs.",
    },
  },
  {
    brand: "NATURA",
    icon: "sprout",
    color: "#5581a2",
    es: {
      name: "Producción de alimentos",
      text: "Soluciones de producción alimentaria que forman parte de una visión integral del bienestar.",
    },
    en: {
      name: "Food production",
      text: "Food production solutions within an integrated vision of wellbeing.",
    },
  },
  {
    brand: "CROWN",
    icon: "sparkles",
    color: "#4b7086",
    es: {
      name: "Cosmética",
      text: "Productos cosméticos y soluciones de cuidado personal para distintos contextos y necesidades.",
    },
    en: {
      name: "Cosmetics",
      text: "Cosmetic products and personal care solutions for different contexts and needs.",
    },
  },
  {
    brand: "ESENCIA",
    icon: "play",
    color: "#023467",
    es: {
      name: "Digital y audiovisual",
      text: "Marketing digital, contenidos y producción audiovisual para comunicar y conectar.",
    },
    en: {
      name: "Digital & audiovisual",
      text: "Digital marketing, content and audiovisual production that communicate and connect.",
    },
  },
  {
    brand: "NUGATE",
    icon: "capsule",
    color: "#035d4d",
    es: {
      name: "Nutracéuticos",
      text: "Desarrollo y producción de nutracéuticos especiales, pulverizados y gelificados.",
    },
    en: {
      name: "Nutraceuticals",
      text: "Development and production of specialty nutraceuticals, powders and gels.",
    },
  },
  {
    brand: "FROZEN FOOD",
    icon: "snow",
    color: "#0c4c6b",
    es: {
      name: "Alimentos congelados",
      text: "Producción de alimentos congelados y empacados al vacío para personas y organizaciones.",
    },
    en: {
      name: "Frozen food",
      text: "Production of frozen and vacuum-packed foods for people and organizations.",
    },
  },
  {
    brand: "SBC Agentic Wellness IA",
    icon: "star",
    color: "#3d7b72",
    es: {
      name: "Eventos y experiencias",
      text: "Summits, boot camps, conciertos y eventos que reúnen conocimiento, comunidad y experiencias.",
    },
    en: {
      name: "Events & experiences",
      text: "Summits, boot camps, concerts and events bringing together knowledge, community and experiences.",
    },
  },
  {
    brand: "CA WELLNESS",
    icon: "sunrise",
    color: "#5581a2",
    es: {
      name: "Bienestar",
      text: "Programas, experiencias y servicios integrativos orientados al bienestar y al desarrollo personal.",
    },
    en: {
      name: "Wellness",
      text: "Programs, experiences and integrated services focused on wellbeing and personal development.",
    },
  },
  {
    brand: "Agentic Wellness IA ACADEMY",
    icon: "academy",
    color: "#4b7086",
    es: {
      name: "Academia",
      text: "Educación, formación y capacitación para acompañar el aprendizaje y el desarrollo humano.",
    },
    en: {
      name: "Academy",
      text: "Education, training and learning experiences that support human development.",
    },
  },
];
export const localizedArea = (index: number, language: Language) => ({
  ...areas[index],
  ...areas[index][language],
});
