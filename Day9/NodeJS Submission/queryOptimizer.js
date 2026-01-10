/**
 * Simple Query Optimizer Module
 * 
 * Analyzes query patterns and suggests composite indexes.
 * Includes a simple caching layer for query results.
 */

class QueryOptimizer {
  constructor(options = {}) {
    // Store query patterns for analysis
    this.queryPatterns = new Map();
    
    // Cache layer for query results
    this.cache = new Map();
    
    // Cache configuration
    this.cacheConfig = {
      ttl: options.cacheTTL || 5 * 60 * 1000, // 5 minutes default TTL
      maxSize: options.maxCacheSize || 100, // Maximum cached queries
      enableCache: options.enableCache !== false // Default: enabled
    };
    
    // Index recommendation configuration
    this.minFrequency = options.minFrequency || 3; // Minimum occurrences to recommend index
    this.maxIndexFields = options.maxIndexFields || 5; // Maximum fields in composite index
  }

  /**
   * Record a query pattern for analysis
   * @param {Object} queryFilters - The filters used in the query
   * @param {Object} metadata - Optional metadata (table, collection name, etc.)
   */
  recordQuery(queryFilters, metadata = {}) {
    if (!queryFilters || typeof queryFilters !== 'object') {
      throw new Error('Query filters must be an object');
    }

    // Extract fields used in the query
    const fields = Object.keys(queryFilters).sort(); // Sort for consistency
    const queryKey = JSON.stringify({ fields, ...metadata });

    // Record the query pattern
    if (!this.queryPatterns.has(queryKey)) {
      this.queryPatterns.set(queryKey, {
        fields,
        metadata,
        frequency: 0,
        filters: queryFilters,
        firstSeen: new Date(),
        lastSeen: new Date()
      });
    }

    const pattern = this.queryPatterns.get(queryKey);
    pattern.frequency++;
    pattern.lastSeen = new Date();

    return pattern;
  }

  /**
   * Analyze query patterns and suggest composite indexes
   * @returns {Array} Array of recommended indexes
   */
  suggestIndexes() {
    const recommendations = [];
    const indexMap = new Map();

    // Group queries by table/collection
    const queriesByTable = new Map();

    for (const [queryKey, pattern] of this.queryPatterns.entries()) {
      const tableName = pattern.metadata.table || pattern.metadata.collection || 'default';
      
      if (!queriesByTable.has(tableName)) {
        queriesByTable.set(tableName, []);
      }
      
      queriesByTable.get(tableName).push(pattern);
    }

    // Analyze patterns for each table
    for (const [tableName, patterns] of queriesByTable.entries()) {
      // Filter patterns that meet minimum frequency threshold
      const frequentPatterns = patterns.filter(p => p.frequency >= this.minFrequency);

      if (frequentPatterns.length === 0) {
        continue;
      }

      // Find most common field combinations
      const fieldCombinations = new Map();

      for (const pattern of frequentPatterns) {
        const fieldKey = pattern.fields.join(',');
        
        if (!fieldCombinations.has(fieldKey)) {
          fieldCombinations.set(fieldKey, {
            fields: pattern.fields,
            totalFrequency: 0,
            queries: []
          });
        }

        const combo = fieldCombinations.get(fieldKey);
        combo.totalFrequency += pattern.frequency;
        combo.queries.push(pattern);
      }

      // Convert to recommendations
      for (const [fieldKey, combo] of fieldCombinations.entries()) {
        if (combo.fields.length > this.maxIndexFields) {
          continue; // Skip if too many fields
        }

        // Determine index order (most selective fields first)
        const orderedFields = this.orderFieldsBySelectivity(combo.fields, combo.queries);

        recommendations.push({
          table: tableName,
          fields: orderedFields,
          originalFields: combo.fields,
          frequency: combo.totalFrequency,
          queryCount: combo.queries.length,
          recommendation: `CREATE INDEX idx_${tableName}_${orderedFields.join('_')} ON ${tableName} (${orderedFields.join(', ')});`,
          priority: this.calculatePriority(combo.totalFrequency, combo.queries.length, orderedFields.length)
        });
      }
    }

    // Sort by priority (highest first)
    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Order fields by selectivity (most selective first for better index performance)
   * @param {Array} fields - Array of field names
   * @param {Array} queries - Array of query patterns using these fields
   * @returns {Array} Ordered array of fields
   */
  orderFieldsBySelectivity(fields, queries) {
    // Simple heuristic: equality fields before range fields, then by frequency of use
    const fieldFrequency = new Map();
    
    for (const field of fields) {
      fieldFrequency.set(field, 0);
    }

    for (const query of queries) {
      for (const field of fields) {
        if (query.filters[field] !== undefined) {
          fieldFrequency.set(field, fieldFrequency.get(field) + 1);
        }
      }
    }

    // Sort by frequency (most used first), then alphabetically
    return fields.sort((a, b) => {
      const freqA = fieldFrequency.get(a);
      const freqB = fieldFrequency.get(b);
      
      if (freqB !== freqA) {
        return freqB - freqA;
      }
      
      return a.localeCompare(b);
    });
  }

  /**
   * Calculate priority score for index recommendation
   * @param {number} frequency - Total frequency of queries using this pattern
   * @param {number} queryCount - Number of distinct queries
   * @param {number} fieldCount - Number of fields in index
   * @returns {number} Priority score
   */
  calculatePriority(frequency, queryCount, fieldCount) {
    // Higher frequency = higher priority
    // More query variations = higher priority
    // Fewer fields = slightly higher priority (simpler indexes are better)
    return (frequency * 2) + (queryCount * 1.5) - (fieldCount * 0.5);
  }

  /**
   * Get cached query result
   * @param {string} cacheKey - Cache key
   * @returns {Object|null} Cached result or null
   */
  getCached(cacheKey) {
    if (!this.cacheConfig.enableCache) {
      return null;
    }

    const cached = this.cache.get(cacheKey);
    
    if (!cached) {
      return null;
    }

    // Check if cache entry is expired
    if (Date.now() - cached.timestamp > this.cacheConfig.ttl) {
      this.cache.delete(cacheKey);
      return null;
    }

    return cached.data;
  }

  /**
   * Store query result in cache
   * @param {string} cacheKey - Cache key
   * @param {*} data - Data to cache
   */
  setCached(cacheKey, data) {
    if (!this.cacheConfig.enableCache) {
      return;
    }

    // Evict old entries if cache is full
    if (this.cache.size >= this.cacheConfig.maxSize) {
      this.evictOldestCacheEntry();
    }

    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Evict the oldest cache entry
   */
  evictOldestCacheEntry() {
    let oldestKey = null;
    let oldestTime = Infinity;

    for (const [key, value] of this.cache.entries()) {
      if (value.timestamp < oldestTime) {
        oldestTime = value.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Execute a query with caching
   * @param {string} queryKey - Unique key for the query
   * @param {Function} queryFn - Function that executes the query
   * @param {Object} queryFilters - Filters used (for pattern recording)
   * @param {Object} metadata - Optional metadata
   * @returns {Promise<*>} Query result
   */
  async executeQuery(queryKey, queryFn, queryFilters = {}, metadata = {}) {
    // Check cache first
    const cached = this.getCached(queryKey);
    if (cached !== null) {
      return cached;
    }

    // Record query pattern
    this.recordQuery(queryFilters, metadata);

    // Execute the actual query
    const result = await queryFn();

    // Cache the result
    this.setCached(queryKey, result);

    return result;
  }

  /**
   * Generate cache key from query parameters
   * @param {Object} queryParams - Query parameters
   * @returns {string} Cache key
   */
  generateCacheKey(queryParams) {
    // Create a deterministic key from query parameters
    const sortedParams = Object.keys(queryParams)
      .sort()
      .reduce((obj, key) => {
        obj[key] = queryParams[key];
        return obj;
      }, {});
    
    return JSON.stringify(sortedParams);
  }

  /**
   * Clear all cache entries
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Clear expired cache entries
   */
  clearExpiredCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheConfig.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get statistics about recorded queries and cache
   * @returns {Object} Statistics object
   */
  getStatistics() {
    return {
      totalQueryPatterns: this.queryPatterns.size,
      cacheSize: this.cache.size,
      cacheConfig: { ...this.cacheConfig },
      topQueries: Array.from(this.queryPatterns.values())
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 10)
        .map(p => ({
          fields: p.fields,
          frequency: p.frequency,
          metadata: p.metadata
        }))
    };
  }

  /**
   * Reset all recorded query patterns
   */
  resetPatterns() {
    this.queryPatterns.clear();
  }

  /**
   * Update cache configuration
   * @param {Object} config - New configuration options
   */
  updateCacheConfig(config) {
    this.cacheConfig = {
      ...this.cacheConfig,
      ...config
    };
  }
}

module.exports = QueryOptimizer;
