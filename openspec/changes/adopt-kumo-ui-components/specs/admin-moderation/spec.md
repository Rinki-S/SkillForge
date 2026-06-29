## ADDED Requirements

### Requirement: Kumo-backed admin console
The admin console SHALL preserve overview metrics, review queue, category management, user management, audit log viewing, and moderation actions while migrating shared low-level UI to Kumo-backed wrappers where practical.

#### Scenario: Review queue behavior is preserved
- **WHEN** an admin filters and reviews Skills after Kumo adoption
- **THEN** the status filter, Skill rows, and approve/reject/offline/delete actions remain available and behave as before

#### Scenario: Management lists remain usable
- **WHEN** an admin manages categories, views users, or views audit logs after Kumo adoption
- **THEN** the same data and actions remain accessible in the console layout
