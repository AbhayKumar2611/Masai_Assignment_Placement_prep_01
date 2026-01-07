# Database Fundamentals - Day 8

## Theoretical Questions

### 1. What is a database? What are the types of databases?

**Database** is an organized collection of structured data stored electronically in a computer system. It allows for efficient storage, retrieval, and management of data.

**Types of Databases:**

1. **Relational Databases (SQL)**
   - Store data in tables with rows and columns
   - Use SQL (Structured Query Language)
   - Examples: MySQL, PostgreSQL, Oracle, SQL Server, SQLite

2. **NoSQL Databases**
   - **Document Databases**: Store data in document format (JSON, BSON)
     - Examples: MongoDB, CouchDB
   - **Key-Value Stores**: Store data as key-value pairs
     - Examples: Redis, DynamoDB, Memcached
   - **Column-Family Stores**: Store data in columns
     - Examples: Cassandra, HBase
   - **Graph Databases**: Store data in nodes and edges
     - Examples: Neo4j, ArangoDB

3. **In-Memory Databases**
   - Store data in RAM for faster access
   - Examples: Redis, Memcached

4. **Time-Series Databases**
   - Optimized for time-stamped data
   - Examples: InfluxDB, TimescaleDB

5. **Object-Oriented Databases**
   - Store data as objects
   - Examples: ObjectDB, db4o

---

### 2. What is the difference between SQL and NoSQL databases?

| Aspect | SQL Databases | NoSQL Databases |
|--------|---------------|-----------------|
| **Structure** | Relational, table-based | Non-relational, flexible schemas |
| **Schema** | Fixed, predefined schema | Dynamic, schema-less |
| **Query Language** | SQL (Structured Query Language) | Various query languages (often API-based) |
| **ACID Compliance** | Strong ACID guarantees | Often BASE (eventual consistency) |
| **Scalability** | Vertical scaling (scale up) | Horizontal scaling (scale out) |
| **Data Relationships** | Strong support for relationships (joins) | Limited relationship support |
| **Use Cases** | Complex queries, transactions | Large-scale, flexible data |
| **Examples** | MySQL, PostgreSQL, Oracle | MongoDB, Cassandra, Redis |

**Key Differences:**

- **Schema**: SQL requires a fixed schema; NoSQL allows flexible schemas
- **Scaling**: SQL scales vertically; NoSQL scales horizontally
- **Consistency**: SQL prioritizes consistency; NoSQL prioritizes availability
- **Relationships**: SQL supports complex relationships; NoSQL has limited relationship support

---

### 3. When would you choose SQL over NoSQL and vice versa?

#### **Choose SQL When:**

1. **Structured Data**: Data has a well-defined structure and relationships
2. **ACID Requirements**: Need strong consistency and transactional integrity
   - Financial systems, banking, e-commerce transactions
3. **Complex Queries**: Need complex joins, aggregations, and reporting
4. **Data Integrity**: Need strict data validation and constraints
5. **Established Schema**: Schema is stable and unlikely to change frequently
6. **Small to Medium Scale**: Traditional applications with predictable growth

**Examples:**
- Banking systems
- E-commerce platforms
- ERP systems
- Content management systems
- Financial reporting systems

#### **Choose NoSQL When:**

1. **Unstructured/Semi-structured Data**: Data format varies or is unpredictable
2. **High Scalability**: Need to handle massive scale and traffic
   - Social media, IoT, big data
3. **Fast Development**: Need rapid development with flexible schema
4. **Horizontal Scaling**: Need to scale across multiple servers
5. **High Availability**: Can tolerate eventual consistency
6. **Simple Queries**: Simple read/write operations, no complex joins

**Examples:**
- Social media platforms (user profiles, posts)
- Real-time analytics
- Content delivery systems
- IoT data collection
- Caching layers
- Log aggregation

**Hybrid Approach:**
Many modern applications use both:
- SQL for transactional, structured data
- NoSQL for high-volume, flexible data

---

### 4. What is ACID in databases? Explain each property.

**ACID** is an acronym for four key properties that guarantee reliable database transactions:

#### **A - Atomicity**

- **Definition**: A transaction is all-or-nothing
- **Meaning**: Either all operations in a transaction succeed, or all fail
- **Example**: Transferring money from Account A to Account B
  - If debit succeeds but credit fails, the entire transaction is rolled back
  - Both operations must complete or neither does

#### **C - Consistency**

- **Definition**: Database remains in a valid state before and after transaction
- **Meaning**: All data integrity rules and constraints are maintained
- **Example**: 
  - If a constraint says "balance cannot be negative"
  - A transaction that would make balance negative is rejected
  - Database always follows its defined rules

#### **I - Isolation**

- **Definition**: Concurrent transactions don't interfere with each other
- **Meaning**: Transactions execute independently, even when running simultaneously
- **Example**: 
  - Transaction A reads balance = $100
  - Transaction B updates balance to $150
  - Transaction A still sees $100 until it commits
  - Prevents dirty reads, phantom reads, etc.

#### **D - Durability**

- **Definition**: Committed transactions persist even after system failure
- **Meaning**: Once a transaction is committed, it's permanent
- **Example**: 
  - After a successful money transfer, even if the database crashes
  - The transaction remains recorded
  - Data is written to persistent storage (disk)

**Real-World Example - Bank Transfer:**

```sql
BEGIN TRANSACTION;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

- **Atomicity**: Both updates succeed or both fail
- **Consistency**: Balances remain valid (no negative balances)
- **Isolation**: Other transactions don't see partial updates
- **Durability**: Transfer is permanent after commit

---

### 5. What is BASE in NoSQL databases?

**BASE** is an acronym that describes the properties of many NoSQL databases, contrasting with ACID:

#### **BA - Basically Available**

- System remains available even during failures
- No single point of failure
- System continues to operate, possibly with reduced functionality

#### **S - Soft State**

- System state may change over time, even without input
- Data consistency is not guaranteed at all times
- State may be eventually consistent

#### **E - Eventually Consistent**

- System will become consistent over time
- No immediate guarantee of consistency
- After all operations complete, data will be consistent

**BASE vs ACID:**

| ACID | BASE |
|------|------|
| Strong consistency | Eventual consistency |
| Availability sacrificed for consistency | Availability prioritized |
| Pessimistic approach | Optimistic approach |
| Complex transactions | Simple operations |
| SQL databases | NoSQL databases |

**Example - Social Media Feed:**

- User posts a photo → immediately visible to some users
- Photo may take time to appear in all feeds (eventual consistency)
- System remains available even if some servers are down (basically available)
- Feed state may change as more data arrives (soft state)

**Trade-offs:**
- **ACID**: Consistency and reliability, but may be slower
- **BASE**: High availability and performance, but eventual consistency

---

### 6. What is database normalization? Explain 1NF, 2NF, 3NF.

**Database Normalization** is the process of organizing data in a database to:
- Eliminate redundancy
- Reduce data anomalies
- Improve data integrity
- Optimize storage

#### **1NF - First Normal Form**

**Rules:**
- Each column contains atomic (indivisible) values
- Each row is unique
- No repeating groups or arrays

**Example - Before 1NF:**
```
StudentID | Name      | Courses
----------|-----------|------------------
1         | John      | Math, Science, English
2         | Jane      | Math, History
```

**After 1NF:**
```
StudentID | Name      | Course
----------|-----------|----------
1         | John      | Math
1         | John      | Science
1         | John      | English
2         | Jane      | Math
2         | Jane      | History
```

#### **2NF - Second Normal Form**

**Rules:**
- Must be in 1NF
- All non-key attributes fully depend on the primary key
- No partial dependencies

**Example - Before 2NF:**
```
OrderID | ProductID | ProductName | Quantity | Price
--------|-----------|-------------|----------|-------
1       | 101       | Laptop      | 2        | 999
1       | 102       | Mouse       | 1        | 29
2       | 101       | Laptop      | 1        | 999
```

**Problem:** ProductName depends only on ProductID, not OrderID (partial dependency)

**After 2NF:**
```
Orders Table:
OrderID | ProductID | Quantity
--------|-----------|----------
1       | 101       | 2
1       | 102       | 1
2       | 101       | 1

Products Table:
ProductID | ProductName | Price
----------|-------------|-------
101       | Laptop      | 999
102       | Mouse       | 29
```

#### **3NF - Third Normal Form**

**Rules:**
- Must be in 2NF
- No transitive dependencies
- Non-key attributes don't depend on other non-key attributes

**Example - Before 3NF:**
```
StudentID | Name    | Department | DepartmentHead
----------|---------|------------|----------------
1         | John    | CS         | Dr. Smith
2         | Jane    | CS         | Dr. Smith
3         | Bob     | Math       | Dr. Jones
```

**Problem:** DepartmentHead depends on Department, not directly on StudentID (transitive dependency)

**After 3NF:**
```
Students Table:
StudentID | Name    | DepartmentID
----------|---------|-------------
1         | John    | 1
2         | Jane    | 1
3         | Bob     | 2

Departments Table:
DepartmentID | Department | DepartmentHead
-------------|------------|----------------
1            | CS         | Dr. Smith
2            | Math       | Dr. Jones
```

**Higher Normal Forms:**
- **BCNF (Boyce-Codd Normal Form)**: Stricter version of 3NF
- **4NF**: Eliminates multi-valued dependencies
- **5NF**: Eliminates join dependencies

**Benefits of Normalization:**
- Reduces data redundancy
- Prevents update anomalies
- Saves storage space
- Maintains data integrity

**Drawbacks:**
- More complex queries (more joins)
- Potential performance impact
- May require denormalization for performance

---

### 7. What is denormalization? When would you denormalize data?

**Denormalization** is the process of intentionally adding redundancy to a normalized database to improve read performance.

**Purpose:**
- Reduce the number of joins needed
- Speed up read operations
- Trade storage space for query performance

#### **When to Denormalize:**

1. **Read-Heavy Applications**
   - Applications with many more reads than writes
   - Example: Analytics dashboards, reporting systems

2. **Performance Critical Queries**
   - Queries that are too slow with normalized structure
   - Example: Complex joins across multiple tables

3. **Data Warehouses**
   - Analytical databases optimized for reporting
   - Example: Star schema, snowflake schema

4. **Caching Strategies**
   - Store computed/aggregated values
   - Example: Storing total order amount instead of calculating each time

5. **Real-Time Systems**
   - Systems requiring fast response times
   - Example: Real-time analytics, dashboards

**Denormalization Techniques:**

1. **Duplicate Data**
   ```sql
   -- Instead of joining, store customer name in orders table
   Orders Table:
   OrderID | CustomerID | CustomerName | Total
   ```

2. **Computed Columns**
   ```sql
   -- Store total instead of calculating
   Orders Table:
   OrderID | ItemCount | TotalAmount
   ```

3. **Materialized Views**
   - Pre-computed query results stored as tables

4. **Flattened Structures**
   - Combine related tables into one

**Example - E-commerce:**

**Normalized:**
```sql
Orders: OrderID, CustomerID, Date
OrderItems: OrderID, ProductID, Quantity, Price
Products: ProductID, Name, Category
```

**Denormalized (for reporting):**
```sql
OrderSummary: OrderID, CustomerID, CustomerName, 
              ProductName, Category, Quantity, Price, Total
```

**Trade-offs:**

| Pros | Cons |
|------|------|
| Faster reads | More storage space |
| Simpler queries | Data redundancy |
| Better performance | Update anomalies risk |
| Reduced joins | More complex updates |

**Best Practices:**
- Denormalize only when necessary
- Document denormalization decisions
- Keep normalized source of truth
- Use triggers/application logic to maintain consistency

---

### 8. What are database indexes? How do they improve performance?

**Database Index** is a data structure that improves the speed of data retrieval operations on a database table.

**Analogy:** Like an index in a book - instead of reading every page, you look up the index to find the page number.

#### **How Indexes Work:**

1. **Without Index (Full Table Scan):**
   ```
   Query: SELECT * FROM users WHERE email = 'john@example.com'
   Database scans all rows sequentially → O(n) time
   ```

2. **With Index:**
   ```
   Index on email column creates a sorted structure
   Database uses index to find row directly → O(log n) time
   ```

#### **Types of Indexes:**

1. **Primary Index**
   - Automatically created on primary key
   - Unique and sorted

2. **Secondary Index**
   - Created on non-primary key columns
   - Can be unique or non-unique

3. **Composite Index**
   - Index on multiple columns
   - Example: `CREATE INDEX idx_name ON users(first_name, last_name)`

4. **Unique Index**
   - Ensures uniqueness of indexed column(s)

5. **Clustered Index**
   - Determines physical order of data
   - Only one per table (usually primary key)

6. **Non-Clustered Index**
   - Separate structure pointing to data
   - Multiple per table

#### **How They Improve Performance:**

1. **Faster Searches**
   - Binary search instead of linear search
   - Example: Finding a row in 1 million rows
     - Without index: ~500,000 comparisons
     - With index: ~20 comparisons

2. **Faster Sorting**
   - Index is already sorted
   - `ORDER BY` operations are faster

3. **Faster Joins**
   - Foreign key indexes speed up join operations

4. **Unique Constraints**
   - Enforce uniqueness efficiently

**Example:**

```sql
-- Create index
CREATE INDEX idx_email ON users(email);

-- Query benefits from index
SELECT * FROM users WHERE email = 'john@example.com';
-- Fast: Uses index to find row directly

-- Without index, database would scan all rows
```

**Performance Impact:**

| Operation | Without Index | With Index |
|-----------|---------------|------------|
| Search | O(n) | O(log n) |
| Insert | O(1) | O(log n) |
| Update | O(1) | O(log n) |
| Delete | O(1) | O(log n) |

---

### 9. What are the trade-offs of using indexes?

#### **Benefits (Pros):**

1. **Faster Queries**
   - Dramatically faster SELECT operations
   - Especially for WHERE, JOIN, ORDER BY clauses

2. **Faster Sorting**
   - Pre-sorted data structure
   - ORDER BY operations are optimized

3. **Unique Constraints**
   - Efficient uniqueness enforcement
   - Prevents duplicate values

4. **Better Join Performance**
   - Foreign key indexes speed up joins

#### **Drawbacks (Cons):**

1. **Storage Space**
   - Indexes require additional disk space
   - Can be 10-20% of table size or more
   - Multiple indexes multiply storage needs

2. **Slower Writes**
   - INSERT, UPDATE, DELETE operations are slower
   - Database must update index structures
   - More indexes = slower writes

3. **Maintenance Overhead**
   - Indexes need to be maintained
   - Rebuilding indexes can be time-consuming
   - Fragmentation over time

4. **Memory Usage**
   - Indexes are often loaded into memory
   - Can consume significant RAM

5. **Over-Indexing**
   - Too many indexes can hurt performance
   - Database optimizer may choose wrong index
   - Maintenance overhead increases

**Example Trade-offs:**

```sql
-- Table with 1 million rows
-- Index on email column

INSERT INTO users (email, name) VALUES ('new@example.com', 'New User');
-- Without index: Fast insert
-- With index: Slightly slower (must update index)

SELECT * FROM users WHERE email = 'new@example.com';
-- Without index: Slow (scans 1M rows)
-- With index: Fast (direct lookup)
```

**When to Use Indexes:**

✅ **Use indexes for:**
- Frequently queried columns
- Columns in WHERE clauses
- Foreign keys (for joins)
- Columns in ORDER BY
- Columns with high selectivity (many unique values)

❌ **Avoid indexes for:**
- Rarely queried columns
- Frequently updated columns
- Small tables
- Columns with low selectivity (few unique values, like boolean)
- Columns with NULL values (unless needed)

**Best Practices:**

1. **Index Primary Keys** - Always (automatic)
2. **Index Foreign Keys** - Usually beneficial
3. **Index Frequently Queried Columns** - Yes
4. **Limit Number of Indexes** - Balance read vs write performance
5. **Monitor Index Usage** - Remove unused indexes
6. **Consider Composite Indexes** - For multi-column queries

**Example - Balanced Approach:**

```sql
-- Good: Index on frequently queried column
CREATE INDEX idx_email ON users(email);

-- Good: Composite index for common query pattern
CREATE INDEX idx_name ON users(first_name, last_name);

-- Bad: Index on rarely queried column
CREATE INDEX idx_created_at ON users(created_at); -- Only if frequently queried

-- Bad: Too many indexes
-- 10+ indexes on a table can hurt write performance
```

---

### 10. What is a primary key? What is a foreign key?

#### **Primary Key**

**Definition:** A column (or set of columns) that uniquely identifies each row in a table.

**Characteristics:**
- **Unique**: No two rows can have the same primary key value
- **Not NULL**: Primary key cannot be null
- **Immutable**: Should not change (best practice)
- **One per table**: Each table has exactly one primary key
- **Automatically indexed**: Most databases create index on primary key

**Example:**

```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  email VARCHAR(100)
);

-- id is the primary key
-- Each user has a unique id
```

**Composite Primary Key:**

```sql
CREATE TABLE order_items (
  order_id INT,
  product_id INT,
  quantity INT,
  PRIMARY KEY (order_id, product_id)
);

-- Combination of order_id and product_id is unique
```

#### **Foreign Key**

**Definition:** A column (or set of columns) in one table that references the primary key of another table.

**Characteristics:**
- **References Primary Key**: Points to primary key in another table
- **Maintains Referential Integrity**: Ensures data consistency
- **Can be NULL**: Foreign keys can be null (optional relationship)
- **Multiple per table**: A table can have multiple foreign keys
- **Cascade Options**: Can define what happens on delete/update

**Example:**

```sql
-- Users table (parent)
CREATE TABLE users (
  id INT PRIMARY KEY,
  username VARCHAR(50)
);

-- Posts table (child)
CREATE TABLE posts (
  id INT PRIMARY KEY,
  user_id INT,
  title VARCHAR(200),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- user_id is a foreign key referencing users.id
```

**Foreign Key Constraints:**

1. **RESTRICT** (Default)
   - Prevents deletion of referenced row
   ```sql
   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
   ```

2. **CASCADE**
   - Deletes/updates child rows when parent is deleted/updated
   ```sql
   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
   ```

3. **SET NULL**
   - Sets foreign key to NULL when parent is deleted
   ```sql
   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
   ```

4. **NO ACTION**
   - Similar to RESTRICT, but checked at end of transaction

**Example - Complete Relationship:**

```sql
-- Parent table
CREATE TABLE departments (
  id INT PRIMARY KEY,
  name VARCHAR(100)
);

-- Child table
CREATE TABLE employees (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES departments(id) 
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
```

**Benefits of Foreign Keys:**

1. **Data Integrity**: Prevents orphaned records
2. **Referential Integrity**: Ensures relationships are valid
3. **Cascade Operations**: Automatic cleanup on delete/update
4. **Documentation**: Shows relationships between tables

**Example - Without Foreign Key (Bad):**

```sql
-- No foreign key constraint
INSERT INTO posts (user_id, title) VALUES (999, 'Test');
-- This succeeds even if user 999 doesn't exist!
-- Creates orphaned record
```

**Example - With Foreign Key (Good):**

```sql
-- With foreign key constraint
INSERT INTO posts (user_id, title) VALUES (999, 'Test');
-- ERROR: Foreign key constraint violation
-- Cannot insert post for non-existent user
```

**Summary:**

| Feature | Primary Key | Foreign Key |
|---------|-------------|-------------|
| Purpose | Uniquely identify row | Reference another table |
| Uniqueness | Must be unique | Can have duplicates |
| NULL | Cannot be NULL | Can be NULL |
| Count | One per table | Multiple per table |
| Index | Automatically indexed | Usually indexed |
| Example | `id INT PRIMARY KEY` | `user_id INT REFERENCES users(id)` |

---

## Machine Coding Question: Blog Data Model

This project implements an **in-memory data model** for a blog system with Users, Posts, and Comments.

### Features

✅ **Data Models:**
- Users (id, username, email, name, createdAt)
- Posts (id, userId, title, content, createdAt, updatedAt)
- Comments (id, userId, postId, content, createdAt, updatedAt)

✅ **CRUD Operations:**
- Create, Read, Update, Delete for all entities
- Query by various criteria

✅ **Relationships:**
- User → Posts (one-to-many)
- Post → Comments (one-to-many)
- User → Comments (one-to-many)

✅ **Cascading Deletes:**
- Delete user → deletes all posts → deletes all comments
- Delete post → deletes all comments
- Maintains referential integrity

✅ **Query Functions:**
- Query users by username, email, name
- Query posts by userId, title, content, date range
- Query comments by userId, postId, content
- Get posts with all comments
- Get user with all posts and comments

✅ **Indexes:**
- User-Posts index for fast lookup
- Post-Comments index for fast lookup
- User-Comments index for fast lookup

### How to Run

```bash
npm install
npm start
```

### Example Usage

```javascript
const BlogDatabase = require('./models/BlogDatabase');
const db = new BlogDatabase();

// Create user
const user = db.createUser({
  username: 'john_doe',
  email: 'john@example.com',
  name: 'John Doe'
});

// Create post
const post = db.createPost({
  userId: user.id,
  title: 'My First Post',
  content: 'This is my first blog post...'
});

// Create comment
const comment = db.createComment({
  userId: user.id,
  postId: post.id,
  content: 'Great post!'
});

// Query operations
const userPosts = db.getPostsByUserId(user.id);
const postComments = db.getCommentsByPostId(post.id);
const postWithComments = db.getPostWithComments(post.id);

// Cascading delete
db.deletePost(post.id); // Also deletes all comments
db.deleteUser(user.id); // Also deletes all posts and comments
```

### Data Structure Design

- **Maps for Storage**: O(1) lookup time
- **Indexes**: Separate indexes for relationships
- **Immutable Returns**: Functions return copies to prevent mutation
- **Auto-increment IDs**: Automatic ID generation
- **Validation**: Checks for required fields and existence

### Architecture

```
BlogDatabase
├── Storage (Maps)
│   ├── users: Map<userId, User>
│   ├── posts: Map<postId, Post>
│   └── comments: Map<commentId, Comment>
├── Indexes
│   ├── userPostsIndex: Map<userId, Set<postId>>
│   ├── postCommentsIndex: Map<postId, Set<commentId>>
│   └── userCommentsIndex: Map<userId, Set<commentId>>
└── Operations
    ├── CRUD operations
    ├── Query operations
    ├── Relationship queries
    └── Cascading deletes
```

