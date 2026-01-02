# Contexto del Proyecto - Anclora Private Estates

## Resumen de los últimos cambios (Enero 2026)

### 1. Resolución de Errores Críticos de i18n
- **Error 404 Resuelto**: Se identificó que `i18n/request.ts` utilizaba una API obsoleta para Next.js 15. Se actualizó para usar `requestLocale` como una `Promise` (haciendo `await`), lo que permitió que las rutas `/es`, `/en` y `/de` volvieran a ser accesibles.
- **Sincronización de Traducciones**: Se corrigieron múltiples errores de `MISSING_MESSAGE`. Los archivos `locales/{locale}/translation.json` se actualizaron para incluir claves que los componentes esperaban pero no encontraban (ej: `hero.cta.primary`, `problemOpportunity`, `privateEstates.headline`, `socialProof.headline`, `finalCta`).
- **Completitud del idioma Alemán**: Se completó el archivo `de/translation.json` que estaba mayormente vacío, permitiendo una visualización coherente en los tres idiomas.

### 2. Estabilidad de la Aplicación (Runtime)
- **Corrección de Configuración**: Se resolvieron crashes en el cliente debidos a importaciones incorrectas de `siteConfig`. Los componentes `CognitiveSolutions.tsx` y `FinalCTA.tsx` ahora importan correctamente `cognitiveSolutionsConfig` como una exportación nombrada desde `lib/config.ts`.
- **Limpieza de Caché**: Se realizaron procesos de limpieza profunda de `.next` para asegurar que los cambios estructurales en el routing se reflejaran correctamente.

### 3. Auditoría de Assets e Identidad
- **Inventario de Assets**: Se creó el documento `INVENTARIO_ASSETS.md` que detalla los recursos faltantes (logos SVG, video hero, imágenes de propiedades).
- **Identidad de Marca**: Se definió la imagen de marca final para Anclora Private Estates, inspirada en exclusividad y lujo. Se ha establecido que el negocio es **100% online**, eliminando cualquier referencia a oficinas físicas.
- **Paleta de Colores**: Consolidada en Azul Marino (#2C3E50), Dorado (#D4AF37), Blanco (#F5F5F0) y Bronce (#B9915F).

---

## Situación Actual del Proyecto

### Perfil del Negocio
- **Fase**: Startup / Lanzamiento inicial.
- **Agente**: Agente independiente asociado a **eXp Realty Spain**.
- **Activos**: Actualmente sin clientes ni propiedades reales. El sitio web se enfocará en mostrar un **portfolio de demostración** (casos de uso) para validar la capacidad y el estilo de trabajo.
- **Alcance**: Operación digital centrada en propiedades de lujo en el Mediterráneo (Mallorca) y soluciones cognitivas (IA) para el sector inmobiliario.

### Estado Funcional
- ✅ El enrutado i18n (`/es`, `/en`, `/de`) funciona perfectamente.
- ✅ Los componentes principales renderizan sin errores de traducción o de JavaScript.
- ⚠️ Muchos elementos visuales (logos SVG, videos, fotos de propiedades) están usando placeholders o faltan en el sistema de archivos.

---

## Próximos Pasos (Priorizados)

### P0 (Crítico - Visual)
- **Generación de Logos SVG**: Convertir los logotipos PNG actuales a formato SVG optimizado para web (`anclora-private-estates.svg`, `anclora-nexus-group.svg`, etc).
- **Carga de Assets de Marca**: Integrar el video hero o una imagen estática de alta calidad para eliminar el placeholder del Hero.

### P1 (Contenido - Portfolio)
- **Implementación de Casos de Uso**: Crear contenido estático para la sección de propiedades que muestre el "tipo de trabajo" (portfolio) con descripciones de lujo, aunque no sean activos reales todavía.
- **Actualización de "Nosotros"**: Incluir perfil profesional del fundador y mención clara a la asociación con eXp Realty Spain.

### P2 (Funcionalidad)
- **Verificación de Enlaces**: Revisar que todos los enlaces en el Header y Footer funcionen con `next-intl/navigation`.
- **Formularios de Contacto**: Verificar la integración con los webhooks de n8n especificados en `siteConfig`.

### P3 (SEO y Optimización)
- **Metatags dinámicos**: Asegurar que cada página y cada idioma tenga su SEO optimizado según `lib/config.ts`.

---

## Notas de Desarrollo
- La aplicación corre sobre **Next.js 15.5.9**.
- Se utiliza `next-intl` para toda la lógica de localización.
- El diseño sigue principios de **Rich Aesthetics**: tipografía serif para lujo (Private Estates) y sans-serif para tecnología (Cognitive Solutions).
