import React, { useState, useEffect, useRef } from 'react'

const Question2 = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [refreshCountdown, setRefreshCountdown] = useState(30)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const countdownRef = useRef(null)

  // Generate mock data
  const generateMockData = () => {
    const today = new Date()
    const registrations = []
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      registrations.push({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 50) + 10
      })
    }

    return {
      totalUsers: 1250,
      trend: '+12%',
      registrations,
      recentUsers: [
        { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', joinDate: '2024-10-26' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active', joinDate: '2024-10-25' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'inactive', joinDate: '2024-10-24' },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'active', joinDate: '2024-10-23' },
        { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', status: 'active', joinDate: '2024-10-22' }
      ],
      activeUsers: 980,
      inactiveUsers: 270
    }
  }

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockData = generateMockData()
      setData(mockData)
      setLastUpdated(new Date())
      setRefreshCountdown(30) // Reset countdown
    } catch (err) {
      setError('Failed to load data')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchData()
  }, [])

  // Auto-refresh countdown
  useEffect(() => {
    if (autoRefresh && !loading) {
      countdownRef.current = setInterval(() => {
        setRefreshCountdown(prev => {
          if (prev <= 1) {
            fetchData()
            return 30
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (countdownRef.current) {
        clearInterval(countdownRef.current)
      }
    }

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current)
      }
    }
  }, [autoRefresh, loading])

  // Calculate max registration count for chart scaling
  const maxRegistrations = data ? Math.max(...data.registrations.map(r => r.count)) : 0

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (loading && !data) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Loading dashboard...</div>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#dc3545' }}>
        <div>{error}</div>
        <button onClick={fetchData} style={{ marginTop: '10px', padding: '8px 16px' }}>
          Retry
        </button>
      </div>
    )
  }

  if (!data) return null

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Analytics Dashboard</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {autoRefresh && (
            <div style={{ color: '#666', fontSize: '14px' }}>
              Auto-refresh in: {refreshCountdown}s
            </div>
          )}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            style={{
              padding: '8px 16px',
              backgroundColor: autoRefresh ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {autoRefresh ? 'Auto-refresh: ON' : 'Auto-refresh: OFF'}
          </button>
          <button
            onClick={fetchData}
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Refreshing...' : 'Manual Refresh'}
          </button>
        </div>
      </div>

      {lastUpdated && (
        <div style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>
          Last updated: {lastUpdated.toLocaleString()}
        </div>
      )}

      {/* Total Users Card */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #dee2e6'
      }}>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Total Users</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#007bff' }}>
            {data.totalUsers.toLocaleString()}
          </div>
          <div style={{ color: '#28a745', fontWeight: 'bold' }}>
            {data.trend} ↗️
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {/* Registrations Chart */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h3 style={{ marginTop: 0 }}>User Registrations (Last 7 Days)</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '200px', marginTop: '20px' }}>
            {data.registrations.map((reg, index) => (
              <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: '100%',
                    backgroundColor: '#007bff',
                    height: `${(reg.count / maxRegistrations) * 180}px`,
                    borderRadius: '4px 4px 0 0',
                    minHeight: '5px',
                    marginBottom: '5px'
                  }}
                  title={`${reg.count} users`}
                />
                <div style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
                  {formatDate(reg.date)}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 'bold', marginTop: '2px' }}>
                  {reg.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h3 style={{ marginTop: 0 }}>Active vs Inactive Users</h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', marginTop: '20px' }}>
            <div style={{ position: 'relative', width: '180px', height: '180px' }}>
              {/* Pie chart using CSS */}
              <div
                style={{
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  background: `conic-gradient(
                    #28a745 0deg ${(data.activeUsers / (data.activeUsers + data.inactiveUsers)) * 360}deg,
                    #dc3545 ${(data.activeUsers / (data.activeUsers + data.inactiveUsers)) * 360}deg 360deg
                  )`,
                  position: 'relative'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'white',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                {data.activeUsers + data.inactiveUsers}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#28a745', borderRadius: '4px' }} />
              <span>Active: {data.activeUsers} ({((data.activeUsers / (data.activeUsers + data.inactiveUsers)) * 100).toFixed(1)}%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#dc3545', borderRadius: '4px' }} />
              <span>Inactive: {data.inactiveUsers} ({((data.inactiveUsers / (data.activeUsers + data.inactiveUsers)) * 100).toFixed(1)}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Users Table */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #dee2e6',
        marginTop: '20px'
      }}>
        <h3 style={{ marginTop: 0 }}>Recent Users (5 Most Recent)</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>Join Date</th>
            </tr>
          </thead>
          <tbody>
            {data.recentUsers.map((user) => (
              <tr key={user.id}>
                <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{user.name}</td>
                <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{user.email}</td>
                <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: user.status === 'active' ? '#d4edda' : '#f8d7da',
                    color: user.status === 'active' ? '#155724' : '#721c24',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{user.joinDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Question2
