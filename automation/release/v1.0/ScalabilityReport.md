# Scalability Report

## Horizontal Scaling Limits
The `WorkerAllocator` caps grid spamming by limiting active threads to `MAX_WORKERS`.

## Dataset Constraints
The `DataAllocator` guarantees uniqueness up to the length of the `users.json` dataset. If 50 parallel threads run, 50 unique users must exist in the DB, otherwise the allocator will intentionally throw a `Data Exhaustion` exception rather than allowing overlapping tests to corrupt DB state.
