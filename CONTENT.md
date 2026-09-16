# Trazabilidad del contenido y la identidad

## Actualización inicial por programas · 16/09/2026

Este registro describe la primera iteración de las cuatro pestañas. Las integraciones posteriores de Longevity Program y Pep Mimetic se documentan al final de este archivo. El antiguo bloque `Science` se mantiene en el código de origen pero no se monta dentro de Copp, para no mezclar productos.

## Fuentes y aplicación

| Fuente local                                                                    | Uso                                                                                                                                                                                              |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `docs/new/logo.jpeg`                                                            | Geometría del símbolo SVG: arco circular, figura humana y dos hojas inferiores; fondo transparente.                                                                                              |
| `docs/new/WhatsApp Image 2026-09-16 at 9.43.174 AM.jpeg`                        | Proporción de símbolo y denominación COPP-ADRESD, referencia de lockup. El encabezado utiliza texto accesible junto al símbolo SVG.                                                              |
| `docs/new/WhatsApp Image 2026-09-16 at 9.43.173 AM.jpeg`                        | Paleta exacta: #023467, #0c4c6b, #3d7b72; #87aeca, #5581a2, #4b7086; #142855 y #035d4d. Neutros claros/oscuros derivados, sin paleta de acentos alternativa.                                     |
| Las otras dos referencias móviles de `docs/new`                                 | Tarjetas amplias, radios suaves, superficies claras, paneles marinos y CTA en degradado. No se reproducen datos de pacientes ni métricas de ejemplo.                                             |
| `PEP19-vs-WEIGHT-SUPPORT-PLUS-BR-Dossier-EN.pdf`, pp. 1–11, 57–63 y atlas 64–68 | Diferenciación de PEP19; fundamento de berberina, resveratrol y vías de investigación; limitación de evidencia del producto completo (p. 61); composición propuesta Plus–BR (p. 63).             |
| `WEIGHT-SUPPORT-Dossier-EN.pdf` (86 pp.)                                        | Contexto multidisciplinario y carácter complementario, ingredientes de base y límites de evidencia. NO se traslada la fórmula original, la presentación comercial ni la pauta de consumo a Plus. |
| `COPP-ADRESD-Institutional-Presentation-EN.pdf` (28 pp.)                        | Contenido institucional conservado: ciencia, tecnología, factor humano, prevención, seguimiento y comunidades.                                                                                   |
| `ANEXOS.- VF ECOSISTEMA COPP ADRESD .docx` y las dos infografías previas        | Doce áreas y denominaciones, B2B/B2C y mapa institucional. Los controles usan la nueva paleta; la infografía documental original conserva sus colores.                                           |
| `PEP-19-NUTRACEUTICAL-MIMETIC-Dossier-EN.pdf`                                   | Se conserva como fuente local. Sus afirmaciones no se atribuyen a Plus ni rellenan el programa Pep Mimetic sin información específica adicional.                                                 |

## Composición Plus–BR

La tabla de p. 63 propone: té verde 100 mg; L-carnitina L-tartrato 80 mg; café verde 60 mg; Garcinia cambogia 50 mg; cúrcuma 30 mg; picolinato de cromo 1 mg; pimienta negra/piperina 5 mg; berberina 100 mg; resveratrol 74 mg.

Las cantidades se presentan como propuesta documental, sin inventar tamaño de cápsula, posología ni dosis diaria. Picolinato de cromo no equivale a cromo elemental. Aunque algunos pasajes mecanísticos mencionan quercetina, no figura en la tabla final y no se añade como décimo ingrediente.

## Criterios editoriales

- ES/EN completos; nombres de marcas y vías moleculares se conservan.
- Se distinguen investigación de ingredientes, hipótesis de mecanismos y evidencia clínica del producto completo. El dossier requiere validación de eficacia y seguridad de la fórmula terminada.
- La comparación con PEP19 no demuestra equivalencia ni permite trasladar resultados del péptido a Plus.
- No se inventan testimonios, precios, certificaciones, disponibilidad comercial, resultados de pérdida de peso ni ensayos del producto.
- No se publican los PDFs confidenciales, datos de proveedores, contratos ni firmas. La nueva solicitud autoriza desarrollar la información de Plus y se incorpora la composición propuesta con su contexto.
- Los gráficos son conceptuales, sin datos clínicos simulados. La figura B/R es decorativa y no una estructura molecular química.
- El contacto confirmado se conserva en +1 (954) 682-2141.

## Nuevos recursos: integración de Longevity y Pep Mimetic

Se revisaron los 42 folios de `docs/new/pep-mimetic.pdf`, los 68 de `docs/new/WEIGHT-SUPPORT-PLUS-BR-Dossier-EN.pdf` y la infografía completa `docs/new/Longevidad.jpeg` antes de implementar. Se extrajo texto por página y se inspeccionaron visualmente las tablas de formulación y mapas de sistemas. Las copias nuevas de ambos PDFs son idénticas byte a byte a los dossiers anteriores (comparación SHA-256 y texto de cada página); por tanto, complementan el acceso a las fuentes, sin sustituir la fórmula de Plus.

### Weight Support Plus

Se mantiene la tabla final de p. 63, nueve ingredientes. Se amplía el contenido con complementariedad (pp. 18–23, 39–40, 53–61), perspectiva multiorgánica (pp. 22–23 y 60–66), biodisponibilidad (pp. 7, 11–12, 26–28, 44–45 y 57), calidad propuesta (pp. 10 y 43–44) y aclaración sobre la quercetina, discutida en el texto pero ausente de la tabla final. Las tecnologías liposomales/nanotecnológicas se presentan como estrategias revisadas, sin atribuirlas a un producto confirmado.

### Pep Mimetic

- Marco PCP4/calmodulina: pp. 1–7 y 35–36. No se atribuye a la mezcla la presencia de la proteína.
- Diez ingredientes y funciones: pp. 8–21 y 37. Se toma la **tabla 3 de p. 18** para cantidades/estandarización: 75/100/25/50/25/5/70/50/50/50 mg; total 500 mg por cápsula propuesta.
- Especificaciones de cápsula, seis extractos y cuatro componentes adicionales: p. 19. Gluten, OGM, aptitud vegana y ausencia de aditivos se identifican como especificaciones documentales, no certificaciones.
- Seis módulos: pp. 22–28 y 36–38; gráfica de hero conceptual, sin representación de resultados ni estructura química.
- Evidencia y límites: pp. 21, 31–34 y 39–42. Formulación completa sin validación clínica; no se convierten hipótesis en indicaciones terapéuticas.
- Ruta de investigación de cinco fases y evaluaciones de seguridad: pp. 32 y 40–42.

Se conserva una discrepancia de fuente de manera explícita: la tabla final indica **CoQ10/ubiquinona**, mientras algunos pasajes dicen ubiquinol. No se inventa una equivalencia ni se altera silenciosamente la tabla. La web tampoco traslada los resultados del péptido de diez aminoácidos/CB1, tratado en la introducción de Weight Support, a PCP4/calmodulina, que es el marco de Pep Mimetic.

### Longevity Program

Fuente exclusiva del nuevo contenido: `docs/new/Longevidad.jpeg` (1024 × 1536). Es un documento de referencia: no se copia a `src/assets`, no se incluye en el bundle y no se muestra como hero, tarjeta ni contenido visual. La landing traduce su estructura a componentes web propios; el material original está en español y el desarrollo de todas sus áreas está disponible en ES/EN.

La infografía fundamenta identidad, propósito/visión/misión, tres dimensiones (bio/psico/social), siete pilares, cinco áreas de evaluación, cuatro ciclos trimestrales en doce meses, equipo multidisciplinario, modelos B2B/B2C, siete indicadores con periodicidades y ruta de implementación. El índice de manual maestro se sintetiza como estructura pendiente de desarrollo, sin inventar protocolos completos o disponibilidad comercial. La alusión a OMS/ICOPE es una inspiración declarada en la fuente, no un aval ni certificación de la organización. Se conserva la ausencia de promesas de inmortalidad o rejuvenecimiento garantizado.

### Tratamiento de visuales científicos

Los mapas de ambos PDFs se revisaron como fundamento editorial. Algunos incluyen quercetina o rótulos de beneficios potenciales que podrían confundirse con resultados demostrados. Se sintetizan en bloques web bilingües con contexto de investigación; no se publica una captura del PDF como sustituto del contenido ni se añaden descargas de los dossiers confidenciales.
