import React, { useState, useEffect } from 'react'

const Question2 = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowBanner(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowBanner(true)
    }

    // Add event listeners
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Initial check
    if (!navigator.onLine) {
      setShowBanner(true)
    }

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Auto-hide banner when coming back online
  useEffect(() => {
    if (isOnline && showBanner) {
      const timer = setTimeout(() => {
        setShowBanner(false)
      }, 3000) // Hide after 3 seconds when online

      return () => clearTimeout(timer)
    }
  }, [isOnline, showBanner])

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Window Online/Offline Detector</h1>
      
      {/* Status Indicator */}
      <div style={{
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: isOnline ? '#d4edda' : '#f8d7da',
        border: `1px solid ${isOnline ? '#c3e6cb' : '#f5c6cb'}`,
        borderRadius: '6px',
        color: isOnline ? '#155724' : '#721c24',
        fontWeight: 'bold'
      }}>
        Status: {isOnline ? '🟢 Online' : '🔴 Offline'}
      </div>

      {/* Banner */}
      {showBanner && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#dc3545',
            color: 'white',
            padding: '15px 20px',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '16px',
            zIndex: 1000,
            animation: 'slideDown 0.3s ease-out',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}
        >
          ⚠️ {isOnline ? 'Connection restored!' : 'No internet connection. Please check your network.'}
        </div>
      )}

      {/* Instructions */}
      <div style={{
        marginTop: showBanner ? '80px' : '20px',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px'
      }}>
        <h3>How to Test:</h3>
        <ol style={{ lineHeight: '1.8' }}>
          <li>Open Chrome DevTools (F12)</li>
          <li>Go to Network tab</li>
          <li>Toggle "Offline" checkbox</li>
          <li>Watch the banner slide in from the top</li>
          <li>Toggle back to "Online" to see it disappear</li>
        </ol>
      </div>

      {/* Connection Info */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#e9ecef',
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <strong>Current Connection:</strong> {navigator.onLine ? 'Online' : 'Offline'}
        <br />
        <strong>Banner Visible:</strong> {showBanner ? 'Yes' : 'No'}
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

export default Question2
