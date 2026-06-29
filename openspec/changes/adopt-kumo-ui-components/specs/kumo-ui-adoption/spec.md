## ADDED Requirements

### Requirement: Kumo dependency setup
The frontend SHALL include Kumo UI as a dependency and SHALL include required peer dependencies needed by Kumo. The setup MUST preserve the existing React, Vite, TypeScript, and Tailwind project structure.

#### Scenario: Dependencies are installed
- **WHEN** the frontend dependency manifest is inspected after implementation
- **THEN** it includes `@cloudflare/kumo` and required peer dependency `@phosphor-icons/react` without removing existing business-critical dependencies

#### Scenario: Frontend build resolves Kumo
- **WHEN** the frontend production build runs
- **THEN** Vite and TypeScript resolve Kumo imports and complete successfully

### Requirement: Kumo style integration
The frontend SHALL load Kumo styles in a way compatible with the current Tailwind 3 setup. The change MUST NOT require Tailwind 4 migration.

#### Scenario: Kumo components render styled
- **WHEN** a page renders Kumo-backed Button, Input, LayerCard, Badge, Loader, or Empty components
- **THEN** those components display with Kumo styling rather than unstyled markup

#### Scenario: Tailwind 4 is not required
- **WHEN** the implementation is reviewed
- **THEN** it does not require changing the application to Tailwind 4 syntax or configuration

### Requirement: Wrapper-first adoption
The frontend SHALL adopt Kumo through existing SkillForge wrapper components first, preserving the public wrapper exports and minimizing page-level import churn.

#### Scenario: Existing pages use wrapper imports
- **WHEN** pages import shared Button, Input, Card, Select, or console primitives
- **THEN** they can continue importing from local SkillForge wrapper paths unless a Kumo block integration explicitly requires otherwise

#### Scenario: Wrapper variants remain compatible
- **WHEN** existing code passes local wrapper variants such as `primary`, `secondary`, `ghost`, `danger`, `sm`, or `md`
- **THEN** the wrapper maps those variants to compatible Kumo variants or preserves equivalent behavior

### Requirement: Low-risk primitive migration
The frontend SHALL migrate low-risk primitives to Kumo-backed implementations before migrating complex controls. Low-risk primitives include buttons, text inputs, text areas, surface/card panels, badges/pills, loading indicators, and empty states.

#### Scenario: Button and input wrappers use Kumo
- **WHEN** Button, Input, and Textarea wrappers are rendered
- **THEN** they use Kumo-backed components while preserving labels, errors, disabled state, and event behavior used by existing pages

#### Scenario: State components use Kumo
- **WHEN** loading or empty states render
- **THEN** they use Kumo Loader or Empty components or a Kumo-compatible composition

### Requirement: Select migration safety
The frontend SHALL NOT replace native Select behavior with Kumo Select until controlled filters and React Hook Form fields are proven compatible. The implementation MUST either keep the existing Select wrapper temporarily or provide a tested adapter for Kumo Select.

#### Scenario: Controlled filters still work
- **WHEN** a user changes marketplace model/category filters or admin status filters
- **THEN** the corresponding state updates and query/refetch behavior remains unchanged

#### Scenario: SkillForm select fields still work
- **WHEN** an author creates or edits a Skill and changes category, model type, or variable type fields
- **THEN** React Hook Form receives the updated values and validation behavior remains unchanged

### Requirement: Kumo block evaluation
The frontend SHALL evaluate Kumo CLI blocks such as PageHeader and ResourceList as owned local source code before adopting them. The implementation MUST NOT blindly overwrite existing product-specific compositions.

#### Scenario: Block source is reviewed before adoption
- **WHEN** a Kumo block is installed into the project
- **THEN** it is placed in a reviewed local path and adapted to SkillForge naming, layout, and data needs before page integration

#### Scenario: Prompt Rail remains product-specific
- **WHEN** Skill detail Prompt generation UI is rendered
- **THEN** the custom Prompt Rail composition remains recognizable even if its internal controls use Kumo primitives

### Requirement: Verification of Kumo adoption
The implementation SHALL verify build success, representative route rendering, form behavior, responsive layout, and focus/accessibility behavior after Kumo adoption.

#### Scenario: Production build passes
- **WHEN** `npm --prefix frontend run build` is executed
- **THEN** TypeScript and Vite build complete successfully

#### Scenario: Business behavior is preserved
- **WHEN** key flows are exercised after migration
- **THEN** marketplace browsing/filtering, login/register, create/edit Skill, Skill detail, Prompt generation UI, admin review filters/actions, favorites, usage logs, and profile entry points remain usable
