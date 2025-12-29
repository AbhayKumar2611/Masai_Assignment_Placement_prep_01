import React, { useState } from 'react'

// Alert Component - Using props composition and children pattern
const Alert = ({ type, message, onDismiss, children }) => {
  const alertStyles = {
    success: {
      backgroundColor: '#d4edda',
      borderColor: '#c3e6cb',
      color: '#155724',
      icon: '✅'
    },
    error: {
      backgroundColor: '#f8d7da',
      borderColor: '#f5c6cb',
      color: '#721c24',
      icon: '❌'
    },
    warning: {
      backgroundColor: '#fff3cd',
      borderColor: '#ffeaa7',
      color: '#856404',
      icon: '⚠️'
    },
    info: {
      backgroundColor: '#d1ecf1',
      borderColor: '#bee5eb',
      color: '#0c5460',
      icon: 'ℹ️'
    }
  }

  const style = alertStyles[type] || alertStyles.info

  return (
    <div style={{
      backgroundColor: style.backgroundColor,
      border: `2px solid ${style.borderColor}`,
      borderRadius: '8px',
      padding: '15px 20px',
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '15px',
      color: style.color,
      animation: 'slideIn 0.3s ease-out',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <span style={{ fontSize: '24px', flexShrink: 0 }}>
        {style.icon}
      </span>
      
      <div style={{ flexGrow: 1 }}>
        {/* Using children pattern - can pass custom content */}
        {children || (
          <div>
            <strong style={{ fontSize: '16px', display: 'block', marginBottom: '5px' }}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </strong>
            <div style={{ fontSize: '14px' }}>{message}</div>
          </div>
        )}
      </div>

      {/* Dismiss button - callback prop pattern */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: style.color,
            opacity: 0.7,
            padding: '0',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'opacity 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.opacity = '1'}
          onMouseOut={(e) => e.target.style.opacity = '0.7'}
          aria-label="Dismiss alert"
        >
          ✕
        </button>
      )}
      
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}

// Alert Container Component - Component composition pattern
const AlertContainer = ({ children }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '400px',
      maxWidth: '90vw',
      zIndex: 1000
    }}>
      {children}
    </div>
  )
}

const Ques2 = () => {
  // State to manage alerts
  const [alerts, setAlerts] = useState([])

  // Add alert function
  const addAlert = (type, message) => {
    const id = Date.now() + Math.random()
    setAlerts(prev => [...prev, { id, type, message }])
  }

  // Remove alert function (callback prop pattern)
  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
  }

  // Show sample alerts
  const showSampleAlerts = () => {
    // Clear existing alerts first
    setAlerts([])
    
    // Add all alert types
    setTimeout(() => addAlert('success', 'Operation completed successfully!'), 100)
    setTimeout(() => addAlert('error', 'An error occurred. Please try again.'), 200)
    setTimeout(() => addAlert('warning', 'Warning: This action cannot be undone.'), 300)
    setTimeout(() => addAlert('info', 'Information: New features are available.'), 400)
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{
        textAlign: 'center',
        color: '#333',
        marginBottom: '30px',
        fontSize: '28px'
      }}>Alert System</h2>

      {/* Control Panel */}
      <div style={{
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '12px',
        padding: '25px',
        marginBottom: '30px'
      }}>
        <h3 style={{
          fontSize: '20px',
          color: '#333',
          marginBottom: '20px'
        }}>Alert Controls</h3>
        
        <div style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          marginBottom: '20px'
        }}>
          <button
            onClick={() => addAlert('success', 'This is a success message!')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Success Alert
          </button>

          <button
            onClick={() => addAlert('error', 'This is an error message!')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Error Alert
          </button>

          <button
            onClick={() => addAlert('warning', 'This is a warning message!')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ffc107',
              color: '#333',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Warning Alert
          </button>

          <button
            onClick={() => addAlert('info', 'This is an info message!')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Info Alert
          </button>
        </div>

        <button
          onClick={showSampleAlerts}
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            width: '100%'
          }}
        >
          🎯 Show Sample Alerts
        </button>
      </div>

      {/* Alert Container - Using composition pattern */}
      <AlertContainer>
        {alerts.map(alert => (
          <Alert
            key={alert.id}
            type={alert.type}
            message={alert.message}
            onDismiss={() => removeAlert(alert.id)}
          />
        ))}
      </AlertContainer>

      {/* Instructions */}
      <div style={{
        backgroundColor: '#e7f3ff',
        border: '1px solid #b3d9ff',
        borderRadius: '8px',
        padding: '20px',
        marginTop: '30px'
      }}>
        <h4 style={{
          color: '#004085',
          marginBottom: '10px',
          fontSize: '18px'
        }}>📚 How it works:</h4>
        <ul style={{
          color: '#004085',
          fontSize: '14px',
          lineHeight: '1.8',
          margin: 0,
          paddingLeft: '20px'
        }}>
          <li><strong>Props Composition:</strong> Alert component accepts type, message, onDismiss props</li>
          <li><strong>Children Pattern:</strong> Alert can accept custom children content</li>
          <li><strong>Callback Props:</strong> onDismiss callback removes alerts</li>
          <li><strong>Component Composition:</strong> AlertContainer wraps and positions alerts</li>
          <li><strong>State Management:</strong> Alerts are stored in state and can be stacked</li>
        </ul>
      </div>
    </div>
  )
}

export default Ques2