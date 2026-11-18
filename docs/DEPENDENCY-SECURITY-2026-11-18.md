# Dependencias: revisión 18/11/2026

Se actualizaron Vite a 8.3.8 y source-map-js a 1.2.2 en los locks de npm y
Yarn 4. Se mantiene la versión mayor de Vite y no se modifica el flujo de
membresía ni se conecta una pasarela de pagos.

Verificación: instalación inmutable con Yarn 4.18.0, `npm run check` y
`npm run build` aprobados. `npm audit --omit=dev` reporta cero vulnerabilidades.

## Estado del advisory tras la revisión de seguimiento

La primera revisión encontró cinco entradas altas del audit por **un mismo
advisory** transitivo: [GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf).
No había parche publicado para picomatch 4.0.7. `npm audit fix --force` proponía
bajar Vite a 6.2.7 y el plugin de React a una versión mayor anterior. No se
aplicó ese downgrade incompatible solo para silenciar el hallazgo.

En la revisión de seguimiento del **18/11/2026**, GitHub ya marca el advisory
como **retirado (withdrawn)**. El registro se conserva como referencia
histórica. npm sigue devolviendo cinco entradas altas vinculadas a ese mismo
registro; la versión publicada de picomatch sigue siendo 4.0.7 y Vite 8.3.8.
La retirada no es una actualización del código ni prueba de que el audit de
npm ya haya sincronizado el cambio. No se añade una excepción global al audit.

El sitio se construye como archivos estáticos; estas herramientas son
`devDependencies`. La aplicación no recibe patrones glob de usuarios para
procesarlos con picomatch. Desarrollo y preview siguen limitados a 127.0.0.1.
`npm audit --omit=dev` sigue limpio. Si se introduce procesamiento de patrones
externos en el futuro, revisar ese límite de confianza expresamente.

## Repetir la verificación

```sh
npx --yes @yarnpkg/cli-dist@4.18.0 install --immutable
npm run check
npm run build
npm audit --omit=dev
npm audit
```

El último comando sigue devolviendo estado no cero por el registro retirado
que npm aún reporta. Revisar el advisory original antes de decidir un cambio
de versión o de comportamiento.
No hay un workflow de publicación del sitio registrado en este repositorio;
este cambio publica las dependencias corregidas en Git. Para volver a servir
un artefacto con ellas, construir y publicar `dist/` mediante el proceso de
hosting vigente. No tratar una ejecución de `vite preview` como despliegue.
