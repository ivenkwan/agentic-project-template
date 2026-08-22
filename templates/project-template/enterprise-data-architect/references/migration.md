# Database Migration Playbook

Migration is **reinterpretation**, not translation: you re-derive the logical model, clean the data, re-decide constraints against current business truth, and validate relentlessly. The data is the asset; everything else — schema, code, access paths — serves it.

## Guiding principles

1. **Logical model first.** Build or reconstruct the target logical model before mapping. A migration that merely copies the old physical schema into new syntax preserves the old problems.
2. **Data quality is the real project.** Legacy data is dirty: duplicates, orphans, misused sentinels, code drift. Budget for profiling and cleansing.
3. **Every transformation must be explicit and verifiable.** Rules written down beat rules implied by code.
4. **Never cut over without rollback.** Plan the freeze, the switch, and the way back.
5. **Validate continuously** — counts, checksums, sampled field comparisons — not just at the end.

## Phase 1 — Assessment

- **Inventory**: all source schemas, files, copybooks, tables, access methods, and the applications and integrations that touch them.
- **Dependencies**: which applications, ETL jobs, reports, and third parties read the source? Map read/write ownership.
- **Data profiling**: volume per table/entity, row counts, duplicate rates, NULL rates, orphan FK references, value distributions, sentinel misuse (999999, 00/00/0000, spaces).
- **Compliance**: PII/sensitive classification, retention requirements, audit needs, data-subject rights.
- **Target selection**: workload and family choice per the main SKILL.md (Workflow E) and the family references.
- **Success criteria and sign-off gates**: define measurable exit criteria before starting.

Deliverables: inventory list, dependency map, data-quality report, target architecture, risk register, phase plan with dates and owners.

## Phase 2 — Target design

1. Reconstruct/confirm the source logical model (see `legacy-systems.md`).
2. Design the target logical model against current business truth — this is the moment to fix historical modeling errors (wrong grains, misplaced attributes, polymorphic status columns).
3. Map to physical on the chosen platform(s).

## Phase 3 — Source-to-target mapping and transformation rules

Produce an explicit mapping table per entity/table:

```
SOURCE                       TARGET                  RULE
CUST-ID PIC 9(9)             customer.id BIGINT      surrogate; map via lookup
CUST-BALANCE COMP-3          customer.balance NUMERIC(18,2)
CUST-STATUS 88 'A'/'C'       customer.status         'A'->'active', 'C'->'closed'
CUST-DOB     Julian          customer.birth_date     convert, flag century rule
```

Include rules for: type conversion, encoding conversion (EBCDIC->UTF-8, packed->numeric), NULL handling (preserve unknown vs not-applicable), code translation, surrogate key generation and stable mapping, de-duplication, and value normalization (trim, case, canonical phone/date forms). Every rule needs a verifiable assertion (e.g., "no source value maps to NULL unless the rule says so").

## Phase 4 — Extract, transform, load (ETL/ELT)

- **Extraction**: read source in its native form (copybook parsing, file export, CDC, or queries). Use batch-friendly approaches; preserve record identity.
- **Transformation**: apply the rules. Make the pipeline **idempotent** (re-running produces the same result) and **resumable** (a failed run resumes from the checkpoint, not from zero).
- **Load**: bulk load, then create indexes and constraints — loading with indexes on is slower and prone to contention. Use staging tables, then move into place atomically.
- **Error handling**: every rejected/transformed record goes to an exception report for human review, with reasons. Never silently drop data.
- **Performance**: profile stage runtimes, parallelize independent streams, and set a target throughput with checkpointing.

## Phase 5 — Reconciliation and verification

Reconcile source against target continuously:

- Row counts per table/entity (and per partition of the source, e.g., by year).
- **Control totals**: sums of key numeric columns (balance, amount) compared source vs target after transformation.
- **Checksums** on hashed rows for high-confidence equality on critical tables.
- **Field-level sampling**: compare a statistically meaningful sample of source records against transformed target rows, field by field.
- **Referential integrity**: verify every FK resolves; count and report orphans (which the cleansing rules should have addressed).
- **Rule completeness**: assert that every transformation rule fired correctly (e.g., "no value outside the target enum", "no NULL where NOT NULL").

Any mismatch halts sign-off. Record the evidence in a reconciliation report.

## Phase 6 — Cutover and rollback

1. **Freeze window**: stop writes to the source (or open a change-data-capture capture). Size it realistically.
2. **Final sync**: run the last incremental load; reconcile to zero drift.
3. **Switch**: point applications to the target. Sequence by dependency (read-only first, then write paths).
4. **Parallel run**: where feasible, run source and target together for a period, comparing outputs on live traffic, before decommissioning.
5. **Rollback plan**: define the exact trigger (a threshold of critical errors), the steps to revert, and how to re-apply the incremental window. Test the rollback before go-live.

## Phase 7 — Post-migration and decommission

- Validate production queries and reports against the target; measure performance against the success criteria.
- Fix any residual data issues discovered in production.
- **Archive** legacy artifacts (copybooks, DDL, JCL, sample data) for audit and future reference — do not lose the historical interpretation.
- Decommission source only after a sustained stable period.
- Hand over the data dictionary, lineage, and runbook.

## Risk and sign-off gates

Gate after each phase: assessment reviewed, mapping approved, staging reconciliation signed off, parallel run accepted, cutover approved by the business owner. Define who signs and on what evidence. If a gate is not met, the migration does not proceed — this discipline is what separates a migration that lands from one that becomes a remediation project.
