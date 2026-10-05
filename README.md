# Landing COPP–ADRESD por programas

React + TypeScript + Vite. Proyecto independiente; documentación original intacta en `docs/`. La landing no requiere API; la página `/eliminar-cuenta` usa el Auth Service del monorepo vía gateway (ver `.env.example`).

## Ejecución

```sh
npm ci
npm run dev       # http://127.0.0.1:5174
npm run build     # TypeScript + producción en dist/
npm run preview   # http://127.0.0.1:4174
```

Se mantienen la configuración y el lockfile de Yarn existentes. No se añadieron dependencias para esta actualización. Vite conserva los allowedHosts configurados y las restricciones de acceso a los documentos internos.

## Arquitectura

- `src/programs/data.ts`: registro tipado de los cuatro programas; el contenido ES/EN se organiza en módulos por programa. Weight Support Plus es la selección inicial.
- `src/programs/ProgramPage.tsx`: pestañas accesibles, hero, bloques de contenido, tarjetas, ingredientes, preguntas y CTA compartidos.
- `src/sections/`: contenido institucional anterior, conservado exclusivamente en Copp Adresd.
- `src/i18n/`: traducciones institucionales, áreas y preferencias persistentes.
- `src/components/BrandMark.tsx`: reconstrucción SVG del símbolo de las referencias. Fondo transparente e identificador de degradado único por instancia.
- `public/logo-symbol.svg`: símbolo SVG reutilizable; `public/favicon.svg`: misma geometría para favicon.
- `src/styles/index.css`: componentes institucionales existentes.
- `src/styles/programs.css`: identidad oficial, temas, programas y adaptaciones responsive; se importa después de la base.
- `src/config/contact.ts`: WhatsApp confirmado, +1 (954) 682-2141.

## Incorporar contenido futuro

En `programs`, elegir el programa, pasar `status` a `available` y añadir `hero`, `sections` y `cta` con textos `l(es, en)`. `hero` permite imagen con texto alternativo traducido, gráfico configurable y datos destacados opcionales. Las tarjetas también aceptan imágenes.

Los bloques disponibles son `overview`, `features`, `benefits`, `content`, `ingredients` y `faq`. Cada bloque define su título, descripción e items; los de ingredientes pueden definir `initialSelected` y `note`. La navegación superior se genera a partir de los bloques que incluyan `navLabel: l(es, en)`. No requiere modificar los componentes al añadir secciones.

Copp Adresd conserva el contenido institucional documentado mediante el adaptador `institutional`. Puede ampliarse con las mismas secciones o migrarse gradualmente. Longevity Program y Pep Mimetic mantienen límites explícitos sobre el alcance y la evidencia de su material de referencia.

No trasladar fórmulas, evidencia ni resultados entre programas. Ver `CONTENT.md` para la trazabilidad y `VERIFICATION.md` para las comprobaciones.

## Comportamiento

- Tabs: flechas izquierda/derecha, Home/End, foco móvil y scroll horizontal contenido.
- Idioma completo ES/EN y tema claro/oscuro persistentes; movimiento reducido respetado.
- Composición interactiva y tabla desplegable, preguntas expandibles y mapa institucional conservado.
- Formulario abre un borrador en WhatsApp con el programa seleccionado. El usuario revisa y envía allí; la web no almacena sus datos.
- Tipografía Manrope local; sin dependencias de fuentes remotas ni imágenes de terceros.

## Actualización con los tres nuevos recursos

Todos los programas tienen ahora contenido disponible. Los módulos están separados:

- `src/programs/types.ts`: contratos de datos y traducciones.
- `src/programs/data.ts`: registro público de programas, conservando los imports existentes.
- `src/programs/weight-support-plus.ts` y `weight-details.ts`: fórmula y lectura ampliada de Plus.
- `src/programs/pep-mimetic.ts`: concepto PCP4, seis módulos, composición propuesta, desarrollo y límites de evidencia.
- `src/programs/longevity-program.ts`: contenido de la infografía y referencia original ampliable.
- `src/programs/ui.ts` y `content.ts`: textos de interfaz y helper de contenido bilingüe.

El renderizador incorpora bloques `steps` (etapas/metodología) y `metrics` (indicadores/periodicidades). Los gráficos de hero permiten un símbolo central y etiqueta configurables; Longevity los usa para una composición web propia basada en sus pilares, sin incrustar la infografía fuente.

Longevity mantiene explícitamente pendientes los protocolos completos, operación y disponibilidad que la imagen no especifica. Pep Mimetic describe una propuesta de investigación, sin presentarla como una combinación clínicamente validada.
