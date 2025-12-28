import React, { useState, useEffect } from 'react'

const Question2 = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    // Handler to update window size
    const handleResize = () => {
      const newWidth = window.innerWidth
      const newHeight = window.innerHeight
      
      console.log(`📐 Window resized to: ${newWidth}x${newHeight}`)
      
      setWindowSize({
        width: newWidth,
        height: newHeight
      })
    }

    // Add event listener
    window.addEventListener('resize', handleResize)
    console.log('✅ Resize event listener added')

    // Cleanup function: remove event listener to prevent memory leaks
    return () => {
      window.removeEventListener('resize', handleResize)
      console.log('🧹 Cleanup: Resize event listener removed')
    }
  }, []) // Empty dependency array - run only on mount/unmount

  // Determine device type based on width
  const getDeviceType = (width) => {
    if (width < 768) {
      return { name: 'Mobile', icon: '📱', color: '#e91e63' }
    } else if (width >= 768 && width <= 1024) {
      return { name: 'Tablet', icon: '📱', color: '#ff9800' }
    } else {
      return { name: 'Desktop', icon: '💻', color: '#4caf50' }
    }
  }

  const device = getDeviceType(windowSize.width)

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📏 Window Resize Tracker</h1>

      <div style={styles.displayCard}>
        <div style={styles.dimensionsSection}>
          <h2 style={styles.dimensionsTitle}>Current Dimensions</h2>
          <div style={styles.dimensions}>
            <span style={styles.dimensionValue}>
              {windowSize.width}
            </span>
            <span style={styles.separator}>×</span>
            <span style={styles.dimensionValue}>
              {windowSize.height}
            </span>
          </div>
          <div style={styles.dimensionLabels}>
            <span>Width (px)</span>
            <span>Height (px)</span>
          </div>
        </div>

        <div style={styles.deviceSection}>
          <div 
            style={{
              ...styles.deviceBadge,
              backgroundColor: device.color
            }}
          >
            <span style={styles.deviceIcon}>{device.icon}</span>
            <span style={styles.deviceName}>{device.name}</span>
          </div>
        </div>
      </div>

      <div style={styles.breakpointInfo}>
        <h3 style={styles.breakpointTitle}>Device Breakpoints</h3>
        <div style={styles.breakpointList}>
          <div style={styles.breakpointItem}>
            <span style={styles.breakpointIcon}>📱</span>
            <span style={styles.breakpointText}>
              <strong>Mobile:</strong> &lt; 768px
            </span>
          </div>
          <div style={styles.breakpointItem}>
            <span style={styles.breakpointIcon}>📱</span>
            <span style={styles.breakpointText}>
              <strong>Tablet:</strong> 768px - 1024px
            </span>
          </div>
          <div style={styles.breakpointItem}>
            <span style={styles.breakpointIcon}>💻</span>
            <span style={styles.breakpointText}>
              <strong>Desktop:</strong> &gt; 1024px
            </span>
          </div>
        </div>
      </div>

      <div style={styles.instructions}>
        <p><strong>Try it:</strong> Resize your browser window and watch the dimensions update in real-time!</p>
        <p style={styles.instructionNote}>
          Check the console to see event listener logs
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '40px',
    fontSize: '32px',
  },
  displayCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: '40px',
    marginBottom: '30px',
  },
  dimensionsSection: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  dimensionsTitle: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '20px',
    fontWeight: '500',
  },
  dimensions: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '10px',
  },
  dimensionValue: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#2196f3',
    fontFamily: 'monospace',
  },
  separator: {
    fontSize: '36px',
    color: '#ccc',
    fontWeight: '300',
  },
  dimensionLabels: {
    display: 'flex',
    justifyContent: 'center',
    gap: '90px',
    fontSize: '14px',
    color: '#999',
  },
  deviceSection: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '20px',
    borderTop: '2px solid #f0f0f0',
  },
  deviceBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 32px',
    borderRadius: '50px',
    color: 'white',
    fontWeight: '600',
    fontSize: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  deviceIcon: {
    fontSize: '24px',
  },
  deviceName: {
    letterSpacing: '0.5px',
  },
  breakpointInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '25px',
    marginBottom: '20px',
  },
  breakpointTitle: {
    fontSize: '18px',
    color: '#333',
    marginBottom: '15px',
    textAlign: 'center',
  },
  breakpointList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  breakpointItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '6px',
  },
  breakpointIcon: {
    fontSize: '24px',
  },
  breakpointText: {
    fontSize: '15px',
    color: '#555',
  },
  instructions: {
    textAlign: 'center',
    color: '#666',
    fontSize: '14px',
    lineHeight: '1.6',
  },
  instructionNote: {
    marginTop: '8px',
    fontSize: '13px',
    color: '#999',
    fontStyle: 'italic',
  },
}

export default Question2