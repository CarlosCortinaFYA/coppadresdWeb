# Dependencias: revisión 18/11/2026

Se actualizaron Vite a 8.3.8 y source-map-js a 1.2.2 en los locks de npm y
Yarn 4. Se mantiene la versión mayor de Vite y no se modifica el flujo de
membresía ni se conecta una pasarela de pagos.

Verificación: instalación inmutable con Yarn 4.18.0, `npm run check` y
`npm run build` aprobados. `npm audit --omit=dev` reporta cero vulnerabilidades.

El audit completo aún reporta cinco paquetes altos por **un mismo advisory**
transitivo: [GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf).
Afecta a picomatch hasta 4.0.7; al revisar, el proveedor no publica una versión
corregida. Vite y sus herramientas de búsqueda propagan el hallazgo. La
sugerencia de `npm audit fix --force` implica bajar Vite a 6.2.7 y el plugin de
React a una versión mayor anterior; no se aplicó ese cambio incompatible.

El sitio se construye como archivos estáticos; estas herramientas son
`devDependencies`, no un servicio Node que reciba patrones de usuarios en
producción. El servidor de desarrollo/preview queda limitado a 127.0.0.1.
Esto acota la exposición de este sitio; no significa que el advisory esté
corregido. No exponer el servidor de desarrollo ni incorporar globs enviados
por usuarios. Actualizar picomatch y ambos locks cuando exista parche.

## Repetir la verificación

```sh
npx --yes @yarnpkg/cli-dist@4.18.0 install --immutable
npm run check
npm run build
npm audit --omit=dev
npm audit
```

El último comando sigue devolviendo estado no cero por el hallazgo descrito.
No hay un workflow de publicación del sitio registrado en este repositorio;
este cambio publica las dependencias corregidas en Git. Para volver a servir
un artefacto con ellas, construir y publicar `dist/` mediante el proceso de
hosting vigente. No tratar una ejecución de `vite preview` como despliegue.
