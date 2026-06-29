## ADDED Requirements

### Requirement: Kumo-backed skill resource pages
Skill marketplace, Skill detail, and author's own skills pages SHALL preserve their resource-list/detail requirements while migrating shared low-level UI to Kumo-backed wrappers where practical.

#### Scenario: Marketplace behavior is preserved
- **WHEN** a visitor opens the marketplace after Kumo adoption
- **THEN** published Skills are still listed with title, intro, category, author, model type, usage count, favorite count, and rating

#### Scenario: SkillForm behavior is preserved
- **WHEN** an author creates or edits a Skill after Kumo adoption
- **THEN** required fields, template-variable matching validation, category/model selection, and variable configuration behavior remain unchanged

#### Scenario: Author actions remain available
- **WHEN** an author opens the "我的 Skill" page after Kumo adoption
- **THEN** view, edit, and delete actions remain available for their Skills
