# user-engagement Specification

## Purpose

TBD.

## Requirements


### Requirement: Favorite a skill with deduplication
The system SHALL allow an authenticated user to favorite a Skill. A user MAY favorite a given Skill at most once; a duplicate favorite MUST be rejected with a clear message.

#### Scenario: Successful favorite
- **WHEN** an authenticated user favorites a Skill they have not favorited before
- **THEN** the favorite is recorded and the Skill's favorite count is reflected accordingly

#### Scenario: Duplicate favorite
- **WHEN** a user favorites a Skill they have already favorited
- **THEN** the system rejects with a "已收藏" message and no duplicate record is created

### Requirement: Unfavorite a skill
The system SHALL allow a user to remove a previously recorded favorite.

#### Scenario: Removing a favorite
- **WHEN** a user unfavorites a Skill they had favorited
- **THEN** the favorite record is removed

#### Scenario: Unfavoriting not-favorited skill
- **WHEN** a user attempts to unfavorite a Skill they have not favorited
- **THEN** the system responds gracefully without error (idempotent) and no record is created

### Requirement: My favorites listing
The system SHALL provide a "我的收藏" page listing the Skills the current user has favorited.

#### Scenario: Viewing favorites
- **WHEN** a user opens their "我的收藏" page
- **THEN** the Skills they have favorited are listed

#### Scenario: Empty favorites
- **WHEN** a user with no favorites opens the page
- **THEN** an empty-state placeholder is shown

### Requirement: Rate and review a skill
The system SHALL allow an authenticated user who has used a Skill to submit a rating (numeric) and a comment. A user MAY submit at most one review per Skill.

#### Scenario: Submitting a review
- **WHEN** a user submits a rating and comment for a Skill they have not reviewed
- **THEN** the review is recorded

#### Scenario: Duplicate review blocked
- **WHEN** a user attempts to review a Skill they have already reviewed
- **THEN** the system rejects with a "已评价" message

### Requirement: Rating aggregation
The system SHALL display a Skill's average rating computed from all its reviews. The average MUST be computed live (e.g. AVG) rather than from a redundant cached column.

#### Scenario: Average rating displayed
- **WHEN** a Skill has reviews with ratings 4 and 5
- **THEN** the displayed average rating is 4.5

### Requirement: Usage history viewing
The system SHALL provide a usage-records page listing the current user's Prompt-generation history, each entry showing the Skill, timestamp, and the rendered Prompt.

#### Scenario: Viewing usage history
- **WHEN** a user opens their usage-records page
- **THEN** their past generations are listed with Skill, timestamp, and rendered Prompt

#### Scenario: Empty usage history
- **WHEN** a user with no generations opens the page
- **THEN** an empty-state placeholder is shown

### Requirement: Personal center
The system SHALL provide a personal center showing the user's profile summary and entry points to their skills, favorites, and usage records.

#### Scenario: Viewing personal center
- **WHEN** a logged-in user opens their personal center
- **THEN** their profile and navigation to my-skills, my-favorites, and usage-records are shown
