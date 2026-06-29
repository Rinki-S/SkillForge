## ADDED Requirements

### Requirement: Skill creation with required-field validation
The system SHALL allow an authenticated user to create an AI Skill. Title, intro, and Prompt template MUST be non-empty; a Skill created by a user is authored by that user.

#### Scenario: Successful skill creation
- **WHEN** an authenticated user submits a Skill with title, intro, and Prompt template filled
- **THEN** the system saves the Skill with status PENDING, author set to the current user, and returns the created Skill

#### Scenario: Missing required fields
- **WHEN** a user submits a Skill with an empty title, intro, or Prompt template
- **THEN** the system rejects creation with a "必填项不能为空" message and no Skill is saved

### Requirement: Skill marketplace listing
The system SHALL provide a Skill 广场 (marketplace) that lists Skills as cards, each showing title, intro, category, author, usage count, favorite count, and average rating. Only PUBLISHED Skills SHALL appear in the marketplace.

#### Scenario: Marketplace shows published skills only
- **WHEN** a visitor opens the marketplace
- **THEN** only Skills with status PUBLISHED are listed, rendered as cards with title, intro, category, author, usage count, favorite count, and rating

### Requirement: Skill detail view
The system SHALL provide a detail page for a Skill showing its full Prompt template, variable descriptions, output format, and usage examples.

#### Scenario: Viewing a published skill detail
- **WHEN** a visitor opens a PUBLISHED Skill's detail page
- **THEN** the full Prompt template, variable descriptions, output format, and usage examples are displayed

#### Scenario: Viewing a non-existent skill
- **WHEN** a visitor opens a detail page for a Skill id that does not exist
- **THEN** the system returns a "数据不存在" message

### Requirement: Author-only skill edit and delete
The system SHALL allow only the author to edit or delete their own Skill. Non-authors (including other users) MUST be blocked; admins operate via the audit capability rather than direct authorship edits.

#### Scenario: Author edits own skill
- **WHEN** the author submits edits to their own Skill
- **THEN** the system updates the Skill, and if the Skill was PUBLISHED its status returns to PENDING for re-audit

#### Scenario: Non-author attempts to edit
- **WHEN** an authenticated user attempts to edit or delete a Skill authored by another user
- **THEN** the system rejects the action with the forbidden error code (4030) and no change occurs

### Requirement: Skill search and filtering
The system SHALL allow Skills to be filtered by keyword (matched against title/intro), by category, and by model type, on the marketplace.

#### Scenario: Filter by keyword
- **WHEN** a user enters a keyword on the marketplace
- **THEN** only PUBLISHED Skills whose title or intro contains the keyword are listed

#### Scenario: Filter by category and model type
- **WHEN** a user selects a category and/or a model type
- **THEN** only PUBLISHED Skills matching all selected filters are listed

### Requirement: Author's own skills listing
The system SHALL provide a "我的 Skill" page listing all of the current user's authored Skills across all statuses.

#### Scenario: Author sees all their skills
- **WHEN** the author opens their "我的 Skill" page
- **THEN** all Skills they authored (PENDING/PUBLISHED/OFFLINE/REJECTED) are listed with their current status
