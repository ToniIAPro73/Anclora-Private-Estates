<!-- ANCLORA-ECOSYSTEM-CONTEXT-START -->
## Contexto de ecosistema Anclora

Antes de modificar este repositorio, todo agente debe leer:

- `.anclora/global/ANCLORA_ECOSYSTEM_CONTEXT.md`
- `.anclora/global/GLOBAL_AGENT_WORKFLOW.md`
- `.anclora/AGENT_PROJECT_CONTEXT.md`
- `MEMORY.md`

La arquitectura estable del ecosistema se define en:

`Boveda-Anclora/contracts/core/ANCLORA_ECOSYSTEM_ARCHITECTURE_CONTRACT.md`

No asumir infraestructura compartida entre productos. Validar siempre hosting, backend, base de datos, auth, variables y ramas.
<!-- ANCLORA-ECOSYSTEM-CONTEXT-END -->

# AGENTS.md

## Reglas operativas de comandos

- No ejecutar comandos de build (por ejemplo `npm run build`).
- Se permite ejecutar comandos de trabajo (lectura, búsqueda, edición, ejecución local) sin autorización explícita previa, siempre que no comprometan la integridad del proyecto.
- No ejecutar comandos destructivos o de riesgo (por ejemplo eliminar archivos/carpetas, reseteos forzados, reescrituras peligrosas) sin autorización explícita del usuario en ese turno.
- Ejecutar `npm run lint` y `npm run test` solo cuando el cambio tenga suficiente entidad como para requerir validación.

## Situación actual del proyecto

- Frontend: React + TypeScript + Vite.
- Estilo: identidad `Premium` obligatoria en cualquier feature visual.
- Idiomas activos: `es`, `en`, `de`, `fr` (i18n obligatorio en nuevos textos de UI).
- Marco de entrega: SDD con artefactos en `sdd/`, reglas en `.agent/rules`, skills en `.agent/skills` y prompts en `.antigravity/prompts`.

## Estado funcional relevante

- Header y navegación principal operativos.
- Overlay de menú rediseñado con estructura jerárquica limpia (sin cards), alineado con referencia visual premium.
- Feature SDD activa para esta mejora:
  - `ANCLORA-MENU-002` / `menu-overlay-clarity-redesign`.
