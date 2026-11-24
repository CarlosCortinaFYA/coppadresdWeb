# Landing COPP–ADRESD por programas

React + TypeScript + Vite. Proyecto independiente; documentación original intacta en `docs/`. La landing no requiere API; la página `/eliminar-cuenta` usa el Auth Service del monorepo vía gateway (ver `.env.example`).

La recuperación de contraseña usa `/recuperar-cuenta` (`/recover-account` en inglés) y el endpoint `POST /api/auth/account/password-reset/confirm`. El enlace HTTPS lleva el token en el fragmento. La página lo retira de la URL al abrir y lo mantiene en memoria hasta confirmar. Verificar en el entorno de despliegue que CloudFront resuelva ambas rutas públicas y reenvíe el POST al gateway.

## Ejecución

```sh
npm ci
npm run dev       # http://127.0.0.1:5174
npm run build     # TypeScript + producción en dist/
npm run preview   # http://127.0.0.1:4174
```

Se mantienen la configuración y el lockfile de Yarn existentes. No se añadieron dependencias para esta actualización. Vite conserva los allowedHosts configurados y las restricciones de acceso a los documentos internos.

Para probar la activación por correo desde `/membresia`, inicia Vite con `VITE_PAID_ACTIVATION_DEMO=true` y apunta `DEV_PROXY_TARGET` al gateway local con la simulación habilitada y un buzón SMTP de pruebas. Los enlaces abren `/activar-membresia` o `/activate-membership`. El navegador conserva la referencia del pago simulado y el plan pendiente en la sesión. Después de recargar, consulta el recibo en Auth para mostrar el plan y monto confirmados.

Ejecuta `node e2e/paid-activation.mjs` con esta web, el Gateway, Auth, la
API y PostgreSQL locales. Habilita `--enable-chaos` en un Mailpit desechable
para probar el rechazo SMTP. Configura `COP_E2E_PAID_WEB_URL`,
`COP_E2E_PAID_INBOX_URL`, `COP_E2E_PAID_DB_CONTAINER` y
`COP_E2E_PAID_DATABASE`. Para la vinculación usa un paciente sintético
`@example.invalid` sembrado en esa base y configura
`COP_E2E_PAID_EXISTING_EMAIL` y `COP_E2E_PAID_EXISTING_PASSWORD`.
El script usa Playwright de la app hermana o de `COP_PLAYWRIGHT_APP_DIR`.
`COP_E2E_BROWSER=webkit` selecciona WebKit.

Para probar los siete pasos hasta Inicio, ejecuta también
`node e2e/paid-customer-journey.mjs`. Sembrar los documentos y los recibos
del paciente existente con `backend/scripts/qa/seed-paid-customer-journey.sql`
en la base desechable, con `psql --set returning_email=<correo sintético>`.
Aplica las migraciones Auth y API antes de sembrar. Configura
`PaidActivationDemo__AppBaseUrl` en Auth y `COP_E2E_PAID_APP_URL` en la prueba
con el origen local de la app móvil. La web y la app usan el mismo host,
con puertos distintos, para continuar con la sesión de Auth. Arranca
la app en Vite con `VITE_WELLNESS_JOURNEY_DEMO=true` y su proxy al Gateway.
Configura la API en Development con `WellnessJourneyDemo__Enabled=true`
y `WellnessJourneyDemo__FailureOnFirstAttempt=true` para la prueba de
reintento en Inicio.

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
