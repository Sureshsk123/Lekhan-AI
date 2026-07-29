# Enterprise Data-Driven Framework

## Architecture
The Data-Driven Framework acts as the single source of truth for all business logic data within test suites. It isolates test logic from test data, ensuring tests remain deterministic, easily parameterizable, and capable of scaling horizontally.

## Directory Structure
- `data/`: Contains raw JSON arrays representing domain entities.
- `data/schemas/`: JSON Schemas enforcing strict structural contracts.
- `data/environments/`: Environment specific overrides (URL, Timeouts).
- `utilities/`: The DataManager and its supporting lifecycle engines.

## Dataset Lifecycle
1. **Resolution**: `EnvironmentDataResolver` identifies the active `NODE_ENV`.
2. **Seeding**: `DataSeeder` loads the raw JSON arrays.
3. **Validation**: `DataValidator` strictly evaluates the payload against its schema, failing fast on missing or malformed fields.
4. **Allocation**: `DataAllocator` yields an exclusive "lease" for that data object to a single worker.

## Factories & Generation
For dynamic scenarios where static JSON is too brittle, the `DataFactory` wraps `RandomDataGenerator` to generate dynamic models (Users, Lessons, Rewards) deterministically using seeded pseudo-random logic.

## Usage Guide
Future test suites should strictly instantiate and consume `DataManager` instead of hardcoding data:
```javascript
const user = dataManager.getUser('validUsers');
await flowManager.authFlow.login(user.username, user.password);

dataManager.release(user);
```
