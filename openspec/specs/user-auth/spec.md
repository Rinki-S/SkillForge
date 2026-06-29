# user-auth Specification

## Purpose

TBD.

## Requirements


### Requirement: User registration
The system SHALL allow new users to register with a unique username and a password. The registration form MUST validate that required fields are non-empty and that the username is not already taken.

#### Scenario: Successful registration
- **WHEN** a visitor submits a registration form with a valid unique username and a non-empty password
- **THEN** the system creates a user account with role USER and returns a success response, and the password is stored only in hashed form

#### Scenario: Duplicate username
- **WHEN** a visitor registers with a username that already exists
- **THEN** the system rejects the registration with a clear "用户名已存在" message and no account is created

#### Scenario: Empty form fields
- **WHEN** a visitor submits the registration form with empty username or password
- **THEN** the system rejects submission with a field-level validation message and no account is created

### Requirement: Password hashing at rest
The system MUST store passwords using BCrypt (salted hash) and SHALL never persist, log, or return plaintext passwords.

#### Scenario: Password never stored in plaintext
- **WHEN** a user registers or changes password
- **THEN** only the BCrypt hash is written to the database, and API responses never include the password field

### Requirement: User login
The system SHALL authenticate users by username and password and, on success, issue a JWT containing the user id and role.

#### Scenario: Successful login
- **WHEN** a user submits correct credentials
- **THEN** the system returns a JWT token and the user's role, and the frontend stores the token for subsequent requests

#### Scenario: Login failure
- **WHEN** a user submits incorrect credentials or a non-existent username
- **THEN** the system rejects login with a generic "用户名或密码错误" message (without revealing which field is wrong)

### Requirement: User logout
The system SHALL allow an authenticated user to log out, clearing the login state on the client.

#### Scenario: Logout clears session
- **WHEN** a logged-in user triggers logout
- **THEN** the frontend discards the JWT and redirects to the login page

### Requirement: JWT-based request authentication
The system SHALL authenticate subsequent API requests via a JWT bearer token; requests without a valid token to protected endpoints MUST be rejected as unauthenticated.

#### Scenario: Missing or invalid token on protected endpoint
- **WHEN** a request to a protected endpoint lacks a valid JWT
- **THEN** the system returns the unauthenticated error code (4010) and the request is not processed

#### Scenario: Expired token
- **WHEN** a request carries an expired JWT
- **THEN** the system returns the unauthenticated error code and the frontend prompts re-login

### Requirement: Role-based authorization
The system SHALL distinguish USER and ADMIN roles. Admin-only endpoints MUST reject requests from non-admin users even when authenticated.

#### Scenario: Non-admin accesses admin endpoint
- **WHEN** an authenticated USER-role request targets an admin-only endpoint
- **THEN** the system returns the forbidden error code (4030) and the action is not performed

#### Scenario: Seed admin account exists
- **WHEN** the database is initialized
- **THEN** a seed admin account exists so the admin console is reachable without manual SQL

### Requirement: Frontend route access control
The frontend SHALL guard routes by authentication and role: unauthenticated users are redirected to login; non-admin users accessing admin routes are blocked with a prompt.

#### Scenario: Unauthenticated route access
- **WHEN** an unauthenticated visitor navigates to a protected page (e.g. my-skills)
- **THEN** the frontend redirects to the login page

#### Scenario: Non-admin accessing admin route
- **WHEN** a USER-role user navigates to an `/admin/*` route
- **THEN** the frontend blocks navigation and shows a "无权限" message
