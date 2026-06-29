# admin-moderation Specification

## Purpose

TBD.

## Requirements


### Requirement: Admin login
The system SHALL allow an admin to log in via the same auth flow; admin identity is determined by the ADMIN role on the account, not a separate credential scheme.

#### Scenario: Admin signs in
- **WHEN** a user with role ADMIN logs in
- **THEN** the frontend grants access to the admin console routes

### Requirement: Platform overview dashboard
The system SHALL provide an admin dashboard showing platform-level overview statistics (e.g. total users, total skills, pending-audit count, published count).

#### Scenario: Viewing dashboard stats
- **WHEN** an admin opens the dashboard
- **THEN** aggregate counts (users, skills, pending audits, published skills) are displayed

### Requirement: Skill audit list
The system SHALL provide an admin view of Skills pending audit, and SHALL allow admins to see all Skills across all statuses.

#### Scenario: Listing pending skills
- **WHEN** an admin opens the audit list
- **THEN** Skills with status PENDING are listed for review

### Requirement: Skill audit actions
The system SHALL allow an admin to approve, reject, take offline (下架), or delete a Skill, driving the Skill state machine: approve (PENDING→PUBLISHED), reject (PENDING→REJECTED), take offline (PUBLISHED→OFFLINE), delete (remove the record).

#### Scenario: Approve a pending skill
- **WHEN** an admin approves a PENDING Skill
- **THEN** its status becomes PUBLISHED and it appears on the marketplace

#### Scenario: Reject a pending skill
- **WHEN** an admin rejects a PENDING Skill
- **THEN** its status becomes REJECTED and it remains hidden from the marketplace

#### Scenario: Take a published skill offline
- **WHEN** an admin takes a PUBLISHED Skill offline
- **THEN** its status becomes OFFLINE and it is removed from the marketplace

#### Scenario: Delete a skill
- **WHEN** an admin deletes a Skill
- **THEN** the Skill record is removed

### Requirement: Category management
The system SHALL allow an admin to create, modify, and delete Skill categories.

#### Scenario: Creating a category
- **WHEN** an admin creates a new category
- **THEN** the category is available for selection when authors create Skills and when users filter the marketplace

#### Scenario: Deleting a category
- **WHEN** an admin deletes a category
- **THEN** the category is removed; if Skills reference it, the system prevents orphaning (reject or reassign per implementation policy)

### Requirement: User management
The system SHALL allow an admin to view and manage platform users.

#### Scenario: Listing users
- **WHEN** an admin opens user management
- **THEN** platform users are listed with their role and basic info

### Requirement: Audit logging
The system SHALL record an audit log entry for each moderation action (approve/reject/takedown/delete/category change/user change), capturing the admin, target, action, and timestamp.

#### Scenario: Moderation action is logged
- **WHEN** an admin approves a Skill
- **THEN** an `audit_logs` row is written recording the admin id, the Skill id, the action "approve", and the timestamp

#### Scenario: Viewing audit logs
- **WHEN** an admin views audit logs
- **THEN** moderation action history is listed with admin, target, action, and timestamp
