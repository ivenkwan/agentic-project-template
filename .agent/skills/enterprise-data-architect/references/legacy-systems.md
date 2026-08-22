# Legacy Systems and Reverse Engineering

This reference equips an agent to read, understand, and reverse-engineer legacy schemas: mainframe COBOL record layouts, VSAM files, IMS hierarchies, and DB2/z. The mindset is archaeology: decode the physical encoding, reconstruct the intent, and never present a guess as a fact.

## Operating principles

- A legacy schema is a physical encoding of business meaning. The PIC clause, the key structure, and the access method each carry semantic weight. Read them as documentation, not obstacles.
- Data in legacy systems is often dirty, de-duplicated by convention rather than constraint, and reliant on code (COBOL paragraphs, CICS transactions, batch jobs) for integrity. Note where integrity is enforced in code rather than in the store.
- Before converting anything, reconstruct the logical model. Only then do you know what the modern target should be.

## The mainframe context

Typical stack: COBOL programs under CICS (online) and batch (JCL), writing to VSAM files, IMS databases, or DB2/z. Character set is EBCDIC unless explicitly converted. Files are fixed or variable length; fields are positioned and formatted by PIC clauses.

## Reading COBOL copybooks

A copybook defines a record layout. Decode it field by field:

- **PIC X(n)** — alphanumeric, EBCDIC or ASCII text, width n.
- **PIC 9(n)** — numeric digits, display (zoned decimal), one byte per digit.
- **PIC S9(n)** — signed display numeric; sign may be in a separate byte or overpunch.
- **PIC S9(n) COMP-3** — packed decimal, two digits per byte plus a sign nibble; n+1/2 bytes total. The most common money/number encoding on mainframes.
- **PIC S9(n) COMP / COMP-4** — binary; fixed-width two's-complement (2, 4, or 8 bytes).
- **COMP-1 / COMP-2** — single/double precision floating point (avoid unless certain).
- **OCCURS** — an array/repeating group; likely a hidden 1:N relationship or a positional table.
- **REDEFINES** — the same bytes reinterpreted as a different layout; a polymorphism or a union-like overlay. Document both interpretations.
- **FILLER** — reserved/unknown bytes; may hide data or alignment.
- **88-level condition names** — named values for a field, e.g. `88 WS-STATUS-ACTIVE VALUE 'A'`. These are the field's enum/domain dictionary.
- **SIGN SEPARATE, JUSTIFIED, BLANK WHEN ZERO** — formatting semantics that affect comparisons.

Example:

```
01 CUSTOMER-RECORD.
   05 CUST-ID         PIC 9(9).        -> integer, 9 digits
   05 CUST-NAME       PIC X(30).       -> text, 30 bytes
   05 CUST-BALANCE    PIC S9(9)V99 COMP-3.  -> packed decimal, 7 bytes, 9 digits + 2 decimals
   05 CUST-STATUS     PIC X(1).        -> code, values in 88-levels
      88 CUST-ACTIVE  VALUE 'A'.
      88 CUST-CLOSED  VALUE 'C'.
```

Decode `PIC S9(9)V99 COMP-3` as a decimal number with 9 integer and 2 fractional digits — the implied decimal point (`V`) is positional, not stored.

## VSAM and its predecessors

- **KSDS (Key-Sequenced Data Set)**: records stored in key order; a primary key defines physical/logical order. Record access is by key; sequential reads follow key order. Equivalent to a clustered index table.
- **ESDS (Entry-Sequenced Data Set)**: records in insertion order, addressed by RBA (relative byte address); no key. Like an append-only log; keys live in alternate indexes.
- **RRDS (Relative-Record Data Set)**: fixed-slot records addressed by record number (1..n). Like a position-addressed array.
- **Alternate indexes (AIX)**: secondary keys pointing to records — the legacy analogue of a secondary index. Unique or non-unique.
- **ISAM**: the indexed-sequential predecessor; same idea, less robust.

When reverse-engineering VSAM: the key structure and alternate indexes *are* the intended access paths. The record layout (copybook) plus the key fields reveal the logical entity and its lookup requirements.

## IMS / DL-I hierarchical databases

IMS stores data as a **hierarchy of segments** under a root segment. A database is defined by a DBD (Database Description); applications navigate via PSBs (Program Specification Blocks).

- **Root segment**: the top of a hierarchy (e.g., CUSTOMER).
- **Child segments**: owned by a parent; a parent can own many children (e.g., ORDERs under CUSTOMER, ORDER-LINEs under ORDER).
- **Parent-child relationship**: the physical navigation is a path from root down through children — equivalent to a sequence of 1:N relationships, but only navigable along the hierarchy. There are no arbitrary cross-hierarchy joins.
- **Segment search fields (SSA)**: qualifiers used to select segments during traversal.

Reverse-engineering an IMS database means turning the DBD hierarchy into a logical model: each segment type becomes an entity, and the parent-child structure becomes nested 1:N relationships. Watch for: segments that exist only to carry repeating groups, and hierarchies that were actually M:N relationships forced into a tree.

## DB2/z

- **Tablespaces**: physical storage for tables; classic types are **simple**, **segmented**, and **partitioned**.
- **Indexspaces**: store indexes. A **clustering index** determines physical row order (the modern equivalent: a clustered index or table ordering).
- **Tables**: relational like modern databases, but note data types — `DECIMAL`, `CHAR`, `VARCHAR`, `GRAPHIC` (DBCS), `TIMESTAMP(p)`, and date arithmetic differences.
- **Locking and concurrency**: RACF for security; note that many legacy apps rely on application-level locking rather than database transactions.

## Legacy encodings to decode

- **Dates**: numeric `YYYYMMDD` (packed or display), Julian dates (`YYDDD` or `YYJJJ`), Gregorian with a base year, and two-digit years (Y2K ambiguity). Verify the century rule by reading the code or sample data. Month-end and fiscal calendars are common.
- **Packed decimals**: two digits per byte, last nibble sign (`C` positive, `D` negative, `F` unsigned). Watch for values that are actually numeric codes (e.g., 999999999 as a "no data" marker).
- **Codes and flags**: single-character status codes, flag bytes, and 88-level condition names are the enum dictionaries. Build a code/meaning table.
- **EBCDIC vs ASCII**: same bytes, different characters; a leading byte set conversion (e.g., UTF-8) is mandatory. Watch for packed/display mixtures within one record.
- **Numeric fields storing identifiers**: many legacy identifiers are formatted as numerics with leading zeros (`CUST-ID PIC 9(9)` = 000123456). Preserve the canonical form; do not collapse to integer and lose the width.

## Reverse-engineering methodology

1. **Inventory**: gather all artifacts — copybooks, DDL, JCL, CICS BMS maps, schematics, runbooks, sample data, program source that reads/writes the files.
2. **Reconstruct the physical model**: every record layout with offsets, widths, types, keys, indexes, and access methods. Build the exact byte map.
3. **Decode encodings**: dates, packed decimals, codes, flags, character sets. Use sample data to confirm.
4. **Infer the logical model**: record types to entities; key fields and alternate indexes to candidate keys; parent-child/pointer structures to relationships; fields to attributes. Reverse-normalize: de-duplicate repeating groups into child entities, turn positional arrays into 1:N.
5. **Document**: logical model, data dictionary, code/meaning tables, a gap and ambiguity list, and data-quality observations (duplicates, missing values, orphan references, known sentinel misuse). Mark every inference clearly.

## Legacy-to-modern type mapping reference

| Legacy | Modern equivalent | Notes |
|---|---|---|
| PIC 9(n) display | INTEGER or NUMERIC(n) | Check leading-zero significance |
| PIC S9(m)Vn COMP-3 | NUMERIC(m, n) | Preserve precision and scale exactly |
| PIC X(n) | VARCHAR(n) or CHAR(n) | Decide trailing-space handling; n in characters after charset conversion |
| OCCURS / repeating group | Child table (1:N) | — |
| REDEFINES | Separate interpretation or subtype | Document both meanings |
| VSAM KSDS record | Table with clustered key | Key = PK; AIX = secondary indexes |
| IMS hierarchy | Nested 1:N tables (or graph if traversal-heavy) | Re-derive logical entities |
| EBCDIC | UTF-8 | Convert early, verify with sample data |
| Julian / YYYYMMDD numeric | DATE or TIMESTAMPTZ | Confirm century rule and timezone |
| Code + 88-levels | Lookup table or CHECK constraint | Preserve the code dictionary |
