# Requirements Document

## Introduction

AI Freebie Radar is a lightweight, local-only web app for tracking AI perks: free API credits, free trials, early access programs, student/developer benefits, limited-time model events and AI tool discounts. Users can create, edit, delete, filter and sort offers. Offer status is derived automatically from the deadline, and all data is persisted in the browser's localStorage. There is no backend, no login and no third-party API.

## Glossary

- **Offer**: One AI perk record with the fields `id`, `title`, `provider`, `category`, `value`, `deadline`, `requirements`, `region`, `url`, `notes`.
- **Category**: One of `api-credits`, `free-trial`, `early-access`, `student-dev`, `model-event`, `tool-discount`.
- **Deadline**: A calendar date in `YYYY-MM-DD` format, or empty for offers with no known end date.
- **Status**: A derived value, `active` or `expired`, computed from the Deadline and the current date. It is never stored.
- **Today**: The current local calendar date at the moment the status is computed.
- **Filter**: A combination of a category selection (`all` or one Category) and a status selection (`all`, `active`, `expired`).
- **Store**: The localStorage key `ai-freebie-radar.offers.v1`.
- **System**: The AI Freebie Radar web application.
- **Demo Data**: The built-in sample offers in `src/data/demoOffers.ts`.

## Requirements

### Requirement 1: Offer status from deadline

**User Story:** As a deal hunter, I want each offer's status computed from its deadline, so that I never act on an expired perk.

#### Acceptance Criteria

1. WHEN an Offer's Deadline is earlier than Today, THE System SHALL classify the Offer as `expired`.
2. WHEN an Offer's Deadline is equal to Today or later than Today, THE System SHALL classify the Offer as `active`.
3. WHEN an Offer has an empty Deadline, THE System SHALL classify the Offer as `active`.
4. IF an Offer's Deadline is not a valid `YYYY-MM-DD` date, THEN THE System SHALL classify the Offer as `active` without throwing an error.
5. THE System SHALL compute Status on every render and SHALL NOT persist Status in the Store.

### Requirement 2: Filtering

**User Story:** As a user, I want to filter offers by category and status, so that I can focus on the perks I care about.

#### Acceptance Criteria

1. WHEN an Offer matches the selected Category, THE System SHALL include it in the filtered results.
2. WHEN an Offer does not match the selected Category, THE System SHALL exclude it from the filtered results.
3. WHEN the status selection is `active` or `expired`, THE System SHALL include only Offers whose Status equals the selection.
4. WHEN both selections are `all`, THE System SHALL return every Offer.
5. WHEN the input list is empty, THE System SHALL return an empty list without throwing an error.
6. THE System SHALL return filtered results that are a subset of the input and preserve the input order.

### Requirement 3: Sorting by deadline

**User Story:** As a user, I want offers sorted by deadline, so that the most urgent perks appear first.

#### Acceptance Criteria

1. WHEN sorting in ascending order, THE System SHALL order Offers so that Deadlines are monotonically non-decreasing.
2. WHEN sorting in descending order, THE System SHALL order Offers so that Deadlines are monotonically non-increasing.
3. THE System SHALL place Offers with an empty or invalid Deadline after all Offers with a valid Deadline, regardless of direction.
4. THE System SHALL return a new list containing exactly the same Offers as the input, without mutating the input.
5. WHEN the input list is empty, THE System SHALL return an empty list without throwing an error.

### Requirement 4: Create, edit and delete offers

**User Story:** As a user, I want to add, edit and delete offers, so that my radar stays up to date.

#### Acceptance Criteria

1. WHEN the user submits the form with a non-empty `title`, `provider` and a valid Category, THE System SHALL add the Offer to the list with a unique `id`.
2. IF the user submits the form with an empty `title` or `provider`, or a `url` that is not `http(s)://`, THEN THE System SHALL show a validation message next to the field and SHALL NOT save the Offer.
3. WHEN the user edits an Offer and saves, THE System SHALL replace the existing Offer with the same `id`.
4. WHEN the user confirms deletion of an Offer, THE System SHALL remove that Offer from the list.

### Requirement 5: Persistence

**User Story:** As a user, I want my offers saved in the browser, so that they survive a page reload.

#### Acceptance Criteria

1. WHEN an Offer is created or edited, THE System SHALL persist the full offer list to the Store.
2. WHEN an Offer is deleted, THE System SHALL persist the updated offer list to the Store.
3. WHEN the app loads and the Store contains a valid offer list, THE System SHALL display that list.
4. IF the Store is missing, unreadable or contains invalid JSON, THEN THE System SHALL load the Demo Data without crashing.

### Requirement 6: Demo data

**User Story:** As a first-time visitor or judge, I want sample offers, so that the app is immediately demoable.

#### Acceptance Criteria

1. WHEN the Store is empty on first load, THE System SHALL load a built-in set of at least 5 Demo Offers that includes at least one active and one expired Offer.
2. WHEN the user clicks "Reset demo data" and confirms, THE System SHALL replace the list with the Demo Offers and persist it.

### Requirement 7: Usability

**User Story:** As a mobile user, I want the UI to work on a small screen, so that I can check perks anywhere.

#### Acceptance Criteria

1. THE System SHALL render a usable single-column layout at viewport widths of 360px and above.
2. THE System SHALL label every form control and SHALL show Status as text, not color alone.
