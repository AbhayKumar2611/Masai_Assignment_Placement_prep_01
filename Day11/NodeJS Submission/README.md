# Search & Filter API

An Express API with MongoDB that implements advanced filtering, text search, sorting, and pagination for a product collection.

## Features

- **Advanced Filtering**: Price range, categories, ratings, stock status, brand
- **Text Search**: Full-text search across product name and description
- **Sorting**: Sort by any field (name, price, rating, createdAt) in ascending/descending order
- **Pagination**: Efficient pagination with metadata (current page, total pages, has next/prev)
- **Query Performance Analysis**: Analyze query execution using `explain()`
- **Indexing Strategy**: Optimized indexes for common query patterns

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file based on `.env.example`:

```env
MONGO_URL=mongodb://localhost:27017/productsDB
PORT=3000
NODE_ENV=development
```

## Running the Server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Health Check
```
GET /health
```

### Get All Products
```
GET /api/products?page=1&limit=10
```

### Search & Filter Products
```
GET /api/products/search?search=laptop&category=Electronics&minPrice=100&maxPrice=500&minRating=4&sortBy=price&sortOrder=asc&page=1&limit=20
```

**Query Parameters:**
- `search`: Text search query (searches name and description)
- `category`: Filter by category (Electronics, Clothing, Books, Home, Sports, Toys)
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `minRating`: Minimum rating filter (0-5)
- `maxRating`: Maximum rating filter (0-5)
- `inStock`: Filter by stock availability (true/false)
- `brand`: Filter by brand name (case-insensitive)
- `sortBy`: Field to sort by (name, price, rating, createdAt)
- `sortOrder`: Sort order (asc/desc)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

### Analyze Query Performance
```
GET /api/products/search/analyze?category=Electronics&minPrice=100&maxPrice=500
```

### Get Product by ID
```
GET /api/products/:id
```

### Create Product
```
POST /api/products
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product description",
  "category": "Electronics",
  "price": 299.99,
  "rating": 4.5,
  "inStock": true,
  "brand": "Brand Name",
  "tags": ["tag1", "tag2"]
}
```

## Example Requests

### Search with filters
```bash
curl "http://localhost:3000/api/products/search?search=laptop&category=Electronics&minPrice=500&maxPrice=2000&minRating=4&sortBy=rating&sortOrder=desc&page=1&limit=10"
```

### Filter by price range and category
```bash
curl "http://localhost:3000/api/products/search?category=Clothing&minPrice=50&maxPrice=200&sortBy=price&sortOrder=asc"
```

### Text search only
```bash
curl "http://localhost:3000/api/products/search?search=wireless&page=1&limit=20"
```

## Indexing Strategy

The implementation includes a comprehensive indexing strategy:

1. **Compound Index**: `{ category: 1, price: 1, rating: -1 }`
   - Optimizes queries filtering by category, price range, and sorting by rating

2. **Text Index**: `{ name: "text", description: "text" }`
   - Enables full-text search across product name and description

3. **Single Field Indexes**: Individual indexes on frequently queried fields
   - `name`, `category`, `price`, `rating`, `inStock`, `brand`, `createdAt`

4. **Compound Indexes for Common Patterns**:
   - `{ category: 1, inStock: 1 }` - for filtering available products by category
   - `{ price: 1, rating: -1 }` - for sorting by price then rating

See `models/product.model.js` for detailed indexing strategy comments.

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

---

# Theoretical Questions

## 1. What are the different types of queries in MongoDB?

**MongoDB queries** are categorized into several types:

### Read Operations
- **Find Queries**: Retrieve documents matching criteria (`find()`, `findOne()`)
- **Count Queries**: Count documents matching criteria (`countDocuments()`)
- **Aggregation Queries**: Complex data processing pipelines (`aggregate()`)
- **Distinct Queries**: Get unique values for a field (`distinct()`)

### Write Operations
- **Insert Queries**: Add new documents (`insertOne()`, `insertMany()`)
- **Update Queries**: Modify existing documents (`updateOne()`, `updateMany()`, `findOneAndUpdate()`)
- **Delete Queries**: Remove documents (`deleteOne()`, `deleteMany()`, `findOneAndDelete()`)
- **Replace Queries**: Replace entire documents (`replaceOne()`)

### Special Queries
- **Text Search**: Full-text search queries (`$text`)
- **Geospatial Queries**: Location-based queries (`$near`, `$geoWithin`)
- **Array Queries**: Query array fields (`$elemMatch`, `$size`)

---

## 2. Explain projection in MongoDB queries.

**Projection** is selecting specific fields to return from documents, reducing network transfer and improving performance.

### Syntax
```javascript
db.collection.find({ filter }, { field1: 1, field2: 1, _id: 0 })
```

### Examples
```javascript
// Include only name and price
db.products.find({}, { name: 1, price: 1 })

// Exclude description field
db.products.find({}, { description: 0 })

// Exclude _id
db.products.find({}, { name: 1, price: 1, _id: 0 })

// Mixed projection (1 to include, 0 to exclude)
// Note: Cannot mix inclusion and exclusion (except _id)
```

### Benefits
- **Reduced Network Traffic**: Transfer only needed data
- **Better Performance**: Less data to process
- **Memory Efficiency**: Store only required fields in memory

---

## 3. What are comparison operators in MongoDB ($eq, $gt, $lt, $in, etc.)?

**Comparison operators** are used to compare field values in queries.

### Common Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$eq` | Equal to | `{ price: { $eq: 100 } }` or `{ price: 100 }` |
| `$ne` | Not equal to | `{ status: { $ne: "inactive" } }` |
| `$gt` | Greater than | `{ price: { $gt: 100 } }` |
| `$gte` | Greater than or equal | `{ price: { $gte: 100 } }` |
| `$lt` | Less than | `{ price: { $lt: 1000 } }` |
| `$lte` | Less than or equal | `{ price: { $lte: 1000 } }` |
| `$in` | Matches any value in array | `{ category: { $in: ["Electronics", "Clothing"] } }` |
| `$nin` | Not in array | `{ status: { $nin: ["deleted", "archived"] } }` |
| `$regex` | Regular expression match | `{ name: { $regex: /laptop/i } }` |
| `$exists` | Field exists | `{ description: { $exists: true } }` |
| `$type` | Field type check | `{ price: { $type: "number" } }` |

### Examples
```javascript
// Price range
{ price: { $gte: 100, $lte: 500 } }

// Multiple categories
{ category: { $in: ["Electronics", "Books"] } }

// Pattern matching
{ name: { $regex: "laptop", $options: "i" } }
```

---

## 4. What are logical operators ($and, $or, $not)?

**Logical operators** combine multiple conditions in queries.

### Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$and` | All conditions must be true | `{ $and: [{ price: { $gt: 100 } }, { rating: { $gte: 4 } }] }` |
| `$or` | At least one condition must be true | `{ $or: [{ category: "Electronics" }, { category: "Books" }] }` |
| `$not` | Negates condition | `{ price: { $not: { $gt: 1000 } } }` |
| `$nor` | None of the conditions are true | `{ $nor: [{ status: "inactive" }, { deleted: true }] }` |

### Examples
```javascript
// AND (implicit in same object)
{ price: { $gt: 100 }, rating: { $gte: 4 } }

// OR
{ $or: [
  { category: "Electronics" },
  { price: { $lt: 50 } }
]}

// Complex combination
{ $and: [
  { $or: [{ category: "Electronics" }, { category: "Books" }] },
  { price: { $gte: 100, $lte: 500 } },
  { rating: { $gte: 4 } }
]}
```

---

## 5. Explain update operators ($set, $unset, $inc, $push, $pull).

**Update operators** modify document fields during update operations.

### Common Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$set` | Set field value | `{ $set: { name: "New Name", price: 199 } }` |
| `$unset` | Remove field | `{ $unset: { oldField: "" } }` |
| `$inc` | Increment/decrement numeric value | `{ $inc: { quantity: 1 } }` or `{ $inc: { quantity: -5 } }` |
| `$push` | Add element to array | `{ $push: { tags: "new-tag" } }` |
| `$pull` | Remove matching elements from array | `{ $pull: { tags: "old-tag" } }` |
| `$pullAll` | Remove all matching elements | `{ $pullAll: { tags: ["tag1", "tag2"] } }` |
| `$pop` | Remove first/last element | `{ $pop: { tags: 1 } }` (last) or `{ $pop: { tags: -1 } }` (first) |
| `$addToSet` | Add to array if not exists | `{ $addToSet: { tags: "unique-tag" } }` |
| `$mul` | Multiply numeric value | `{ $mul: { price: 1.1 } }` (10% increase) |
| `$min` | Set if new value is less | `{ $min: { lowestPrice: 99 } }` |
| `$max` | Set if new value is greater | `{ $max: { highestPrice: 299 } }` |
| `$rename` | Rename field | `{ $rename: { oldName: "newName" } }` |

### Examples
```javascript
// Update single field
{ $set: { price: 299.99 } }

// Update multiple fields
{ $set: { price: 299.99, inStock: true } }

// Increment quantity
{ $inc: { quantity: 1 } }

// Add to array
{ $push: { tags: "electronics" } }

// Remove from array
{ $pull: { tags: "old-tag" } }

// Remove field
{ $unset: { oldField: "" } }
```

---

## 6. What are indexes in MongoDB? What types of indexes exist?

**Indexes** are data structures that improve query performance by allowing MongoDB to find documents without scanning entire collections.

### Benefits
- **Faster Queries**: Reduce query execution time
- **Efficient Sorting**: Speed up sort operations
- **Unique Constraints**: Enforce uniqueness on fields

### Types of Indexes

1. **Single Field Index**: Index on one field
   ```javascript
   db.products.createIndex({ price: 1 })
   ```

2. **Compound Index**: Index on multiple fields
   ```javascript
   db.products.createIndex({ category: 1, price: 1 })
   ```

3. **Text Index**: Full-text search index
   ```javascript
   db.products.createIndex({ name: "text", description: "text" })
   ```

4. **Geospatial Index**: Location-based queries
   ```javascript
   db.places.createIndex({ location: "2dsphere" })
   ```

5. **Hashed Index**: Hash-based indexes for sharding
   ```javascript
   db.products.createIndex({ _id: "hashed" })
   ```

6. **TTL Index**: Automatically delete documents after expiration
   ```javascript
   db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 })
   ```

7. **Sparse Index**: Only indexes documents with the field
   ```javascript
   db.products.createIndex({ optionalField: 1 }, { sparse: true })
   ```

8. **Partial Index**: Index only documents matching filter
   ```javascript
   db.products.createIndex({ price: 1 }, { partialFilterExpression: { inStock: true } })
   ```

9. **Unique Index**: Enforce uniqueness
   ```javascript
   db.products.createIndex({ email: 1 }, { unique: true })
   ```

---

## 7. How do you create a compound index? What is index order?

**Compound indexes** are indexes on multiple fields, optimized for queries filtering/sorting on those fields.

### Creating Compound Index
```javascript
db.products.createIndex({ category: 1, price: 1, rating: -1 })
```

### Index Order Matters

**Left-to-Right Rule**: Index order is critical. MongoDB can use a compound index for queries that match fields from left to right.

```javascript
// Index: { category: 1, price: 1, rating: -1 }

// ✅ Efficient (matches left to right)
{ category: "Electronics", price: { $gte: 100 } }
{ category: "Electronics", price: { $gte: 100 }, rating: -1 }

// ⚠️ Less efficient (skips middle field)
{ category: "Electronics", rating: -1 }

// ❌ Inefficient (doesn't start with first field)
{ price: { $gte: 100 }, rating: -1 }
```

### ESR Rule (Equality, Sort, Range)

For optimal compound indexes:
1. **Equality** fields first (`category`)
2. **Sort** fields next (`rating`)
3. **Range** fields last (`price`)

However, MongoDB optimizer can use indexes efficiently even if order differs.

### Direction (1 vs -1)

- `1`: Ascending order
- `-1`: Descending order

For compound indexes, direction matters for sorting:
- If sorting by `{ category: 1, rating: -1 }`, index should be `{ category: 1, rating: -1 }` or `{ category: -1, rating: 1 }`

---

## 8. What is a covered query in MongoDB?

**Covered query** is a query where all fields in the query result are present in the index, allowing MongoDB to return results without accessing documents.

### Benefits
- **Faster Execution**: No need to fetch documents from disk
- **Lower I/O**: Reduced disk reads
- **Better Performance**: Index-only query execution

### Example
```javascript
// Index
db.products.createIndex({ category: 1, price: 1, name: 1 })

// Covered query (all fields in index)
db.products.find(
  { category: "Electronics" },
  { _id: 0, category: 1, price: 1, name: 1 }
)

// Not covered (includes _id, which requires document fetch)
db.products.find(
  { category: "Electronics" },
  { category: 1, price: 1, name: 1 }
)
```

### Conditions for Covered Query
1. All fields in projection must be in index
2. `_id` field should not be projected (or excluded)
3. Query filter must use indexed fields
4. No fields can use expressions or functions

### Checking if Query is Covered
```javascript
db.products.find({ category: "Electronics" })
  .explain("executionStats")
  // Check executionStats.stage === "IXSCAN"
  // Check executionStats.totalDocsExamined === 0
```

---

## 9. How do you analyze query performance? What is explain()?

**Query performance analysis** helps identify slow queries and optimize them using execution statistics.

### explain() Method

`explain()` provides detailed information about how MongoDB executes a query.

### Execution Modes

1. **queryPlanner** (default): Shows query plan without executing
2. **executionStats**: Shows actual execution statistics
3. **allPlansExecution**: Shows all considered plans

### Usage
```javascript
// Basic explain
db.products.find({ category: "Electronics" }).explain()

// Execution stats
db.products.find({ category: "Electronics" }).explain("executionStats")

// All plans
db.products.find({ category: "Electronics" }).explain("allPlansExecution")
```

### Key Metrics

```javascript
{
  executionStats: {
    executionTimeMillis: 15,        // Total execution time
    totalDocsExamined: 100,          // Documents scanned
    totalKeysExamined: 50,           // Index keys examined
    nReturned: 25,                   // Documents returned
    executionStages: {
      stage: "IXSCAN",               // Index scan (good) or COLLSCAN (bad)
      indexName: "category_1_price_1",
      docsExamined: 100
    }
  }
}
```

### Interpreting Results

- **stage: "IXSCAN"**: Using index (good)
- **stage: "COLLSCAN"**: Collection scan (bad - scans all documents)
- **executionTimeMillis**: Lower is better
- **totalDocsExamined vs nReturned**: Should be close (efficient)
- **keysExamined**: Index keys examined

### Optimization Tips

1. **Use Indexes**: Ensure queries use indexes (IXSCAN)
2. **Reduce Documents Examined**: Optimize filter conditions
3. **Limit Results**: Use `limit()` to reduce data transfer
4. **Projection**: Use projection to return only needed fields
5. **Compound Indexes**: Create indexes matching query patterns

---

## 10. What are TTL indexes?

**TTL (Time-To-Live) indexes** automatically delete documents after a specified time period, useful for session data, logs, and temporary data.

### Creating TTL Index
```javascript
db.sessions.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 3600 }  // Delete after 1 hour
)
```

### How It Works
1. MongoDB checks TTL indexes every 60 seconds (background task)
2. Documents with expiration time in the past are deleted
3. Only works on fields of type `Date` or arrays of `Date`

### Examples
```javascript
// Delete documents after 24 hours
db.logs.createIndex(
  { timestamp: 1 },
  { expireAfterSeconds: 86400 }
)

// Delete after 7 days
db.tempData.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 604800 }
)

// Delete after 30 minutes (1800 seconds)
db.sessions.createIndex(
  { lastAccess: 1 },
  { expireAfterSeconds: 1800 }
)
```

### Requirements

1. **Date Field**: Indexed field must be `Date` type
2. **Single Field**: TTL index must be single-field index (not compound)
3. **Background Task**: Deletion happens every 60 seconds (not immediate)

### Use Cases

- **Session Management**: Auto-delete expired sessions
- **Log Rotation**: Remove old log entries
- **Cache Expiration**: Remove stale cache data
- **Temporary Data**: Clean up temporary documents
- **Event Data**: Remove old event records

### Modifying TTL
```javascript
// Change expiration time
db.sessions.dropIndex({ createdAt: 1 })
db.sessions.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 7200 }  // New expiration: 2 hours
)
```

---

## License

ISC

