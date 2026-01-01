# VIDEO ASSETS - PLACEHOLDERS

## Hero Video Background

**Ubicación**: `/public/assets/videos/hero-background.mp4`

**Especificaciones**:
- Formato: MP4 (H.264)
- Resolución: 1920×1080 (Full HD)
- Duración: 15-20 segundos (loop perfecto)
- Bitrate: 2-3 Mbps
- Tamaño máximo: 5MB
- Sin audio (muted)
- FPS: 30

**Contenido sugerido**:
- Vistas aéreas de Mallorca (costa, montañas)
- Atardeceres sobre el mar Mediterráneo
- Arquitectura de lujo de propiedades
- Detalles de interiores elegantes
- Movimiento lento y suave (slow motion)

**Fallback Image**:
- `/public/assets/images/hero-fallback.webp`
- Primera frame del video
- 1920×1080

---

## Implementación

### Hero con Video Background
```tsx
<section className="relative h-screen">
  {/* Video Background */}
  <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute inset-0 w-full h-full object-cover"
    poster="/assets/images/hero-fallback.webp"
  >
    <source 
      src="/assets/videos/hero-background.mp4" 
      type="video/mp4" 
    />
  </video>
  
  {/* Overlay */}
  <div className="absolute inset-0 bg-black/40" />
  
  {/* Content */}
  <div className="relative z-10 h-full flex items-center justify-center">
    <h1 className="heading-display text-white">
      Propiedades Exclusivas en Mallorca
    </h1>
  </div>
</section>
```

### Con Lazy Loading
```tsx
'use client';

import { useEffect, useRef, useState } from 'react';

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      onLoadedData={() => setIsLoaded(true)}
      className={`transition-opacity duration-1000 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      poster="/assets/images/hero-fallback.webp"
    >
      <source 
        src="/assets/videos/hero-background.mp4" 
        type="video/mp4" 
      />
    </video>
  );
}
```

---

## Fuentes de Video Stock

**Gratuitas**:
- Pexels Videos: https://www.pexels.com/videos/
- Pixabay Videos: https://pixabay.com/videos/
- Coverr: https://coverr.co/

**Premium**:
- Artgrid: https://artgrid.io/
- Storyblocks: https://www.storyblocks.com/
- Adobe Stock: https://stock.adobe.com/

**Keywords de búsqueda**:
- "mallorca luxury villa"
- "mediterranean coast aerial"
- "luxury property interior"
- "balearic islands sunset"
- "modern architecture mallorca"

---

## Optimización

### Compresión con FFmpeg

```bash
# Optimizar video para web
ffmpeg -i input.mp4 \
  -c:v libx264 \
  -crf 28 \
  -preset slow \
  -vf scale=1920:1080 \
  -movflags +faststart \
  -an \
  output.mp4
```

### Extraer Frame para Poster
```bash
# Extraer primer frame como fallback
ffmpeg -i hero-background.mp4 \
  -vframes 1 \
  -vf scale=1920:1080 \
  hero-fallback.jpg
```

### Crear Loop Perfecto
```bash
# Crear loop seamless con fade
ffmpeg -i input.mp4 \
  -filter_complex "[0:v]fade=t=in:st=0:d=1,fade=t=out:st=14:d=1[v]" \
  -map "[v]" \
  output-loop.mp4
```

---

## Performance Considerations

### Lazy Loading
- No cargar video hasta que sea visible
- Usar Intersection Observer
- Priorizar LCP images antes que video

### Mobile Considerations
```tsx
<video
  autoPlay={!isMobile}
  loop
  muted
  playsInline
  poster="/assets/images/hero-fallback.webp"
>
  {!isMobile && (
    <source src="/assets/videos/hero-background.mp4" type="video/mp4" />
  )}
</video>
```

### Preload
```tsx
// En layout.tsx o page.tsx
<link 
  rel="preload" 
  as="image" 
  href="/assets/images/hero-fallback.webp" 
/>
```

---

## Alternativas Sin Video

Si el video impacta negativamente el performance:

**Opción 1: Gradient Animado**
```css
background: linear-gradient(
  135deg,
  #1a1a1a 0%,
  #2d2d2d 50%,
  #1a1a1a 100%
);
background-size: 200% 200%;
animation: gradient 15s ease infinite;

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

**Opción 2: Imagen de Alta Calidad**
```tsx
<OptimizedImage
  src="/assets/images/hero-premium.webp"
  alt="Luxury properties in Mallorca"
  fill
  priority
  className="object-cover"
/>
```

**Opción 3: Ken Burns Effect** (zoom suave en imagen)
```css
@keyframes kenburns {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}

.hero-image {
  animation: kenburns 20s ease-in-out infinite alternate;
}
```
