## ADDED Requirements

### Requirement: Kumo-backed console primitives
The frontend console experience SHALL use Kumo-backed low-level primitives for common controls and surfaces where practical, while preserving the resource-oriented dashboard shell, page headers, resource rows, responsive behavior, and visible focus requirements.

#### Scenario: Console primitives remain consistent
- **WHEN** a user opens marketplace, skill detail, my skills, favorites, usage logs, profile, or admin pages
- **THEN** common controls and surfaces use Kumo-backed primitives or approved Kumo-compatible local compositions without losing the console layout

#### Scenario: Responsive console behavior remains intact
- **WHEN** a user opens resource-list pages on desktop or narrow mobile widths
- **THEN** resource metadata and actions remain accessible without full-page horizontal scrolling

### Requirement: Kumo block usage preserves SkillForge composition
If Kumo PageHeader, ResourceList, Sidebar, or similar blocks are adopted, they SHALL be adapted to preserve SkillForge page structure, auth/admin navigation visibility, and product-specific Prompt Rail composition.

#### Scenario: Page header block adoption
- **WHEN** a Kumo PageHeader block is used on an operational page
- **THEN** the page still shows the expected title, task description, primary actions, and metadata region required by the console experience

#### Scenario: Sidebar block adoption
- **WHEN** a Kumo Sidebar block is evaluated or adopted
- **THEN** unauthenticated users, authenticated users, and admins see the same allowed navigation entries as before migration
