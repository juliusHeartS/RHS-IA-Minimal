# SEMANTIC_VIEW() Syntax Reference

Complete reference for Snowflake Semantic View query syntax.
Based on [Snowflake documentation](https://docs.snowflake.com/en/user-guide/views-semantic/querying).

## Syntax Rules

### Core Syntax

```sql
SELECT * FROM SEMANTIC_VIEW(
    <semantic_view_name>
    [DIMENSIONS <table>.<dimension> [AS <alias>], ...]
    [METRICS <table>.<metric> [AS <alias>], ...]
    [FACTS <table>.<fact>, ...]
    [WHERE <condition>]
)
```

At least one of METRICS, DIMENSIONS, or FACTS must be specified.

### Clauses

1. **METRICS** - Aggregated values (e.g., `orders.order_average_value`)
   ```sql
   METRICS orders.order_average_value, orders.total_revenue
   ```

2. **DIMENSIONS** - Grouping/filtering attributes (e.g., `customer.region`)
   ```sql
   DIMENSIONS customer.customer_market_segment
   ```

3. **FACTS** - Row-level (non-aggregated) values
   ```sql
   FACTS orders.order_date, orders.order_total
   ```
   **METRICS and FACTS cannot be used together in the same query.**

4. **Wildcard syntax** - Select all from a logical table
   ```sql
   DIMENSIONS customer.*
   METRICS orders.*
   ```

5. **Aliasing** - Rename output columns with `AS`
   ```sql
   DIMENSIONS customer.customer_market_segment AS segment
   METRICS orders.order_average_value AS avg_value
   ```

6. **Expressions** - Scalar expressions referencing facts or dimensions
   ```sql
   DIMENSIONS DATE_PART('year', orders.order_date) AS order_year
   ```

### Column Ordering

The order of clauses determines output column order:
```sql
-- Dimensions appear first, then metrics
SELECT * FROM SEMANTIC_VIEW(model DIMENSIONS t.region METRICS t.revenue)

-- Metrics appear first, then dimensions
SELECT * FROM SEMANTIC_VIEW(model METRICS t.revenue DIMENSIONS t.region)
```

### Dimension Reachability

Dimensions must be **reachable** by every metric used in the query. This means the dimension's logical table must be related to the metric's logical table through the relationships defined in the semantic view. If unrelated, the query will fail.

### WHERE Clause Placement

WHERE can be **inside** or **outside** the function with different semantics:

**Inside (pre-aggregation)** - Filters base data BEFORE metrics are computed.
**Use this for all dimension-based filters** so that metrics are aggregated over the correct population:
```sql
SELECT * FROM SEMANTIC_VIEW(
    model
    METRICS t.total_revenue
    DIMENSIONS t.region
    WHERE t.region = 'US'  -- Revenue computed only for US region
)
```

**Outside (post-aggregation)** - Filters results AFTER metrics are computed.
**Use this only for filtering on computed metric values:**
```sql
SELECT * FROM SEMANTIC_VIEW(
    model
    METRICS t.total_revenue
    DIMENSIONS t.region
)
WHERE total_revenue > 1000000  -- All regions computed, then filter by metric value
```

**IMPORTANT**: Never use an external WHERE to filter on a dimension. This computes the metric across all dimension values first, then discards rows — the metric values will be wrong because they were aggregated over the wrong population.

The internal WHERE can only reference dimensions and facts, not metrics.

### What You DON'T Need (But CAN Use on Results)

1. **No GROUP BY needed** - Results are automatically grouped by dimensions
   ```sql
   -- Simpler (dimensions auto-group)
   SELECT * FROM SEMANTIC_VIEW(model METRICS t.revenue DIMENSIONS t.region)
   ```

2. **No JOINs needed within the model** - Relationships are pre-defined in the semantic view
   ```sql
   -- Cross-table reference handled automatically
   SELECT * FROM SEMANTIC_VIEW(model METRICS orders.revenue DIMENSIONS customer.region)
   ```

3. **No aggregate functions needed** - Metrics are pre-aggregated
   ```sql
   SELECT * FROM SEMANTIC_VIEW(model METRICS t.NET_REVENUE)
   ```

### What You CAN Do With Results

You CAN join, aggregate, or further process SEMANTIC_VIEW results:

```sql
-- JOIN results with other tables
SELECT sv.*, extra.category_name
FROM SEMANTIC_VIEW(model METRICS t.revenue DIMENSIONS t.category_id) AS sv
JOIN category_lookup AS extra ON sv.category_id = extra.id

-- Further aggregate results
SELECT region, SUM(revenue) as total
FROM SEMANTIC_VIEW(model METRICS t.revenue DIMENSIONS t.region, t.product)
GROUP BY region

-- Use in CTEs
WITH revenue_by_region AS (
    SELECT * FROM SEMANTIC_VIEW(model METRICS t.revenue DIMENSIONS t.region)
)
SELECT * FROM revenue_by_region WHERE revenue > 1000000

-- ORDER BY and LIMIT
SELECT * FROM SEMANTIC_VIEW(
    model
    DIMENSIONS t.customer_name
    METRICS t.order_average_value
)
ORDER BY order_average_value DESC
LIMIT 10
```

### Restrictions

The following are **not supported** inside SEMANTIC_VIEW queries:
- **PIVOT / UNPIVOT**
- **Window functions**
- **Subqueries**
- **LATERAL joins**

---

## Query Patterns

### Pattern 1: Single Metric (Total)

Get a single aggregated metric value.

```sql
SELECT * FROM SEMANTIC_VIEW(
    tpch_analysis
    METRICS customer.customer_count
)
```

Returns one row with the total.

### Pattern 2: Metric by Dimension (Grouped)

Break down a metric by a dimension.

```sql
SELECT * FROM SEMANTIC_VIEW(
    tpch_analysis
    DIMENSIONS customer.customer_market_segment
    METRICS orders.order_average_value
)
```

Returns one row per segment with corresponding metric value.

### Pattern 3: Filtered by Dimension

Filter on a dimension using the **internal** WHERE clause (pre-aggregation).

```sql
SELECT * FROM SEMANTIC_VIEW(
    CHAOS_MODEL
    METRICS T_DATA_LOG.NET_REVENUE
    DIMENSIONS REF_ENTITIES.ACC_TYPE_CD
    WHERE REF_ENTITIES.ACC_TYPE_CD = 'EXT'
)
```

Returns NET_REVENUE computed only for external accounts. Using an internal WHERE ensures the metric is aggregated over the correct population.

### Pattern 4: Time Series

Analyze metrics over time.

```sql
SELECT * FROM SEMANTIC_VIEW(
    CHAOS_MODEL
    METRICS T_DATA_LOG.NET_REVENUE
    DIMENSIONS T_DATA_LOG.LOG_DT
)
ORDER BY LOG_DT ASC
```

### Pattern 5: Multiple Metrics

Request multiple metrics at once.

```sql
SELECT * FROM SEMANTIC_VIEW(
    CHAOS_MODEL
    METRICS T_DATA_LOG.NET_REVENUE, T_DATA_LOG.GROSS_REVENUE
    DIMENSIONS REF_ENTITIES.ACC_TYPE_CD
)
```

### Pattern 6: Multiple Dimensions

Group by multiple dimensions.

```sql
SELECT * FROM SEMANTIC_VIEW(
    CHAOS_MODEL
    METRICS T_DATA_LOG.NET_REVENUE
    DIMENSIONS REF_ENTITIES.ACC_TYPE_CD, T_DATA_LOG.LOG_DT
)
ORDER BY LOG_DT ASC, ACC_TYPE_CD
```

### Pattern 7: Complex Filtering

Combine multiple filter conditions using the **internal** WHERE clause.

```sql
SELECT * FROM SEMANTIC_VIEW(
    CHAOS_MODEL
    METRICS T_DATA_LOG.NET_REVENUE
    DIMENSIONS REF_ENTITIES.ACC_TYPE_CD, T_DATA_LOG.LOG_DT
    WHERE REF_ENTITIES.ACC_TYPE_CD = 'EXT'
      AND T_DATA_LOG.LOG_DT >= '2024-01-01'
      AND T_DATA_LOG.LOG_DT < '2025-01-01'
)
ORDER BY LOG_DT ASC
```

### Pattern 8: Post-Aggregation Filter on Metric

Filter results by a computed metric value using the **external** WHERE clause.

```sql
SELECT * FROM SEMANTIC_VIEW(
    tpch_analysis
    DIMENSIONS customer.customer_name
    METRICS orders.average_line_items_per_order,
            orders.order_average_value
)
WHERE average_line_items_per_order > 4
ORDER BY average_line_items_per_order DESC
LIMIT 5
```

### Pattern 9: Using Named Filters

Apply pre-defined business logic filters from the DDL.

```sql
-- Named filters encapsulate complex conditions (e.g., IS_EXTERNAL excludes test accounts)
SELECT * FROM SEMANTIC_VIEW(
    CHAOS_MODEL
    METRICS T_DATA_LOG.NET_REVENUE
    DIMENSIONS REF_ENTITIES.ACC_TYPE_CD
    WHERE REF_ENTITIES.IS_EXTERNAL
)
```

Named filters ensure consistent definitions across all analyses.

### Pattern 10: Aliased Columns

Use aliases to rename output columns.

```sql
SELECT * FROM SEMANTIC_VIEW(
    tpch_analysis
    DIMENSIONS customer.customer_market_segment AS segment
    METRICS orders.order_average_value AS avg_order_value
)
ORDER BY avg_order_value DESC
```

### Pattern 11: Expressions in Dimensions

Use scalar expressions to transform dimensions.

```sql
SELECT * FROM SEMANTIC_VIEW(
    tpch_analysis
    DIMENSIONS DATE_PART('year', orders.order_date) AS order_year
    METRICS orders.order_average_value
)
ORDER BY order_year
```

---

## Common Errors and Fixes

### Error: "Invalid identifier"

**Cause**: Metric or dimension name doesn't match DDL.

**Fix**: Run `GET_DDL('SEMANTIC_VIEW', 'view_name')` and verify exact names and aliases.

### Error: "PRIVATE metric/dimension"

**Cause**: Trying to use a metric/dimension marked as PRIVATE in the DDL.

**Fix**: Use only PUBLIC metrics and dimensions.

### Error: Dimension not reachable

**Cause**: The dimension's logical table has no relationship to the metric's logical table in the semantic view definition.

**Fix**: Check the DDL for defined RELATIONSHIPS. Use dimensions from tables that are related to the metric's table.

### Error: METRICS and FACTS combined

**Cause**: Both METRICS and FACTS clauses used in the same query.

**Fix**: Use one or the other. METRICS for aggregated values, FACTS for row-level data.

---

## Validation Checklist

Before running a SEMANTIC_VIEW query, verify:

- [ ] Using `SEMANTIC_VIEW()` function (not direct SELECT)
- [ ] At least one of METRICS, DIMENSIONS, or FACTS is specified
- [ ] METRICS and FACTS are not combined in the same query
- [ ] Metric names match DDL exactly (including logical table prefix)
- [ ] Dimension names match DDL exactly (including logical table prefix)
- [ ] Dimensions are reachable by every metric in the query (tables are related)
- [ ] Dimension filters use the **internal** WHERE clause (pre-aggregation)
- [ ] External WHERE only filters on computed metric values (post-aggregation)
- [ ] Internal WHERE references only dimensions/facts (not metrics)
- [ ] All referenced metrics/dimensions are PUBLIC (not PRIVATE)
- [ ] No PIVOT, UNPIVOT, window functions, or subqueries inside the function
