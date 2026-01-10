/**
 * Example usage of the Query Optimizer
 */

const QueryOptimizer = require('./queryOptimizer');

// Initialize the query optimizer
const optimizer = new QueryOptimizer({
  cacheTTL: 5 * 60 * 1000, // 5 minutes
  maxCacheSize: 100,
  minFrequency: 3, // Recommend index after 3 occurrences
  maxIndexFields: 5
});

// Example 1: Record query patterns
console.log('=== Recording Query Patterns ===\n');

// Simulate multiple queries on a users table
optimizer.recordQuery(
  { status: 'active', role: 'admin' },
  { table: 'users' }
);

optimizer.recordQuery(
  { status: 'active', role: 'admin' },
  { table: 'users' }
);

optimizer.recordQuery(
  { status: 'active', role: 'admin' },
  { table: 'users' }
);

optimizer.recordQuery(
  { status: 'active', role: 'user' },
  { table: 'users' }
);

optimizer.recordQuery(
  { status: 'active', role: 'user' },
  { table: 'users' }
);

// Simulate queries on an orders table
optimizer.recordQuery(
  { userId: 123, status: 'pending' },
  { table: 'orders' }
);

optimizer.recordQuery(
  { userId: 123, status: 'pending' },
  { table: 'orders' }
);

optimizer.recordQuery(
  { userId: 123, status: 'pending' },
  { table: 'orders' }
);

optimizer.recordQuery(
  { userId: 456, status: 'completed', date: '2024-01-15' },
  { table: 'orders' }
);

optimizer.recordQuery(
  { userId: 456, status: 'completed', date: '2024-01-15' },
  { table: 'orders' }
);

optimizer.recordQuery(
  { userId: 456, status: 'completed', date: '2024-01-15' },
  { table: 'orders' }
);

optimizer.recordQuery(
  { userId: 456, status: 'completed', date: '2024-01-15' },
  { table: 'orders' }
);

console.log('Query patterns recorded.\n');

// Example 2: Get index recommendations
console.log('=== Index Recommendations ===\n');

const recommendations = optimizer.suggestIndexes();
console.log('Recommended Indexes:');
recommendations.forEach((rec, index) => {
  console.log(`\n${index + 1}. ${rec.recommendation}`);
  console.log(`   Priority: ${rec.priority.toFixed(2)}`);
  console.log(`   Frequency: ${rec.frequency} queries`);
  console.log(`   Query Variations: ${rec.queryCount}`);
  console.log(`   Fields: [${rec.fields.join(', ')}]`);
});

// Example 3: Using the caching layer
console.log('\n=== Caching Example ===\n');

// Simulate a database query function
async function fetchUsersFromDB(filters) {
  console.log(`  [DB Query] Fetching users with filters:`, filters);
  // Simulate database delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return { users: [`User1 with ${JSON.stringify(filters)}`, `User2 with ${JSON.stringify(filters)}`] };
}

// First query - will hit the database
console.log('First query (cache miss):');
const cacheKey1 = optimizer.generateCacheKey({ status: 'active', role: 'admin' });
const result1 = await optimizer.executeQuery(
  cacheKey1,
  () => fetchUsersFromDB({ status: 'active', role: 'admin' }),
  { status: 'active', role: 'admin' },
  { table: 'users' }
);
console.log('  Result:', result1);

// Second query with same parameters - will use cache
console.log('\nSecond query with same parameters (cache hit):');
const result2 = await optimizer.executeQuery(
  cacheKey1,
  () => fetchUsersFromDB({ status: 'active', role: 'admin' }),
  { status: 'active', role: 'admin' },
  { table: 'users' }
);
console.log('  Result:', result2);
console.log('  (No database query was executed - served from cache)');

// Example 4: Get statistics
console.log('\n=== Statistics ===\n');
const stats = optimizer.getStatistics();
console.log(`Total Query Patterns: ${stats.totalQueryPatterns}`);
console.log(`Cache Size: ${stats.cacheSize}`);
console.log('\nTop 5 Query Patterns by Frequency:');
stats.topQueries.slice(0, 5).forEach((query, index) => {
  console.log(`  ${index + 1}. Fields: [${query.fields.join(', ')}] - Frequency: ${query.frequency}`);
});

// Example 5: Clear cache
console.log('\n=== Cache Management ===\n');
console.log(`Cache size before clearing: ${optimizer.cache.size}`);
optimizer.clearCache();
console.log(`Cache size after clearing: ${optimizer.cache.size}`);

console.log('\n=== Example Complete ===');
