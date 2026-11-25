/**
 * Contenido bilingüe de la página del canal de WhatsApp para pacientes.
 *
 * Esta página es la URL declarada en el perfil de WhatsApp Business. Debe
 * explicar el uso transaccional/clínico del canal, el opt-in/opt-out y la
 * privacidad, y dejar claro que no es un canal de ventas ni de suplementos.
 */
export interface PatientChannelSection {
  title: string;
  body: string;
  items?: string[];
  link?: { label: string; href: string };
}

export interface PatientChannelContent {
  metaTitle: string;
  metaDescription: string;
  home: string;
  eyebrow: string;
  title: string;
  intro: string;
  sections: PatientChannelSection[];
  noteTitle: string;
  note: string;
  legal: string;
  back: string;
}

const es: PatientChannelContent = {
  metaTitle: "Canal de WhatsApp para pacientes | Agentic Wellness IA",
  metaDescription:
    "Canal oficial de WhatsApp del programa Agentic Wellness IA para el acompañamiento de pacientes inscritos: opt-in, baja con SALIR/STOP y privacidad.",
  home: "Ir al inicio",
  eyebrow: "Canal de atención",
  title: "WhatsApp para pacientes Agentic Wellness IA",
  intro:
    "Este es el canal oficial de WhatsApp del programa Agentic Wellness IA para acompañar a pacientes inscritos. Es un canal de seguimiento asistencial y educativo, no un canal de ventas ni de promociones.",
  sections: [
    {
      title: "Para qué usamos este canal",
      body: "Solo para el acompañamiento del programa y de los planes aprobados por tu equipo de salud:",
      items: [
        "Registro de tu check-in de bienestar y recordatorios del programa.",
        "Seguimiento de hábitos, comidas, mediciones y tareas asignadas.",
        "Educación general en salud y ayuda para entender tu plan.",
        "Avisos operativos de tu proceso (por ejemplo, una evaluación pendiente).",
      ],
    },
    {
      title: "Quién recibe mensajes",
      body: "Únicamente pacientes con una inscripción activa y consentimiento explícito para recibir mensajes por WhatsApp. El número se vincula una sola vez mediante un código de verificación (OTP) y solo el titular puede usarlo. Nunca escribimos a contactos que no se hayan vinculado.",
    },
    {
      title: "Cómo darte de baja o volver",
      body: "Puedes detener los mensajes en cualquier momento. Responde con la palabra indicada y el sistema actualiza tu preferencia:",
      items: [
        "Para detener los mensajes: responde SALIR o STOP.",
        "Para volver a recibirlos: responde INICIAR o START.",
        "También puedes escribir a info@coppadresd.com y lo gestionamos contigo.",
      ],
    },
    {
      title: "Qué no hacemos por este canal",
      body: "Para proteger tu información y cumplir las políticas de WhatsApp:",
      items: [
        "No enviamos promociones no solicitadas ni campañas masivas.",
        "No vendemos suplementos, productos ni membresías por WhatsApp.",
        "No compartimos tus datos con terceros ajenos a tu atención.",
        "No sustituimos una consulta, un diagnóstico ni una urgencia médica.",
      ],
    },
    {
      title: "Tus datos y tu privacidad",
      body: "Los mensajes y datos asociados se tratan únicamente para tu atención dentro del programa, con acceso restringido al equipo autorizado. Puedes consultar cómo eliminar tu cuenta y tus datos en la página de eliminación de cuenta.",
      link: {
        label: "Eliminar mi cuenta y mis datos",
        href: "/eliminar-cuenta",
      },
    },
  ],
  noteTitle: "Una urgencia no se atiende por WhatsApp",
  note: "Si tienes dolor en el pecho, dificultad para respirar, desmayo o cualquier signo de emergencia, contacta de inmediato a los servicios de emergencia de tu país. Este canal no es un servicio de urgencias ni de monitoreo en tiempo real.",
  legal:
    "Canal oficial del programa Agentic Wellness IA. Titular de la cuenta de WhatsApp Business: Fya Tech SAS. Este sitio y el canal se rigen por las políticas de WhatsApp Business y por nuestras políticas de privacidad.",
  back: "Volver al inicio",
};

const en: PatientChannelContent = {
  metaTitle: "Patient WhatsApp channel | Agentic Wellness IA",
  metaDescription:
    "Official WhatsApp channel of the Agentic Wellness IA program for enrolled patients: opt-in, opt-out with SALIR/STOP and privacy.",
  home: "Go to home",
  eyebrow: "Care channel",
  title: "WhatsApp for Agentic Wellness IA patients",
  intro:
    "This is the official WhatsApp channel of the Agentic Wellness IA program for enrolled patients. It is a care and education channel, not a sales or promotions channel.",
  sections: [
    {
      title: "What we use this channel for",
      body: "Only for program support and the plans approved by your care team:",
      items: [
        "Wellbeing check-ins and program reminders.",
        "Follow-up on habits, meals, measurements and assigned tasks.",
        "General health education and help understanding your plan.",
        "Operational notices about your process (for example, a pending assessment).",
      ],
    },
    {
      title: "Who receives messages",
      body: "Only patients with an active enrollment and explicit consent to receive WhatsApp messages. The number is linked once through a verification code (OTP) and only its owner can use it. We never message contacts who have not opted in.",
    },
    {
      title: "How to opt out or come back",
      body: "You can stop messages at any time. Reply with the word below and the system updates your preference:",
      items: [
        "To stop messages: reply SALIR or STOP.",
        "To receive them again: reply INICIAR or START.",
        "You can also write to info@coppadresd.com and we will handle it with you.",
      ],
    },
    {
      title: "What we never do here",
      body: "To protect your information and comply with WhatsApp policies:",
      items: [
        "We do not send unsolicited promotions or mass campaigns.",
        "We do not sell supplements, products or memberships over WhatsApp.",
        "We do not share your data with third parties outside your care.",
        "We do not replace a consultation, a diagnosis or a medical emergency.",
      ],
    },
    {
      title: "Your data and privacy",
      body: "Messages and related data are used only for your care within the program, with access restricted to authorized staff. You can review how to delete your account and data on the account deletion page.",
      link: {
        label: "Delete my account and data",
        href: "/eliminar-cuenta",
      },
    },
  ],
  noteTitle: "An emergency is not handled over WhatsApp",
  note: "If you have chest pain, difficulty breathing, fainting or any emergency sign, contact your local emergency services immediately. This channel is not an emergency service or real-time monitoring.",
  legal:
    "Official channel of the Agentic Wellness IA program. WhatsApp Business account holder: Fya Tech SAS. This site and the channel follow the WhatsApp Business policies and our privacy policies.",
  back: "Back to home",
};

export const patientChannelContent = { es, en };
