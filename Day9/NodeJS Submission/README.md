# Simple Query Optimizer

A Node.js module that analyzes query patterns and suggests composite indexes. Includes a simple caching layer for storing query results.

## Features

- **Query Pattern Analysis**: Records and analyzes query patterns to identify frequently used field combinations
- **Index Recommendations**: Suggests composite indexes based on query frequency and patterns
- **Caching Layer**: Simple in-memory cache with TTL (Time-To-Live) support for query results
- **Statistics**: Provides insights into query patterns and cache performance

## Installation

```bash
npm install
```

## Usage

See `example.js` for detailed usage examples.

```javascript
const QueryOptimizer = require("./queryOptimizer");

const optimizer = new QueryOptimizer({
  cacheTTL: 5 * 60 * 1000, // 5 minutes
  maxCacheSize: 100,
  minFrequency: 3, // Recommend index after 3 occurrences
});

// Record query patterns
optimizer.recordQuery({ status: "active", role: "admin" }, { table: "users" });

// Get index recommendations
const recommendations = optimizer.suggestIndexes();

// Use caching
const result = await optimizer.executeQuery(
  "cache-key",
  () => fetchFromDatabase(),
  { status: "active" },
  { table: "users" }
);
```

## Running Examples

```bash
npm start
# or
node example.js
```

---

# Theoretical Questions

## 1. What is database scaling? Explain vertical vs horizontal scaling.

**Database Scaling** is the process of increasing a database's capacity to handle more load, data, or users.

### Vertical Scaling (Scale Up)

- **Definition**: Adding more resources (CPU, RAM, storage) to a single server
- **How it works**: Upgrade hardware on the existing machine
- **Pros**: Simple, no code changes needed, maintains consistency
- **Cons**: Physical limits, expensive, single point of failure
- **Example**: Upgrading from 16GB to 64GB RAM

### Horizontal Scaling (Scale Out)

- **Definition**: Adding more servers/machines to distribute the load
- **How it works**: Add more database instances and distribute data/load
- **Pros**: Unlimited scaling, cost-effective, better fault tolerance
- **Cons**: More complex, requires code changes, data consistency challenges
- **Example**: Adding 3 more database servers to handle increased traffic

---

## 2. What is database replication? Explain master-slave replication.

**Database Replication** is the process of copying and maintaining database objects across multiple database instances.

### Master-Slave Replication

- **Master (Primary)**: Handles all write operations (INSERT, UPDATE, DELETE)
- **Slave (Replica)**: Receives copies of data changes from master, handles read operations

### How it works:

1. Write operations go to master
2. Master logs changes (binary log)
3. Slaves connect to master and copy changes
4. Reads can be distributed across slaves for better performance

### Benefits:

- **Read Scaling**: Multiple slaves handle read queries
- **High Availability**: If master fails, a slave can be promoted
- **Backup**: Slaves serve as live backups
- **Geographic Distribution**: Slaves can be in different regions

### Limitations:

- Replication lag (slaves may be slightly behind)
- Slaves are read-only (writes only on master)

---

## 3. What is database sharding? How does it work?

**Database Sharding** is a method of distributing data across multiple databases (shards) based on a shard key.

### How it works:

1. **Choose a shard key**: A field used to determine which shard stores the data (e.g., user_id, country)
2. **Partition data**: Split data into logical groups (shards)
3. **Route queries**: Application determines which shard to query based on shard key
4. **Distribute load**: Each shard handles a subset of data

### Example:

- **Shard 1**: Users with IDs 1-1000
- **Shard 2**: Users with IDs 1001-2000
- **Shard 3**: Users with IDs 2001-3000

When querying user 1500, application routes to Shard 2.

### Benefits:

- **Horizontal scaling**: Add more shards as data grows
- **Improved performance**: Smaller datasets per shard
- **Isolation**: Failure in one shard doesn't affect others

---

## 4. What are the challenges of sharding?

1. **Complexity**: Application must know which shard to query
2. **Cross-shard queries**: Queries spanning multiple shards are slow and complex
3. **Rebalancing**: Moving data between shards when growth is uneven
4. **Shard key selection**: Poor choice leads to hot spots and uneven distribution
5. **Join operations**: Difficult to join data across shards
6. **Transaction consistency**: Maintaining ACID properties across shards is challenging
7. **Operational overhead**: Managing multiple databases, monitoring, backups
8. **Data migration**: Moving data when rebalancing or adding shards

---

## 5. What is database partitioning? How does it differ from sharding?

**Database Partitioning** splits a single database table into smaller, manageable pieces (partitions) within the same database instance.

### Types:

- **Horizontal Partitioning**: Rows split based on criteria (e.g., date ranges)
- **Vertical Partitioning**: Columns split into different tables

### Partitioning vs Sharding:

| Aspect           | Partitioning              | Sharding                           |
| ---------------- | ------------------------- | ---------------------------------- |
| **Location**     | Same database instance    | Different servers/machines         |
| **Transparency** | Database handles routing  | Application handles routing        |
| **Complexity**   | Lower (DBMS manages)      | Higher (application logic)         |
| **Network**      | No network calls          | Requires network calls             |
| **Scaling**      | Limited by single machine | Unlimited (add more machines)      |
| **Example**      | Table partitioned by year | Users table split across 3 servers |

### Partitioning Example:

```sql
CREATE TABLE orders (
  id INT,
  order_date DATE,
  amount DECIMAL
) PARTITION BY RANGE (YEAR(order_date)) (
  PARTITION p2022 VALUES LESS THAN (2023),
  PARTITION p2023 VALUES LESS THAN (2024),
  PARTITION p2024 VALUES LESS THAN (2025)
);
```

---

## 6. What is a connection pool? Why is it important?

**Connection Pool** is a cache of database connections maintained so that connections can be reused rather than creating new ones for each request.

### How it works:

- Application creates a pool of pre-established database connections at startup
- When a request needs a connection, it borrows one from the pool
- After the request completes, connection returns to the pool for reuse
- Pool manages maximum connections, idle timeouts, etc.

### Why it's important:

1. **Performance**: Creating connections is expensive (network, authentication). Reusing saves time
2. **Resource management**: Limits number of connections (database has connection limits)
3. **Efficiency**: Reduces overhead of establishing/closing connections repeatedly
4. **Scalability**: Better resource utilization under high load

### Example:

```javascript
// Without pool: Creates new connection for each request
// With pool: Reuses existing connections
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "password",
  database: "mydb",
});
```

---

## 7. What are N+1 queries? How do you solve this problem?

**N+1 Query Problem** occurs when an application executes 1 query to fetch a list of records (N records), and then executes N additional queries (one per record) to fetch related data.

### Example:

```javascript
// 1 query to get all users
const users = await User.findAll();

// N queries (one for each user) to get their posts
for (const user of users) {
  const posts = await Post.findAll({ where: { userId: user.id } });
}
```

### Solutions:

1. **Eager Loading (JOIN)**: Fetch related data in one query

   ```javascript
   const users = await User.findAll({
     include: [{ model: Post }], // Single query with JOIN
   });
   ```

2. **Batch Loading**: Fetch all related data in one query, then map

   ```javascript
   const users = await User.findAll();
   const userIds = users.map((u) => u.id);
   const allPosts = await Post.findAll({ where: { userId: userIds } });
   // Map posts to users in memory
   ```

3. **Database-level JOINs**: Use SQL JOINs in raw queries

---

## 8. What is caching? Explain different caching strategies (cache-aside, write-through, write-back).

**Caching** stores frequently accessed data in fast storage (memory) to reduce database load and improve response times.

### Caching Strategies:

#### 1. Cache-Aside (Lazy Loading)

- **Read**: Check cache first. If miss, read from DB and update cache
- **Write**: Write to DB, then invalidate/update cache
- **Pros**: Simple, cache only contains requested data
- **Cons**: Cache miss overhead, potential inconsistency

```
Read: App → Cache (miss) → DB → Update Cache → Return
Write: App → DB → Invalidate Cache
```

#### 2. Write-Through

- **Read**: Check cache first, if miss read from DB
- **Write**: Write to both cache and DB simultaneously
- **Pros**: Always consistent, cache always up-to-date
- **Cons**: Write latency (must wait for DB)

```
Write: App → Cache → DB (wait for both) → Return
```

#### 3. Write-Back (Write-Behind)

- **Read**: Check cache first, if miss read from DB
- **Write**: Write to cache immediately, write to DB asynchronously later
- **Pros**: Fast writes, good for high write workloads
- **Cons**: Risk of data loss if cache fails before DB write, complex

```
Write: App → Cache (return immediately) → DB (async later)
```

---

## 9. What is the CAP theorem?

**CAP Theorem** states that a distributed system can guarantee at most two of these three properties:

- **C (Consistency)**: All nodes see the same data simultaneously
- **A (Availability)**: System remains operational (responds to requests)
- **P (Partition Tolerance)**: System continues despite network failures

### Implications:

- **CP**: Consistency + Partition Tolerance (sacrifices availability)
  - Example: Traditional databases (PostgreSQL cluster)
- **AP**: Availability + Partition Tolerance (sacrifices consistency)
  - Example: DNS, NoSQL (Cassandra, DynamoDB)
- **CA**: Consistency + Availability (sacrifices partition tolerance)
  - Not practical for distributed systems (single-node systems only)

### Real-world:

Most distributed systems choose **AP** or **CP**. **CA** is not feasible in distributed environments where network partitions occur.

---

## 10. What are database transactions? What is MVCC (Multi-Version Concurrency Control)?

### Database Transactions

**Transaction** is a sequence of database operations executed as a single unit that must either fully complete (commit) or fully fail (rollback).

### ACID Properties:

- **Atomicity**: All or nothing (either all operations succeed or none)
- **Consistency**: Database remains in valid state after transaction
- **Isolation**: Concurrent transactions don't interfere with each other
- **Durability**: Committed changes persist even after system failure

### Example:

```sql
BEGIN TRANSACTION;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT; -- Both succeed or both fail
```

### MVCC (Multi-Version Concurrency Control)

**MVCC** allows multiple transactions to access the same data simultaneously without blocking each other by maintaining multiple versions of data.

### How it works:

1. Each write creates a new version of the row (old version retained)
2. Transactions read the version that was current when they started
3. Read operations don't block write operations (and vice versa)
4. When transaction commits, it checks if the data it read was modified

### Benefits:

- **Non-blocking reads**: Readers don't block writers
- **Snapshot isolation**: Each transaction sees a consistent snapshot
- **Better concurrency**: Higher throughput than locking mechanisms

### Example (PostgreSQL):

- Transaction 1 reads row at time T1
- Transaction 2 updates same row at time T2
- Transaction 1 continues reading the old version (no conflict)
- On commit, Transaction 1 checks if its snapshot is still valid

### Isolation Levels with MVCC:

- **Read Uncommitted**: No isolation
- **Read Committed**: Each query sees committed data
- **Repeatable Read**: Transaction sees same snapshot throughout
- **Serializable**: Highest isolation, prevents all anomalies

---

## License

ISC
