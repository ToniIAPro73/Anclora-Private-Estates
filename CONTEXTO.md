# Contexto del Proyecto

## Resumen de los ultimos cambios

1) Enrutado i18n y layouts
- Se elimino `app/layout.tsx` y `app/page.tsx` para evitar un layout raiz que compita con `app/[locale]`.
- Se ajustaron los parametros dinamicos en `app/[locale]/layout.tsx` y `app/[locale]/page.tsx` para cumplir con Next.js 15: `params` se trata como `Promise` y se hace `await` antes de leer `locale`.
- Se mantuvo `middleware.ts` con `next-intl` y el matcher para `/(es|en|de)`.

2) Configuracion next-intl
- `next.config.js` usa `createNextIntlPlugin('./i18n/request.ts')`.
- `i18n/request.ts` carga `locales/{locale}/translation.json` y valida `locale`.
- `i18n/navigation.ts` define `locales` y `localePrefix: 'always'`.

3) Lint y ESLint CLI
- El script de lint se migro a `eslint .` con `eslint.config.mjs` (Flat config).
- Se desactivo/ignoro lint en carpetas no relevantes para el flujo actual.
- Se corrigieron multiples tipos `any`, `no-console`, imports y casos de `require` en varios archivos.

4) Favicon y PWA
- Se elimino `public/favicon.svg`.
- Se regeneraron `public/favicon-16x16.png` y `public/favicon-32x32.png` reales desde `public/assets/logos/logo_private_estates.png`.
- Se generaron `public/android-chrome-192x192.png`, `public/android-chrome-512x512.png` y `public/favicon.ico`.
- `public/site.webmanifest` incluye los favicons 16/32, los iconos 192/512 y los dos logos 1024x1024 con `purpose: "maskable"`.
- `lib/metadata.ts` incluye `favicon.ico` y solo PNG en `icons`.

5) Assets actualizados
- Logo web: `public/assets/logos/logo_private_estates.png` (1024x1024).
- Logo grupo matriz: `public/assets/logos/Logo_Anclora_Nexus_Group.png` (1024x1024).
- Paleta de color: `public/assets/logos/palette_private_estates.png`.

## Situacion actual del proyecto

### Estado funcional
- El servidor `next dev` compila `/[locale]` pero la ruta `/es` sigue respondiendo 404.
- En consola del navegador solo aparecen warnings de preload de CSS (sin errores JS).
- Se corrigio el error de Next 15 sobre `params` sincronicos (ahora se hace `await`), pero el 404 persiste.

### Hipotesis principales del bloqueo
1) El `notFound()` en `app/[locale]/layout.tsx` podria estar disparandose por un valor de `locale` inesperado.
2) El middleware de `next-intl` podria no estar redirigiendo correctamente o la ruta no coincide con el matcher.
3) El layout raiz eliminado pudo cambiar el arbol de rutas y aun hay cache local de Next.

### Logs recientes relevantes
- Next.js 15.5.9
- Compila `/middleware` y `app/[locale]` sin errores.
- GET `/es` devuelve 404 (no 500).

## Archivos clave a revisar para el 404

- `app/[locale]/layout.tsx`
- `app/[locale]/page.tsx`
- `middleware.ts`
- `i18n/request.ts`
- `i18n/navigation.ts`
- `next.config.js`

## Acciones sugeridas (orden recomendado)

1) Reiniciar `npm run dev` para limpiar cache y cargar cambios de `params`.
2) Revisar logs del servidor justo despues de solicitar `/es`.
3) Si sigue 404, añadir un log temporal en `app/[locale]/layout.tsx` para verificar `locale`.
4) Si `locale` es correcto, revisar el matcher del middleware y el `localePrefix`.
5) Si el middleware no aplica, forzar una ruta directa `/es` sin redirecciones y validar que el layout renderiza.

## Pendientes por prioridad

### P0 (Bloqueantes)
- Resolver 404 en `/es` (confirmar si el `notFound()` se dispara o si el matcher del middleware no aplica).
- Confirmar carga correcta de mensajes `next-intl` desde `i18n/request.ts`.

### P1 (Alta)
- Verificar `localePrefix: 'always'` vs necesidad real del proyecto (impacto en rutas raiz).
- Limpiar caches locales y asegurar que no hay restos de layouts raiz anteriores.

### P2 (Media)
- Revisar metadata SEO y `site.webmanifest` una vez el routing funcione.
- Validar cambio de idioma con `useLanguageToggle` en todas las rutas principales.

### P3 (Baja)
- Ajustar tamaños/formatos adicionales de iconos si se requieren (maskable con padding, apple-touch).

## Notas adicionales

- El manifest y los iconos ya son consistentes en tamanos y rutas.
- El proyecto mantiene el enfoque i18n con `next-intl`, datos localizados y rutas `/es`, `/en`, `/de`.
- A nivel de lint, el repositorio se encuentra limpio con el nuevo CLI.
