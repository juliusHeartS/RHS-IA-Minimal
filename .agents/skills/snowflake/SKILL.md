---
name: snowflake
description: Connect to Snowflake, discover Semantic Views, and query data using certified business metrics. Use when working with Snowflake databases, semantic layers, or when the user mentions Snowflake, semantic views, or certified metrics. Also use this skill when a Snowflake connection is already active in the session and the user asks to explore, query, or analyze any database, schema, table, or view — even if they don't explicitly mention Snowflake.
compatibility: Requires snowflake-connector-python (Python) or odbc package (R)
---

# Snowflake Skill

This skill guides you through connecting to Snowflake, discovering Semantic Views, and generating queries that use certified business metrics instead of error-prone raw SQL.

## Critical Rules

- **NEVER execute destructive SQL (DROP, DELETE, TRUNCATE, REPLACE, REVOKE) without first showing the user a warning with the exact SQL and receiving explicit confirmation to proceed.** See Section 7 for details.
- **NEVER pull large datasets locally** — keep computation in Snowflake. See Section 7.

## Why Semantic Views Matter

Semantic Views provide a curated layer over raw data with pre-defined metrics, dimensions, and relationships. They encode business logic and calculation rules that ensure consistent, accurate results. When a Semantic View covers the data you need, prefer it over raw tables to benefit from these certified definitions.

**Real-world example**: A legacy ERP database had a revenue column (`X_AMT`) with hidden business rules—only status code 90 transactions count as realized revenue, and a discount factor (`ADJ_FCTR`) must be applied. Querying raw tables for "external customer revenue" returned **$184B**. The same query using the semantic model's certified `NET_REVENUE` metric returned **$84.5B**—the correct answer. The raw query was **2x+ too high** because it ignored discounts and included invalid transaction codes.

**Always check for Semantic Views first.** Use them when they cover your use case; fall back to raw tables when they don't.

---

## Session Awareness

If a Snowflake connection has already been established in this session (e.g., via a `snowflake.connector` connection object or an `odbc::snowflake()` DBI connection), **continue using it for all subsequent database/table/schema exploration and queries.** You do not need the user to say "Snowflake" again — any request to explore, describe, or query a database object should use the active Snowflake connection and follow the discovery and query patterns in this skill.

---

## 1. Detecting Integrated Authentication

Before connecting, check if you're in a Posit Workbench environment with integrated Snowflake auth.

### Safe Detection

**CRITICAL**: Only check file EXISTENCE. NEVER read `connections.toml` or `config.toml` - they contain OAuth tokens.

**Bash:**
```bash
# Check for Posit Workbench + Snowflake integration
if [ -n "$RS_SERVER_URL" ] && [ -n "$SNOWFLAKE_HOME" ] && [ -f "$SNOWFLAKE_HOME/connections.toml" ]; then
    echo "integrated_auth_available"
else
    echo "no_integrated_auth"
fi
```

**Python:**
```python
import os
from pathlib import Path

def has_integrated_auth():
    snowflake_home = os.environ.get("SNOWFLAKE_HOME")
    return (
        os.environ.get("RS_SERVER_URL") is not None
        and snowflake_home is not None
        and Path(snowflake_home, "connections.toml").exists()
    )
```

**R:**
```r
has_integrated_auth <- function() {
    rs_server <- Sys.getenv("RS_SERVER_URL", unset = NA)
    snowflake_home <- Sys.getenv("SNOWFLAKE_HOME", unset = NA)

    if (is.na(rs_server) || is.na(snowflake_home)) {
        return(FALSE)
    }

    file.exists(file.path(snowflake_home, "connections.toml"))
}
```

---

## 2. Connecting to Snowflake

### With Integrated Auth (Posit Workbench)

When integrated auth is available, connect with zero arguments:

**Python:**
```python
import snowflake.connector

# Zero-argument connection uses $SNOWFLAKE_HOME config
conn = snowflake.connector.connect()

# OR explicitly use the workbench connection
conn = snowflake.connector.connect(connection_name='workbench')
```

**R:**
```r
library(DBI)
library(odbc)

# Zero-argument connection uses integrated auth
conn <- dbConnect(odbc::snowflake())
```

### Without Integrated Auth

If integrated auth is not available, ask the user for connection details:

**Python:**
```python
import snowflake.connector

conn = snowflake.connector.connect(
    account=account,      # e.g., "xy12345.us-east-1"
    user=user,
    password=password,    # Or use authenticator='externalbrowser' for SSO
    warehouse=warehouse,
    database=database,
    schema=schema
)
```

**R:**
```r
conn <- dbConnect(
    odbc::snowflake(),
    account = account,
    uid = user,
    pwd = password,
    warehouse = warehouse,
    database = database,
    schema = schema
)
```

### Verify Connection Context

After connecting, always display the active session context including the current role:

**Python:**
```python
cursor = conn.cursor()
cursor.execute("SELECT CURRENT_ACCOUNT(), CURRENT_ROLE(), CURRENT_WAREHOUSE(), CURRENT_DATABASE(), CURRENT_SCHEMA()")
account, role, warehouse, database, schema = cursor.fetchone()
print(f"Connected to Snowflake:")
print(f"  Account:   {account}")
print(f"  Role:      {role}")
print(f"  Warehouse: {warehouse}")
print(f"  Database:  {database}")
print(f"  Schema:    {schema}")
```

**R:**
```r
ctx <- dbGetQuery(conn, "SELECT CURRENT_ACCOUNT() AS ACCOUNT, CURRENT_ROLE() AS ROLE, CURRENT_WAREHOUSE() AS WAREHOUSE, CURRENT_DATABASE() AS DATABASE, CURRENT_SCHEMA() AS SCHEMA")
cat(sprintf("Connected to Snowflake:\n  Account:   %s\n  Role:      %s\n  Warehouse: %s\n  Database:  %s\n  Schema:    %s\n",
    ctx$ACCOUNT, ctx$ROLE, ctx$WAREHOUSE, ctx$DATABASE, ctx$SCHEMA))
```

---

## 3. Discovery Protocol

After connecting, discover what's available. **Always check for Semantic Views first.**

### Step 1: Check for Semantic Views

```sql
-- In current schema
SHOW SEMANTIC VIEWS

-- In a specific schema
SHOW SEMANTIC VIEWS IN SCHEMA schema_name

-- In a specific database (all schemas)
SHOW SEMANTIC VIEWS IN DATABASE database_name
```

If semantic views exist, you should use them for analysis queries.

### Step 2: Discover Regular Objects

```sql
-- Views (often the underlying data for semantic views)
SHOW VIEWS IN SCHEMA schema_name

-- Tables
SHOW TABLES IN SCHEMA schema_name
```

### Step 3: Determine Mode

- **If Semantic Views found**: Use SEMANTIC mode - prioritize certified metrics
- **If no Semantic Views**: Use RAW mode - query tables/views directly

**Python example:**
```python
cursor = conn.cursor()

# Check for semantic views in current schema
cursor.execute("SHOW SEMANTIC VIEWS")
semantic_views = cursor.fetchall()

# Check for regular views and tables
cursor.execute("SHOW VIEWS")
views = cursor.fetchall()

cursor.execute("SHOW TABLES")
tables = cursor.fetchall()

if semantic_views:
    print(f"SEMANTIC MODE: Found {len(semantic_views)} semantic view(s)")
    for sv in semantic_views:
        print(f"  - {sv[1]}")  # sv[1] is typically the name
else:
    print(f"RAW MODE: Found {len(views)} views, {len(tables)} tables")
```

### Other Useful Discovery Queries

```sql
SHOW WAREHOUSES
SHOW DATABASES
SHOW SCHEMAS IN DATABASE database_name
```

---

## 4. Loading Semantic Model Definitions

When you find a Semantic View, retrieve its definition to understand available metrics and dimensions:

```sql
SELECT GET_DDL('SEMANTIC_VIEW', '{database}.{schema}.{view_name}')
```

**Python:**
```python
cursor.execute(f"SELECT GET_DDL('SEMANTIC_VIEW', '{database}.{schema}.{view_name}')")
ddl_text = cursor.fetchone()[0]
print(ddl_text)
```

The DDL reveals:
- **METRICS**: Pre-calculated business metrics (e.g., `NET_REVENUE`)
- **DIMENSIONS**: Grouping/filtering attributes (e.g., `ACCOUNT_TYPE`, `LOG_DT`)
- **RELATIONSHIPS**: How tables join together
- **FILTERS**: Named filters for common use cases

**Use the metric and dimension names from the DDL in your queries.**

---

## 5. Query Generation Rules

When Semantic Views are available, use the `SEMANTIC_VIEW()` function.

### Key Points

1. **Use `SEMANTIC_VIEW()` function** - The recommended query method
2. **No GROUP BY needed** - Semantic layer handles aggregation via DIMENSIONS
3. **No JOINs needed within model** - Relationships are pre-defined (but you CAN join results with other tables)
4. **No aggregate functions needed** - Metrics are pre-aggregated (but you CAN aggregate results further)
5. **Use DDL-defined names** - Metrics and dimensions must match the DDL exactly
6. **METRICS vs FACTS** - Use METRICS for aggregated values, FACTS for row-level data (cannot combine both)

### Basic Syntax

```sql
SELECT * FROM SEMANTIC_VIEW(
    {view_name}
    METRICS {logical_table}.{metric_name}
    DIMENSIONS {logical_table}.{dimension_name}
    [WHERE {dimension} = 'value']  -- Optional: pre-aggregation filter
)
[WHERE {column} = 'value']  -- Optional: post-aggregation filter
```

### WHERE Clause: Inside vs Outside

- **Inside** (pre-aggregation): Filters base data BEFORE metrics are computed — **use this for dimension filters**
- **Outside** (post-aggregation): Filters results AFTER metrics are computed — **use this only for filtering on computed metric values**

**IMPORTANT**: When filtering by a dimension value (e.g., account type, region, status), always use the **internal** WHERE clause. Using an external WHERE on a dimension filters rows from the result set *after* the metric has already been aggregated across all dimension values, which produces incorrect metric values.

```sql
-- CORRECT: Pre-aggregation filter on dimension
-- Revenue is computed ONLY for 'EXT' accounts
SELECT * FROM SEMANTIC_VIEW(
    CHAOS_MODEL
    METRICS T_DATA_LOG.NET_REVENUE
    DIMENSIONS REF_ENTITIES.ACC_TYPE_CD
    WHERE REF_ENTITIES.ACC_TYPE_CD = 'EXT'
)

-- CORRECT: Post-aggregation filter on a computed metric
-- Revenue is computed for ALL account types, then only high-revenue rows are returned
SELECT * FROM SEMANTIC_VIEW(
    CHAOS_MODEL
    METRICS T_DATA_LOG.NET_REVENUE
    DIMENSIONS REF_ENTITIES.ACC_TYPE_CD
)
WHERE NET_REVENUE > 1000000

-- WRONG: Without internal WHERE, this returns revenue for ALL account types
-- There's no way to filter by ACC_TYPE_CD externally — it's not in the output
-- SELECT * FROM SEMANTIC_VIEW(
--     CHAOS_MODEL
--     METRICS T_DATA_LOG.NET_REVENUE
-- )
-- Returns one row: NET_REVENUE across ALL accounts (too high!)
```

### Quick Examples

**Single metric:**
```sql
SELECT * FROM SEMANTIC_VIEW(
    CHAOS_MODEL
    METRICS T_DATA_LOG.NET_REVENUE
)
```

**With dimension for grouping and filtering:**
```sql
SELECT * FROM SEMANTIC_VIEW(
    CHAOS_MODEL
    METRICS T_DATA_LOG.NET_REVENUE
    DIMENSIONS REF_ENTITIES.ACC_TYPE_CD
    WHERE REF_ENTITIES.ACC_TYPE_CD = 'EXT'
)
```

**Multiple metrics and dimensions:**
```sql
SELECT * FROM SEMANTIC_VIEW(
    CHAOS_MODEL
    METRICS T_DATA_LOG.NET_REVENUE, T_DATA_LOG.GROSS_REVENUE
    DIMENSIONS REF_ENTITIES.ACC_TYPE_CD, T_DATA_LOG.LOG_DT
)
ORDER BY LOG_DT ASC
```

**Join results with other data:**
```sql
SELECT sv.*, lookup.category_name
FROM SEMANTIC_VIEW(
    CHAOS_MODEL
    METRICS T_DATA_LOG.NET_REVENUE
    DIMENSIONS REF_ENTITIES.ACC_TYPE_CD
) AS sv
JOIN category_lookup AS lookup ON sv.ACC_TYPE_CD = lookup.code
```

**Using named filters (defined in DDL):**

Semantic Views can define named filters (e.g., `IS_EXTERNAL`) that encapsulate complex business logic. Check the DDL for available filters:
```sql
-- If DDL defines: FILTER IS_EXTERNAL AS (ACC_TYPE_CD = 'EXT' AND ENTITY_NAME != 'AUTOMOBILE')
-- Use it via the internal WHERE clause:
SELECT * FROM SEMANTIC_VIEW(
    CHAOS_MODEL
    METRICS T_DATA_LOG.NET_REVENUE
    DIMENSIONS REF_ENTITIES.ACC_TYPE_CD
    WHERE REF_ENTITIES.IS_EXTERNAL
)
```

Named filters ensure consistent definitions across all analyses—everyone uses the same "external customer" definition.

For complete syntax reference and more examples, see [references/semantic-view-syntax.md](references/semantic-view-syntax.md).

---

## 6. Creating Semantic Views

When a user asks to create a semantic view, model, or semantic layer:

### Default: Generate DDL/YAML for Admin Review

**Do not execute CREATE SEMANTIC VIEW directly.** Instead, generate the DDL or YAML definition and present it to the user so they can share it with their Snowflake admin for review and deployment.

```sql
-- Generate and present this to the user (do NOT execute)
CREATE OR REPLACE SEMANTIC VIEW my_model
  COMMENT = 'Revenue analysis model'
  TABLES (
    ...
  )
  RELATIONSHIPS (
    ...
  )
  ...;
```

Tell the user: *"Here's the semantic view definition. I recommend sharing this with your Snowflake admin for review and deployment."*

### If the User Wants Direct Creation

If the user explicitly asks to create it themselves:

1. **Warn them**: *"Creating semantic views typically requires elevated privileges (e.g., ACCOUNTADMIN or a role with CREATE SEMANTIC VIEW grants). This will modify your Snowflake schema. Do you want to proceed?"*
2. **Only proceed after explicit confirmation.**
3. **If creation fails due to insufficient privileges**, fall back to providing the DDL/YAML: *"Your current role ({role}) doesn't have permission to create semantic views. Here's the DDL you can share with your Snowflake admin."*

---

## 7. Operational Rules

### Prefer Server-Side Operations

When connected to Snowflake, **do not pull data locally unless absolutely necessary.** Keep computation in Snowflake:

- Use SQL aggregations, filters, and transformations server-side
- Only fetch result sets that are already filtered/aggregated to what's needed
- Avoid `SELECT *` on large tables followed by local processing
- If the user needs a summary, compute it in SQL rather than fetching raw rows
- When local processing is truly required (e.g., for plotting), fetch only the minimum columns and rows needed

### Destructive Command Confirmation

**CRITICAL: NEVER execute destructive SQL commands without explicit user confirmation. This is a hard rule with no exceptions.**

Before executing ANY of the following, you MUST:
1. **Stop** — do NOT execute the command
2. **Show a warning** — display the exact SQL you intend to run and explain what it will permanently affect (e.g., "This will permanently drop table X and all its data")
3. **Ask for confirmation** — explicitly ask the user to confirm (e.g., "Do you want me to proceed?")
4. **Wait** — only execute after the user explicitly says yes

This applies to:
- `DROP` (table, view, schema, database, semantic view, warehouse, role, etc.)
- `DELETE` / `TRUNCATE`
- `ALTER ... DROP COLUMN`
- `REPLACE` (as in `CREATE OR REPLACE` — this drops the existing object)
- `REVOKE`
- Any command that permanently removes, overwrites, or modifies data/objects

**Example behavior:**
> User: "Drop the staging table"
>
> **Correct**: "I'm about to run the following command which will **permanently delete** the table `STAGING_DB.PUBLIC.STG_ORDERS` and all its data:\n\n```sql\nDROP TABLE STAGING_DB.PUBLIC.STG_ORDERS;\n```\n\nThis cannot be undone. Do you want me to proceed?"
>
> **Wrong**: Executing `DROP TABLE` immediately without warning.

---

## 8. Workflow Summary

1. **Detect environment** - Check for integrated auth (don't read config files)
2. **Connect** - Use zero-arg connection if integrated auth available
3. **Discover** - Run `SHOW SEMANTIC VIEWS` first, then views/tables
4. **Introspect** - If semantic views found, get DDL to understand metrics
5. **Query** - Use `SEMANTIC_VIEW()` function with DDL-defined names
6. **Validate** - If errors, check metric/dimension names match DDL

---

## 9. Troubleshooting

### Query returns "invalid identifier"
- Verify metric/dimension names match exactly what's in the DDL
- Check you're using the correct table alias (e.g., `T_DATA_LOG.NET_REVENUE`)

### Cannot see semantic views
- Ensure you have appropriate permissions on the schema
- Try `SHOW SEMANTIC VIEWS IN DATABASE {database}` to search broader

### Query syntax error
- Use `SEMANTIC_VIEW()` function, not direct `SELECT FROM`
- GROUP BY and JOINs aren't needed within the function (but can be used on results)

### Connection fails with integrated auth
- Verify `$RS_SERVER_URL` and `$SNOWFLAKE_HOME` are set
- Check `$SNOWFLAKE_HOME/connections.toml` exists (don't read it)
- Ensure OAuth token hasn't expired (may need to re-authenticate in Workbench)
