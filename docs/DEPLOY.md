# Despliegue de la web pública

Dominio: `https://www.coppadresd.com` (y apex `coppadresd.com`).
Infra: S3 `cooppadresd-web-prod` (us-east-2) + CloudFront `E3736H4CGEE9U7`.

## Automático (normal)

`.github/workflows/deploy-web.yml` se ejecuta en cada push a `main` que toque
`src/`, `public/`, `index.html`, la configuración del build o el propio workflow.
También se puede lanzar a mano con `workflow_dispatch`.

Pipeline:

1. `npm ci` → `npm run check` (`tsc --noEmit`) → `npm run build` (`tsc -b && vite build`).
2. Valida que `dist/index.html` y `dist/assets/` existen y no están vacíos.
3. Sube `dist/assets/**` como inmutable (`max-age=31536000, immutable`); los nombres
   llevan hash de contenido, así que un asset nunca cambia bajo la misma URL.
4. Sube el resto de estáticos (`favicon.svg`, `logo-symbol.svg`, `robots.txt`,
   `licenses/…`) con `max-age=3600`.
5. Publica `index.html` con `no-cache, must-revalidate` **después** de los assets.
6. Borra assets huérfanos (solo bajo `assets/`, nunca en la raíz).
7. Invalida `/*` y espera a que CloudFront complete la invalidación.
8. Comprueba `https://www.coppadresd.com/` por HTTP.

Autenticación: OIDC de GitHub Actions → rol `cooppadresd-gha-web`
(`arn:aws:iam::933629770820:role/cooppadresd-gha-web`). Sin access keys.
El trust solo acepta `repo:CarlosCortinaFYA/coppadresdWeb` (por ID inmutable) en
`refs/heads/main`. Permisos: `s3:ListBucket` en el bucket, `s3:PutObject/GetObject/
DeleteObject/AbortMultipartUpload` en sus objetos y `cloudfront:CreateInvalidation/
GetInvalidation/ListInvalidations` sobre esa distribución.

## Manual (fallback)

```sh
npm ci
npm run check
npm run build

aws s3 sync dist/assets s3://cooppadresd-web-prod/assets \
  --cache-control "public, max-age=31536000, immutable"
aws s3 sync dist s3://cooppadresd-web-prod \
  --exclude "index.html" --exclude "assets/*" \
  --cache-control "public, max-age=3600"
aws s3 cp dist/index.html s3://cooppadresd-web-prod/index.html \
  --cache-control "no-cache, must-revalidate" --content-type "text/html; charset=utf-8"
aws s3 sync dist/assets s3://cooppadresd-web-prod/assets --delete --size-only \
  --cache-control "public, max-age=31536000, immutable"

aws cloudfront create-invalidation \
  --distribution-id E3736H4CGEE9U7 --paths "/*"
```

## Reglas

- **Nunca `--delete` en la raíz del bucket.** `mascot/*.png`, `sitemap.xml` y
  `social-cover.jpg` no están en el repo y se gestionan fuera del build; un
  `aws s3 sync dist s3://bucket --delete` los borraría. Solo se limpia `assets/`.
- **`index.html` siempre `no-cache`** y siempre después de subir los assets.
- El repo no usa Yarn en CI: `package-lock.json` + `npm ci` es la ruta verificada.
- Un fallo en el build corta el deploy antes de tocar S3.
