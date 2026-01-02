# 📦 Inventario de Assets - Anclora Private Estates

> **Contexto**: Web en desarrollo para agente independiente de eXp Realty Spain. Sin clientes activos aún, enfocada en mostrar portfolio y capacidades profesionales.

---

## 📊 Resumen Ejecutivo

| Categoría | Requeridos | Existentes | Faltantes |
|-----------|:----------:|:----------:|:---------:|
| **Logos SVG** | 4 | 0 | 🔴 4 |
| **Logos PNG** | 2 | 2 | ✅ 0 |
| **Video Hero** | 1 | 0 | 🔴 1 |
| **Placeholders** | 4 | 4 | ✅ 0 |
| **Fotos Propiedades** | 6+ | 0 | 🟡 6+ |
| **Logos Partners** | 5 | 1 (genérico) | 🟡 5 |

---

## 🔴 CRÍTICOS - Afectan funcionamiento visual

### 1. Logos SVG (Web)

Los componentes Header, Footer y Hero buscan estos archivos SVG que **no existen**:

#### `/assets/logos/anclora-private-estates.svg`
| Especificación | Valor |
|----------------|-------|
| **Usado en** | Header, Footer |
| **Dimensiones** | Vectorial, ~200x50px visible |
| **Fondo** | Transparente |
| **Descripción** | Logo principal de la marca con texto "Anclora Private Estates". Versión horizontal para navegación. |
| **Fuente existente** | Puede generarse desde `logo_private_estates.png` |

#### `/assets/logos/anclora-nexus-group.svg`
| Especificación | Valor |
|----------------|-------|
| **Usado en** | Hero (sobre video/imagen oscura) |
| **Dimensiones** | Vectorial, ~300x80px visible |
| **Fondo** | Transparente |
| **Descripción** | Logo del grupo matriz "Anclora Nexus Group". Se muestra invertido (blanco) sobre fondo oscuro. |
| **Fuente existente** | Puede generarse desde `Logo_Anclora_Nexus_Group.png` |

#### `/assets/logos/anclora-cognitive-solutions.svg`
| Especificación | Valor |
|----------------|-------|
| **Usado en** | Sección B2B (Cognitive Solutions) |
| **Dimensiones** | Vectorial, ~250x60px visible |
| **Fondo** | Transparente |
| **Descripción** | Logo de la división B2B de servicios IA. Debe transmitir tecnología e innovación. |
| **Fuente existente** | Diseñar nuevo basado en identidad corporativa |

#### `/assets/logos/anclora-private-estates-mark.svg`
| Especificación | Valor |
|----------------|-------|
| **Usado en** | Favicons, iconos pequeños |
| **Dimensiones** | Cuadrado, ~64x64px |
| **Fondo** | Transparente |
| **Descripción** | Isotipo/símbolo de la marca sin texto. Ancla estilizada o inicial "A" con elementos dorados. |

---

### 2. Video/Imagen Hero Background

#### `/assets/videos/hero-background.mp4`
| Especificación | Valor |
|----------------|-------|
| **Usado en** | Sección Hero principal |
| **Resolución** | 1920x1080 mínimo (4K ideal) |
| **Duración** | 15-30 segundos, loop seamless |
| **Audio** | Sin audio (se reproduce muteado) |
| **Formato** | MP4 (H.264) |
| **Peso máximo** | ~10-15MB |

**Contenido sugerido** (opciones):
1. **Vista aérea con drone**: Mallorca desde el aire, costas, mar turquesa
2. **Propiedad de lujo**: Exterior de villa con piscina infinity
3. **Lifestyle mediterráneo**: Atardecer sobre el mar, veleros

**Alternativa temporal**: Usar una imagen estática de alta calidad en `/assets/images/hero-background.jpg` y modificar el componente `Hero.tsx` para mostrar imagen en lugar de video.

---

## 🟡 RECOMENDADOS - Mejoran presentación

### 3. Fotos de Propiedades (Portfolio)

Para la sección "Propiedades Destacadas" y el portfolio. Al no tener propiedades reales aún, opciones:

**Opción A: Caso de estudio ficticio (recomendado)**
Crear 1-2 propiedades "portfolio" con descripción clara de que es una demostración de capacidades.

| Archivo | Descripción del contenido |
|---------|---------------------------|
| `/assets/images/properties/portfolio-villa-01.jpg` | Villa de lujo con vistas al mar, piscina infinity, arquitectura moderna |
| `/assets/images/properties/portfolio-villa-02.jpg` | Interior: salón amplio con ventanales, acabados premium |
| `/assets/images/properties/portfolio-villa-03.jpg` | Terraza/jardín con vistas panorámicas |
| `/assets/images/properties/portfolio-finca-01.jpg` | Finca tradicional mallorquina reformada |
| `/assets/images/properties/portfolio-finca-02.jpg` | Interior rústico-moderno, vigas de madera |
| `/assets/images/properties/portfolio-atico-01.jpg` | Ático en Palma con terraza y vistas ciudad |

**Especificaciones técnicas**:
- Resolución: 1920x1280 mínimo
- Formato: JPG o WebP
- Peso: <500KB por imagen

**Opción B: Solo placeholders**
Usar los SVG placeholder existentes hasta tener contenido real.

---

### 4. Logos de Partners/Tecnología

Para la sección "Social Proof" (alianzas estratégicas):

| Partner | Archivo | Descripción |
|---------|---------|-------------|
| eXp Realty | `/assets/partners/exp-realty.svg` | Logo oficial eXp Realty Spain (tu brokerage) |
| Make.com | `/assets/partners/make.svg` | Plataforma de automatización que usas |
| n8n | `/assets/partners/n8n.svg` | Herramienta de workflows |
| OpenAI | `/assets/partners/openai.svg` | IA que potencia tus servicios |
| Idealista | `/assets/partners/idealista.svg` | Portal inmobiliario principal |

**Nota**: Puedes usar el `placeholder-partner.svg` genérico por ahora. Para logos reales, descargar de las webs oficiales respetando guidelines de marca.

---

### 5. Foto de Perfil/Equipo

#### `/assets/images/team/founder.jpg`
| Especificación | Valor |
|----------------|-------|
| **Usado en** | Página "Nosotros" |
| **Dimensiones** | 800x800 (cuadrada) |
| **Descripción** | Foto profesional tuya como fundador/agente. Fondo neutro, vestimenta profesional. |

---

## ✅ YA EXISTEN

### Logos PNG (Alta resolución)
- ✅ `/assets/logos/logo_private_estates.png` (787KB)
- ✅ `/assets/logos/Logo_Anclora_Nexus_Group.png` (2.3MB)
- ✅ `/assets/logos/palette_private_estates.png`

### Placeholders
- ✅ `/assets/images/placeholders/hero-placeholder.svg`
- ✅ `/assets/images/placeholders/property-placeholder.svg`
- ✅ `/assets/images/placeholders/blog-placeholder.svg`
- ✅ `/assets/partners/placeholder-partner.svg`

### Favicons/PWA
- ✅ `/favicon.ico`
- ✅ `/favicon-16x16.png`
- ✅ `/favicon-32x32.png`
- ✅ `/android-chrome-192x192.png`
- ✅ `/android-chrome-512x512.png`

---

## 🛠️ Plan de Acción Sugerido

### Fase 1: Mínimo viable (1-2 horas)
1. [ ] Convertir logos PNG existentes a SVG (puedo ayudarte)
2. [ ] Elegir imagen estática para hero (temporalmente)
3. [ ] La web será navegable

### Fase 2: Portfolio básico (1 día)
4. [ ] Buscar/crear 2-3 fotos de propiedades de ejemplo
5. [ ] Añadir foto profesional tuya
6. [ ] Añadir disclaminer "Portfolio/Demostración"

### Fase 3: Producción (cuando tengas propiedades reales)
7. [ ] Reemplazar contenido portfolio por propiedades reales
8. [ ] Video hero profesional
9. [ ] Logos reales de partners

---

## 📍 Rutas de la Aplicación

Las siguientes rutas **YA EXISTEN** en el código:

| Ruta | Descripción | Estado |
|------|-------------|--------|
| `/es`, `/en`, `/de` | Homepage | ✅ Funcional |
| `/propiedades` | Listado de propiedades | ⚠️ Necesita datos |
| `/servicios` | Servicios ofrecidos | ⚠️ Necesita contenido |
| `/contacto` | Formulario de contacto | ⚠️ Verificar funcionamiento |
| `/nosotros` | Sobre la empresa | ⚠️ Necesita foto tuya |
| `/blog` | Insights/Blog | ⚠️ Necesita artículos |

---

*Documento generado: 2 enero 2026*
