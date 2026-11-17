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
        "Un solo plan con todo incluido: acompañamiento con IA 24/7, control de medicamentos, nutrición inteligente, gamificación, SOS y comunidad. Paga mes a mes o ahorra pagando el año completo. Precios en USD.",
      facts: [
        "Acompañamiento con IA 24/7",
        "Un solo plan con todo incluido",
        "Ahorra 50 % pagando el año",
      ],
      scrollHint: "Configura tu plan",
    },
    stepper: ["Tu plan", "Pago seguro", "Confirmación"],
    heroNote:
      "Precios en dólares (USD). Cancela cuando quieras; los servicios incluidos son de un solo miembro.",
    sections: {
      plan: "Cómo quieres pagar",
      included: "Todo esto está incluido",
      includedHint:
        "El monitoreo inteligente depende de los dispositivos médicos o de bienestar compatibles de cada persona. COPP-ADRESD solo extrae y organiza esos datos; no mide por sí misma.",
      includedTag: "Incluido",
      recurring: "al año",
      recurringMonth: "por mes",
    },
    plans: {
      annual: {
        name: "Anual",
        note: "El año completo por un solo pago",
        badge: "Ahorra 50 %",
      },
      monthly: {
        name: "Mensual",
        note: "Mismo programa, pago mes a mes",
        badge: "$239.52 al año",
      },
      perMonth: "/mes",
    },
    core: [
      {
        id: "agent",
        icon: "sparkles",
        name: "Agente inteligente 24/7",
        description: "Acompañamiento de IA permanente.",
      },
      {
        id: "monitoring",
        icon: "pulse",
        name: "Monitoreo inteligente",
        description:
          "Reúne en la app los datos de tus dispositivos médicos o de bienestar compatibles. COPP-ADRESD solo extrae la información.",
      },
      {
        id: "medication",
        icon: "capsule",
        name: "Control de medicamentos",
        description:
          "Escanea o busca tu medicina, programa horarios, recibe recordatorios, controla tu inventario y registra efectos secundarios.",
      },
      {
        id: "nutrition",
        icon: "bowl",
        name: "Nutrición inteligente con IA",
        description:
          "Planes de 30 días como sugerencia del programa, que debes validar con un profesional de la salud avalado.",
      },
      {
        id: "gamification",
        icon: "star",
        name: "Gamificación",
        description:
          "Metas, retos personales, puntos y logros para mantener la constancia.",
      },
      {
        id: "sos",
        icon: "shield",
        name: "SOS y protección familiar",
        description: "Botón de ayuda y avisos a contactos de confianza.",
      },
      {
        id: "community",
        icon: "users",
        name: "Comunidad",
        description:
          "Clubes por interés, interacción entre miembros y publicaciones para compartir avances y apoyo.",
      },
    ],
    summary: {
      title: "Tu resumen",
      planAnnual: "Plan anual",
      planMonthly: "Plan mensual",
      equivalentRow: "Equivalente mensual",
      monthlyYearRow: "Total al año pagando mensual",
      annualRow: "Pagando anual serían",
      taxesRow: "Impuestos",
      taxesHint: "se calculan al pagar",
      dueAnnual: "el plan por un año",
      dueMonthly: "el mes en curso",
      savingsRow: "Tu ahorro",
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
        "Tu programa queda activo desde la primera semana.",
      ],
      again: "Configurar otra vez",
      home: "Volver al inicio",
      whatsapp: "Hablar con un asesor",
      disclaimer:
        "Modo demostración. Ninguna tarjeta fue cargada y tus datos no fueron enviados ni guardados.",
    },
    legalTitle: "Sobre este programa",
    legal:
      "COPP-ADRESD es un programa de bienestar y acompañamiento; no diagnostica, trata ni previene enfermedades ni reemplaza la atención médica. Por ahora la plataforma no cuenta con profesionales de la salud atendiendo: los planes nutricionales son sugerencias o recomendaciones del programa y deben ser validados por un profesional de la salud avalado y de tu elección antes de seguirlos. El control de medicamentos es un registro informativo; no prescribe ni modifica tratamientos y sus alertas no sustituyen el criterio de tu médico o farmacéutico. Los impuestos de venta se calculan al pagar según tu estado. Los servicios de emergencia (SOS) dependen de cobertura y de acuerdos con terceros y no sustituyen el 911. Precios en dólares (USD).",
    whatsappMessage(selection: string, amount: string): string {
      return `Hola, quiero contratar la membresía COPP-ADRESD: ${selection}. Cargo estimado hoy: ${amount}.`;
    },
    aria: {
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
        "A single plan with everything included: 24/7 AI guidance, medication tracking, smart nutrition, gamification, SOS and community. Pay month to month or save by paying for the full year. Prices in USD.",
      facts: [
        "24/7 AI companion",
        "A single plan with everything included",
        "Save 50 % with the annual plan",
      ],
      scrollHint: "Configure your plan",
    },
    stepper: ["Your plan", "Secure payment", "Confirmation"],
    heroNote:
      "Prices in US dollars (USD). Cancel anytime; each membership covers one member.",
    sections: {
      plan: "How would you like to pay",
      included: "Everything included",
      includedHint:
        "Smart monitoring depends on each person's compatible medical or wellness devices. COPP-ADRESD only extracts and organizes that data; it does not measure on its own.",
      includedTag: "Included",
      recurring: "a year",
      recurringMonth: "per month",
    },
    plans: {
      annual: {
        name: "Annual",
        note: "The whole year with a single payment",
        badge: "Save 50 %",
      },
      monthly: {
        name: "Monthly",
        note: "Same program, month to month",
        badge: "$239.52 a year",
      },
      perMonth: "/month",
    },
    core: [
      {
        id: "agent",
        icon: "sparkles",
        name: "Intelligent agent 24/7",
        description: "Always-on AI companionship.",
      },
      {
        id: "monitoring",
        icon: "pulse",
        name: "Smart monitoring",
        description:
          "Brings your compatible medical or wellness device data into the app. COPP-ADRESD only extracts the information.",
      },
      {
        id: "medication",
        icon: "capsule",
        name: "Medication tracking",
        description:
          "Scan or search your medicine, schedule doses, get reminders, track your supply and log side effects.",
      },
      {
        id: "nutrition",
        icon: "bowl",
        name: "AI smart nutrition",
        description:
          "30-day plans suggested by the program, which you must validate with a qualified health professional.",
      },
      {
        id: "gamification",
        icon: "star",
        name: "Gamification",
        description:
          "Goals, personal challenges, points and achievements to keep consistency.",
      },
      {
        id: "sos",
        icon: "shield",
        name: "SOS and family protection",
        description: "Help button and alerts to trusted contacts.",
      },
      {
        id: "community",
        icon: "users",
        name: "Community",
        description:
          "Interest clubs, interaction between members and posts to share progress and support.",
      },
    ],
    summary: {
      title: "Your summary",
      planAnnual: "Annual plan",
      planMonthly: "Monthly plan",
      equivalentRow: "Monthly equivalent",
      monthlyYearRow: "Total per year paying monthly",
      annualRow: "Paying annually would be",
      taxesRow: "Taxes",
      taxesHint: "calculated at checkout",
      dueAnnual: "one year of the plan",
      dueMonthly: "the current month",
      savingsRow: "Your savings",
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
        "Your program is active from the first week.",
      ],
      again: "Configure again",
      home: "Back to home",
      whatsapp: "Talk to an advisor",
      disclaimer:
        "Demo mode. No card was charged and your data was not sent or stored.",
    },
    legalTitle: "About this program",
    legal:
      "COPP-ADRESD is a wellbeing and support program; it does not diagnose, treat or prevent disease and it does not replace medical care. For now the platform does not have health professionals on staff: nutrition plans are suggestions or recommendations from the program and must be validated by a qualified health professional of your choice before you follow them. Medication tracking is an informational record; it does not prescribe or change treatments and its alerts do not replace your doctor's or pharmacist's judgement. Sales taxes are calculated at checkout based on your state. Emergency services (SOS) depend on coverage and third-party agreements and do not replace 911. Prices in US dollars (USD).",
    whatsappMessage(selection: string, amount: string): string {
      return `Hi, I would like to join the COPP-ADRESD membership: ${selection}. Estimated charge today: ${amount}.`;
    },
    aria: {
      dueToday: "Charge today",
    },
    currency: "USD",
  },
} as const;

export type MembershipContent = (typeof membershipContent)["es"];
