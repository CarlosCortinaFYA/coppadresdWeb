import { weightAdditionalSections } from "./weight-details";
import { l } from "./types";
import type { ProgramDefinition } from "./types";
import { programUI } from "./ui";
export const weightSupportPlus: ProgramDefinition = {
  id: "weightSupportPlus",
  name: "Weight Support Plus",
  status: "available",
  hero: {
    artwork: {
      code: "PLUS / BR",
      eyebrow: programUI.botanical,
      title: programUI.pair,
      caption: programUI.research,
      tags: [
        { title: l("Berberina", "Berberine"), label: "AMPK" },
        { title: l("Resveratrol", "Resveratrol"), label: "SIRT1 · PGC-1α" },
      ],
    },
    facts: [
      { value: "09", label: programUI.ingredients },
      { icon: "leaf", label: programUI.pairNote },
      { icon: "users", label: programUI.lifestyle },
    ],
    eyebrow: l("WEIGHT SUPPORT PLUS · BR", "WEIGHT SUPPORT PLUS · BR"),
    title: l(
      "Tu bienestar,\ndesde el equilibrio.",
      "Your wellbeing,\nfrom within.",
    ),
    description: l(
      "Una propuesta nutracéutica con berberina y resveratrol, concebida para acompañar el cuidado del peso y la salud metabólica dentro de un enfoque integral.",
      "A nutraceutical proposal with berberine and resveratrol, designed to complement weight management and metabolic health within a comprehensive approach.",
    ),
    note: l(
      "Alimentación, movimiento y acompañamiento profesional: la base del proceso.",
      "Nutrition, movement and professional guidance: the foundation of the process.",
    ),
  },
  sections: [
    {
      id: "overview",
      navLabel: l("El programa", "The program"),
      kind: "overview",
      eyebrow: l("01 / VISIÓN DEL PROGRAMA", "01 / PROGRAM OVERVIEW"),
      title: l(
        "El equilibrio se construye\ndesde varios frentes.",
        "Balance begins\nwith a broader approach.",
      ),
      description: l(
        "Weight Support Plus–BR amplía la propuesta de Weight Support con dos componentes complementarios. Su dossier reúne investigación sobre ingredientes y vías metabólicas, en el contexto del modelo multidisciplinario COPP–ADRESD.",
        "Weight Support Plus–BR expands the Weight Support proposal with two complementary components. Its dossier brings together research on ingredients and metabolic pathways within the multidisciplinary COPP–ADRESD model.",
      ),
      items: [
        {
          icon: "leaf",
          title: l("Composición complementaria", "Complementary composition"),
          text: l(
            "Nueve ingredientes en una propuesta que combina extractos botánicos, L-carnitina y picolinato de cromo.",
            "Nine ingredients in a proposal combining botanical extracts, L-carnitine and chromium picolinate.",
          ),
        },
        {
          icon: "pulse",
          title: l("Perspectiva metabólica", "Metabolic perspective"),
          text: l(
            "Un fundamento de investigación que relaciona energía celular, metabolismo de la glucosa y equilibrio oxidativo.",
            "A research rationale connecting cellular energy, glucose metabolism and oxidative balance.",
          ),
        },
        {
          icon: "users",
          title: l("Parte de un proceso", "Part of a process"),
          text: l(
            "Se plantea como complemento del cuidado nutricional, la actividad física y el seguimiento profesional.",
            "Proposed as a complement to nutritional care, physical activity and professional follow-up.",
          ),
        },
      ],
    },
    {
      id: "components",
      kind: "features",
      eyebrow: l("02 / EL ENFOQUE PLUS", "02 / THE PLUS APPROACH"),
      title: l(
        "Berberina y resveratrol.\nCiencia que se conecta.",
        "Berberine and resveratrol.\nConnected science.",
      ),
      description: l(
        "El dossier estudia su complementariedad desde la biología de sistemas. El fundamento mecanístico no demuestra por sí mismo un beneficio clínico de la combinación.",
        "The dossier explores their complementarity through systems biology. A mechanistic rationale alone does not establish a clinical benefit for the combination.",
      ),
      items: [
        {
          label: "01 / AMPK",
          title: l("Berberina", "Berberine"),
          text: l(
            "Alcaloide vegetal investigado por su relación con AMPK, un sensor de energía celular. El dossier revisa su papel en las vías de la glucosa, los lípidos y la interacción con la microbiota intestinal.",
            "A plant alkaloid investigated for its relationship with AMPK, a cellular energy sensor. The dossier reviews its role in glucose and lipid pathways and interactions with the gut microbiota.",
          ),
        },
        {
          label: "02 / SIRT1 · PGC-1α",
          title: l("Resveratrol", "Resveratrol"),
          text: l(
            "Polifenol investigado por su relación con las sirtuinas, la función mitocondrial y las respuestas al estrés oxidativo. Aporta al dossier una perspectiva complementaria sobre adaptación y energía celular.",
            "A polyphenol investigated for its relationship with sirtuins, mitochondrial function and oxidative stress responses. It adds a complementary perspective on cellular adaptation and energy to the dossier.",
          ),
        },
      ],
    },
    {
      id: "composition",
      navLabel: l("Composición", "Composition"),
      kind: "ingredients",
      initialSelected: 7,
      note: programUI.formulaNote,
      eyebrow: l("03 / COMPOSICIÓN PROPUESTA", "03 / PROPOSED COMPOSITION"),
      title: l(
        "Nueve ingredientes.\nUna propuesta integrada.",
        "Nine ingredients.\nOne integrated proposal.",
      ),
      description: l(
        "Explora los componentes de la fórmula Plus–BR y el papel propuesto para cada uno en el dossier.",
        "Explore the components of the Plus–BR formula and each ingredient’s proposed role in the dossier.",
      ),
      items: [
        {
          label: "100 mg",
          title: l("Extracto de té verde", "Green tea extract"),
          text: l(
            "Fuente de catequinas. El dossier examina su actividad antioxidante y su relación con la termogénesis.",
            "A source of catechins. The dossier examines antioxidant activity and its relationship with thermogenesis.",
          ),
        },
        {
          label: "80 mg",
          title: l("L-carnitina L-tartrato", "L-carnitine L-tartrate"),
          text: l(
            "Incluida por su papel en el transporte de ácidos grasos hacia las mitocondrias.",
            "Included for its role in transporting fatty acids into mitochondria.",
          ),
        },
        {
          label: "60 mg",
          title: l("Extracto de café verde", "Green coffee extract"),
          text: l(
            "Fuente de ácido clorogénico, estudiado en el contexto del metabolismo de la glucosa.",
            "A source of chlorogenic acid, studied in the context of glucose metabolism.",
          ),
        },
        {
          label: "50 mg",
          title: l(
            "Extracto de Garcinia cambogia",
            "Garcinia cambogia extract",
          ),
          text: l(
            "Incluida en la propuesta por la investigación sobre apetito y metabolismo de lípidos; los resultados clínicos son variables.",
            "Included based on research into appetite and lipid metabolism; clinical findings vary.",
          ),
        },
        {
          label: "30 mg",
          title: l("Extracto de cúrcuma", "Turmeric extract"),
          text: l(
            "Aporta curcuminoides, estudiados por su relación con las vías inflamatorias y el metabolismo.",
            "Provides curcuminoids, studied for their relationship with inflammatory pathways and metabolism.",
          ),
        },
        {
          label: "1 mg",
          title: l("Picolinato de cromo", "Chromium picolinate"),
          text: l(
            "Compuesto de cromo incluido por su relación con la función de la insulina. La cantidad corresponde al compuesto, no al cromo elemental.",
            "A chromium compound included for its relationship with insulin function. The amount refers to the compound, not elemental chromium.",
          ),
        },
        {
          label: "5 mg",
          title: l("Extracto de pimienta negra", "Black pepper extract"),
          text: l(
            "La piperina se incluye para estudiar la biodisponibilidad. También puede modificar la exposición a otros compuestos y medicamentos.",
            "Piperine is included to address bioavailability. It may also alter exposure to other compounds and medicines.",
          ),
        },
        {
          label: "100 mg",
          title: l("Berberina", "Berberine"),
          text: l(
            "Componente del enfoque Plus investigado en señalización AMPK y metabolismo energético.",
            "A Plus component investigated in AMPK signaling and energy metabolism.",
          ),
        },
        {
          label: "74 mg",
          title: l("Resveratrol", "Resveratrol"),
          text: l(
            "Componente del enfoque Plus investigado en sirtuinas, balance oxidativo y función mitocondrial.",
            "A Plus component investigated in sirtuins, oxidative balance and mitochondrial function.",
          ),
        },
      ],
    },
    {
      id: "research",
      navLabel: l("Ciencia", "Science"),
      kind: "benefits",
      eyebrow: l("04 / ÁREAS DE INVESTIGACIÓN", "04 / RESEARCH AREAS"),
      title: l(
        "Entender las conexiones.\nConocer los límites.",
        "Understand the connections.\nRecognize the limits.",
      ),
      description: l(
        "Estos son objetivos de investigación descritos en el dossier, no resultados garantizados del producto terminado.",
        "These are research objectives described in the dossier, not guaranteed outcomes of the finished product.",
      ),
      items: [
        {
          label: "AMPK",
          title: l("Metabolismo energético", "Energy metabolism"),
          text: l(
            "Vías relacionadas con la utilización de energía y el metabolismo de ácidos grasos.",
            "Pathways related to energy utilization and fatty acid metabolism.",
          ),
        },
        {
          label: "PI3K / AKT",
          title: l("Señalización de la glucosa", "Glucose signaling"),
          text: l(
            "Mecanismos de señalización de insulina y transporte de glucosa descritos en la literatura de ingredientes.",
            "Insulin signaling and glucose transport mechanisms described in ingredient research.",
          ),
        },
        {
          label: "SIRT1 / PGC-1α",
          title: l("Función mitocondrial", "Mitochondrial function"),
          text: l(
            "Procesos de adaptación celular y regulación de la biogénesis mitocondrial.",
            "Cellular adaptation processes and regulation of mitochondrial biogenesis.",
          ),
        },
        {
          label: "Nrf2 / NF-κB",
          title: l("Equilibrio celular", "Cellular balance"),
          text: l(
            "Respuestas antioxidantes e inflamatorias analizadas como parte de una red biológica interconectada.",
            "Antioxidant and inflammatory responses considered as part of an interconnected biological network.",
          ),
        },
      ],
    },
    ...weightAdditionalSections,
    {
      id: "care",
      kind: "content",
      eyebrow: l("05 / MÁS ALLÁ DE LA FÓRMULA", "05 / BEYOND THE FORMULA"),
      title: l(
        "Los hábitos sostienen\nel camino.",
        "Habits sustain\nthe journey.",
      ),
      description: l(
        "El marco de Weight Support sitúa el suplemento dentro de un abordaje multidisciplinario. La propuesta Plus conserva ese contexto de acompañamiento.",
        "The Weight Support framework places supplementation within a multidisciplinary approach. The Plus proposal retains that context of support.",
      ),
      items: [
        {
          icon: "bowl",
          title: l("Alimentación", "Nutrition"),
          text: l(
            "Cuidado nutricional y educación alimentaria adaptados a cada persona.",
            "Nutritional care and food education adapted to each person.",
          ),
        },
        {
          icon: "pulse",
          title: l("Movimiento", "Movement"),
          text: l(
            "Actividad física como parte del cuidado cotidiano y de la salud metabólica.",
            "Physical activity as part of everyday care and metabolic health.",
          ),
        },
        {
          icon: "moon",
          title: l("Descanso", "Rest"),
          text: l(
            "Atención al sueño y a los hábitos que favorecen una rutina sostenible.",
            "Attention to sleep and habits that support a sustainable routine.",
          ),
        },
        {
          icon: "heart",
          title: l("Acompañamiento", "Support"),
          text: l(
            "Apoyo psicológico, evaluación médica y seguimiento dentro de un plan integral.",
            "Psychological support, medical assessment and follow-up within a comprehensive plan.",
          ),
        },
      ],
    },
    {
      id: "questions",
      kind: "faq",
      eyebrow: l("06 / INFORMACIÓN CLARA", "06 / CLEAR INFORMATION"),
      title: l(
        "Antes de dar\nel siguiente paso.",
        "Before taking\nthe next step.",
      ),
      items: [
        {
          title: l(
            "¿Qué diferencia a Plus de Weight Support?",
            "How does Plus differ from Weight Support?",
          ),
          text: l(
            "La propuesta Plus–BR añade berberina y resveratrol y ajusta las cantidades de los siete ingredientes de la fórmula original. La composición que se muestra aquí corresponde únicamente a la tabla propuesta para Plus–BR.",
            "The Plus–BR proposal adds berberine and resveratrol and adjusts the amounts of the seven original ingredients. The composition shown here corresponds only to the proposed Plus–BR table.",
          ),
        },
        {
          title: l(
            "¿Qué evidencia presenta el dossier?",
            "What evidence does the dossier present?",
          ),
          text: l(
            "Integra investigación mecanística, estudios preclínicos y estudios clínicos de ingredientes individuales. El propio dossier señala que la eficacia y seguridad de la formulación completa deben confirmarse en estudios clínicos diseñados para el producto terminado.",
            "It brings together mechanistic research, preclinical studies and clinical studies of individual ingredients. The dossier itself states that the efficacy and safety of the complete formulation should be confirmed in clinical studies designed for the finished product.",
          ),
        },
        {
          title: l("¿Es equivalente a PEP19?", "Is it equivalent to PEP19?"),
          text: l(
            "No. La introducción de este dossier compara Plus–BR con un péptido de diez aminoácidos relacionado con CB1. Es una referencia diferente de PCP4, sobre la que se desarrolla el programa Pep Mimetic. Plus–BR es una combinación nutracéutica. El dossier compara vías de investigación; esa comparación no establece equivalencia ni permite trasladar resultados de PEP19 a Plus.",
            "No. This dossier’s introduction compares Plus–BR with a ten-amino-acid peptide related to CB1. This is a different reference from PCP4, around which the Pep Mimetic program is developed. Plus–BR is a nutraceutical combination. The dossier compares research pathways; that comparison does not establish equivalence or allow PEP19 outcomes to be attributed to Plus.",
          ),
        },
        {
          title: l(
            "¿Sustituye el tratamiento o los hábitos?",
            "Does it replace treatment or lifestyle habits?",
          ),
          text: l(
            "Se plantea como complemento, no como sustituto de la alimentación, el movimiento ni los tratamientos indicados por un profesional. No se presentan promesas de pérdida de peso ni resultados individuales garantizados.",
            "It is proposed as a complement, not a replacement for nutrition, movement or professionally prescribed treatment. No weight-loss promises or guaranteed individual outcomes are presented.",
          ),
        },
        {
          title: l(
            "¿Qué precauciones recoge la documentación?",
            "What precautions does the documentation discuss?",
          ),
          text: l(
            "La documentación aborda tolerancia digestiva, biodisponibilidad e interacciones, especialmente con medicamentos que afectan glucosa, coagulación y presión arterial. No establece seguridad suficiente durante embarazo y lactancia. La idoneidad y las instrucciones de uso requieren evaluación profesional; esta página no define una pauta de consumo.",
            "The documentation addresses digestive tolerance, bioavailability and interactions, particularly with medicines affecting glucose, blood clotting and blood pressure. It does not establish sufficient safety during pregnancy and breastfeeding. Suitability and instructions for use require professional assessment; this page does not define a dosing schedule.",
          ),
        },
      ],
    },
  ],
  cta: {
    title: l(
      "El siguiente paso\nempieza con una conversación.",
      "The next step\nbegins with a conversation.",
    ),
    text: l(
      "Conoce más sobre Weight Support Plus y su lugar dentro del modelo de acompañamiento COPP–ADRESD.",
      "Learn more about Weight Support Plus and its place within the COPP–ADRESD support model.",
    ),
  },
};
