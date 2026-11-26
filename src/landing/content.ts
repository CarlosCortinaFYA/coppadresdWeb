/**
 * Contenido bilingüe de la landing Agentic Wellness AI.
 * Las cifras que aparecen en las tarjetas flotantes y en la demo del agente
 * son ilustrativas (ejemplo de uso), no métricas de producto.
 */
import type { Language } from "../i18n/translations";

export const BRAND = "Agentic Wellness AI";

const es = {
  metaTitle: "Agentic Wellness AI | Tu agente de bienestar con inteligencia artificial",
  metaDescription:
    "Agentic Wellness AI: un agente de bienestar con IA que une nutrición, ejercicio y adherencia en un plan diario, en tu móvil y tu reloj.",
  skip: "Saltar al contenido",
  nav: [
    { id: "agente", label: "Agente IA" },
    { id: "plataforma", label: "Plataforma" },
    { id: "app", label: "App" },
    { id: "wearables", label: "Wearables" },
  ],
  membership: "Membresía",
  join: "Únete ahora",
  seeApp: "Ver la app",
  toggleLanguage: "Switch to English",
  toggleTheme: { light: "Activar modo oscuro", dark: "Activar modo claro" },
  menu: { open: "Abrir menú", close: "Cerrar menú" },
  hero: {
    eyebrow: "Tu agente de bienestar con IA",
    title: ["Bienestar con IA,", "a tu ritmo."],
    lead: "Nutrición, ejercicio y adherencia en un plan que la IA ajusta contigo cada día, desde tu móvil y tu reloj.",
    imageAlt: "Mujer corriendo junto a una pared naranja con un reloj inteligente en la muñeca",
    phoneAlt:
      "Pantalla de inicio de la app: saludo del agente, plan de bienestar con objetivo bajar de peso y accesos rápidos",
    pulse: { label: "Ritmo cardiaco", value: "142", unit: "lpm", zone: "Zona 2" },
    bubble: "Vas muy bien. Mantén este ritmo 4 minutos más.",
  },
  agent: {
    title: "Conoce a tu agente.",
    lead: "Le cuentas cómo te sientes y reorganiza tu día: comidas, entrenamiento, descanso y recordatorios.",
    user: "Hoy dormí mal y no tengo mucha energía.",
    typing: "Tu agente está escribiendo",
    reply:
      "Entendido. Cambié tu entrenamiento por una caminata suave de 20 minutos y te propongo un desayuno alto en proteína. ¿Lo agrego a tu plan?",
    chips: ["Sí, agrégalo", "Ver el desayuno", "Recordármelo a las 7:00"],
    input: "Pregúntame o cuéntame cómo te sientes...",
    replay: "Repetir conversación",
  },
  platform: {
    title: "Todo tu bienestar en un solo plan.",
    lead: "Cada módulo comparte datos con tu agente, así las recomendaciones tienen contexto.",
    items: {
      nutrition: {
        title: "Nutrición",
        text: "Planes y menús personalizados con IA. Registra tus comidas con una foto.",
        alt: "Bowl con salmón, verduras y huevo visto desde arriba",
      },
      exercise: {
        title: "Plan de ejercicios",
        text: "Rutinas que se adaptan a tu energía, tu tiempo y tu progreso.",
        alt: "Mujer haciendo abdominales sobre una esterilla junto a la ventana",
      },
      adherence: {
        title: "Adherencia",
        text: "Seguimiento diario, rachas y avisos para que el plan se cumpla.",
        ring: "actividades",
        streak: "días de racha",
      },
      meds: {
        title: "Medicamentos",
        text: "Recordatorios y control de tomas, sin olvidos.",
        reminder: "Vitamina D",
        time: "08:00",
        done: "Tomada",
      },
      sleep: {
        title: "Sueño y recuperación",
        text: "Tu descanso cambia tu plan del día siguiente.",
        alt: "Persona durmiendo en una cama blanca",
      },
      community: {
        title: "Comunidad",
        text: "Retos, apoyo y avances compartidos.",
        alt: "Dos personas entrenando con cuerdas de batalla en un gimnasio",
      },
    },
  },
  app: {
    eyebrow: "La app",
    title: "Diseñada para acompañarte, no para distraerte.",
    steps: [
      {
        title: "Evaluación",
        text: "Tu agente conoce tu objetivo, tus hábitos y tu punto de partida en una conversación.",
        alt: "Pantalla del protocolo de hoy con progreso del día al 60% y tareas de pódcast, ejercicio y nutrición",
      },
      {
        title: "Plan personalizado",
        text: "Recibes un plan por semanas con nutrición, actividad, bienestar y seguimiento.",
        alt: "Pantalla del plan de bienestar con objetivo bajar de peso, semana 9 de 12 y 7 de 12 actividades completadas",
      },
      {
        title: "Seguimiento diario",
        text: "Registras peso, comidas, sueño y signos vitales con un toque. El agente ajusta el resto.",
        alt: "Pantalla de inicio con accesos rápidos a nutrición, medicamentos, comunidad y SOS",
      },
    ],
  },
  wearables: {
    title: "Conecta tu reloj. Tu agente hace el resto.",
    lead: "Pasos, ritmo cardiaco y sueño llegan a tu plan sin que tengas que anotarlos.",
    imageAlt: "Persona revisando los anillos de actividad en su reloj inteligente",
    facts: [
      { title: "Actividad", text: "Pasos, minutos activos y entrenamientos." },
      { title: "Corazón", text: "Ritmo cardiaco en reposo y durante el ejercicio." },
      { title: "Sueño", text: "Duración y regularidad de tu descanso." },
    ],
    note: "Depende de los dispositivos compatibles de cada persona. La app solo lee y organiza esos datos.",
  },
  how: {
    title: "Empezar toma menos de cinco minutos.",
    steps: [
      { title: "Cuéntale tu objetivo", text: "Bajar de peso, moverte más, dormir mejor o controlar un hábito." },
      { title: "Recibe tu plan", text: "La IA arma tu semana con nutrición, ejercicio y recordatorios." },
      { title: "Avanza cada día", text: "Tu agente revisa tu progreso y ajusta el plan contigo." },
    ],
  },
  faq: {
    title: "Preguntas frecuentes",
    items: [
      {
        q: "¿Qué es Agentic Wellness AI?",
        a: "Una plataforma de bienestar con un agente de inteligencia artificial que te acompaña en nutrición, ejercicio, sueño y adherencia desde una app móvil.",
      },
      {
        q: "¿Reemplaza a mi médico?",
        a: "No. Es un programa de bienestar y acompañamiento; no diagnostica ni trata enfermedades. Ante cualquier síntoma o urgencia acude a un profesional de salud.",
      },
      {
        q: "¿Necesito un reloj inteligente?",
        a: "No es obligatorio. Puedes registrar todo en la app; si tienes un dispositivo compatible, los datos se integran solos.",
      },
      {
        q: "¿Qué pasa con mis datos?",
        a: "Tus datos se usan para personalizar tu plan. Puedes solicitar la eliminación de tu cuenta en cualquier momento.",
      },
    ],
  },
  cta: {
    title: "Empieza hoy con tu agente.",
    lead: "Elige tu membresía y recibe tu primer plan personalizado.",
    whatsapp: "Escríbenos por WhatsApp",
    imageAlt: "Mujer con reloj inteligente bebiendo agua en una pista de atletismo",
    whatsappMessage: "Hola, quiero saber más sobre Agentic Wellness AI.",
  },
  footer: {
    tagline: "Inteligencia artificial al servicio de tu bienestar.",
    product: "Producto",
    support: "Soporte",
    patient: "Atención al paciente",
    deleteAccount: "Eliminar cuenta",
    disclaimer:
      "Agentic Wellness AI es un programa de bienestar y acompañamiento. No diagnostica, trata ni previene enfermedades ni reemplaza la atención médica.",
    rights: "Todos los derechos reservados.",
    photos: "Fotografías: Unsplash.",
  },
};

type LandingContent = typeof es;

const en: LandingContent = {
  metaTitle: "Agentic Wellness AI | Your AI-powered wellness agent",
  metaDescription:
    "Agentic Wellness AI: an AI wellness agent that brings nutrition, exercise and adherence together in a daily plan, on your phone and your watch.",
  skip: "Skip to content",
  nav: [
    { id: "agente", label: "AI agent" },
    { id: "plataforma", label: "Platform" },
    { id: "app", label: "App" },
    { id: "wearables", label: "Wearables" },
  ],
  membership: "Membership",
  join: "Join now",
  seeApp: "See the app",
  toggleLanguage: "Cambiar a español",
  toggleTheme: { light: "Switch to dark mode", dark: "Switch to light mode" },
  menu: { open: "Open menu", close: "Close menu" },
  hero: {
    eyebrow: "Your AI wellness agent",
    title: ["AI wellness,", "at your pace."],
    lead: "Nutrition, exercise and adherence in one plan the AI adjusts with you every day, from your phone and your watch.",
    imageAlt: "Woman running past an orange wall wearing a smartwatch",
    phoneAlt:
      "App home screen: the agent greeting, a wellness plan with a weight loss goal and quick actions",
    pulse: { label: "Heart rate", value: "142", unit: "bpm", zone: "Zone 2" },
    bubble: "Great job. Keep this pace for 4 more minutes.",
  },
  agent: {
    title: "Meet your agent.",
    lead: "Tell it how you feel and it reorganizes your day: meals, training, rest and reminders.",
    user: "I slept badly and I'm low on energy today.",
    typing: "Your agent is typing",
    reply:
      "Got it. I swapped your workout for an easy 20 minute walk and suggest a high protein breakfast. Should I add it to your plan?",
    chips: ["Yes, add it", "Show the breakfast", "Remind me at 7:00"],
    input: "Ask me or tell me how you feel...",
    replay: "Replay conversation",
  },
  platform: {
    title: "All your wellbeing in one plan.",
    lead: "Every module shares data with your agent, so recommendations have context.",
    items: {
      nutrition: {
        title: "Nutrition",
        text: "AI-personalized plans and menus. Log meals with a photo.",
        alt: "Bowl with salmon, vegetables and egg seen from above",
      },
      exercise: {
        title: "Exercise plan",
        text: "Routines that adapt to your energy, your time and your progress.",
        alt: "Woman doing crunches on a mat next to a window",
      },
      adherence: {
        title: "Adherence",
        text: "Daily tracking, streaks and nudges so the plan actually happens.",
        ring: "activities",
        streak: "day streak",
      },
      meds: {
        title: "Medications",
        text: "Reminders and dose tracking, nothing forgotten.",
        reminder: "Vitamin D",
        time: "08:00",
        done: "Taken",
      },
      sleep: {
        title: "Sleep and recovery",
        text: "Your rest shapes the next day's plan.",
        alt: "Person sleeping in a white bed",
      },
      community: {
        title: "Community",
        text: "Challenges, support and shared progress.",
        alt: "Two people training with battle ropes in a gym",
      },
    },
  },
  app: {
    eyebrow: "The app",
    title: "Designed to support you, not distract you.",
    steps: [
      {
        title: "Assessment",
        text: "Your agent learns your goal, habits and starting point in one conversation.",
        alt: "Today's protocol screen with daily progress at 60% and podcast, exercise and nutrition tasks",
      },
      {
        title: "Personalized plan",
        text: "You get a week-by-week plan covering nutrition, activity, wellbeing and tracking.",
        alt: "Wellness plan screen with a weight loss goal, week 9 of 12 and 7 of 12 activities completed",
      },
      {
        title: "Daily tracking",
        text: "Log weight, meals, sleep and vitals in one tap. The agent adjusts the rest.",
        alt: "Home screen with quick access to nutrition, medications, community and SOS",
      },
    ],
  },
  wearables: {
    title: "Connect your watch. Your agent does the rest.",
    lead: "Steps, heart rate and sleep flow into your plan without manual logging.",
    imageAlt: "Person checking the activity rings on a smartwatch",
    facts: [
      { title: "Activity", text: "Steps, active minutes and workouts." },
      { title: "Heart", text: "Resting and workout heart rate." },
      { title: "Sleep", text: "Duration and consistency of your rest." },
    ],
    note: "Depends on each person's compatible devices. The app only reads and organizes that data.",
  },
  how: {
    title: "Getting started takes less than five minutes.",
    steps: [
      { title: "Share your goal", text: "Lose weight, move more, sleep better or manage a habit." },
      { title: "Get your plan", text: "The AI builds your week with nutrition, exercise and reminders." },
      { title: "Progress every day", text: "Your agent reviews your progress and adjusts the plan with you." },
    ],
  },
  faq: {
    title: "Frequently asked questions",
    items: [
      {
        q: "What is Agentic Wellness AI?",
        a: "A wellness platform with an artificial intelligence agent that supports your nutrition, exercise, sleep and adherence from a mobile app.",
      },
      {
        q: "Does it replace my doctor?",
        a: "No. It is a wellbeing and support program; it does not diagnose or treat disease. For any symptom or emergency, see a health professional.",
      },
      {
        q: "Do I need a smartwatch?",
        a: "It is optional. You can log everything in the app; if you have a compatible device, the data syncs on its own.",
      },
      {
        q: "What happens to my data?",
        a: "Your data is used to personalize your plan. You can request deletion of your account at any time.",
      },
    ],
  },
  cta: {
    title: "Start today with your agent.",
    lead: "Choose your membership and get your first personalized plan.",
    whatsapp: "Message us on WhatsApp",
    imageAlt: "Woman with a smartwatch drinking water on a running track",
    whatsappMessage: "Hi, I'd like to know more about Agentic Wellness AI.",
  },
  footer: {
    tagline: "Artificial intelligence working for your wellbeing.",
    product: "Product",
    support: "Support",
    patient: "Patient support",
    deleteAccount: "Delete account",
    disclaimer:
      "Agentic Wellness AI is a wellbeing and support program. It does not diagnose, treat or prevent disease and does not replace medical care.",
    rights: "All rights reserved.",
    photos: "Photos: Unsplash.",
  },
};

export const landingContent: Record<Language, LandingContent> = { es, en };
