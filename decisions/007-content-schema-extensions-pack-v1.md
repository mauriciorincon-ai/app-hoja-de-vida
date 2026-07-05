# ADR-007 — Content schema extensions for content-pack-v1

- **Status:** accepted (2026-07-05)
- **Context:** post-Sprint 001 content integration (branch `content/cv-pack-v1`)

## Context

The planner approved `content-pack-v1.md` (portafolio/hoja-de-vida/contenido/, READ-ONLY),
which converts the placeholder content into the real CV of Henry Rincón. The pack requires
three things the Sprint 001 schema could not express:

1. §9 defines an honest three-state showcase (`en producción / en construcción / en
exploración`) plus public-evidence links per card; the schema only had two states and no
   links.
2. §11 requires JSON-LD `Person.name` = full legal name and `alternateName` = public brand,
   but `identidad` only had one `nombre`.
3. §6 explicitly asks for certification entries with an empty-but-present `verificacion`
   field ("previsto en el schema"), and §3/§7 ship `perfil`/`skills` content whose HOME
   sections arrive in Sprint 2.

## Decision

Extend the Zod schemas **additively only** (no existing field changed shape):

- `appEstados` gains `"en-produccion"` (chip: sage, the design system's "shipped" accent);
  app cards gain `enlaces: [{ etiqueta, url }]` (default `[]`), rendered as external links.
- `identidad` gains optional `nombreCompleto` (JSON-LD/footer identity) and `perfil`
  (default `""`).
- `cvSchema` gains `certificaciones` (with `nota` and `verificacion` defaulting to `""`)
  and `skills` (grouped items), both defaulting to `[]`.

`perfil`, `certificaciones` and `skills` are **stored and validated but not yet rendered**:
their sections belong to the Sprint 2 scope (detail/chat iteration). Storing them now keeps
the content versioned next to its mirrors and lets S2 be render-only work.

The §10 contact CTA references the CV chat; the chat ships in S2, so the microcopy uses the
chat-free variant ("¿Quieres saber si encajo en tu equipo? Escríbeme…") until it exists —
consistent with the showcase's "no promised features" rule.

## Consequences

- Editing certificaciones/skills in the YAML has no visual effect until S2 — documented in
  `docs/MANUAL-DE-USO.md`.
- The ATS gate keeps holding for everything rendered; unrendered fields are not part of the
  gate yet.
- Public contact email (`identidad.email` = mauricio.hmrc@gmail.com) is now decoupled from
  the form destination (`SOLICITUDES_TO_EMAIL` env, defaults to the internal Gmail) — pack
  §11 requirement.
