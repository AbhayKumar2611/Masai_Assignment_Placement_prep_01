import React, { useState } from 'react'

const Question2 = () => {
  // Mock data - all 100 posts
  const allPosts = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    author: `Author ${(i % 10) + 1}`,
    content: `This is post number ${i + 1}`,
    likes: Math.floor(Math.random() * 500),
    timestamp: new Date(Date.now() - i * 3600000).toISOString()
  }))

  const [displayedPosts, setDisplayedPosts] = useState(allPosts.slice(0, 20))
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(allPosts.length > 20)

  const handleLoadMore = () => {
    if (loading || !hasMore) return

    setLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      const currentCount = displayedPosts.length
      const nextBatch = allPosts.slice(currentCount, currentCount + 20)
      
      if (nextBatch.length > 0) {
        setDisplayedPosts(prev => [...prev, ...nextBatch])
        setHasMore(currentCount + 20 < allPosts.length)
      } else {
        setHasMore(false)
      }
      
      setLoading(false)
    }, 1000) // 1 second delay to show loading state
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Infinite Scroll Feed</h1>
      
      <div style={{ marginBottom: '20px', color: '#666' }}>
        Showing {displayedPosts.length} of {allPosts.length} posts
      </div>

      {/* Posts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
        {displayedPosts.map((post) => (
          <div
            key={post.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ fontWeight: 'bold', color: '#333' }}>{post.author}</div>
              <div style={{ color: '#666', fontSize: '14px' }}>{formatDate(post.timestamp)}</div>
            </div>
            <div style={{ marginBottom: '10px', color: '#555' }}>{post.content}</div>
            <div style={{ color: '#888', fontSize: '14px' }}>
              ❤️ {post.likes} likes
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        {hasMore ? (
          <button
            onClick={handleLoadMore}
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              minWidth: '150px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            {loading ? (
              <>
                <span>Loading...</span>
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid white',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}
                />
              </>
            ) : (
              'Load More'
            )}
          </button>
        ) : (
          <div
            style={{
              padding: '12px 24px',
              backgroundColor: '#f5f5f5',
              color: '#666',
              borderRadius: '6px',
              fontSize: '16px'
            }}
          >
            No more posts
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default Question2
