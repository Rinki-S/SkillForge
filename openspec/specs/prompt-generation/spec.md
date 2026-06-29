# prompt-generation Specification

## Purpose

TBD.

## Requirements


### Requirement: Skill variable configuration
The system SHALL allow a Skill author to define input variables for a Prompt template. Each variable MUST have a name (the `{{name}}` placeholder), a display label, a type (text/textarea/number/select), a required flag, and optionally a default value and options (for select type).

#### Scenario: Defining a variable
- **WHEN** an author configures a variable with name `lang`, label "目标语言", type select, options ["中文","英文"], required true
- **THEN** the variable is persisted and associated with the Skill for later form rendering

### Requirement: Prompt template variable matching validation
At Skill save time, the system MUST validate that every `{{varName}}` placeholder in the Prompt template corresponds to exactly one configured variable, and that every configured variable is referenced by the template. Placeholders with no matching variable, or variables with no placeholder, MUST be rejected.

#### Scenario: Template and variables match
- **WHEN** an author saves a Skill whose template contains `{{text}}` and `{{lang}}` and whose variables are exactly `text` and `lang`
- **THEN** the Skill is saved successfully

#### Scenario: Dangling placeholder
- **WHEN** an author saves a Skill whose template contains `{{lang}}` but no variable named `lang` is configured
- **THEN** the system rejects the save with a "模板变量与配置不匹配" message

#### Scenario: Unused variable
- **WHEN** an author configures a variable `topic` that does not appear in the template
- **THEN** the system rejects the save with a "模板变量与配置不匹配" message

### Requirement: Dynamic variable form rendering
When a user opens the Prompt generation page for a Skill, the frontend SHALL render a form whose fields are derived from the Skill's variables: text→input, textarea→textarea, number→number input, select→dropdown with the configured options. Required fields MUST be visually marked.

#### Scenario: Form rendered by variable type
- **WHEN** a user opens the Prompt generation page for a Skill with variables text(text,required) and lang(select,required,options [中文,英文])
- **THEN** the form shows a required text input for `text` and a required dropdown with options [中文,英文] for `lang`

### Requirement: Final prompt generation with backend authoritative validation
The system SHALL generate the final Prompt by substituting submitted variable values into the template. The backend MUST re-validate the submission (required fields filled, types valid, select values within options) before rendering, regardless of frontend checks, because the frontend is not trusted.

#### Scenario: Successful prompt generation
- **WHEN** a user submits valid values for all variables of a PUBLISHED Skill
- **THEN** the backend validates the values, renders the final Prompt by substituting into the template, and returns the rendered Prompt

#### Scenario: Missing required variable on generation
- **WHEN** a user submits generation without a value for a required variable
- **THEN** the backend rejects with a "变量缺失" message and no Prompt is rendered

#### Scenario: Invalid select value
- **WHEN** a user submits a value for a select variable that is not among its options
- **THEN** the backend rejects with a validation error and no Prompt is rendered

### Requirement: Copy generated prompt
The frontend SHALL provide a one-click copy action for the generated final Prompt.

#### Scenario: Copying the prompt
- **WHEN** a user clicks "复制" after a Prompt is generated
- **THEN** the rendered Prompt text is placed on the clipboard and a success feedback is shown

### Requirement: Usage logging and count increment
On a successful Prompt generation, the system MUST record a usage log entry (user, skill, rendered final Prompt, submitted variable values as JSON, timestamp) and increment the Skill's usage count.

#### Scenario: Generation logs usage
- **WHEN** the backend successfully renders a final Prompt for a user
- **THEN** a `skill_usage_logs` row is created with the rendered Prompt and variable values, and the Skill's `usage_count` is incremented by one
