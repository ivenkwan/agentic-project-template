# NoSQL Modeling (Document, Key-Value, Columnar)

NoSQL systems trade away relational guarantees to optimize specific access patterns and scale. Model for the *access pattern*, not for normalization. Decide the family from the workload before designing.

## When NoSQL is the right call

Choose NoSQL when the workload genuinely demands it: extreme scale with horizontal partitioning, flexible/semi-structured documents, high-throughput point access, analytics on massive scan volumes, or data that is naturally a document or a graph. Do not choose NoSQL just because the data is "big" — relational systems with partitioning handle most enterprise loads.

Understand the trade space first:

- **ACID vs BASE**: relational gives atomic, consistent, isolated, durable transactions. Most NoSQL systems relax consistency (eventual consistency) and transactions for availability and scale. Decide what the business actually needs; never silently accept lost updates.
- **CAP**: under a network partition you choose consistency or availability. MongoDB, Cassandra, and DynamoDB make different defaults; know which and why.
- **No joins across nodes**: document and key-value stores do not join well across partitions. Data must be shaped for the queries — embed or denormalize deliberately.

## Family selection

| Family | Systems | Strengths | Design center |
|---|---|---|---|
| Document | MongoDB | Flexible schemas, embedded documents, rich query | Model documents around aggregates; embed or reference |
| Key-value | Redis, DynamoDB | High-throughput point reads/writes, caching, TTL | Value = whole object; access by key |
| Columnar / OLAP | Cassandra, BigQuery, Snowflake, Redshift | Large scans, analytics, time-series | Wide tables, partition key = access path |
| Search | Elasticsearch, OpenSearch | Full-text, faceted, fuzzy | Inverted index; denormalized docs |

## Document stores (MongoDB)

Model documents as **aggregates**: a document should capture the data needed for the dominant read or write as one unit. Two decisions drive everything:

- **Embed vs reference**: embed child data when it is always read with the parent, small, and owned (e.g., order line items inside an order). Reference (store an `_id`) when the child is large, shared, or queried independently. Avoid unbounded arrays — cap them or split into a collection.
- **Denormalize deliberately**: copies of a field (e.g., customer name on an order) improve read locality at the cost of consistency. State who updates the copy.

Concrete rules:

- Design the **shard key** for write distribution and read locality: high cardinality, no hot spots. A bad shard key (low cardinality, monotonic, or skewed) creates hot partitions and throttling.
- Use **schema validation** (JSON Schema via `validator`/`$jsonSchema`) to enforce structure and types at the database, not just in the app.
- Index what you query: single-field, compound, and text/2dsphere indexes. Compound index field order must match the query pattern (equality first, then sort/range).
- Store money as decimal (`Decimal128`) or as scaled integers; never BSON double.
- Timestamps: store UTC; prefer BSON Date.

Anti-patterns: unbounded arrays that exceed the 16 MB document limit; `$lookup` used as a join everywhere (a sign the model is relational and should be); a single collection storing heterogeneous shapes without validation; querying on unindexed fields; hot shard keys.

## Key-value stores (Redis, DynamoDB)

The value is an opaque (or semi-structured) object; access is by key. Model by defining the **read and write patterns first**: every query is a key lookup or a small range.

- **DynamoDB**: choose the **partition key** and optional **sort key** to make the dominant access pattern a single `GetItem` or a tight `Query`. Secondary indexes (GSI/LSI) serve secondary patterns but add cost and propagation. Provision capacity or use on-demand; design for hot keys (distribute, use salting for inherently hot keys like a viral user).
- **Redis**: data structures (STRING, HASH, LIST, SET, ZSET) map to patterns — caches, counters, sessions, leaderboards, rate limits. Set **TTL** for anything that should expire. Use HASH for small objects; ZSET for rankings; keep values small.

Anti-patterns: `Scan`/`*KEYS` on production data; a table where the dominant query is a full scan because the partition key doesn't match it; unbounded item growth per key; missing TTL on cache-like data.

## Columnar and OLAP (Cassandra, BigQuery, Snowflake, Redshift)

These optimize **scan-heavy analytics** on wide, append-heavy tables. Modeling is the mirror image of OLTP: you deliberately denormalize and pre-join so a query touches few large partitions.

- **Cassandra**: the primary key defines the partition (and clustering order within it). Every query must be planned around a partition key; a query without the partition key is a cluster-wide scan. Denormalize per query pattern (multiple tables for multiple read shapes), use `ALLOW FILTERING` only for one-off exploration, and store time-series with wide rows keyed by time buckets to avoid unbounded rows. In-memory consistency is configurable (`LOCAL_QUORUM` is the common production default).
- **BigQuery / Snowflake / Redshift**: star or snowflake schemas — `fact` tables with numeric measures and foreign keys to `dim` tables. Partition and cluster by the columns used in most filters (e.g., event_date). Use columnar compression; avoid SELECT *; beware joins that blow up row counts. Materialized views and aggregation tables (pre-aggregated rollups) serve dashboards.

Anti-patterns: normalizing to the same degree as OLTP (destroying scan efficiency); designing partition/cluster keys that don't match the filter pattern; heavy cross-partition joins; updating/deleting hot rows in append-optimized stores.

## Modeling guidance summary

1. Write down the **access patterns** (queries and writes) before any schema. Every NoSQL decision flows from them.
2. Choose the **family** by pattern, then design for that family's strengths.
3. **Denormalize deliberately** and document the consistency mechanism.
4. Pick **partition/shard keys** for the dominant pattern; verify there are no hot keys.
5. Enforce integrity in the store where the platform allows (schema validation, uniqueness, TTL, constraints); otherwise enforce it in the ingestion pipeline and state that this is an accepted trade.
6. Prototype with representative data volume; measure latency and cost.
