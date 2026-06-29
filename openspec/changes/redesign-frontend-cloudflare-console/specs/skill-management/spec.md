## MODIFIED Requirements

### Requirement: Skill marketplace listing
The system SHALL provide a Skill marketplace as a registry-style resource list, each entry showing title, intro, category, author, model type, usage count, favorite count, and average rating. Only PUBLISHED Skills SHALL appear in the marketplace. On desktop, the marketplace SHALL prioritize efficient scanning with row/table-like alignment; on smaller screens, entries MAY render as compact stacked cards with the same metadata.

#### Scenario: Marketplace shows published skills only
- **WHEN** a visitor opens the marketplace
- **THEN** only Skills with status PUBLISHED are listed, rendered as registry entries with title, intro, category, author, model type, usage count, favorite count, and rating

#### Scenario: Marketplace supports desktop scanning
- **WHEN** a user opens the marketplace on a desktop viewport
- **THEN** Skills are presented in a dense list or table-like layout with aligned metadata suitable for scanning and opening a Skill detail

### Requirement: Skill detail view
The system SHALL provide a resource-detail page for a Skill showing its full Prompt template, variable descriptions, output format, usage examples, and operational metadata such as category, model type, author, usage count, favorite count, and rating.

#### Scenario: Viewing a published skill detail
- **WHEN** a visitor opens a PUBLISHED Skill's detail page
- **THEN** the full Prompt template, variable descriptions, output format, usage examples, and operational metadata are displayed in a resource-detail layout

#### Scenario: Viewing a non-existent skill
- **WHEN** a visitor opens a detail page for a Skill id that does not exist
- **THEN** the system returns a "数据不存在" message

### Requirement: Author's own skills listing
The system SHALL provide a "我的 Skill" page listing all of the current user's authored Skills across all statuses in a console-style resource list with status, category/model metadata, and author actions.

#### Scenario: Author sees all their skills
- **WHEN** the author opens their "我的 Skill" page
- **THEN** all Skills they authored (PENDING/PUBLISHED/OFFLINE/REJECTED) are listed with their current status and available author actions
