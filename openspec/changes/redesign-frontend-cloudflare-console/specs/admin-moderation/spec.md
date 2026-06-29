## MODIFIED Requirements

### Requirement: Platform overview dashboard
The system SHALL provide an admin dashboard showing platform-level overview statistics (e.g. total users, total skills, pending-audit count, published count) in compact console metrics suitable for operational scanning.

#### Scenario: Viewing dashboard stats
- **WHEN** an admin opens the dashboard
- **THEN** aggregate counts (users, skills, pending audits, published skills) are displayed as compact console metrics

### Requirement: Skill audit list
The system SHALL provide an admin review queue for Skills pending audit, and SHALL allow admins to see all Skills across all statuses. The review queue SHALL use a dense list or table-like layout with title, author, status, and available moderation actions.

#### Scenario: Listing pending skills
- **WHEN** an admin opens the audit list
- **THEN** Skills with status PENDING are listed for review in a queue layout with enough metadata to decide the next moderation action

#### Scenario: Filtering skills by status
- **WHEN** an admin changes the status filter
- **THEN** the review queue updates to list Skills matching the selected status

### Requirement: Category management
The system SHALL allow an admin to create, modify, and delete Skill categories, presented in a console management section with existing categories listed compactly and category actions clearly available.

#### Scenario: Creating a category
- **WHEN** an admin creates a new category
- **THEN** the category is available for selection when authors create Skills and when users filter the marketplace

#### Scenario: Deleting a category
- **WHEN** an admin deletes a category
- **THEN** the category is removed; if Skills reference it, the system prevents orphaning (reject or reassign per implementation policy)

### Requirement: User management
The system SHALL allow an admin to view and manage platform users in a compact console list showing role and basic user identity.

#### Scenario: Listing users
- **WHEN** an admin opens user management
- **THEN** platform users are listed with their role and basic info in a console list

### Requirement: Audit logging
The system SHALL record an audit log entry for each moderation action (approve/reject/takedown/delete/category change/user change), capturing the admin, target, action, and timestamp. The admin UI SHALL present audit logs as a compact operational history.

#### Scenario: Moderation action is logged
- **WHEN** an admin approves a Skill
- **THEN** an `audit_logs` row is written recording the admin id, the Skill id, the action "approve", and the timestamp

#### Scenario: Viewing audit logs
- **WHEN** an admin views audit logs
- **THEN** moderation action history is listed with admin, target, action, and timestamp in a compact operational history
