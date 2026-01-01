# 🚀 Quick Start Guide - Anclora Private Estates

## Prerrequisitos Instalados ✅

El proyecto ya está configurado con:
- ✅ Next.js 15.1.3 + React 19
- ✅ TypeScript 5.7
- ✅ Tailwind CSS 4.0
- ✅ React Hook Form + Zod
- ✅ Variables de entorno configuradas
- ✅ ESLint + Prettier
- ✅ Estructura de carpetas completa
- ✅ Tipos TypeScript definidos
- ✅ Utilidades básicas creadas
- ✅ Docker Compose para servicios backend

## 📦 Instalación de Dependencias

```bash
cd anclora-private-estates
npm install
```

Esto instalará todas las dependencias definidas en `package.json`.

## 🔧 Configuración Inicial

### 1. Variables de Entorno

El archivo `.env.local` ya está creado con valores de desarrollo. Para producción:

```bash
cp .env.example .env.production
# Editar .env.production con valores reales
```

### 2. Servicios Backend (Opcional - Para Testing Local)

Levantar n8n, Twenty CRM y Mautic en Docker:

```bash
docker-compose up -d
```

Acceso a servicios locales:
- **n8n**: http://localhost:5678 (admin/admin123)
- **Twenty CRM**: http://localhost:3001
- **Mautic**: http://localhost:8080

## 🎯 Desarrollo

### Iniciar Servidor de Desarrollo

```bash
npm run dev
```

Abre http://localhost:3000 en tu navegador.

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm start            # Servidor de producción
npm run lint         # Ejecutar ESLint
npm run type-check   # Verificar tipos TypeScript
npm run format       # Formatear código con Prettier
```

## 📁 Estructura del Proyecto

```
app/
├── api/              # API Routes
│   ├── contact/      # Formulario de contacto
│   ├── webhook-n8n/  # Webhook para n8n
│   └── altcha/       # Anti-spam verification
├── propiedades/      # Páginas de propiedades
├── blog/             # Blog
└── page.tsx          # Homepage

components/
├── ui/               # Componentes UI base
├── layout/           # Header, Footer, Nav
├── sections/         # Secciones de página
└── shared/           # Componentes compartidos

lib/
├── utils.ts          # Utilidades generales
├── validations.ts    # Schemas Zod (pendiente)
├── n8n-client.ts     # Cliente n8n (pendiente)
└── ...

types/
└── index.ts          # Tipos TypeScript
```

## 🎨 Sistema de Diseño

### Colores Anclora

```tsx
// En Tailwind CSS
className="bg-anclora-gold text-anclora-white"

// Colores disponibles:
anclora-gold          #C5A059
anclora-gold-light    #D4B575
anclora-gold-dark     #A6834A
anclora-black         #000000
anclora-gray-dark     #1A1A1A
anclora-beige         #F5F5DC
anclora-white         #FFFFFF
```

### Componentes Pre-construidos

```tsx
// Botones
<button className="btn-primary">Click me</button>
<button className="btn-secondary">Click me</button>

// Inputs
<input className="input-anclora" />

// Cards
<div className="card-anclora">Content</div>
```

### Tipografías

```tsx
// Sans-serif (Montserrat) - Por defecto
<p className="font-sans">Text</p>

// Serif (Playfair Display) - Para headings
<h1 className="font-serif">Heading</h1>
```

## 🔨 Próximos Pasos

### Fase 1.3 - Estructura de Contenidos (En Progreso)
- [ ] Definir data structures para propiedades
- [ ] Crear archivo de traducciones (es.json, en.json)
- [ ] Mapear secciones de la web
- [ ] Definir jerarquía de navegación

### Fase 2 - Branding y Diseño
- [ ] Optimizar logo Anclora
- [ ] Preparar assets visuales
- [ ] Crear componentes de marca

### Fase 3 - Desarrollo Frontend
- [ ] Sección Hero
- [ ] Sección Features
- [ ] Grid de propiedades
- [ ] Formularios

## 📚 Recursos Útiles

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)

## 🐛 Debugging

### Puerto ocupado
```bash
# Matar proceso en puerto 3000
lsof -ti:3000 | xargs kill -9
```

### Problemas de caché
```bash
rm -rf .next
npm run dev
```

### Problemas con Docker
```bash
docker-compose down -v
docker-compose up -d
```

## 📞 Soporte

Para preguntas o problemas:
- Revisar documentación en `/ANCLORA_PRIVATE_ESTATES_ARQUITECTURA.md`
- Consultar README.md principal

---

**¡Listo para empezar a desarrollar! 🎉**
