## MODIFIED Requirements

### Requirement: My favorites listing
The system SHALL provide a "我的收藏" page listing the Skills the current user has favorited in a console-style resource list with Skill title, metadata, and an action to open the Skill detail.

#### Scenario: Viewing favorites
- **WHEN** a user opens their "我的收藏" page
- **THEN** the Skills they have favorited are listed as resource entries with key metadata

#### Scenario: Empty favorites
- **WHEN** a user with no favorites opens the page
- **THEN** an empty-state placeholder is shown with clear direction for browsing the marketplace

### Requirement: Usage history viewing
The system SHALL provide a usage-records page listing the current user's Prompt-generation history, each entry showing the Skill, timestamp, and the rendered Prompt in a compact console-style history view.

#### Scenario: Viewing usage history
- **WHEN** a user opens their usage-records page
- **THEN** their past generations are listed with Skill, timestamp, and rendered Prompt in a compact history view

#### Scenario: Empty usage history
- **WHEN** a user with no generations opens the page
- **THEN** an empty-state placeholder is shown with clear direction for generating a Prompt from the marketplace

### Requirement: Personal center
The system SHALL provide a personal center showing the user's profile summary and console-style entry points to their skills, favorites, and usage records.

#### Scenario: Viewing personal center
- **WHEN** a logged-in user opens their personal center
- **THEN** their profile and navigation to my-skills, my-favorites, and usage-records are shown as console entry points
