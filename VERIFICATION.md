# Verificación de la landing

Fecha: 16 de septiembre de 2026.

## Compilación

- `npm run build`: correcto, TypeScript estricto y Vite 8.
- La versión de producción se sirve localmente con `npm run preview` en el puerto 4174.
- JavaScript: 264.86 kB (83.03 kB gzip). CSS: 39.08 kB (8.73 kB gzip).
- Tipografía Manrope local: 24.83 kB. Infografía WebP: 306.37 kB frente a 2.14 MB del PNG extraído, manteniendo 1525 × 1004 px.
- `dist/` contiene exclusivamente HTML, CSS, JS, fuente, infografía, favicon, robots y licencia de fuente. No contiene los documentos fuente.

## Navegador

- Versión compilada sin errores ni warnings de consola tras carga, cambio de idioma/tema y recarga.
- Español/claro: 320, 390, 768, 1024 y 1440 px. Sin desbordamiento horizontal ni textos cortados en títulos, párrafos o tarjetas.
- Inglés/oscuro: 320, 768 y 1440 px. Sin desbordamiento horizontal ni textos cortados.
- Revisión visual de hero, tarjetas, ecosistema, proceso, tecnología, comunidad, ciencia, preguntas frecuentes, CTA, pie y diálogo móvil.
- Español inicial y cambio a inglés sin recarga. Atributo `lang`, título y descripción se actualizan.
- Idioma y tema se conservan después de recargar.
- Paridad de traducciones: 167 claves por idioma. Nombres propios de marcas y sociedad se conservan.
- Los controles de las 12 áreas actualizan la selección compartida entre hero y catálogo.
- Selector de organizaciones/personas actualiza el enfoque; el diálogo conserva ese enfoque y el área elegida.
- Menú móvil: abre, navega y se cierra al seleccionar una sección; cierre con Escape.
- Preguntas frecuentes: expansión nativa con teclado.
- Diálogos: foco contenido por `dialog.showModal()`, Escape cierra y restaura el foco al control que lo abrió.
- Infografía original: carga comprobada, dimensiones correctas y alt descriptivo. Se ofrece en español; la interfaz de áreas está traducida a ambos idiomas.
- Contraste de textos secundarios ajustado durante revisión. Foco visible y estilos para `prefers-reduced-motion` incluidos. Esta revisión no constituye una certificación WCAG ni una prueba con lector de pantalla.
- Un solo h1; estructura h2/h3, landmarks, enlaces identificables y etiquetas asociadas a campos.

## WhatsApp

- Número confirmado: +1 (954) 682-2141.
- Enlace directo inspeccionado: `https://wa.me/19546822141`.
- Verificada la codificación y recuperación exacta de texto con tildes, saltos de línea, interrogación y ampersand.
- El diálogo prepara el texto y abre WhatsApp para revisión del visitante. No se enviaron mensajes reales durante la validación.

## Alcance de SEO

Metadata inicial en HTML, actualización según idioma, favicon, robots, tipografía local, dimensiones de imagen y HTML semántico. No se inventaron dominio canónico ni URLs para sitemap/hreflang. Es una SPA React; la estrategia de indexación independiente de ambos idiomas se define al publicar.
