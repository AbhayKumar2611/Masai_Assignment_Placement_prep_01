# MongoDB Aggregation Pipeline Builder API

A comprehensive Express API with MongoDB that implements CRUD operations and advanced aggregation pipelines for analytics. Includes pagination, sorting, text search, and complex data analysis.

## Features

### CRUD Operations:
- **Create**: Add new products to the catalog
- **Read**: Get products with filters, pagination, sorting, and text search
- **Update**: Full update (PUT) and partial update (PATCH) products
- **Delete**: Remove products from the catalog

### Analytics (Aggregation Pipeline):
- **Orders by User**: Group orders by user with statistics using $lookup and $group
- **Sales by Category**: Calculate total sales per category using $unwind and $group
- **Top Customers**: Find top N customers by spending using $group, $lookup, and $sort
- **Analytics Summary**: Combined analytics endpoint

### Additional Features:
- **Pagination**: Efficient pagination with metadata
- **Sorting**: Sort by any field in ascending/descending order
- **Text Search**: Full-text search across product name and description
- **Filtering**: Filter by category, price range, brand, stock status
- **Date Filtering**: Filter by date ranges for analytics

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

## Analytics Endpoints (Aggregation Pipeline)

### Group Orders by User
```
GET /api/analytics/orders-by-user?status=completed&startDate=2024-01-01&endDate=2024-12-31&sortBy=totalOrders&sortOrder=desc
```

**Query Parameters:**
- `status`: Filter by order status (pending, processing, shipped, delivered, cancelled)
- `startDate`: Start date for filtering (YYYY-MM-DD)
- `endDate`: End date for filtering (YYYY-MM-DD)
- `sortBy`: Field to sort by (totalOrders, totalAmount, averageOrderValue)
- `sortOrder`: Sort order (asc/desc)

**Response:**
```json
{
  "success": true,
  "message": "Orders grouped by user successfully",
  "data": [
    {
      "userId": "...",
      "userName": "John Doe",
      "userEmail": "john@example.com",
      "totalOrders": 10,
      "totalAmount": 5000.00,
      "averageOrderValue": 500.00,
      "orders": [...]
    }
  ],
  "count": 5
}
```

### Calculate Total Sales per Category
```
GET /api/analytics/sales-by-category?status=completed&startDate=2024-01-01&endDate=2024-12-31
```

**Query Parameters:**
- `status`: Filter by order status
- `startDate`: Start date for filtering
- `endDate`: End date for filtering

**Response:**
```json
{
  "success": true,
  "message": "Sales by category calculated successfully",
  "data": [
    {
      "category": "Electronics",
      "totalSales": 25000.00,
      "totalQuantity": 150,
      "totalOrders": 50,
      "averageItemPrice": 166.67,
      "averageOrderValue": 500.00,
      "uniqueProductsCount": 25,
      "products": [...]
    }
  ],
  "summary": {
    "totalCategories": 5,
    "grandTotalSales": 50000.00
  }
}
```

### Find Top 5 Customers by Spending
```
GET /api/analytics/top-customers?limit=5&status=completed&startDate=2024-01-01&endDate=2024-12-31
```

**Query Parameters:**
- `limit`: Number of top customers to return (default: 5)
- `status`: Filter by order status
- `startDate`: Start date for filtering
- `endDate`: End date for filtering

**Response:**
```json
{
  "success": true,
  "message": "Top 5 customers retrieved successfully",
  "data": [
    {
      "userId": "...",
      "userName": "John Doe",
      "userEmail": "john@example.com",
      "totalSpending": 5000.00,
      "totalOrders": 10,
      "averageOrderValue": 500.00,
      "firstOrderDate": "2024-01-01",
      "lastOrderDate": "2024-12-31"
    }
  ],
  "count": 5
}
```

### Get Analytics Summary (Combined)
```
GET /api/analytics/summary?status=completed&startDate=2024-01-01&endDate=2024-12-31
```

Returns combined analytics data including orders by user count, sales by category, and top customers.

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

## Aggregation Pipeline Theoretical Questions

## 1. What is the aggregation framework in MongoDB?

**Aggregation Framework** is a framework for processing documents through a series of stages to transform and analyze data. It's MongoDB's equivalent of SQL's GROUP BY, JOIN, and aggregate functions.

### How It Works:
Documents pass through multiple stages sequentially, with each stage transforming the data before passing it to the next stage.

### Key Benefits:
- **Powerful Data Processing**: Complex transformations in a single query
- **Performance**: Efficient execution with indexes
- **Flexibility**: Combine multiple operations in one pipeline
- **Analytics**: Ideal for reporting, analytics, and data analysis

### Use Cases:
- Analytics and reporting (sales, revenue, statistics)
- Data transformation (reshaping documents)
- Complex filtering and grouping
- Joining collections ($lookup)
- Calculating aggregations (sum, avg, count, min, max)

---

## 2. Explain the stages in aggregation pipeline ($match, $group, $project, $sort, $limit).

**Pipeline Stages** are operations that transform documents as they pass through the aggregation pipeline.

### Common Stages:

| Stage | Description | SQL Equivalent | Example |
|-------|-------------|----------------|---------|
| **$match** | Filter documents | WHERE | `{ $match: { status: "completed" } }` |
| **$group** | Group and aggregate | GROUP BY | `{ $group: { _id: "$category", total: { $sum: "$price" } } }` |
| **$project** | Select/reshape fields | SELECT | `{ $project: { name: 1, price: 1, _id: 0 } }` |
| **$sort** | Sort documents | ORDER BY | `{ $sort: { price: -1 } }` |
| **$limit** | Limit number of documents | LIMIT | `{ $limit: 10 }` |
| **$skip** | Skip documents | OFFSET | `{ $skip: 5 }` |
| **$unwind** | Deconstruct array fields | (No SQL equivalent) | `{ $unwind: "$items" }` |
| **$lookup** | Join with another collection | LEFT JOIN | `{ $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } }` |
| **$addFields** | Add computed fields | (Computed columns) | `{ $addFields: { total: { $multiply: ["$price", "$quantity"] } } }` |
| **$count** | Count documents | COUNT(*) | `{ $count: "total" }` |

### Example Pipeline:
```javascript
db.orders.aggregate([
  // Stage 1: Match (filter)
  { $match: { status: "completed", totalAmount: { $gte: 100 } } },
  
  // Stage 2: Group by category
  {
    $group: {
      _id: "$items.category",
      totalRevenue: { $sum: "$totalAmount" },
      avgOrderValue: { $avg: "$totalAmount" },
      orderCount: { $sum: 1 }
    }
  },
  
  // Stage 3: Project (shape output)
  {
    $project: {
      _id: 0,
      category: "$_id",
      totalRevenue: 1,
      avgOrderValue: { $round: ["$avgOrderValue", 2] },
      orderCount: 1
    }
  },
  
  // Stage 4: Sort by revenue
  { $sort: { totalRevenue: -1 } },
  
  // Stage 5: Limit to top 5
  { $limit: 5 }
])
```

---

## 3. What is $lookup? How do you perform joins in MongoDB?

**$lookup** is an aggregation stage that performs a left outer join with another collection.

### Syntax:
```javascript
{
  $lookup: {
    from: "collection_name",        // Collection to join with
    localField: "field_in_current", // Field in current collection
    foreignField: "field_in_from",  // Field in joined collection
    as: "output_array_field"        // Name for output array
  }
}
```

### Example:
```javascript
// Orders collection joined with Users collection
db.orders.aggregate([
  {
    $lookup: {
      from: "users",              // Join with users collection
      localField: "userId",       // Field in orders
      foreignField: "_id",        // Field in users
      as: "userDetails"           // Output array name
    }
  },
  {
    $unwind: "$userDetails"      // Convert array to object
  }
])
```

### $lookup Variations:

1. **Standard Join**: Join based on field equality
2. **Pipeline Join**: Join with pipeline conditions (MongoDB 3.6+)
   ```javascript
   {
     $lookup: {
       from: "orders",
       let: { userId: "$_id" },
       pipeline: [
         { $match: { $expr: { $eq: ["$userId", "$$userId"] } } },
         { $group: { _id: null, totalOrders: { $sum: 1 } } }
       ],
       as: "orderStats"
     }
   }
   ```

### Limitations:
- Only left outer join (returns all documents from left collection)
- Must be in same database
- Less efficient than embedded documents for frequently accessed data

---

## 4. What is $unwind? When would you use it?

**$unwind** deconstructs an array field, creating one document for each array element.

### Syntax:
```javascript
{
  $unwind: {
    path: "$arrayField",
    preserveNullAndEmptyArrays: true  // Optional: include docs with null/empty arrays
  }
}
```

### Example:
```javascript
// Before unwind:
[
  { _id: 1, name: "John", tags: ["red", "blue", "green"] }
]

// After unwind:
[
  { _id: 1, name: "John", tags: "red" },
  { _id: 1, name: "John", tags: "blue" },
  { _id: 1, name: "John", tags: "green" }
]
```

### When to Use:
- **Processing Array Elements**: When you need to group/aggregate array items separately
- **Grouping by Array Values**: Group documents by values within arrays
- **Calculating Statistics**: Calculate statistics for each array element
- **Flattening Nested Arrays**: Process nested array structures

### Example Use Case:
```javascript
// Calculate total sales per category from order items
db.orders.aggregate([
  { $unwind: "$items" },              // Deconstruct items array
  {
    $group: {
      _id: "$items.category",         // Group by category
      totalSales: { $sum: "$items.subtotal" },
      totalQuantity: { $sum: "$items.quantity" }
    }
  }
])
```

---

## 5. What are aggregation expressions and operators?

**Aggregation Expressions** are expressions used within aggregation stages to calculate values, transform data, or perform operations.

### Expression Operators Categories:

1. **Arithmetic Operators**: `$add`, `$subtract`, `$multiply`, `$divide`, `$mod`, `$pow`
   ```javascript
   { $project: { total: { $multiply: ["$price", "$quantity"] } } }
   ```

2. **Comparison Operators**: `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$cmp`
   ```javascript
   { $project: { isExpensive: { $gte: ["$price", 100] } } }
   ```

3. **Logical Operators**: `$and`, `$or`, `$not`, `$cond` (if-then-else)
   ```javascript
   { $project: { discount: { $cond: [{ $gte: ["$price", 100] }, 10, 0] } } }
   ```

4. **String Operators**: `$concat`, `$substr`, `$toLower`, `$toUpper`, `$trim`
   ```javascript
   { $project: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } }
   ```

5. **Date Operators**: `$year`, `$month`, `$dayOfMonth`, `$dateToString`
   ```javascript
   { $project: { year: { $year: "$orderDate" } } }
   ```

6. **Array Operators**: `$arrayElemAt`, `$size`, `$slice`, `$concatArrays`
   ```javascript
   { $project: { firstTag: { $arrayElemAt: ["$tags", 0] } } }
   ```

7. **Accumulator Operators** (used in $group): `$sum`, `$avg`, `$min`, `$max`, `$first`, `$last`, `$push`, `$addToSet`
   ```javascript
   {
     $group: {
       _id: "$category",
       total: { $sum: "$price" },
       average: { $avg: "$price" },
       maxPrice: { $max: "$price" },
       products: { $push: "$name" }
     }
   }
   ```

### Example:
```javascript
{
  $project: {
    total: { $multiply: ["$price", "$quantity"] },
    discount: {
      $cond: [
        { $gte: ["$totalAmount", 100] },
        10,  // If true
        0    // If false
      ]
    },
    finalPrice: {
      $subtract: [
        { $multiply: ["$price", "$quantity"] },
        {
          $multiply: [
            { $multiply: ["$price", "$quantity"] },
            { $divide: [{ $cond: [{ $gte: ["$totalAmount", 100] }, 10, 0] }, 100] }
          ]
        }
      ]
    }
  }
}
```

---

## 6. How do you handle one-to-many relationships in MongoDB?

**One-to-Many relationships** can be handled using embedded documents or references, depending on access patterns.

### Option 1: Embedded Documents (Array)
**Use when**: Few children, always accessed together, small documents

```javascript
// User with embedded orders
{
  _id: ObjectId("..."),
  name: "John",
  orders: [                    // Embedded array
    { orderNumber: "ORD001", total: 100 },
    { orderNumber: "ORD002", total: 200 }
  ]
}
```

### Option 2: References (Array of IDs)
**Use when**: Many children, accessed independently, large documents

```javascript
// User document
{
  _id: ObjectId("..."),
  name: "John",
  orderIds: [                  // References
    ObjectId("..."),
    ObjectId("...")
  ]
}

// Separate orders collection
{
  _id: ObjectId("..."),
  orderNumber: "ORD001",
  userId: ObjectId("..."),
  total: 100
}
```

### Option 3: Child-References (Parent ID in child)
**Use when**: Many children, frequent queries on children

```javascript
// Orders collection (child references parent)
{
  _id: ObjectId("..."),
  orderNumber: "ORD001",
  userId: ObjectId("..."),    // Reference to user
  total: 100
}

// Query orders for a user
db.orders.find({ userId: ObjectId("...") })
```

### Choosing the Right Pattern:
- **Embed**: Few children (< 100), always accessed together, small size
- **Reference**: Many children, accessed independently, large size, frequent updates

---

## 7. How do you handle many-to-many relationships in MongoDB?

**Many-to-Many relationships** are handled using arrays of references in both documents.

### Pattern: Arrays of References
```javascript
// Products collection
{
  _id: ObjectId("product1"),
  name: "Laptop",
  categoryIds: [              // Array of category IDs
    ObjectId("cat1"),
    ObjectId("cat2")
  ]
}

// Categories collection
{
  _id: ObjectId("cat1"),
  name: "Electronics",
  productIds: [               // Array of product IDs
    ObjectId("product1"),
    ObjectId("product2")
  ]
}
```

### Querying Many-to-Many:
```javascript
// Find all categories for a product
db.categories.find({ _id: { $in: product.categoryIds } })

// Find all products in a category
db.products.find({ _id: { $in: category.productIds } })

// Using aggregation with $lookup
db.products.aggregate([
  { $match: { _id: ObjectId("product1") } },
  {
    $lookup: {
      from: "categories",
      localField: "categoryIds",
      foreignField: "_id",
      as: "categories"
    }
  }
])
```

### Alternative: Junction Collection (Normalized)
```javascript
// ProductCategory junction collection
{
  _id: ObjectId("..."),
  productId: ObjectId("product1"),
  categoryId: ObjectId("cat1")
}

// Query with aggregation
db.productCategories.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "productId",
      foreignField: "_id",
      as: "product"
    }
  },
  {
    $lookup: {
      from: "categories",
      localField: "categoryId",
      foreignField: "_id",
      as: "category"
    }
  }
])
```

### Choosing the Pattern:
- **Arrays of References**: Simple queries, few relationships
- **Junction Collection**: Complex queries, many relationships, need metadata

---

## 8. What is data modeling in MongoDB? Explain the 6 rules of thumb.

**Data Modeling** in MongoDB involves designing document structure to optimize for application access patterns.

### 6 Rules of Thumb:

1. **Embed for one-to-one and one-to-few relationships**
   - User profile, address, preferences
   - Small, frequently accessed together
   ```javascript
   { user: "John", address: { street: "...", city: "..." } }
   ```

2. **Reference for one-to-many or many-to-many relationships**
   - User with many orders
   - Large documents would exceed 16MB limit
   ```javascript
   { user: "John", orderIds: [ObjectId("..."), ObjectId("...")] }
   ```

3. **Prefer embedding when data is accessed together**
   - Product with specifications
   - Always fetch together
   ```javascript
   { product: "Laptop", specs: { cpu: "i7", ram: "16GB" } }
   ```

4. **Prefer referencing when data is accessed independently**
   - Products and reviews accessed separately
   - Need to query independently
   ```javascript
   // Separate collections
   // Products: { _id: "...", name: "Laptop" }
   // Reviews: { productId: "...", rating: 5 }
   ```

5. **Consider read/write ratio**
   - **Read-heavy**: Embed for faster reads
   - **Write-heavy**: Reference to avoid duplication updates
   - **Balanced**: Consider access patterns

6. **Denormalize for read performance**
   - Store computed or frequently accessed data
   - Trade storage for query speed
   ```javascript
   {
     product: "Laptop",
     price: 999,
     discountPrice: 899,      // Precomputed
     averageRating: 4.5,      // Precomputed from reviews
     reviewCount: 100         // Precomputed
   }
   ```

### Additional Considerations:
- **Document Size Limit**: 16MB maximum
- **Index Size**: Keep indexes small for performance
- **Query Patterns**: Design for your most common queries
- **Scalability**: Consider sharding implications

---

## 9. What are atomic operations in MongoDB?

**Atomic Operations** are operations that complete entirely or not at all, ensuring data consistency.

### Single Document Operations:
All single-document operations in MongoDB are atomic:
- `updateOne()`
- `updateMany()` (each document updated atomically)
- `findOneAndUpdate()`
- `findOneAndDelete()`
- `findOneAndReplace()`

### Atomic Update Operators:
```javascript
// Atomic increment
db.products.updateOne(
  { _id: ObjectId("...") },
  { $inc: { stock: -1 } }      // Atomically decreases stock
)

// Atomic push to array
db.users.updateOne(
  { _id: ObjectId("...") },
  { $push: { orders: newOrder } }
)

// Atomic set multiple fields
db.products.updateOne(
  { _id: ObjectId("...") },
  {
    $set: {
      price: 999,
      updatedAt: new Date()
    }
  }
)
```

### Atomic Operations with Conditions:
```javascript
// Atomic conditional update
db.products.updateOne(
  { _id: ObjectId("..."), stock: { $gt: 0 } },
  { $inc: { stock: -1 } }      // Only if stock > 0
)
```

### Limitations:
- **Single Document**: Only single-document operations are atomic
- **Multiple Documents**: Updates to multiple documents are not atomic together
- **For Multi-Document Atomicity**: Use transactions (MongoDB 4.0+)

### Example Use Case:
```javascript
// Atomically update inventory
db.inventory.updateOne(
  { productId: ObjectId("..."), quantity: { $gte: 1 } },
  {
    $inc: { quantity: -1 },
    $push: { logs: { action: "purchase", date: new Date() } }
  }
)
```

---

## 10. What is a transaction in MongoDB? When should you use it?

**Transactions** in MongoDB ensure atomicity across multiple documents and collections (ACID properties).

### Transaction Support:
- **MongoDB 4.0+**: Multi-document transactions for replica sets
- **MongoDB 4.2+**: Multi-document transactions for sharded clusters
- **Single Document**: Always atomic (no transaction needed)

### Transaction Syntax (MongoDB Driver):
```javascript
const session = client.startSession()

try {
  session.startTransaction()
  
  // Operations within transaction
  await ordersCollection.insertOne(order, { session })
  await inventoryCollection.updateOne(
    { productId: order.productId },
    { $inc: { stock: -order.quantity } },
    { session }
  )
  await usersCollection.updateOne(
    { _id: order.userId },
    { $push: { orders: order._id } },
    { session }
  )
  
  // Commit transaction
  await session.commitTransaction()
} catch (error) {
  // Rollback on error
  await session.abortTransaction()
  throw error
} finally {
  session.endSession()
}
```

### When to Use Transactions:

1. **Financial Operations**: Money transfers, payments, refunds
   ```javascript
   // Transfer money between accounts (must be atomic)
   ```

2. **Inventory Management**: Order processing, stock updates
   ```javascript
   // Create order and reduce inventory atomically
   ```

3. **Consistency Requirements**: Related updates must succeed together
   ```javascript
   // Update multiple related documents together
   ```

4. **Data Integrity**: Maintaining referential integrity
   ```javascript
   // Delete user and all related orders together
   ```

### When NOT to Use Transactions:

1. **Single Document Operations**: Already atomic
2. **High-Throughput Scenarios**: Transactions add overhead
3. **Optional Consistency**: When eventual consistency is acceptable
4. **Read Operations**: No need for transactions on reads

### Performance Considerations:
- **Overhead**: Transactions add latency and overhead
- **Locks**: Can cause contention in high-concurrency scenarios
- **Duration**: Keep transactions short (seconds, not minutes)
- **Alternatives**: Consider application-level consistency or eventual consistency

### Best Practices:
- Keep transactions short
- Minimize operations within transaction
- Handle errors and rollbacks properly
- Use transactions only when necessary
- Consider eventual consistency for non-critical operations

---

## License

ISC

---

## License

ISC

