## ADDED Requirements

### Requirement: Dashboard shell layout
The frontend SHALL present the authenticated application as a dashboard shell with persistent primary navigation, a top utility area, and a bounded main content region. The shell MUST preserve existing route access behavior for public, authenticated, and admin-only routes.

#### Scenario: Visitor views public marketplace
- **WHEN** an unauthenticated visitor opens the marketplace route
- **THEN** the dashboard shell displays public navigation and login/register actions without showing authenticated-only or admin-only entries

#### Scenario: User views authenticated routes
- **WHEN** an authenticated non-admin user opens the application
- **THEN** the dashboard shell displays user navigation entries for marketplace, create skill, my skills, favorites, usage logs, and profile access

#### Scenario: Admin views admin route
- **WHEN** an authenticated admin opens the application
- **THEN** the dashboard shell includes the admin console entry and allows access to admin routes

### Requirement: Console visual system
The frontend SHALL use a control-console visual system with neutral canvas, white panels, subtle borders, reduced shadows, compact spacing, and orange accents for primary actions, active navigation, focus, and important statuses. The interface MUST avoid marketing-style hero sections on operational pages.

#### Scenario: Operational page visual treatment
- **WHEN** a user opens marketplace, skill detail, my skills, favorites, usage logs, profile, or admin pages
- **THEN** the page uses console panels, section headers, toolbars, resource rows, and restrained accent color instead of large marketing hero blocks

#### Scenario: Keyboard focus is visible
- **WHEN** a keyboard user focuses a link, button, input, select, or textarea
- **THEN** the focused control shows a visible focus indicator consistent with the console visual system

### Requirement: Resource-oriented page headers
Operational pages SHALL start with a compact resource-oriented header that names the page, explains the page task, and exposes primary actions where applicable.

#### Scenario: Marketplace header
- **WHEN** a user opens the marketplace
- **THEN** the page header identifies it as the Skill registry or marketplace and provides the primary create/import or create-skill action when appropriate

#### Scenario: Admin header
- **WHEN** an admin opens the admin console
- **THEN** the page header identifies the moderation/operations task and summarizes the review context

### Requirement: Responsive console behavior
The console experience SHALL remain usable on desktop, tablet, and mobile widths. Desktop layouts MAY use sidebars and tables, but mobile layouts MUST collapse navigation and convert dense rows into readable stacked content without losing actions.

#### Scenario: Mobile resource browsing
- **WHEN** a user opens a resource-list page on a narrow viewport
- **THEN** each resource remains readable with its primary metadata and actions accessible without horizontal scrolling of the full page

#### Scenario: Desktop resource browsing
- **WHEN** a user opens a resource-list page on a desktop viewport
- **THEN** resources are arranged for efficient scanning with aligned metadata columns or row-like structure
