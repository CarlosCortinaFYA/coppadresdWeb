# Verificación · actualización por programas · 16/09/2026

## Compilación y datos

- `npm run build`: correcto, TypeScript estricto + Vite, 30 módulos; JS ~288 kB (90.15 kB gzip), CSS ~56.8 kB (12.25 kB gzip).
- `git diff --check`: sin errores de whitespace. Git advierte de su conversión normal LF/CRLF en Windows.
- Comprobación Node: cuatro registros; nueve ingredientes y cantidades idénticas a p. 63; pares ES/EN no vacíos; Longevity/Pep pendientes con secciones vacías; URL y codificación del número confirmado de WhatsApp correctas.
- Configuración de Yarn, lockfiles, allowedHosts y restricciones fs de Vite conservadas. No se añadieron dependencias.

## Navegador real

Revisión visual en el navegador integrado sobre Vite dev y comprobación final contra `http://127.0.0.1:4174` (dist).

- Cuatro pestañas probadas. Copp conserva las doce áreas y el contenido institucional; Plus muestra sus secciones; Longevity/Pep muestran estado pendiente ES/EN sin prestaciones inventadas.
- Flechas izquierda/derecha, Home/End: selección y foco correctos. Un solo tab dentro del orden de tabulación. Ningún `aria-controls` ni enlace de sección roto en el panel Plus final.
- Logo vectorial revisado en encabezado, hero y CTA; transparente y sin caja. Colores más claros de la paleta oficial para el símbolo sobre fondos oscuros.
- Explorador cambia de ingrediente; comprobado Resveratrol / 74 mg. Tabla desplegable muestra los nueve ingredientes. Preguntas expandibles operativas.
- Formulario muestra Weight Support Plus como interés y prepara el programa en el borrador de contacto. Diálogo se cierra con Escape. No se enviaron mensajes ni se abrió una conversación externa durante las pruebas.
- Menú móvil abre y se cierra al navegar. Tabs con scroll limitado a su contenedor.
- ES/EN en toda la página y estado pendiente. Idioma y tema se mantienen tras recargar.
- Producción: consola sin warnings ni errores en las pruebas realizadas.

## Responsive y visual

- Plus ES/claro: 320, 390, 768, 1024 y 1440 px.
- Plus EN/oscuro: 320, 390, 768, 1024 y 1440 px.
- Copp: 320, 768 y 1440 px; comprobación adicional EN/oscuro en tablet.
- `documentElement.scrollWidth === clientWidth` en los anchos comprobados. Los 15 px de diferencia frente al ancho de viewport son el scrollbar vertical, no desbordamiento.
- Inspeccionadas portada, tarjetas de componentes, explorador de ingredientes, investigación, hábitos, FAQ, CTA, pie y portada institucional. Logo oscuro y navegación móvil revisados visualmente.
- Movimiento reducido: transición de panel desactivada por media query; se conserva la regla global de scroll/movimiento reducido.

## Alcance

La revisión no es una auditoría clínica ni una certificación de accesibilidad. La documentación de la fórmula se presenta como propuesta, con límites de evidencia. No hay publicación externa ni backend de captación. Los dossiers originales permanecen locales y fuera de dist.

## Verificación de nuevos contenidos · Longevity y Pep Mimetic

- Build final correcto: 38 módulos; JS 326.86 kB (103.01 kB gzip), CSS 62.35 kB (13.13 kB gzip). Imagen de longevidad 437.25 kB, sin alterar el original.
- Validación de datos mediante Vite SSR: cuatro programas disponibles; cantidades de las nueve entradas Plus y diez entradas Pep idénticas a sus tablas; Pep suma 500 mg; siete pilares y cuatro ciclos en Longevity; pares de texto ES/EN no vacíos y IDs únicos por programa.
- Pruebas de las cuatro pestañas en 320, 768 y 1440 px, tanto ES/claro como EN/oscuro: sin desbordamiento horizontal. Enlaces de sección y aria-controls válidos en todos los programas.
- Infografía cargada (naturalWidth 1024 / naturalHeight 1536), proporcional en vista pequeña y diálogo. Ampliar y cerrar con Escape comprobados. La imagen original sigue en español, con desarrollo textual equivalente en ambos idiomas.
- Explorador Pep: selección del décimo ingrediente y lectura de ácido alfa-lipoico / 50 mg. Tabla completa de diez entradas desplegada y revisada en inglés.
- Menú móvil de Longevity: navegación a Methodology y cierre automático correcto; cuatro ciclos traducidos en ES/EN.
- Revisión visual: Longevity portada, pilares y metodología; Pep portada clara/oscura y módulos en móvil. Se corrigió un solapamiento del gráfico de Pep y se comprobó la versión corregida.
- Producción (`127.0.0.1:4174`): sin warnings ni errores en consola durante las comprobaciones.
- No se enviaron mensajes externos ni se publicaron PDFs. Se conservan las pruebas previas de contacto y diálogo.
