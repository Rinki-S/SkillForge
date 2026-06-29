## ADDED Requirements

### Requirement: Prompt Rail Kumo compatibility
The Prompt Rail SHALL preserve existing Prompt generation behavior while using Kumo-backed controls and surfaces where practical. The migration MUST keep live preview, variable input, generation action, and backend result visually distinct.

#### Scenario: Variable controls remain functional
- **WHEN** a user fills Prompt Rail variables after Kumo adoption
- **THEN** the input values update the live preview and are submitted to the existing generation mutation unchanged

#### Scenario: Generated result remains copyable
- **WHEN** a backend-rendered Prompt is displayed after generation
- **THEN** the user can still copy it and receive success feedback

#### Scenario: Preview and result remain distinct
- **WHEN** a user has both a live preview and generated backend result visible
- **THEN** the UI labels and styles them as separate surfaces
