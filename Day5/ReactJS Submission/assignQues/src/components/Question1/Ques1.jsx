import React, { useState, useEffect } from 'react'

const Ques1 = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Function to fetch user profile (can be called from useEffect or retry button)
  const fetchUserProfile = async (signal = null) => {
    try {
      setLoading(true)
      setError(null)
      
      const fetchOptions = signal ? { signal } : {}
      const response = await fetch('https://jsonplaceholder.typicode.com/users/1', fetchOptions)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const userData = await response.json()
      
      // Only update state if not aborted (component still mounted)
      if (!signal || !signal.aborted) {
        setUser(userData)
        setLoading(false)
      }
    } catch (err) {
      // Ignore abort errors (component unmounted)
      if (err.name === 'AbortError') {
        console.log('Fetch aborted - component unmounted')
        return
      }
      
      // Only update state if not aborted
      if (!signal || !signal.aborted) {
        setError(err.message || 'Failed to fetch user profile')
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    // AbortController for cleanup - prevents state updates on unmounted components
    const abortController = new AbortController()
    const signal = abortController.signal

    // Fetch user profile on component mount
    fetchUserProfile(signal)

    // Cleanup function - cancels fetch if component unmounts
    return () => {
      abortController.abort()
      console.log('🧹 Cleanup: Aborting fetch request (component unmounted)')
    }
  }, []) // Empty dependency array - runs only on mount

  // Retry handler (no signal needed - user-initiated action)
  const handleRetry = () => {
    fetchUserProfile()
  }

  // Loading state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <p style={{ fontSize: '18px', color: '#666' }}>Loading user profile...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '8px',
          padding: '20px',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '15px'
          }}>⚠️</div>
          <h2 style={{
            color: '#721c24',
            marginBottom: '10px',
            fontSize: '24px'
          }}>Error Loading Profile</h2>
          <p style={{
            color: '#721c24',
            marginBottom: '20px',
            fontSize: '16px'
          }}>{error}</p>
          <button
            onClick={handleRetry}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    )
  }

  // Success state - Display user profile
  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{
        textAlign: 'center',
        color: '#333',
        marginBottom: '30px',
        fontSize: '28px'
      }}>User Profile</h2>
      
      {user && (
        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '25px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '25px'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: '#007bff',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
              fontWeight: 'bold',
              margin: '0 auto 15px'
            }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h3 style={{
              fontSize: '24px',
              color: '#333',
              marginBottom: '5px'
            }}>{user.name}</h3>
            <p style={{
              color: '#666',
              fontSize: '16px',
              fontStyle: 'italic'
            }}>@{user.username}</p>
          </div>

          <div style={{
            borderTop: '1px solid #dee2e6',
            paddingTop: '20px'
          }}>
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#495057', display: 'block', marginBottom: '5px' }}>📧 Email:</strong>
              <span style={{ color: '#212529' }}>{user.email}</span>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#495057', display: 'block', marginBottom: '5px' }}>📱 Phone:</strong>
              <span style={{ color: '#212529' }}>{user.phone}</span>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#495057', display: 'block', marginBottom: '5px' }}>🌐 Website:</strong>
              <a 
                href={`https://${user.website}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#007bff', textDecoration: 'none' }}
                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
              >
                {user.website}
              </a>
            </div>

            {user.address && (
              <div style={{ marginBottom: '15px' }}>
                <strong style={{ color: '#495057', display: 'block', marginBottom: '5px' }}>📍 Address:</strong>
                <span style={{ color: '#212529' }}>
                  {user.address.street}, {user.address.suite}<br />
                  {user.address.city}, {user.address.zipcode}
                </span>
              </div>
            )}

            {user.company && (
              <div>
                <strong style={{ color: '#495057', display: 'block', marginBottom: '5px' }}>🏢 Company:</strong>
                <span style={{ color: '#212529' }}>{user.company.name}</span>
                <p style={{ color: '#6c757d', fontSize: '14px', marginTop: '5px', fontStyle: 'italic' }}>
                  "{user.company.catchPhrase}"
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Ques1