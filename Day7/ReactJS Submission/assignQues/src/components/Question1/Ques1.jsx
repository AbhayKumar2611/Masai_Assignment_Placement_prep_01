import React, { useState, useEffect, useRef } from 'react'

const Ques1 = () => {
  // Generate mock data
  const generateProducts = () => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `Product ${i + 1}`,
      category: ['Electronics', 'Clothing', 'Food', 'Books'][i % 4],
      price: (Math.random() * 100 + 10).toFixed(2)
    }))
  }

  const [products] = useState(generateProducts())
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [isSearching, setIsSearching] = useState(false)
  const debounceTimerRef = useRef(null)

  // Manual debounce implementation
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Show "Searching..." immediately when user types
    setIsSearching(true)

    // Set new timer for 300ms
    debounceTimerRef.current = setTimeout(() => {
      // Filter products after debounce period
      const filtered = products.filter(product => {
        const searchLower = searchTerm.toLowerCase()
        return (
          product.name.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower) ||
          product.price.includes(searchTerm)
        )
      })
      setFilteredProducts(filtered)
      setIsSearching(false)
    }, 300)

    // Cleanup function to clear timer on unmount or when searchTerm changes
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [searchTerm, products])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Live Search Filter</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search products by name, category, or price..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            boxSizing: 'border-box'
          }}
        />
        {isSearching && (
          <p style={{ color: '#646cff', marginTop: '8px', fontSize: '14px' }}>
            Searching...
          </p>
        )}
      </div>

      <div style={{ textAlign: 'left' }}>
        <p style={{ marginBottom: '10px', color: '#888' }}>
          Showing {filteredProducts.length} of {products.length} products
        </p>
        
        <div style={{ display: 'grid', gap: '10px' }}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div
                key={product.id}
                style={{
                  padding: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: '#1a1a1a',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>
                    {product.name}
                  </h3>
                  <p style={{ margin: '0', color: '#888', fontSize: '14px' }}>
                    Category: {product.category}
                  </p>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#646cff' }}>
                  ${product.price}
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
              No products found matching your search.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Ques1
