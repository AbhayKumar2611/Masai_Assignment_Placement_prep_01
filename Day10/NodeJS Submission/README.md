# MongoDB CRUD Operations API

A simple Express API for a product catalog with MongoDB. Implements full CRUD operations with pagination, sorting, and text search functionality.

## Features

- **Create**: Add new products to the catalog
- **Read**: Get products with filters, pagination, sorting, and text search
- **Update**: Full update (PUT) and partial update (PATCH) products
- **Delete**: Remove products from the catalog
- **Pagination**: Efficient pagination with metadata
- **Sorting**: Sort by any field in ascending/descending order
- **Text Search**: Full-text search across product name and description
- **Filtering**: Filter by category, price range, brand, stock status

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file based on `.env.example`:

```env
MONGO_URL=mongodb://localhost:27017/productCatalog
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

### Create Product
```
POST /api/products
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product description",
  "category": "Electronics",
  "price": 299.99,
  "stock": 100,
  "brand": "Brand Name",
  "tags": ["tag1", "tag2"],
  "inStock": true
}
```

### Get All Products (with filters, pagination, sorting)
```
GET /api/products?search=laptop&category=Electronics&minPrice=100&maxPrice=500&brand=Apple&inStock=true&sortBy=price&sortOrder=asc&page=1&limit=10
```

**Query Parameters:**
- `search`: Text search query (searches name and description)
- `category`: Filter by category (Electronics, Clothing, Books, Home, Sports, Toys, Food, Beauty)
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `brand`: Filter by brand name (case-insensitive)
- `inStock`: Filter by stock availability (true/false)
- `sortBy`: Field to sort by (name, price, createdAt, category, etc.)
- `sortOrder`: Sort order (asc/desc)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

### Get Product by ID
```
GET /api/products/:id
```

### Update Product (Full Update)
```
PUT /api/products/:id
Content-Type: application/json

{
  "name": "Updated Product Name",
  "description": "Updated description",
  "category": "Electronics",
  "price": 399.99,
  "stock": 50,
  "brand": "Updated Brand",
  "inStock": true
}
```

### Partial Update Product
```
PATCH /api/products/:id
Content-Type: application/json

{
  "price": 349.99,
  "stock": 75
}
```

### Delete Product
```
DELETE /api/products/:id
```

## Example Requests

### Create a product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "High-performance laptop",
    "category": "Electronics",
    "price": 999.99,
    "stock": 50,
    "brand": "Dell",
    "tags": ["laptop", "computer"],
    "inStock": true
  }'
```

### Search products with filters
```bash
curl "http://localhost:3000/api/products?search=laptop&category=Electronics&minPrice=500&maxPrice=1500&sortBy=price&sortOrder=asc&page=1&limit=10"
```

### Get product by ID
```bash
curl http://localhost:3000/api/products/507f1f77bcf86cd799439011
```

### Update product
```bash
curl -X PUT http://localhost:3000/api/products/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Laptop",
    "price": 1099.99,
    "stock": 30
  }'
```

### Delete product
```bash
curl -X DELETE http://localhost:3000/api/products/507f1f77bcf86cd799439011
```

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

## 1. What is MongoDB? What makes it different from relational databases?

**MongoDB** is a NoSQL document database that stores data in flexible, JSON-like documents called BSON.

### Key Differences from Relational Databases:

| Aspect | MongoDB | Relational DB (SQL) |
|--------|---------|---------------------|
| **Data Model** | Document-based (BSON) | Table-based (rows/columns) |
| **Schema** | Schema-less/flexible | Fixed schema |
| **Relationships** | Embedded documents or references | Foreign keys, joins |
| **Scalability** | Horizontal scaling (sharding) | Vertical scaling (mostly) |
| **Query Language** | MongoDB Query Language (MQL) | SQL |
| **Transactions** | Multi-document transactions (4.0+) | ACID transactions |
| **Joins** | Limited ($lookup aggregation) | Full JOIN support |

### Advantages:
- **Flexible Schema**: Fields can vary between documents
- **Horizontal Scaling**: Easier to scale across multiple servers
- **Fast Development**: No need to define schema upfront
- **JSON-like Structure**: Natural fit for JavaScript/Node.js

---

## 2. What are collections and documents in MongoDB?

**Collections** are groups of documents (similar to tables in SQL databases).

**Documents** are individual records stored as BSON (similar to rows in SQL databases).

### Collections:
- Store multiple documents
- No enforced schema (documents can have different structures)
- Created automatically when first document is inserted
- Can be organized using namespaces: `database.collection`

### Documents:
- Stored in BSON format (Binary JSON)
- Similar to JSON objects but with additional data types
- Must have an `_id` field (unique identifier)
- Can contain nested objects and arrays

### Example:
```javascript
// Collection: products
// Document:
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "Laptop",
  "price": 999.99,
  "specs": {
    "cpu": "Intel i7",
    "ram": "16GB"
  },
  "tags": ["electronics", "computer"]
}
```

---

## 3. What is BSON? How does it differ from JSON?

**BSON** (Binary JSON) is MongoDB's binary-encoded serialization format for documents.

### Differences:

| Feature | JSON | BSON |
|---------|------|------|
| **Format** | Text-based | Binary |
| **Data Types** | Limited (string, number, boolean, null, object, array) | Extended (Date, ObjectId, Binary, etc.) |
| **Size** | Human-readable, larger | Compact, smaller |
| **Parsing** | Slower (text parsing) | Faster (binary parsing) |
| **Type Support** | Limited types | Rich types (Date, ObjectId, Decimal128) |

### BSON Data Types:
- **ObjectId**: Unique identifier (12 bytes)
- **Date**: Date/time values
- **Binary**: Binary data
- **Decimal128**: High-precision decimal
- **Timestamp**: Internal timestamp
- **Regular Expression**: Regex patterns

### Example:
```javascript
// JSON
{
  "name": "Product",
  "price": 100,
  "createdAt": "2024-01-01T00:00:00Z"  // String
}

// BSON
{
  "name": "Product",
  "price": Number(100),
  "createdAt": Date("2024-01-01")  // Date object
}
```

---

## 4. Explain the structure of a MongoDB document. What is _id?

**MongoDB document** structure consists of field-value pairs stored in BSON format.

### Document Structure:
```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),  // Required field
  "field1": "value1",
  "field2": 123,
  "nestedObject": {
    "nestedField": "value"
  },
  "arrayField": ["item1", "item2"],
  "dateField": ISODate("2024-01-01")
}
```

### `_id` Field:

- **Required**: Every document must have an `_id` field
- **Unique**: Unique identifier within a collection
- **Default Type**: ObjectId (12-byte unique identifier)
- **Indexed**: Automatically indexed for fast lookups
- **Immutable**: Cannot be changed after creation (unless replacing entire document)

### ObjectId Structure:
- 4 bytes: Timestamp (creation time)
- 5 bytes: Random value
- 3 bytes: Counter (starting with random value)

### Custom _id:
You can use custom `_id` values (string, number, etc.), but ObjectId is recommended for distributed systems.

---

## 5. What are the data types supported in MongoDB?

MongoDB supports various BSON data types:

### Basic Types:
- **String**: UTF-8 strings
- **Integer**: 32-bit or 64-bit integers
- **Double**: 64-bit floating-point numbers
- **Boolean**: true/false
- **Null**: null values
- **Array**: Ordered list of values
- **Object**: Embedded document

### Special Types:
- **ObjectId**: 12-byte unique identifier
- **Date**: Date and time (stored as UTC)
- **Timestamp**: Internal timestamp (64-bit)
- **Binary**: Binary data
- **Regular Expression**: Regex patterns
- **JavaScript**: JavaScript code
- **Symbol**: Deprecated, similar to string
- **Decimal128**: 128-bit decimal (high precision)
- **MinKey/MaxKey**: Comparison boundaries

### Example:
```javascript
{
  "string": "text",
  "integer": 100,
  "double": 99.99,
  "boolean": true,
  "null": null,
  "array": [1, 2, 3],
  "object": { "key": "value" },
  "objectId": ObjectId("507f1f77bcf86cd799439011"),
  "date": ISODate("2024-01-01"),
  "binary": BinData(0, "base64data"),
  "regex": /pattern/i,
  "decimal": NumberDecimal("99.99")
}
```

---

## 6. What are embedded documents vs references in MongoDB?

**Embedded Documents**: Store related data directly within a document (denormalized).

**References**: Store only a reference (ID) to related data in another document (normalized).

### Embedded Documents:
```javascript
// User document with embedded address
{
  "_id": ObjectId("..."),
  "name": "John",
  "address": {  // Embedded
    "street": "123 Main St",
    "city": "NYC",
    "zip": "10001"
  }
}
```

### References:
```javascript
// User document with reference
{
  "_id": ObjectId("..."),
  "name": "John",
  "addressId": ObjectId("...")  // Reference
}

// Separate address document
{
  "_id": ObjectId("..."),
  "street": "123 Main St",
  "city": "NYC"
}
```

### When to Use:

| Embedded | References |
|----------|------------|
| One-to-one relationships | One-to-many relationships |
| Small, frequently accessed data | Large, rarely accessed data |
| Data always accessed together | Data accessed independently |
| Few reads, many writes | Many reads, few writes |

---

## 7. When should you embed vs reference data?

### Embed When:
- **One-to-one relationship**: User profile, settings
- **Small data size**: Address, preferences
- **Frequently accessed together**: Product with specs
- **Data rarely changes**: Historical data
- **Read-heavy operations**: Fast single query

### Reference When:
- **One-to-many relationship**: User with many orders
- **Large data size**: Large documents would exceed 16MB limit
- **Data accessed independently**: Products and reviews separately
- **Frequently changing data**: Shared data updated often
- **Many-to-many relationship**: Complex relationships

### Example Decision:
```javascript
// Embed: Product with specifications (always accessed together)
{
  "name": "Laptop",
  "specs": {  // Embedded
    "cpu": "i7",
    "ram": "16GB"
  }
}

// Reference: User with orders (many orders per user)
{
  "_id": ObjectId("..."),
  "name": "John",
  "orderIds": [ObjectId("..."), ObjectId("...")]  // References
}
```

---

## 8. What are the advantages and disadvantages of MongoDB?

### Advantages:
- **Flexible Schema**: No rigid schema, easy to evolve
- **Horizontal Scaling**: Easy sharding across servers
- **Fast Development**: No need to define schema upfront
- **JSON-like Structure**: Natural fit for JavaScript/Node.js
- **Rich Query Language**: Powerful querying and aggregation
- **Document Model**: Stores related data together
- **Indexing**: Supports multiple index types
- **Replication**: Built-in replication for high availability

### Disadvantages:
- **No Joins**: Limited join capabilities (requires $lookup)
- **Memory Usage**: Can consume more memory
- **Transaction Support**: Multi-document transactions added in 4.0 (limited)
- **Data Duplication**: Embedded documents can lead to duplication
- **Learning Curve**: Different from SQL, requires learning MQL
- **Schema Validation**: No enforced schema (can lead to inconsistencies)
- **File Size Limit**: 16MB document size limit
- **Less Mature Tools**: Fewer tools compared to SQL databases

### Use Cases:
- **Best For**: Content management, real-time analytics, IoT, mobile apps, catalogs
- **Not Ideal For**: Complex transactions, strict relational data, legacy SQL apps

---

## 9. Explain schema design in MongoDB. Is MongoDB schema-less?

**MongoDB is schema-less** at the database level, but schemas can be defined at the application level.

### Schema-less Nature:
- Documents in a collection can have different structures
- No enforced schema validation at database level
- Fields can be added/removed without migration
- Flexible and adaptable to changes

### Schema Design Best Practices:

1. **Application-Level Schema**: Define schema using Mongoose, ODM, or validation
   ```javascript
   // Mongoose schema
   const productSchema = new Schema({
     name: { type: String, required: true },
     price: { type: Number, min: 0 }
   })
   ```

2. **Design Patterns**:
   - **Embed vs Reference**: Choose based on access patterns
   - **One-to-Many**: Embed for few children, reference for many
   - **Many-to-Many**: Use arrays of references
   - **Precomputed Data**: Store computed values for faster reads

3. **Denormalization**: Store duplicate data if it improves read performance

4. **Schema Validation**: Use MongoDB 3.6+ validation rules
   ```javascript
   db.createCollection("products", {
     validator: {
       $jsonSchema: {
         required: ["name", "price"],
         properties: {
           name: { type: "string" },
           price: { type: "number", minimum: 0 }
         }
       }
     }
   })
   ```

### Schema Evolution:
- Start with minimal schema
- Add fields as needed
- Use migrations for application-level changes
- Validate data at application level

---

## 10. What is the aggregation pipeline in MongoDB?

**Aggregation Pipeline** is a framework for processing documents through a series of stages to transform and analyze data.

### How It Works:
Documents pass through multiple stages, each transforming the data.

### Pipeline Stages:

| Stage | Description | Example |
|-------|-------------|---------|
| `$match` | Filter documents (like WHERE) | `{ $match: { price: { $gte: 100 } } }` |
| `$project` | Select/reshape fields (like SELECT) | `{ $project: { name: 1, price: 1 } }` |
| `$group` | Group and aggregate | `{ $group: { _id: "$category", total: { $sum: "$price" } } }` |
| `$sort` | Sort documents | `{ $sort: { price: -1 } }` |
| `$limit` | Limit number of documents | `{ $limit: 10 }` |
| `$skip` | Skip documents | `{ $skip: 5 }` |
| `$unwind` | Deconstruct array fields | `{ $unwind: "$tags" }` |
| `$lookup` | Join with another collection | `{ $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } }` |
| `$addFields` | Add computed fields | `{ $addFields: { total: { $multiply: ["$price", "$quantity"] } } }` |
| `$facet` | Multiple pipelines | Parallel processing |

### Example Aggregation:
```javascript
db.orders.aggregate([
  // Stage 1: Match (filter)
  { $match: { status: "completed" } },
  
  // Stage 2: Unwind array
  { $unwind: "$items" },
  
  // Stage 3: Group and calculate
  {
    $group: {
      _id: "$items.category",
      totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
      avgPrice: { $avg: "$items.price" },
      count: { $sum: 1 }
    }
  },
  
  // Stage 4: Sort
  { $sort: { totalRevenue: -1 } },
  
  // Stage 5: Limit
  { $limit: 10 }
])
```

### Benefits:
- **Powerful Data Processing**: Complex transformations
- **Performance**: Efficient execution with indexes
- **Flexibility**: Combine multiple operations
- **Analytics**: Ideal for reporting and analytics

### Use Cases:
- Analytics and reporting
- Data transformation
- Complex filtering and grouping
- Joining collections ($lookup)
- Calculating aggregations (sum, avg, count)

---

## License

ISC

