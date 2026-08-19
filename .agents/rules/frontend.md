---
name: Reglas Frontend SITFAI
description: Normativas estrictas de calidad y arquitectura.
---

## Cero Any
Está estrictamente prohibido usar `any` o tipados implícitos.

## Accesibilidad Obligatoria
- Todo `<button>` debe llevar su atributo `type` (`button`, `submit`, `reset`).
- Todo `<input>` debe tener un `id` que coincida con el atributo `for` (o ser envuelto por) su respectivo `<label>`.

## Cero Hardcodeo de UI
Prohibido usar clases arbitrarias de Tailwind (ej. `bg-[#F8FAFC]`, `border-[#E2E8F0]`, `h-[24px]`). Deben reemplazarse por las variables canónicas del sistema de diseño (ej. `bg-surface`, `border-border`, `h-6`).

## Fidelidad al DTO
Las vistas (`.vue`) solo pueden renderizar propiedades que existan explícitamente en las interfaces DTO definidas.
