# COPP–ADRESD · Landing institucional

Aplicación independiente en React + TypeScript + Vite. El contenido parte de los archivos de `docs/`; los originales se conservan intactos. No depende de los demás proyectos del monorepo.

## Ejecutar

Requiere Node.js 22.12+ o una versión compatible con Vite 8.

```sh
npm ci
npm run dev
```

Vista local: http://127.0.0.1:5174

```sh
npm run check    # TypeScript estricto
npm run build    # Genera únicamente los archivos públicos en dist/
npm run preview  # Comprueba dist/ en http://127.0.0.1:4174
```

## Organización

- `src/sections/`: bloques del ecosistema y del programa.
- `src/components/`: iconos, navegación, pie, encabezados y diálogos reutilizables.
- `src/i18n/translations.ts`: textos y metadatos completos en español e inglés.
- `src/i18n/areas.ts`: las 12 áreas, marcas, iconos y descripciones.
- `src/i18n/Preferences.tsx`: preferencias de idioma y tema; `usePreferences.ts` mantiene separado el contexto para Fast Refresh.
- `src/styles/index.css`: tokens de ambos temas, componentes, breakpoints y movimiento reducido.
- `src/assets/`: tipografía Manrope local e infografía optimizada a WebP.
- `CONTENT.md`: trazabilidad editorial y decisiones sobre los documentos fuente.

Idioma y tema iniciales: español y claro. Las preferencias se guardan en localStorage; si el navegador no permite almacenamiento, el cambio sigue funcionando en memoria. Las anclas conservan el idioma sin recargar.

## Canal de contacto

WhatsApp confirmado por el propietario: **+1 (954) 682-2141**. Está centralizado en `src/config/contact.ts`.

El diálogo prepara un mensaje con la organización, el enfoque, el área y el objetivo. Al continuar, abre `https://wa.me/19546822141` en una pestaña nueva con el texto codificado. El visitante revisa el mensaje en WhatsApp antes de enviarlo. También hay un enlace directo en el pie de página.

No se almacena información en el sitio ni se implementa un backend de leads. La prueba del enlace valida el destino y la codificación, sin enviar mensajes reales.

## Assets y publicación

- La fuente se sirve localmente, sin solicitudes a Google Fonts. Su licencia SIL OFL se distribuye en `public/licenses/Manrope.txt`.
- `ecosystem.webp` deriva de `word/media/image2.png` del DOCX: 1525 × 1004, sin recorte ni marcos. La imagen original está en español; se ofrece como referencia ampliable en ese idioma. La representación React de las 12 áreas funciona en ambos idiomas.
- El isotipo vectorial es una interpretación gráfica del motivo ADN de la referencia; no se afirma que sea un archivo oficial de marca.
- Los PDFs, el DOCX y `.analysis/` no se copian a `dist/`. Vite bloquea su lectura directa durante desarrollo.
- Publicar únicamente `dist/`. No se ha realizado despliegue externo.
- No se inventó dominio canónico, agenda, redes sociales ni URLs de tiendas. Canonical, sitemap y rutas indexables por idioma requieren definir el dominio y la estrategia de publicación.

## Verificación

Build y tipado estricto, revisión visual en navegador, navegación por teclado, mapa, enfoque B2B/B2C, preguntas desplegables, preparación de WhatsApp, diálogos, carga de imagen, cambio de idioma/tema y persistencia. Detalle de tamaños y resultados en `VERIFICATION.md`.
