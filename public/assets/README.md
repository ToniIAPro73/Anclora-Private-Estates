# Assets Structure

Esta carpeta contiene todos los assets visuales del proyecto Anclora Private Estates.

## Estructura de Directorios

```
/public/assets/
├── logos/              # Logos de marca (SVG)
│   ├── anclora-private-estates.svg
│   ├── anclora-nexus-group.svg
│   ├── anclora-cognitive-solutions.svg
│   └── anclora-private-estates-mark.svg
│
├── images/             # Imágenes generales del sitio
│   ├── hero-*.webp    # Imágenes de hero sections
│   ├── og-image.jpg   # Open Graph image (1200x630)
│   └── placeholders/  # Placeholders para desarrollo
│
├── videos/             # Videos de hero y background
│   ├── hero-background.mp4
│   └── property-showcase.mp4
│
├── properties/         # Imágenes de propiedades
│   ├── [property-id]/ # Una carpeta por propiedad
│   │   ├── main.webp  # Imagen principal
│   │   ├── gallery-01.webp
│   │   ├── gallery-02.webp
│   │   └── ...
│
├── blog/               # Imágenes de blog posts
│   ├── [post-slug]/
│   │   ├── featured.webp
│   │   └── inline-*.webp
│
└── partners/           # Logos de partners/tecnologías
    ├── make-logo.svg
    ├── openai-logo.svg
    ├── n8n-logo.svg
    ├── exp-realty-logo.svg
    └── mls-logo.svg
```

## Especificaciones de Imágenes

### Hero Images
- Formato: WebP
- Dimensiones: 1920x1080 (16:9)
- Calidad: 85%
- Tamaño máximo: 500KB

### Property Images
- Formato: WebP
- Dimensiones principales: 1600x1200 (4:3)
- Dimensiones galería: 1200x900 (4:3)
- Calidad: 80%
- Tamaño máximo: 300KB por imagen

### Blog Featured Images
- Formato: WebP
- Dimensiones: 1200x630 (OG format)
- Calidad: 80%
- Tamaño máximo: 200KB

### Partner Logos
- Formato: SVG (preferido) o PNG con transparencia
- Dimensiones: Máximo 200x80px
- Background: Transparente

### Videos
- Formato: MP4 (H.264)
- Resolución: 1920x1080
- Frame rate: 30fps
- Bitrate: 5000 kbps
- Duración recomendada: 15-30 segundos para loops

## Optimización

Todas las imágenes deben:
1. Estar optimizadas con herramientas como sharp o squoosh
2. Usar formatos modernos (WebP para fotos, SVG para iconos/logos)
3. Incluir alt text descriptivo
4. Tener nombres descriptivos en kebab-case
5. Ser responsive con srcset cuando sea necesario

## Placeholders

Durante el desarrollo, se usan placeholders SVG generados automáticamente.
Ver `/public/assets/images/placeholders/` para los placeholders disponibles.

## Créditos

Las imágenes finales deben incluir créditos de fotógrafos/sources cuando sea aplicable.
Almacenar metadatos en `/data/assets-metadata.json`.
