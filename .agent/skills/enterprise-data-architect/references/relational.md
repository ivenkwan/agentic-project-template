# Relational Physical Design

Mapping a logical model to a physical relational schema: types, constraints, indexes, partitioning, and DDL conventions across PostgreSQL, MySQL, SQL Server, and Oracle.

## Mapping logical to physical

For each entity: a table. For each attribute: a column. For each relationship: a foreign key (on the many side), a junction table for M:N, or a self-reference for recursive. Decide per-column: data type, NULL-ability, default, and constraints. Then design indexes for the known query workload — never index everything, never nothing.

## Cross-platform decisions

### Primary keys and identifiers
- Prefer `BIGINT` identity/sequence for concentrated OLTP; `UUID`/`UUIDv7` for distributed writers. Consider ordered UUIDs to keep B-tree pages dense.
- Composite keys only when genuinely required; they complicate FKs and indexes.

### Money, decimals, precision
- Exact numerics: `NUMERIC(p,s)` / `DECIMAL(p,s)`. Money should be NUMERIC with a defined scale and an associated currency column.
- Never FLOAT/DOUBLE for money, prices, or any exact quantity.

### Text
- Use length-limited VARCHAR for domain fields; use unbounded text only for prose. Set the collation explicitly where case/accents matter.
- Legacy fixed-width fields that must round-trip: consider CHAR(n) or a documented trim rule.

### Dates and time
- `TIMESTAMP WITH TIME ZONE` (PostgreSQL), `TIMESTAMPTZ`, `DATETIMEOFFSET` (SQL Server), `TIMESTAMP WITH TIME ZONE` (Oracle), `TIMESTAMP` with `UTC` convention (MySQL). Store UTC, convert at presentation.
- Prefer date-only types for business dates; use timestamps only when time matters.

### Nullability
- NULL only where the business meaning is genuinely "no information". For "not applicable" or "unknown", consider an explicit domain value plus a CHECK constraint, so query logic stays two-valued where possible.

### Enumerations
- CHECK constraints for small stable sets; reference tables for growing sets or sets with attributes. Native ENUM only where it fits the platform's semantics (and remember adding values is a DDL change).

## PostgreSQL

Types: `BIGINT`, `INTEGER`, `NUMERIC(p,s)`, `VARCHAR(n)`, `TEXT`, `UUID`, `JSONB`, arrays, `TIMESTAMPTZ`, `DATE`, `INTERVAL`, `BOOLEAN`, `BYTEA`, range types, `GENERATED ALWAYS AS (...) STORED` columns, `IDENTITY` columns (preferred over legacy `SERIAL`), `ENUM`.

- **JSONB**: use for genuinely semi-structured data; query with `->`, `->>`, `@>`, `?`. Add a CHECK constraint and GIN index when you depend on it. Do not let a single JSONB column swallow structure that belongs in columns.
- **Indexes**: B-tree (default), BRIN (very large, naturally ordered data), GIN (arrays, JSONB, full-text), GiST (geometry, ranges). Partial indexes for hot subsets; expression indexes for computed predicates; `INCLUDE` for index-only scans; `UNIQUE` indexes to enforce alternate keys.
- **Partitioning**: declarative `PARTITION BY RANGE | LIST | HASH`, with `PARTITION BY` on a column used in most queries so the planner prunes. Partition when tables grow past operational pain (commonly tens to hundreds of GB) and queries filter by the partition key. Always verify partition pruning with EXPLAIN.
- **Constraints**: PRIMARY KEY, FOREIGN KEY with `ON DELETE`/`ON UPDATE` actions chosen explicitly, CHECK, NOT NULL, `EXCLUDE USING gist` for exclusion rules.
- **Extensions**: `pgcrypto`, `uuid-ossp`, `citext`, `postgis`, `timescaledb`, `pg_trgm` for fuzzy text. Enable only what you use.
- **Performance**: use `EXPLAIN (ANALYZE, BUFFERS)` to validate; tune `work_mem`, `shared_buffers`; rely on autovacuum; set `fillfactor` lower on hot-update tables. Indexed FK columns are strongly advised.

## MySQL / MariaDB

- **Engine**: InnoDB is the standard (transactions, row-level locking, FKs). MyISAM is legacy (table locks, no transactions) — do not choose it for new work.
- **Types**: `BIGINT UNSIGNED AUTO_INCREMENT`, `DECIMAL`, `VARCHAR(n)`, `TEXT`, `JSON`, `DATETIME`/`TIMESTAMP` (with `time_zone` conventions), `ENUM` (InnoDB).
- **Charsets/collations**: use `utf8mb4` (full Unicode, including emoji) with `utf8mb4_0900_ai_ci` or a deliberate collation; default `utf8` is a subset and drops characters.
- **Foreign keys**: enforced only by InnoDB; name them consistently for maintenance.
- **Indexes**: B-tree; prefix indexes on long text; composite index ordering matters (leftmost-prefix rule); `SPATIAL`/`FULLTEXT` for special cases. Beware invisible indexes and the optimizer ignoring them.
- **Partitioning**: range/list/hash on InnoDB; less mature than PostgreSQL — verify partition pruning and avoid over-partitioning.
- **Online DDL**: use `ALTER TABLE ... ALGORITHM=INPLACE, LOCK=NONE` where possible to avoid full table rebuilds in production.

## SQL Server

- **Clustering**: one clustered index per table defines physical order; pick the clustered key for stable, narrow, non-updatable values (often the identity). Secondary (nonclustered) indexes cover other access paths; `INCLUDE` columns enable covering index scans.
- **Identity vs sequences**: `IDENTITY` for surrogate keys; `SEQUENCE` for ordered shared identifiers.
- **Temporal tables**: `SYSTEM_VERSIONED` tables give history automatically — prefer over hand-rolled audit columns when the platform allows.
- **Types**: `BIGINT`, `NUMERIC(p,s)`, `NVARCHAR(n)` (Unicode), `DATETIMEOFFSET` for UTC with offset, `UNIQUEIDENTIFIER`, `ROWVERSION` (optimistic concurrency).
- **Partitioning**: partition functions/schemes with filegroups; align indexes to the partition for sliding-window maintenance.
- **Filegroups**: separate indexes, `tempdb`, and history onto their own filegroups/files for IO management.

## Oracle

- **Types**: `NUMBER` (exact numeric, variable scale — don't use FLOAT for money), `VARCHAR2(n)`, `CHAR(n)`, `DATE` (contains time), `TIMESTAMP WITH TIME ZONE`, `RAW`, `CLOB`. `VARCHAR2` vs `NVARCHAR2` for Unicode.
- **Rowid**: physical locator, not a key; never expose as a business identifier.
- **Indexes**: B-tree, bitmap (OLAP/warehouse only), function-based, partitioned, and reverse-key indexes. `UNIQUE` constraints automatically create indexes.
- **Sequences**: `NEXTVAL/CURRVAL` for surrogate generation; identity columns (`GENERATED BY DEFAULT AS IDENTITY`) in modern versions.
- **Partitioning**: range/list/hash/composite with partition pruning and exchange partition for fast loads/archival.
- **NLS**: national language settings affect sorting and comparisons; set NLS parameters explicitly in session/DDL to avoid locale surprises.

## DDL and schema change conventions

- **Idempotent migrations**: write migrations that can be applied once; use `IF NOT EXISTS` where supported, and version them.
- **Expand/contract**: for non-disruptive change — add new columns/tables, backfill, dual-write, then drop old structures after verification. Never drop in the same release you add.
- **Naming**: apply the skill-wide convention (snake_case, singular, no reserved words) consistently in DDL.
- **Document non-obvious DDL** with comments: why a denormalized column, why a partial index, why a specific ON DELETE action.

## Common physical design mistakes

- FLOAT for money or exact quantities.
- No index on FK columns, causing join blowups.
- Composite index column order that never matches predicates.
- Over-indexing transactional tables (write amplification) or under-indexing hot reads.
- Using a wide value (VARCHAR(200) email) as the PK instead of a surrogate.
- Letting `id` be the only key with no UNIQUE constraint on the real natural key.
- Ignoring timezone: storing local times without zone, or comparing across zones.
- One table with a giant JSONB/JSON blob where real columns and constraints are needed.
