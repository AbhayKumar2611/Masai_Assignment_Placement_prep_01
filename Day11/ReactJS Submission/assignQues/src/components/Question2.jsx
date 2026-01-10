import React, { useState, useMemo } from 'react'

const Question2 = () => {
  // Mock data
  const allProducts = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    category: ['Electronics', 'Clothing', 'Books', 'Home'][i % 4],
    price: Math.floor(Math.random() * 200) + 20,
    inStock: Math.random() > 0.3
  }))

  const [filters, setFilters] = useState({
    categories: [],
    minPrice: '',
    maxPrice: '',
    inStock: null // null = all, true = in stock only, false = out of stock only
  })

  // Get unique categories
  const categories = useMemo(() => {
    return [...new Set(allProducts.map(p => p.category))]
  }, [])

  // Filter products
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false
      }

      // Price range filter
      if (filters.minPrice && product.price < parseInt(filters.minPrice)) {
        return false
      }
      if (filters.maxPrice && product.price > parseInt(filters.maxPrice)) {
        return false
      }

      // In stock filter
      if (filters.inStock !== null && product.inStock !== filters.inStock) {
        return false
      }

      return true
    })
  }, [filters])

  const handleCategoryChange = (category) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
  }

  const handlePriceChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleStockToggle = () => {
    setFilters(prev => ({
      ...prev,
      inStock: prev.inStock === null ? true : prev.inStock === true ? false : null
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      minPrice: '',
      maxPrice: '',
      inStock: null
    })
  }

  const hasActiveFilters = filters.categories.length > 0 || 
                          filters.minPrice || 
                          filters.maxPrice || 
                          filters.inStock !== null

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Advanced Product Filter</h1>

      {/* Filters Section */}
      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{ marginTop: 0 }}>Filters</h2>

        {/* Category Filter */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Category:
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {categories.map(category => (
              <label key={category} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                {category}
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Price Range:
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => handlePriceChange('minPrice', e.target.value)}
              style={{ padding: '8px', width: '120px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <span>to</span>
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
              style={{ padding: '8px', width: '120px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
        </div>

        {/* In Stock Filter */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filters.inStock === true}
              onChange={handleStockToggle}
            />
            <span style={{ fontWeight: 'bold' }}>In Stock Only</span>
          </label>
        </div>

        {/* Clear All Button */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
        {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
      </div>

      {/* Products Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {filteredProducts.map(product => (
          <div
            key={product.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{product.name}</div>
            <div style={{ color: '#666', marginBottom: '8px' }}>{product.category}</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff', marginBottom: '8px' }}>
              ${product.price}
            </div>
            <div style={{
              color: product.inStock ? '#28a745' : '#dc3545',
              fontWeight: 'bold'
            }}>
              {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#666',
          fontSize: '18px'
        }}>
          No products match your filters
        </div>
      )}
    </div>
  )
}

export default Question2
