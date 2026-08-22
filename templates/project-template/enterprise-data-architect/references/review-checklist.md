# Schema Review and Audit Checklist

Use this checklist when reviewing or auditing a schema. Work from the DDL, catalog, indexes, and (if available) the data dictionary and query workload. Reconstruct the logical model first, then walk each section. Record findings with severity and a concrete fix.

## Severity rubric

- **Critical**: causes data corruption, data loss, or a security/compliance breach. Fix immediately; block go-live.
- **High**: produces incorrect query results or obvious performance failure at expected scale; will cause incidents. Fix before go-live.
- **Medium**: makes the schema fragile, ambiguous, or costly to operate; likely to bite. Fix in a defined window.
- **Low**: style, naming, or minor improvement; fix opportunistically.

Report format: a table of `Severity | Location | Finding | Why it matters | Fix`, plus a one-line overall assessment.

## 1. Correctness and modeling

- [ ] Each table has an explicit **grain** — one row means one identifiable thing. Duplicate conceptual rows impossible.
- [ ] Primary key is stable, immutable, and unique; surrogate vs natural decision documented.
- [ ] Natural/business keys enforced with UNIQUE constraints where they exist.
- [ ] Foreign keys defined for every relational dependency; ON DELETE/ON UPDATE actions chosen explicitly (not left to chance).
- [ ] Referential integrity is **in the database**, not only in application code.
- [ ] Normalization: no 2NF/3NF violations (partial or transitive dependencies).
- [ ] M:N relationships resolved to junction tables (or equivalent) — no comma-separated values in columns.
- [ ] No polymorphic "status" column meaning different things per row.
- [ ] No hidden semantics: no `attributes`/`misc` JSON blobs swallowing real structure.
- [ ] No soft-delete flag where history or uniqueness is at risk; alternatives documented.
- [ ] Cardinality and optionality of relationships match business rules.

## 2. Types and integrity

- [ ] Money and exact quantities are exact numerics (NUMERIC/DECIMAL), never FLOAT.
- [ ] Text-like identifiers (ZIP, phone, SSN, codes) are domain-checked strings, not integers.
- [ ] VARCHAR lengths reflect domain maxima; no overflow-prone arbitrary caps on identifiers.
- [ ] Date/time types with an explicit timezone policy; UTC stored, conversion at presentation.
- [ ] No magic sentinels (9999-12-31, 999999, empty string as NULL) without an explicit documented convention.
- [ ] NULL policy explicit: NOT NULL where mandatory; domains handle "not applicable" vs "unknown".
- [ ] CHECK constraints enforce enum/code values; lookup tables used where codes have attributes.
- [ ] Defaults specified for columns that need them (created_at, status).
- [ ] Audit columns present where accountability is required (created_at, updated_at, created_by, updated_by).

## 3. Naming and documentation

- [ ] Names descriptive, snake_case, singular, no reserved words; abbreviations documented.
- [ ] Table name states its grain; column names describe the attribute.
- [ ] A data dictionary exists and matches the DDL (types, NULLs, defaults, meanings, owners).
- [ ] Non-obvious decisions (denormalization, partial indexes, unusual constraints) have comments.

## 4. Performance

- [ ] Foreign key columns are indexed.
- [ ] Indexes exist for the dominant query predicates; composite index column order matches predicate usage.
- [ ] No obvious missing index (queries doing full scans on hot tables) or redundant indexes (duplicate or overlapping).
- [ ] Write-heavy tables not over-indexed; read-heavy tables not under-indexed.
- [ ] Partitioning used where tables exceed operational pain and queries filter by the partition key.
- [ ] EXPLAIN output for representative queries shows no accidental full scans, nested-loop blowups, or cartesian joins.
- [ ] For OLAP/columnar: partition/cluster keys match the filter pattern; no SELECT * on huge fact tables.

## 5. Anti-pattern scan

- [ ] No EAV (entity-attribute-value) where real columns belong.
- [ ] No comma-separated lists in columns.
- [ ] No unbounded arrays/JSON where children are always read with the parent.
- [ ] No hot keys / hot partitions in NoSQL shard/partition design.
- [ ] No unbounded variable-length traversals in graph schemas (missing depth bounds or relationship filters).
- [ ] No mirror/archive tables without a documented lifecycle.
- [ ] No application-level-only integrity on a schema that other systems write to.

## 6. Time and history

- [ ] Timezone policy documented and consistently applied.
- [ ] Date-only vs timestamp choice reflects actual business meaning.
- [ ] History requirements met (audit columns, type-2, temporal, or event sourcing as appropriate); no reliance on soft delete.

## 7. Security and compliance

- [ ] PII/sensitive columns identified and classified.
- [ ] Access control matches the sensitivity (least privilege, roles, RLS/column masking where needed).
- [ ] Retention/deletion rules defined and implementable.
- [ ] Data lineage and ownership documented.

## 8. Migration readiness (when relevant)

- [ ] Source-to-target mapping complete with transformation rules.
- [ ] Reconciliation plan defined (counts, control totals, checksums, sampling).
- [ ] Cutover, rollback, and parallel-run plans exist.
- [ ] Legacy artifacts (copybooks, DDL, JCL) archived.

## Overall assessment

Summarize: is the schema correct and sound (go-live ready), correctable with known fixes (ready with remediation), or fundamentally compromised (redesign needed)? State the top three highest-impact findings explicitly.
