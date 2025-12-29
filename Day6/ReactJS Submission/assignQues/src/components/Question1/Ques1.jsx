import React, { useState } from 'react'

const Ques1 = () => {
  // State to track visibility of each widget
  const [widgets, setWidgets] = useState({
    userStats: true,
    recentActivity: true,
    quickActions: true
  })

  // Toggle function for each widget
  const toggleWidget = (widgetName) => {
    setWidgets(prev => ({
      ...prev,
      [widgetName]: !prev[widgetName]
    }))
  }

  // Check if all widgets are hidden (using early return pattern)
  const allWidgetsHidden = !widgets.userStats && !widgets.recentActivity && !widgets.quickActions

  // Early return pattern for empty state
  if (allWidgetsHidden) {
    return (
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h2 style={{
          textAlign: 'center',
          color: '#333',
          marginBottom: '30px',
          fontSize: '28px'
        }}>Dashboard</h2>
        
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#f8f9fa',
          border: '2px dashed #dee2e6',
          borderRadius: '12px',
          color: '#6c757d'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📊</div>
          <h3 style={{ fontSize: '24px', marginBottom: '10px', color: '#495057' }}>
            No widgets selected
          </h3>
          <p style={{ fontSize: '16px' }}>
            Toggle widgets above to display them on your dashboard
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{
        textAlign: 'center',
        color: '#333',
        marginBottom: '30px',
        fontSize: '28px'
      }}>Dashboard</h2>

      {/* Widget Controls */}
      <div style={{
        display: 'flex',
        gap: '15px',
        marginBottom: '30px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => toggleWidget('userStats')}
          style={{
            padding: '10px 20px',
            backgroundColor: widgets.userStats ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          {widgets.userStats ? '✓' : '○'} User Stats
        </button>

        <button
          onClick={() => toggleWidget('recentActivity')}
          style={{
            padding: '10px 20px',
            backgroundColor: widgets.recentActivity ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          {widgets.recentActivity ? '✓' : '○'} Recent Activity
        </button>

        <button
          onClick={() => toggleWidget('quickActions')}
          style={{
            padding: '10px 20px',
            backgroundColor: widgets.quickActions ? '#ffc107' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          {widgets.quickActions ? '✓' : '○'} Quick Actions
        </button>
      </div>

      {/* Widget Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {/* User Stats Widget - Using && pattern */}
        {widgets.userStats && (
          <div style={{
            backgroundColor: '#ffffff',
            border: '2px solid #28a745',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '20px',
                color: '#28a745',
                margin: 0
              }}>📊 User Stats</h3>
              <button
                onClick={() => toggleWidget('userStats')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#6c757d'
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.8' }}>
              <div>Total Users: <strong>1,234</strong></div>
              <div>Active Today: <strong>567</strong></div>
              <div>New This Week: <strong>89</strong></div>
              <div>Growth Rate: <strong>+12.5%</strong></div>
            </div>
          </div>
        )}

        {/* Recent Activity Widget - Using ternary pattern */}
        {widgets.recentActivity ? (
          <div style={{
            backgroundColor: '#ffffff',
            border: '2px solid #007bff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '20px',
                color: '#007bff',
                margin: 0
              }}>🕐 Recent Activity</h3>
              <button
                onClick={() => toggleWidget('recentActivity')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#6c757d'
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              <div style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <strong>John Doe</strong> created a new post
                <div style={{ fontSize: '12px', color: '#999' }}>2 minutes ago</div>
              </div>
              <div style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <strong>Jane Smith</strong> updated profile
                <div style={{ fontSize: '12px', color: '#999' }}>15 minutes ago</div>
              </div>
              <div style={{ padding: '8px 0' }}>
                <strong>Bob Wilson</strong> commented on post
                <div style={{ fontSize: '12px', color: '#999' }}>1 hour ago</div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Quick Actions Widget - Using && pattern */}
        {widgets.quickActions && (
          <div style={{
            backgroundColor: '#ffffff',
            border: '2px solid #ffc107',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '20px',
                color: '#ffc107',
                margin: 0
              }}>⚡ Quick Actions</h3>
              <button
                onClick={() => toggleWidget('quickActions')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#6c757d'
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button style={{
                padding: '10px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                ➕ Create New Post
              </button>
              <button style={{
                padding: '10px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                👤 Add User
              </button>
              <button style={{
                padding: '10px',
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                📊 View Reports
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Ques1