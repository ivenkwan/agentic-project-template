# Logical Data Modeling

The logical data model expresses business truth independent of any platform. It is the blueprint that survives technology churn. Master this before touching physical DDL.

## Entity-relationship notation

Represent entities, attributes, and relationships with explicit cardinality and optionality. Three notations are common; be fluent in all and state which you are using:

- **Chen**: boxes for entities, diamonds for relationships, `1`, `N`, `M` on edges; good for conceptual models.
- **Crow's Foot**: the de facto standard for relational design; `|` for mandatory one, `o` for optional, `>` for many.
- **UML**: class boxes with multiplicities (`1`, `0..1`, `*`, `1..*`).

Cardinality answers "how many"; optionality answers "must it exist". A relationship line reads from both sides: `ORDER places CUSTOMER` — one customer places zero-to-many orders; an order is placed by exactly one customer.

## Entities, attributes, domains

- **Entity**: a thing the business tracks — a noun with identity and attributes (CUSTOMER, ORDER, INVOICE).
- **Attribute**: a property of an entity. An attribute has a **domain**: a named set of allowed values plus a data type and units. Two attributes that mean the same thing (a customer's address in two tables) must share one domain.
- **Entity vs attribute test**: if a thing has its own attributes and relationships, it is an entity, not an attribute. "Phone number" on CUSTOMER becomes entity PHONE if a customer can have several phones with types.

The first questions for every table: what is the **grain** (what one row uniquely represents), what are the **facts/attributes**, and what are the **dimensions** (the context that qualifies the facts)?

## Normalization

Normalize to remove redundancy and update anomalies. Test each level, then stop deliberately.

- **1NF**: atomic values; no repeating groups (no lists, no arrays pretending to be scalar).
- **2NF**: 1NF + every non-key attribute depends on the *whole* candidate key, not part of it. Violation symptom: a composite key where some columns are constant for a subset of the key.
- **3NF**: 2NF + no transitive dependency — non-key attributes depend only on the key, not on other non-key attributes.
- **BCNF**: every determinant is a candidate key; handles the residual anomalies 3NF misses. Usually the practical ceiling.
- **4NF/5NF**: multi-valued and join dependencies; rarely needed outside specialized modeling, but know they exist.

**When to stop**: 3NF/BCNF is the default for operational systems. Deliberate denormalization (redundancy for read performance) is a *decision*, documented at the point of design, with the consistency mechanism specified. Common legitimate reasons: hot-path reporting, avoiding expensive joins at massive scale, dimensional star schemas for analytics.

## Keys

- **Candidate key**: a minimal set of attributes that uniquely identifies a row. An entity may have several.
- **Primary key**: the chosen candidate key. Logical models name it; physical models implement it.
- **Surrogate vs natural**: natural keys come from the business (SSN, part number); surrogates are system-generated and stable. Prefer surrogates as the physical PK (natural keys change, are reused, or leak semantics), but always enforce the natural key with a UNIQUE constraint.
- **Alternate keys**: candidate keys not chosen as PK — still need uniqueness.
- **Foreign key**: attributes that reference another entity's key; carries the relationship's cardinality and optionality onto the physical schema.
- **Composite keys**: use sparingly and only when truly necessary; they complicate FK references and index design.

## Relationships

- **1:1**: rare. Usually signals an attribute misplaced in its own table or a subtyping split. Ask whether it should be a single table, or a base type with subtypes (e.g., PERSON / EMPLOYEE).
- **1:N**: the workhorse. Modeled as a FK on the many side.
- **M:N**: always resolved into a junction/association entity carrying the FKs to both sides, optionally with its own attributes (e.g., ORDER_LINE between ORDER and PRODUCT with quantity and unit price).
- **Recursive**: an entity related to itself (EMPLOYEE manages EMPLOYEE). Decide the modeling approach (see hierarchies).

## Hierarchies

Five strategies; choose by traversal pattern:

| Strategy | Description | Best for |
|---|---|---|
| Adjacency list | A self-referencing FK (parent_id) | Shallow, OLTP-friendly trees |
| Nested set | left/right numbers encode subtree | Read-heavy, full-subtree queries |
| Closure table | a table of ancestor/descendant pairs | Arbitrary-depth queries and deletes |
| Path enumeration | a materialized path string | Order-preserving, simple depth queries |
| Graph | nodes + edges | Deep, relationship-heavy, path-finding |

In relational stores, deep recursive traversal (recursive CTEs) is often the wrong tool at scale — consider closure tables or a graph database (see `graph.md`).

## Domains and the data dictionary

A **domain** is the single source of truth for a value's type, allowed values, and meaning. Model recurring meanings once: `CURRENCY_AMOUNT` = NUMERIC(18,4) with a currency code; `POSTAL_CODE` = domain-checked string. When you see the same attribute modeled with different types in different tables, that is a domain violation to fix.

Maintain a data dictionary entry per table and column:

```
TABLE: customer
GRAIN: one customer account
OWNER: customer-service
COLUMNS:
  customer_id        BIGINT        PK, surrogate
  email              VARCHAR(320)  UNIQUE, natural key
  status             VARCHAR(20)   IN ('active','suspended','closed')
  created_at         TIMESTAMPTZ   DEFAULT now(), UTC
  credit_limit       NUMERIC(18,4) NULL, not applicable until verified
```

## Naming conventions

- snake_case; singular table names; no reserved words; no abbreviations unless the dictionary defines them.
- Name states the grain: `customer_address`, not `info`.
- Warehouses: `dim_*` for dimensions, `fact_*` for facts.
- Columns describe the attribute, not the type: `amount` not `amt`; `is_active` not `flg`.

## Temporal and history design

- **Audit columns**: created_at, updated_at, created_by, updated_by, and optionally version. Decide whether the application or the database owns them (database triggers are the reliable choice).
- **Type-2 dimensions**: for history, keep current row plus closed rows with valid_from/valid_to.
- **Bitemporal**: track both "system time" (when recorded) and "business time" (when true). Complex; only adopt when audit requirements demand it.
- **Soft delete**: an anti-pattern (breaks uniqueness and FKs). Prefer a status column for "closed" states, audit tables for history, or temporal design. Deleting truly obsolete rows is also acceptable when retention rules permit.

## Enumerations

- Small, stable, closed sets: CHECK constraints or native ENUM.
- Sets that grow or carry attributes (code, description, ordering): reference/lookup tables.
- Never store free-text where a code is meant; validate codes at the database.

## Common logical modeling mistakes

- Confusing entities with attributes; stuffing sub-entities into columns.
- Missing relationship optionality, so physical FKs become nullable or mandatory without a decision.
- Modeling units, currency, or timezone implicitly (a "DATE" that is actually a business date in the user's zone).
- Over-generalization: a generic "attributes" bag for everything destroys semantics.
- Ignoring the grain, then discovering a table can contain duplicate conceptual rows.
- Mixing multiple status meanings into one column.
