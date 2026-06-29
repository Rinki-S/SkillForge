## MODIFIED Requirements

### Requirement: Dynamic variable form rendering
When a user opens the Prompt generation page for a Skill, the frontend SHALL render a Prompt Rail whose fields are derived from the Skill's variables: text→input, textarea→textarea, number→number input, select→dropdown with the configured options. Required fields MUST be visually marked. The Prompt Rail SHALL visually connect template, variable inputs, live preview, and generation action as one flow.

#### Scenario: Form rendered by variable type
- **WHEN** a user opens the Prompt generation page for a Skill with variables text(text,required) and lang(select,required,options [中文,英文])
- **THEN** the Prompt Rail shows a required text input for `text` and a required dropdown with options [中文,英文] for `lang`

#### Scenario: Prompt flow is visible
- **WHEN** a user views the Prompt generation area
- **THEN** the UI presents template, variables, live preview, and generated output as connected steps rather than unrelated form fields

### Requirement: Copy generated prompt
The frontend SHALL provide a one-click copy action for the generated final Prompt and SHALL show clear success feedback after copying. The generated prompt area SHALL be visually distinct from the live preview so users can tell preview text from the backend-rendered final output.

#### Scenario: Copying the prompt
- **WHEN** a user clicks "复制" after a Prompt is generated
- **THEN** the rendered Prompt text is placed on the clipboard and a success feedback is shown

#### Scenario: Distinguishing preview from generated output
- **WHEN** a user has filled variables but has not generated the final Prompt
- **THEN** the UI labels the live preview separately from any generated backend result
