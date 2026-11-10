/**
 * Contenido de la página de membresía en ES/EN. La legalidad ES se conserva
 * del documento de referencia "Membresía COPP-ADRESD"; EN es su traducción.
 */

export interface ModuleContent {
  name: string;
  description: string;
}

export const membershipContent = {
  es: {
    metaTitle: "Membresía COPP–ADRESD | Programa de bienestar",
    home: "Ir al inicio",
    backSite: "Volver a la web",
    close: "Cerrar",
    language: "Cambiar a inglés",
    light: "Activar modo claro",
    dark: "Activar modo oscuro",
    eyebrow: "PROGRAMA COPP-ADRESD",
    hero: {
      title: ["Una membresía.", "Todo el acompañamiento."],
      description:
        "Plataforma con agente de IA 24/7, nutrición supervisada y tu nutracéutico incluido. Un solo plan: elige cómo pagarlo y ajusta los módulos opcionales.",
      facts: [
        "Acompañamiento con IA 24/7",
        "Nutrición revisada por especialistas",
        "Nutracéutico con entrega incluida",
      ],
      scrollHint: "Configura tu plan",
    },
    stepper: ["Tu plan", "Pago seguro", "Confirmación"],
    heroNote:
      "Precios en dólares (USD). Cancela cuando quieras; los servicios incluidos son de un solo miembro.",
    sections: {
      plan: "Cómo quieres pagar",
      included: "Incluido en el programa",
      modules: "Módulos opcionales",
      modulesHint:
        "Solo estos dos módulos puedes quitar de tu plan; el resto del programa es indivisible por diseño.",
      device: "Dispositivo",
      deviceHint:
        "Opcional y de pago único, aparte del plan. Solo un dispositivo por cuenta.",
      removeOn: "Quitar de mi plan",
      removeOff: "Volver a incluir",
      includedTag: "Incluido",
      offTag: "Quitado",
      offYearTag: "quitar",
      saveTag: "Ahorra con anual",
      deviceIncluded: "—",
      recurring: "al año",
      recurringMonth: "por mes",
      oneTime: "pago único",
    },
    plans: {
      annual: {
        name: "Anual",
        note: "Todo el año por un solo pago",
        badge: "Ahorra 25 %",
      },
      monthly: {
        name: "Mensual",
        note: "Mismo programa, pago a pago",
        badge: "$400.00 al año",
      },
      perMonth: "/mes",
    },
    modules: {
      sos: {
        name: "SOS y protección familiar",
        description:
          "Botón de ayuda y avisos a tus contactos de confianza ante emergencias.",
      },
      community: {
        name: "Comunidad",
        description:
          "Clubes por interés, retos entre miembros y publicaciones para compartir avances.",
      },
    },
    core: [
      {
        id: "agent",
        icon: "sparkles",
        name: "Agente inteligente 24/7",
        description: "Acompañamiento de IA permanente en tu ritmo y horario.",
      },
      {
        id: "monitoring",
        icon: "pulse",
        name: "Monitoreo inteligente",
        description: "Seguimiento de hábitos, sueño y señales de bienestar.",
      },
      {
        id: "nutrition",
        icon: "bowl",
        name: "Nutrición con IA",
        description:
          "Planes de 30 días revisados por nutricionista: bajar y sostener el peso.",
      },
      {
        id: "nutraceutical",
        icon: "capsule",
        name: "Weight Support Plus·BR",
        description:
          "Tu nutracéutico (berberina + resveratrol) con entrega incluida.",
      },
      {
        id: "gamification",
        icon: "star",
        name: "Gamificación",
        description:
          "Metas, retos personales y logros para mantener la constancia.",
      },
    ],
    devices: {
      none: {
        name: "Solo la app",
        description: "Usa el programa completo desde tu teléfono.",
      },
      band: {
        name: "Manilla inteligente",
        description: "Seguimiento continuo, pago único aparte del plan.",
      },
      ring: {
        name: "Anillo inteligente",
        description:
          "Señales de sueño y recuperación, pago único aparte del plan.",
      },
    },
    summary: {
      title: "Tu resumen",
      planAnnual: "Plan anual",
      planMonthly: "Plan mensual",
      offRow: "Sin",
      includedRow: "Incluye",
      deviceRow: "Dispositivo",
      deviceNone: "Ninguno",
      taxesRow: "Impuestos",
      taxesHint: "se calculan al pagar",
      dueRow: "Hoy pagas",
      dueAnnual: "el plan por un año",
      dueMonthly: "el mes en curso",
      dueWithDevice: "el plan por un año + dispositivo",
      savingsRow: "Ahorras con anual",
      edit: "Editar",
      continue: "Continuar al pago seguro",
      secure: "Conexión segura. Este paso nunca pide datos de tarjeta.",
      demo: "Modo demostración: integramos la pasarela de pago próximamente; hoy no se procesan cargos reales.",
    },
    checkout: {
      eyebrow: "PASO 2",
      title: "Pago seguro",
      description:
        "Revisa tu membresía y completa los datos de la tarjeta. Demostración: nada sale de esta página.",
      contactTitle: "Tus datos",
      name: "Nombre completo",
      email: "Correo electrónico",
      cardTitle: "Datos de pago",
      cardNumber: "Número de tarjeta",
      cardName: "Nombre que aparece en la tarjeta",
      expiry: "Vencimiento",
      csc: "Código de seguridad",
      numberHint: "Formato: 1234 5678 9012 3456",
      expiryHint: "Formato: MM/AA",
      cscHint: "3 o 4 dígitos",
      pay: "Pagar",
      back: "Volver a mi plan",
      processing: "Procesando pago…",
      errorCard:
        "El número de tarjeta no es válido. Revísalo e inténtalo de nuevo.",
      errorForm: "Completa los campos marcados.",
      whatsapp: "¿Prefieres ayuda humana? Continuar en WhatsApp",
      recap: { title: "Recibo de tu membresía" },
      secureNote: "Cifrado en tránsito. Demostración: los datos no se envían.",
    },
    processing: {
      title: "Activando tu membresía",
      steps: [
        "Validando tu información",
        "Contactando al procesador de pagos",
        "Activando tu programa",
      ],
      note: "Demostración: ninguna tarjeta será cargada.",
    },
    done: {
      eyebrow: "PASO 3",
      title: "¡Tu membresía está lista!",
      description:
        "Reservamos la configuración que elegiste. En la versión real, este paso confirmaría el cobro y activaría tu cuenta al instante.",
      reference: "Referencia",
      nextTitle: "Esto pasa al finalizar el pago",
      next: [
        "Recibes el comprobante con el detalle de tu suscripción.",
        "El equipo de bienestar te prepara el onboarding en la app.",
        "Tus módulos quedan activos desde la primera semana.",
      ],
      again: "Configurar otra vez",
      home: "Volver al inicio",
      whatsapp: "Hablar con un asesor",
      disclaimer:
        "Modo demostración. Ninguna tarjeta fue cargada y tus datos no fueron enviados ni guardados.",
    },
    legalTitle: "Sobre este programa",
    legal:
      "COPP-ADRESD es un programa de bienestar y acompañamiento; no diagnostica, trata ni previene enfermedades ni reemplaza la atención médica. El nutracéutico es un suplemento dietario: no está destinado a diagnosticar, tratar, curar ni prevenir ninguna enfermedad y los resultados individuales varían. Los impuestos de venta se calculan al pagar según tu estado. Los servicios de emergencia (SOS) dependen de cobertura y de acuerdos con terceros y no sustituyen al 911. Dispositivos: un solo dispositivo por cuenta. Precios en dólares (USD).",
    whatsappMessage(selection: string, amount: string): string {
      return `Hola, quiero contratar la membresía COPP-ADRESD: ${selection}. Cargo estimado hoy: ${amount}.`;
    },
    aria: {
      moduleSwitch: (name: string, off: boolean) =>
        off ? `Incluir ${name}` : `Quitar ${name}`,
      dueToday: "Cargo de hoy",
    },
    currency: "USD",
  },
  en: {
    metaTitle: "COPP–ADRESD Membership | Wellbeing program",
    home: "Go to home",
    backSite: "Back to site",
    close: "Close",
    language: "Switch to Spanish",
    light: "Switch to light mode",
    dark: "Switch to dark mode",
    eyebrow: "COPP-ADRESD PROGRAM",
    hero: {
      title: ["One membership.", "Complete guidance."],
      description:
        "A platform with a 24/7 AI agent, supervised nutrition and your nutraceutical included. A single plan: choose how to pay and adjust the optional modules.",
      facts: [
        "24/7 AI companion",
        "Nutrition reviewed by specialists",
        "Nutraceutical with delivery included",
      ],
      scrollHint: "Configure your plan",
    },
    stepper: ["Your plan", "Secure payment", "Confirmation"],
    heroNote:
      "Prices in US dollars (USD). Cancel anytime; each membership covers one member.",
    sections: {
      plan: "How would you like to pay",
      included: "Included in the program",
      modules: "Optional modules",
      modulesHint:
        "Only these two modules can be removed; the rest of the program is indivisible by design.",
      device: "Device",
      deviceHint:
        "Optional one-time payment, on top of the plan. One device per account.",
      removeOn: "Remove from my plan",
      removeOff: "Add it back",
      includedTag: "Included",
      offTag: "Removed",
      offYearTag: "remove",
      saveTag: "Save with annual",
      deviceIncluded: "—",
      recurring: "a year",
      recurringMonth: "per month",
      oneTime: "one-time payment",
    },
    plans: {
      annual: {
        name: "Annual",
        note: "The whole year with a single payment",
        badge: "Save 25 %",
      },
      monthly: {
        name: "Monthly",
        note: "Same program, pay as you go",
        badge: "$400.00 a year",
      },
      perMonth: "/month",
    },
    modules: {
      sos: {
        name: "SOS and family protection",
        description:
          "Help button and alerts to trusted contacts in emergencies.",
      },
      community: {
        name: "Community",
        description:
          "Interest clubs, member challenges and posts to share progress.",
      },
    },
    core: [
      {
        id: "agent",
        icon: "sparkles",
        name: "Intelligent agent 24/7",
        description: "Always-on AI companionship on your own pace.",
      },
      {
        id: "monitoring",
        icon: "pulse",
        name: "Smart monitoring",
        description: "Tracking of habits, sleep and wellbeing signals.",
      },
      {
        id: "nutrition",
        icon: "bowl",
        name: "AI nutrition",
        description:
          "30-day plans reviewed by a nutritionist: lose and sustain weight.",
      },
      {
        id: "nutraceutical",
        icon: "capsule",
        name: "Weight Support Plus·BR",
        description:
          "Your nutraceutical (berberine + resveratrol) with delivery included.",
      },
      {
        id: "gamification",
        icon: "star",
        name: "Gamification",
        description:
          "Goals, personal challenges and achievements to keep consistency.",
      },
    ],
    devices: {
      none: {
        name: "App only",
        description: "Use the full program from your phone.",
      },
      band: {
        name: "Smart band",
        description:
          "Continuous tracking, one-time payment on top of the plan.",
      },
      ring: {
        name: "Smart ring",
        description:
          "Sleep and recovery signals, one-time payment on top of the plan.",
      },
    },
    summary: {
      title: "Your summary",
      planAnnual: "Annual plan",
      planMonthly: "Monthly plan",
      offRow: "Without",
      includedRow: "Includes",
      deviceRow: "Device",
      deviceNone: "None",
      taxesRow: "Taxes",
      taxesHint: "calculated at checkout",
      dueRow: "You pay today",
      dueAnnual: "one year of the plan",
      dueMonthly: "the current month",
      dueWithDevice: "the yearly plan + device",
      savingsRow: "You save with annual",
      edit: "Edit",
      continue: "Continue to secure payment",
      secure: "Secure connection. This step never asks for card details.",
      demo: "Demo mode: the payment gateway will be integrated soon; no real charges are processed today.",
    },
    checkout: {
      eyebrow: "STEP 2",
      title: "Secure payment",
      description:
        "Review your membership and complete the card details. Demonstration: nothing leaves this page.",
      contactTitle: "Your details",
      name: "Full name",
      email: "Email address",
      cardTitle: "Payment details",
      cardNumber: "Card number",
      cardName: "Name on card",
      expiry: "Expiration",
      csc: "Security code",
      numberHint: "Format: 1234 5678 9012 3456",
      expiryHint: "Format: MM/YY",
      cscHint: "3 or 4 digits",
      pay: "Pay",
      back: "Back to my plan",
      processing: "Processing payment…",
      errorCard: "The card number is not valid. Check it and try again.",
      errorForm: "Please complete the marked fields.",
      whatsapp: "Rather talk to a person? Continue on WhatsApp",
      recap: { title: "Membership receipt" },
      secureNote: "Encrypted in transit. Demonstration: data is not sent.",
    },
    processing: {
      title: "Activating your membership",
      steps: [
        "Validating your information",
        "Contacting the payment processor",
        "Activating your program",
      ],
      note: "Demonstration: no card will be charged.",
    },
    done: {
      eyebrow: "STEP 3",
      title: "Your membership is ready!",
      description:
        "We have reserved the configuration you chose. In the real flow, this step confirms the charge and activates your account instantly.",
      reference: "Reference",
      nextTitle: "What happens after checkout",
      next: [
        "You receive the receipt with your subscription details.",
        "The wellbeing team prepares your app onboarding.",
        "Your modules are active from the first week.",
      ],
      again: "Configure again",
      home: "Back to home",
      whatsapp: "Talk to an advisor",
      disclaimer:
        "Demo mode. No card was charged and your data was not sent or stored.",
    },
    legalTitle: "About this program",
    legal:
      "COPP-ADRESD is a wellbeing and support program; it does not diagnose, treat or prevent disease and it does not replace medical care. The nutraceutical is a dietary supplement: it is not intended to diagnose, treat, cure or prevent any disease, and individual results vary. Sales taxes are calculated at checkout based on your state. Emergency services (SOS) depend on coverage and third-party agreements and do not replace 911. Devices: one device per account. Prices in US dollars (USD).",
    whatsappMessage(selection: string, amount: string): string {
      return `Hi, I would like to join the COPP-ADRESD membership: ${selection}. Estimated charge today: ${amount}.`;
    },
    aria: {
      moduleSwitch: (name: string, off: boolean) =>
        off ? `Add ${name} back` : `Remove ${name}`,
      dueToday: "Charge today",
    },
    currency: "USD",
  },
} as const;

export type MembershipContent = (typeof membershipContent)["es"];
