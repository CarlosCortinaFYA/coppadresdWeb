import { l } from "./types";
import type { ProgramDefinition } from "./types";
import { item } from "./content";
export const pepMimetic: ProgramDefinition = {
  id: "pepMimetic",
  name: "Pep Mimetic",
  status: "available",
  hero: {
    eyebrow: l(
      "PEP-19 NUTRACEUTICAL MIMETIC™",
      "PEP-19 NUTRACEUTICAL MIMETIC™",
    ),
    title: l(
      "Una mirada conectada\na la biología celular.",
      "A connected view\nof cellular biology.",
    ),
    description: l(
      "Una propuesta nutracéutica de investigación inspirada en la red de señalización de PCP4/PEP-19. Diez ingredientes planteados para explorar procesos de regulación del calcio, energía mitocondrial y adaptación celular.",
      "A research-oriented nutraceutical proposal inspired by the PCP4/PEP-19 signaling network. Ten ingredients proposed to explore calcium regulation, mitochondrial energy and cellular adaptation.",
    ),
    note: l(
      "Concepto basado en hipótesis. La formulación completa aún requiere validación en estudios con personas.",
      "A hypothesis-driven concept. The complete formulation still requires validation in studies involving people.",
    ),
    artwork: {
      code: "PCP4 / PEP-19",
      center: "Ca²⁺",
      centerCaption: "PCP4 · CaM",
      eyebrow: l("BIOLOGÍA DE SISTEMAS", "SYSTEMS BIOLOGY"),
      title: l(
        "Explorar la red.\nComprender sus conexiones.",
        "Explore the network.\nUnderstand its connections.",
      ),
      caption: l(
        "Modelo conceptual · resultados pendientes de validación",
        "Conceptual model · outcomes pending validation",
      ),
      tags: [
        { title: l("Calmodulina", "Calmodulin"), label: "CaM" },
        { title: l("Bioenergética", "Bioenergetics"), label: "AMPK · SIRT1" },
      ],
    },
    facts: [
      {
        value: "10",
        label: l("ingredientes propuestos", "proposed ingredients"),
      },
      { value: "06", label: l("módulos biológicos", "biological modules") },
      {
        value: "500 mg",
        label: l(
          "composición propuesta por cápsula",
          "proposed composition per capsule",
        ),
      },
    ],
  },
  sections: [
    {
      id: "pep-overview",
      kind: "overview",
      navLabel: l("Concepto", "Concept"),
      eyebrow: l("01 / EL CONCEPTO MIMÉTICO", "01 / THE MIMETIC CONCEPT"),
      title: l(
        "Inspirado en una red.\nSin sustituir la proteína.",
        "Inspired by a network.\nWithout replacing the protein.",
      ),
      description: l(
        "El dossier de Pep Mimetic toma como referencia PCP4, una proteína humana reguladora de la señalización calcio–calmodulina. La propuesta busca influir en aspectos de esa red mediante componentes complementarios; no suministra PCP4 ni reproduce todas sus funciones.",
        "The Pep Mimetic dossier refers to PCP4, a human protein that regulates calcium–calmodulin signaling. The proposal seeks to influence aspects of that network through complementary components; it does not supply PCP4 or reproduce all its functions.",
      ),
      items: [
        item(
          "Calcio como punto de partida",
          "Calcium as the starting point",
          "El marco conceptual relaciona la regulación del calcio intracelular con señalización neuronal, función mitocondrial y adaptación al estrés.",
          "The conceptual framework connects intracellular calcium regulation with neuronal signaling, mitochondrial function and stress adaptation.",
          undefined,
          "pulse",
        ),
        item(
          "Farmacología de redes",
          "Network pharmacology",
          "Cada ingrediente se plantea como modulador de nodos complementarios, en lugar de atribuir toda la actividad a un único compuesto.",
          "Each ingredient is proposed to modulate complementary nodes, rather than assigning all activity to a single compound.",
          undefined,
          "link",
        ),
        item(
          "Investigación por validar",
          "Research requiring validation",
          "El fundamento de ingredientes individuales no demuestra la eficacia ni la seguridad de la combinación. El dossier requiere estudios de laboratorio y estudios con personas.",
          "The rationale for individual ingredients does not establish the combination’s efficacy or safety. The dossier calls for laboratory studies and studies involving people.",
          undefined,
          "shield",
        ),
      ],
    },
    {
      id: "pep-modules",
      kind: "benefits",
      navLabel: l("Red biológica", "Biological network"),
      eyebrow: l("02 / SEIS MÓDULOS BIOLÓGICOS", "02 / SIX BIOLOGICAL MODULES"),
      title: l(
        "Procesos conectados.\nHipótesis de investigación.",
        "Connected processes.\nResearch hypotheses.",
      ),
      description: l(
        "El dossier organiza la propuesta en seis módulos. Los mecanismos descritos explican el diseño de la fórmula. Sus beneficios siguen siendo hipótesis.",
        "The dossier organizes the proposal into six modules. The described mechanisms explain the formula’s design. Its benefits remain hypotheses.",
      ),
      items: [
        item(
          "Homeostasis del calcio",
          "Calcium homeostasis",
          "L-treonato de magnesio, resveratrol y apigenina se relacionan con excitabilidad neuronal y señalización dependiente de calcio.",
          "Magnesium L-threonate, resveratrol and apigenin are linked to neuronal excitability and calcium-dependent signaling.",
          "CaM · CaMKII · CREB",
        ),
        item(
          "Bioenergética mitocondrial",
          "Mitochondrial bioenergetics",
          "Resveratrol, berberina, pterostilbeno, CoQ10 y L-carnitina se integran en el modelo de biogénesis y producción de energía.",
          "Resveratrol, berberine, pterostilbene, CoQ10 and L-carnitine are integrated into the model of biogenesis and energy production.",
          "AMPK · SIRT1 · PGC-1α",
        ),
        item(
          "Adaptación celular",
          "Cellular adaptation",
          "El marco estudia la respuesta a la demanda metabólica y al estrés mediante factores de transcripción y vías de señalización.",
          "The framework examines responses to metabolic demand and stress through transcription factors and signaling pathways.",
          "FOXO · CREB · PI3K/AKT",
        ),
        item(
          "Equilibrio oxidativo",
          "Oxidative balance",
          "Polifenoles y ácido alfa-lipoico se vinculan a defensas antioxidantes endógenas y balance redox mitocondrial.",
          "Polyphenols and alpha-lipoic acid are linked to endogenous antioxidant defenses and mitochondrial redox balance.",
          "Nrf2 · HO-1 · SOD",
        ),
        item(
          "Metabolismo energético",
          "Energy metabolism",
          "L-carnitina, CoQ10 y berberina participan en el modelo de transporte de ácidos grasos y síntesis de ATP.",
          "L-carnitine, CoQ10 and berberine contribute to the model of fatty acid transport and ATP synthesis.",
          "CPT-1 · ATP",
        ),
        item(
          "Mantenimiento celular",
          "Cellular maintenance",
          "El dossier explora autofagia, control de calidad mitocondrial y respuestas de supervivencia celular.",
          "The dossier explores autophagy, mitochondrial quality control and cell-survival responses.",
          "mTOR · Bcl-2 · FOXO",
        ),
      ],
    },
    {
      id: "pep-composition",
      kind: "ingredients",
      navLabel: l("Composición", "Composition"),
      eyebrow: l("03 / FORMULACIÓN PROPUESTA", "03 / PROPOSED FORMULATION"),
      title: l(
        "Diez componentes.\nFunciones complementarias.",
        "Ten components.\nComplementary roles.",
      ),
      description: l(
        "Composición propuesta por cápsula, según la tabla 3 del dossier. Las cantidades de extractos no equivalen a la misma masa de compuesto puro.",
        "Proposed composition per capsule, according to table 3 of the dossier. Extract amounts are not equivalent to the same mass of pure compound.",
      ),
      initialSelected: 0,
      note: l(
        "Fuente: pep-mimetic.pdf, pp. 17–19. Total propuesto: 500 mg por cápsula. Es una especificación documental, no una pauta de consumo. La tabla de composición identifica CoQ10 como ubiquinona, aunque otras secciones del dossier mencionan ubiquinol.",
        "Source: pep-mimetic.pdf, pp. 17–19. Proposed total: 500 mg per capsule. This is a documented specification, not a dosing schedule. The composition table identifies CoQ10 as ubiquinone, although other dossier sections mention ubiquinol.",
      ),
      items: [
        item(
          "Extracto con trans-resveratrol",
          "Trans-resveratrol extract",
          "Polygonum cuspidatum, 98% trans-resveratrol. El dossier lo relaciona con SIRT1, AMPK, adaptación mitocondrial y señalización endotelial.",
          "Polygonum cuspidatum, 98% trans-resveratrol. The dossier relates it to SIRT1, AMPK, mitochondrial adaptation and endothelial signaling.",
          "75 mg",
        ),
        item(
          "Extracto con berberina HCl",
          "Berberine HCl extract",
          "Berberis aristata, 97% berberina HCl. Componente del modelo de señalización AMPK y regulación del metabolismo energético.",
          "Berberis aristata, 97% berberine HCl. A component of the model for AMPK signaling and energy-metabolism regulation.",
          "100 mg",
        ),
        item(
          "Extracto con pterostilbeno",
          "Pterostilbene extract",
          "Pterocarpus marsupium, 98% pterostilbeno. Análogo del resveratrol considerado en el dossier por su complementariedad en señalización y adaptación mitocondrial.",
          "Pterocarpus marsupium, 98% pterostilbene. A resveratrol analogue considered in the dossier for complementary signaling and mitochondrial adaptation.",
          "25 mg",
        ),
        item(
          "Extracto con quercetina",
          "Quercetin extract",
          "Sophora japonica, 95% quercetina. Su fundamento se centra en Nrf2, señalización inflamatoria y balance oxidativo.",
          "Sophora japonica, 95% quercetin. Its rationale focuses on Nrf2, inflammatory signaling and oxidative balance.",
          "50 mg",
        ),
        item(
          "Extracto con apigenina",
          "Apigenin extract",
          "Matricaria chamomilla, 98% apigenina. El dossier explora señalización neuronal, adaptación celular y mecanismos aún experimentales.",
          "Matricaria chamomilla, 98% apigenin. The dossier explores neuronal signaling, cellular adaptation and mechanisms still under experimental investigation.",
          "25 mg",
        ),
        item(
          "Extracto con piperina",
          "Piperine extract",
          "Piper nigrum, 95% piperina. Se propone por su efecto sobre la biodisponibilidad de determinados compuestos, sujeto a evaluación de interacciones.",
          "Piper nigrum, 95% piperine. Proposed for its effect on the bioavailability of selected compounds, subject to interaction assessment.",
          "5 mg",
        ),
        item(
          "L-treonato de magnesio",
          "Magnesium L-threonate",
          "Sal de magnesio incluida en el modelo de regulación del calcio, excitabilidad neuronal y procesos dependientes de ATP. No es un extracto botánico.",
          "A magnesium salt included in the model of calcium regulation, neuronal excitability and ATP-dependent processes. It is not a botanical extract.",
          "70 mg",
        ),
        item(
          "Coenzima Q10 · ubiquinona",
          "Coenzyme Q10 · ubiquinone",
          "Componente de la cadena de transporte de electrones mitocondrial. La tabla de formulación especifica ubiquinona.",
          "A component of the mitochondrial electron transport chain. The formulation table specifies ubiquinone.",
          "50 mg",
        ),
        item(
          "L-carnitina L-tartrato",
          "L-carnitine L-tartrate",
          "Incluida por el transporte de ácidos grasos hacia la mitocondria y su relación con la β-oxidación.",
          "Included for fatty acid transport into mitochondria and its relationship with β-oxidation.",
          "50 mg",
        ),
        item(
          "Ácido alfa-lipoico",
          "Alpha-lipoic acid",
          "Cofactor mitocondrial integrado en el modelo de balance redox y regeneración de antioxidantes.",
          "A mitochondrial cofactor integrated into the model of redox balance and antioxidant regeneration.",
          "50 mg",
        ),
      ],
    },
    {
      id: "pep-specifications",
      kind: "content",
      eyebrow: l("04 / DISEÑO DE LA PROPUESTA", "04 / PROPOSAL DESIGN"),
      title: l(
        "Del ingrediente\na la formulación.",
        "From ingredient\nto formulation.",
      ),
      description: l(
        "Características descritas en el dossier; no se presentan como certificaciones ni disponibilidad comercial confirmada.",
        "Characteristics described in the dossier; these are not presented as certifications or confirmed commercial availability.",
      ),
      items: [
        item(
          "Cápsula vegetal",
          "Vegetable capsule",
          "La especificación describe una cápsula dura vegetal con 500 mg de contenido neto propuesto.",
          "The specification describes a hard vegetable capsule with a proposed 500 mg net fill weight.",
          undefined,
          "capsule",
        ),
        item(
          "Seis extractos botánicos",
          "Six botanical extracts",
          "Resveratrol, berberina, pterostilbeno, quercetina, apigenina y piperina se asocian a fuentes y estandarizaciones concretas.",
          "Resveratrol, berberine, pterostilbene, quercetin, apigenin and piperine are associated with specified sources and standardizations.",
          undefined,
          "leaf",
        ),
        item(
          "Cuatro componentes adicionales",
          "Four additional components",
          "Magnesio L-treonato, CoQ10, L-carnitina L-tartrato y ácido alfa-lipoico: no se describen como extractos botánicos.",
          "Magnesium L-threonate, CoQ10, L-carnitine L-tartrate and alpha-lipoic acid are not described as botanical extracts.",
          undefined,
          "link",
        ),
        item(
          "Especificación de desarrollo",
          "Development specification",
          "La tabla propone ausencia de colorantes y conservantes artificiales, sin gluten, no transgénico y aptitud vegana. No se aportan certificaciones del producto final.",
          "The table proposes no artificial colors or preservatives, gluten-free and non-GMO composition, and vegan suitability. Finished-product certifications are not provided.",
          undefined,
          "shield",
        ),
      ],
    },
    {
      id: "pep-development",
      kind: "steps",
      eyebrow: l("05 / RUTA DE INVESTIGACIÓN", "05 / RESEARCH ROADMAP"),
      title: l(
        "La validación\nes parte del desarrollo.",
        "Validation\nis part of development.",
      ),
      description: l(
        "Etapas propuestas en el dossier. No representan ensayos ya realizados ni hitos completados.",
        "Stages proposed in the dossier. They do not represent completed trials or achieved milestones.",
      ),
      items: [
        item(
          "Estandarización y caracterización",
          "Standardization and characterization",
          "Identificación de ingredientes, caracterización analítica y optimización de la fórmula.",
          "Ingredient standardization, analytical characterization and formulation optimization.",
          "I",
        ),
        item(
          "Investigación celular",
          "Cellular research",
          "Cultivos celulares, ensayos de calcio, función mitocondrial y biomarcadores de estrés oxidativo.",
          "Cell cultures, calcium assays, mitochondrial function and oxidative stress biomarkers.",
          "II",
        ),
        item(
          "Evaluación preclínica",
          "Preclinical evaluation",
          "Modelos animales, farmacocinética y toxicología.",
          "Animal models, pharmacokinetics and toxicology.",
          "III",
        ),
        item(
          "Seguridad y exploración en humanos",
          "Human safety and exploration",
          "Estudios iniciales de seguridad y ensayos exploratorios basados en biomarcadores.",
          "Initial safety studies and biomarker-driven exploratory trials.",
          "IV",
        ),
        item(
          "Validación clínica controlada",
          "Controlled clinical validation",
          "Estudios aleatorizados y controlados con placebo, con resultados clínicamente relevantes para el uso previsto.",
          "Randomized, placebo-controlled studies with clinically meaningful outcomes for the intended use.",
          "V",
        ),
      ],
    },
    {
      id: "pep-questions",
      kind: "faq",
      eyebrow: l("06 / ALCANCE Y EVIDENCIA", "06 / SCOPE AND EVIDENCE"),
      title: l(
        "Qué propone.\nQué falta por demostrar.",
        "What is proposed.\nWhat remains to be demonstrated.",
      ),
      items: [
        item(
          "¿Contiene PEP-19 o sustituye PCP4?",
          "Does it contain PEP-19 or replace PCP4?",
          "No. El dossier describe una combinación nutracéutica inspirada en vías asociadas a la proteína PCP4/PEP-19. No afirma suministrar la proteína ni reproducir todas sus funciones.",
          "No. The dossier describes a nutraceutical combination inspired by pathways associated with PCP4/PEP-19. It does not claim to supply the protein or reproduce all its functions.",
        ),
        item(
          "¿Es la misma referencia PEP19 del dossier Weight Support?",
          "Is this the same PEP19 reference used in the Weight Support dossier?",
          "Los documentos usan denominaciones parecidas para referencias diferentes: Pep Mimetic se desarrolla alrededor de PCP4/calmodulina, mientras que la introducción comparativa de Weight Support trata un péptido de diez aminoácidos relacionado con CB1. No se trasladan sus mecanismos ni resultados entre programas.",
          "The documents use similar names for different references: Pep Mimetic is developed around PCP4/calmodulin, while the comparative introduction in Weight Support discusses a ten-amino-acid peptide related to CB1. Their mechanisms and outcomes are not transferred between programs.",
        ),
        item(
          "¿Qué evidencia respalda la combinación?",
          "What evidence supports the combination?",
          "El dossier presenta evidencia experimental y, para algunos ingredientes, estudios con personas. Reconoce que aún faltan estudios sobre la fórmula completa. Sus aplicaciones siguen siendo hipótesis de investigación.",
          "The dossier presents experimental evidence and, for some ingredients, studies involving people. It acknowledges that studies of the complete formula are still needed. Its applications remain research hypotheses.",
        ),
        item(
          "¿Cómo se plantea la seguridad?",
          "How is safety addressed?",
          "El documento pide estudiar la compatibilidad, la estabilidad, el recorrido de la fórmula en el organismo y su seguridad, incluidos estudios de la combinación con personas. Las conclusiones sobre seguridad y eficacia siguen siendo provisionales.",
          "The document calls for studies of compatibility, stability, how the formula behaves in the body, and safety, including studies of the combination involving people. Safety and efficacy conclusions remain provisional.",
        ),
        item(
          "¿Hay una pauta de consumo definida aquí?",
          "Is a dosing schedule defined here?",
          "La tabla presenta una composición propuesta por cápsula para fines de investigación. La información es general. Consulta a un profesional de la salud para orientación personal.",
          "The table presents a proposed composition per capsule for research purposes. This is general information. Consult a health professional for individual guidance.",
        ),
      ],
    },
  ],
  cta: {
    title: l(
      "Conversemos\nsobre la propuesta científica.",
      "Let’s discuss\nthe scientific proposal.",
    ),
    text: l(
      "Solicita información sobre Pep Mimetic, su fundamento y la ruta de investigación descrita en el dossier.",
      "Request information about Pep Mimetic, its rationale and the research roadmap described in the dossier.",
    ),
  },
};
