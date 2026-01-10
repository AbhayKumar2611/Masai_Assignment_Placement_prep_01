import React, { useState, useMemo } from 'react'

const Question1 = () => {
  // Mock data
  const mockData = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: ['Admin', 'User', 'Guest'][i % 3]
  }))

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Calculate pagination
  const totalPages = Math.ceil(mockData.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentData = mockData.slice(startIndex, endIndex)

  // Calculate page numbers to show (5 at a time)
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than 5
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show 5 pages around current page
      let startPage = Math.max(1, currentPage - 2)
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)
      
      // Adjust if we're near the end
      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1)
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
    }
    
    return pages
  }

  const pageNumbers = getPageNumbers()

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Handle page size change
  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value)
    setPageSize(newSize)
    setCurrentPage(1) // Reset to first page
  }

  // Calculate showing range
  const showingStart = startIndex + 1
  const showingEnd = Math.min(endIndex, mockData.length)
  const totalResults = mockData.length

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Client-Side Pagination</h1>
      
      {/* Page Size Selector */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <label>Items per page:</label>
        <select value={pageSize} onChange={handlePageSizeChange} style={{ padding: '5px 10px' }}>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* Results Info */}
      <div style={{ marginBottom: '20px', color: '#666' }}>
        Showing {showingStart}-{showingEnd} of {totalResults} results
      </div>

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Email</th>
            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Role</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((user) => (
            <tr key={user.id}>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.id}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.name}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.email}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* First Button */}
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          style={{
            padding: '8px 16px',
            border: '1px solid #ddd',
            backgroundColor: currentPage === 1 ? '#f5f5f5' : 'white',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            borderRadius: '4px'
          }}
        >
          First
        </button>

        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: '8px 16px',
            border: '1px solid #ddd',
            backgroundColor: currentPage === 1 ? '#f5f5f5' : 'white',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            borderRadius: '4px'
          }}
        >
          Previous
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              backgroundColor: currentPage === page ? '#007bff' : 'white',
              color: currentPage === page ? 'white' : 'black',
              cursor: 'pointer',
              borderRadius: '4px',
              minWidth: '40px'
            }}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: '8px 16px',
            border: '1px solid #ddd',
            backgroundColor: currentPage === totalPages ? '#f5f5f5' : 'white',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            borderRadius: '4px'
          }}
        >
          Next
        </button>

        {/* Last Button */}
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          style={{
            padding: '8px 16px',
            border: '1px solid #ddd',
            backgroundColor: currentPage === totalPages ? '#f5f5f5' : 'white',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            borderRadius: '4px'
          }}
        >
          Last
        </button>
      </div>
    </div>
  )
}

export default Question1
