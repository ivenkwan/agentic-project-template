# Graph Data Modeling

Graph databases model data as **nodes**, **relationships**, and **properties** — the property graph model. They excel when the value is in the *connections*: relationship-heavy traversals, path queries, network analysis, dependency graphs, and flexible schemas that change shape.

## The property graph model

- **Node**: an entity (CUSTOMER, ACCOUNT, TRANSACTION). Nodes have labels (types) and properties.
- **Relationship**: a typed, directed edge between two nodes (ACCOUNT `OWNS` CUSTOMER, TRANSACTION `CREDITS` ACCOUNT). Relationships can carry **properties** (amount, date, weight) and can be self-referencing.
- **Properties**: key-value attributes on nodes and relationships.
- A label is not a constraint: a node can have several labels, and labels are not enforced as rigid schemas.

## When graph is the right model

- The dominant questions are about **paths and connectivity** ("what chain of accounts leads to X", "all suppliers reachable within 3 hops", "does this transaction depend on that system").
- The data is **relationship-dense** and traversals would be awkward recursive SQL.
- The schema **evolves** and relationships carry their own attributes.
- You need **variable-length traversals** and **shortest-path / influence** queries.

When the queries are mostly point lookups, aggregates, or strict table-shaped reporting, a relational or OLAP store is usually the better fit. Choosing graph for everything is as wrong as choosing relational for everything.

## Modeling decisions

### Nodes vs relationships
- A relationship with **properties** (amount, timestamp, state) is a first-class fact — keep it as a relationship, not a node.
- When a relationship itself needs to participate in other relationships (an "order line" that is itself linked to a shipment), promote it to an **intermediate node**.
- Don't overload a node to encode connectivity that belongs in an edge (e.g., an `owner_id` property chaining nodes manually — that is an adjacency list reinvented).

### Labels
- Use **specific, typed labels** (ACCOUNT, CUSTOMER) over generic ones (NODE, ENTITY). Over-generic labels defeat the schema and make queries ambiguous.
- A node can carry multiple labels when it plays multiple roles (PERSON + EMPLOYEE). Keep label semantics consistent.

### Relationship naming
- Name relationships in a **readable, directed, verb phrase** (OWNS, CREATED, DEPENDS_ON). Direction matters: `A -[:OWNS]-> B` is not `B -[:OWNS]-> A`.

### Properties on edges
- Store the fact that belongs to the *relationship* on the relationship (e.g., `:DEPOSITED` with `{amount, at}`), not on either node.

### Time and versioning
- Model time-aware edges with properties like `valid_from`/`valid_to`, or create **time-bucketed** edges when you must traverse history. A relationship that is true only for a window is a temporal edge — capture that window explicitly.

## Mapping relational to graph

| Relational | Graph |
|---|---|
| Table | Node label |
| Row | Node |
| Column | Node property |
| Foreign key (1:N) | Relationship (N side `-[:REL]->` 1 side) |
| Junction/association table (M:N) | Relationship (promote to intermediate node only if it needs its own relationships) |
| Enum / code table | Optional label or node; often simpler as property |
| Recursive self-FK | Self-referencing relationship |

The mapping is never mechanical: re-examine whether an entity is really a node or a relationship, whether M:N junctions should be typed edges, and whether denormalized columns belong as properties or edges.

## Query patterns (Cypher, Neo4j)

Neo4j is the reference platform; Cypher is its query language.

- **Indexes and constraints**: create indexes for properties used in lookups and uniqueness constraints for natural keys: `CREATE CONSTRAINT account_id FOR (a:ACCOUNT) REQUIRE a.id IS UNIQUE`. Back with explicit schema before loading data.
- **Traversal**: `MATCH (a:ACCOUNT)-[:TRANSFER*1..5]->(b:ACCOUNT)` — variable-length path with depth bounds; always bound the depth to avoid unbounded work.
- **Shortest path**: `MATCH p = shortestPath((a)-[*]->(b))` — for connectivity questions; add relationship-type filters to keep it fast.
- **Node property index lookups first**: begin queries at indexed nodes; never start a traversal from an unindexed property.
- **LOAD CSV**: import in bulk with periodic commits, then create indexes after import for speed.

## Common graph modeling pitfalls

- **Edges modeled as nodes**: every relationship promoted to a node — bloats the graph and complicates traversal. Keep facts that belong to the edge as edge properties.
- **Over-generic labels/properties**: generic `value`/`node`/`relationship` names destroy queryability and integrity.
- **Unbounded traversal**: variable-length paths without depth limits or relationship filters cause exponential scans.
- **Missing indexes/constraints**: lookups and uniqueness are slow or silently duplicated.
- **Cycles**: real data often contains cycles (A depends on B, B depends on A); decide whether to allow them and protect traversal logic accordingly.
- **Fan-out explosion**: a single node connected to millions of others (a supernode) makes traversals through it pathological; split or redesign if hot.
- **Copying a relational model wholesale**: tables turned into labels with FK columns left as properties — the result is a slower relational DB with extra ceremony.

## When graph is wrong

If the workload is: mostly exact-match point queries, heavy aggregation/group-by, strict reporting with fixed schema, or transactions requiring broad consistency — prefer relational. If it is analytic aggregation at massive scale — prefer columnar/OLAP. Use a graph alongside these for the connectivity layer if (and only if) connectivity queries are real and frequent.
