## ADDED Requirements

### Requirement: Kumo-backed engagement pages
Favorites, usage history, and personal center pages SHALL preserve existing data behavior and navigation while migrating shared low-level UI to Kumo-backed wrappers where practical.

#### Scenario: Favorites remain accessible
- **WHEN** a user opens favorites after Kumo adoption
- **THEN** favorited Skills are still listed and link to their Skill detail pages

#### Scenario: Usage history remains accessible
- **WHEN** a user opens usage logs after Kumo adoption
- **THEN** prior generations are still listed with Skill, timestamp, and rendered Prompt

#### Scenario: Profile entry points remain accessible
- **WHEN** a logged-in user opens the personal center after Kumo adoption
- **THEN** profile summary and navigation to my skills, favorites, usage records, and marketplace remain available
