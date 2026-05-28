# Anclora Private Estates

Frontend premium para Anclora Private Estates, construido con React + TypeScript + Vite.

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- i18next (`es`, `en`, `de`, `fr`)
- GSAP/ScrollTrigger

## Estado actual

- Navegación principal y secciones premium de landing operativas.
- Menú overlay rediseñado con enfoque limpio y jerárquico (sin cards), manteniendo la identidad visual premium.
- Documentación SDD inicial y de features en `sdd/`.

## SDD y gobernanza

- Núcleo SDD: `sdd/core/`
- Features SDD: `sdd/features/`
- Reglas de agentes: `.agent/rules/`
- Skills de features: `.agent/skills/features/`
- Prompts de orquestación: `.antigravity/prompts/features/`

Feature activa más reciente:
- `ANCLORA-MENU-002` (`menu-overlay-clarity-redesign`)

## Validación

Comandos de validación habilitados:

```bash
npm run lint
npm run test
```

## Documentación de análisis y mejora

- `public/docs/ANALISIS.md`
- `public/docs/PLAN_MEJORA.md`

## Contratos UX/UI

Lectura mínima antes de tocar interfaz:

1. `docs/standards/ANCLORA_ECOSYSTEM_CONTRACT_GROUPS.md`
2. `docs/standards/ANCLORA_ULTRA_PREMIUM_APP_CONTRACT.md`
3. `docs/standards/UI_MOTION_CONTRACT.md`
4. `docs/standards/MODAL_CONTRACT.md`
5. `docs/standards/LOCALIZATION_CONTRACT.md`

## Branding canónico

- Grupo: `Ultra Premium`
- Tipografía display: `Cardo` (serif)
- Tipografía body/UI: `Inter` (sans-serif)
- Tipografía acentos: `Fraunces` (serif)
- Borde de icono: Oro pulido `#D4AF37`
- Accent principal: Oro `#D4AF37`
- Interior de icono: Teal oscuro `#1A3035`
- Secundario: Teal `#3AA090`
- Fondo base: `#07252F`
- Prefijo favicon: `pe_`
- Idiomas: `es`, `en`, `de`, `fr`
- Assets finales (icono, favicon): pendientes de entrega por el usuario
- Contrato de referencia: `docs/standards/ANCLORA_BRANDING_MASTER_CONTRACT.md`
- Alcance de esta fase: alineación estructural de branding; assets finales integrados en fase posterior
## Global Preferences Toggle

Esta app sigue el contrato global de preferencias de Anclora Group.

Incluye:
- idioma
- moneda, porque muestra importes
- unidades, porque muestra superficies

El Theme Toggle se gestiona por separado y no aparece en apps Ultra Premium.
