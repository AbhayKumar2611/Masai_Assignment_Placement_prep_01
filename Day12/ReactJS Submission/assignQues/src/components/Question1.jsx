import React, { useState, useEffect } from 'react'

const Question1 = () => {
  const defaultSettings = {
    theme: 'light',
    language: 'en',
    notifications: true
  }

  const [settings, setSettings] = useState(defaultSettings)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(prev => ({ ...defaultSettings, ...parsed }))
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings))
  }, [settings])

  const handleThemeChange = (e) => {
    setSettings(prev => ({
      ...prev,
      theme: e.target.value
    }))
  }

  const handleLanguageChange = (e) => {
    setSettings(prev => ({
      ...prev,
      language: e.target.value
    }))
  }

  const handleNotificationsChange = (e) => {
    setSettings(prev => ({
      ...prev,
      notifications: e.target.checked
    }))
  }

  const handleReset = () => {
    setSettings(defaultSettings)
    localStorage.setItem('appSettings', JSON.stringify(defaultSettings))
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Settings Panel</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Settings are automatically saved to localStorage and persist across page refreshes.
      </p>

      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        {/* Theme Setting */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Theme:
          </label>
          <select
            value={settings.theme}
            onChange={handleThemeChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>

        {/* Language Setting */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Language:
          </label>
          <select
            value={settings.language}
            onChange={handleLanguageChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        {/* Notifications Setting */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={handleNotificationsChange}
              style={{ width: '20px', height: '20px' }}
            />
            <span style={{ fontWeight: 'bold' }}>Enable Notifications</span>
          </label>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        style={{
          padding: '12px 24px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        Reset to Defaults
      </button>

      {/* Current Settings Display */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#e9ecef',
        borderRadius: '8px'
      }}>
        <h3 style={{ marginTop: 0 }}>Current Settings:</h3>
        <pre style={{ margin: 0, fontSize: '14px' }}>
          {JSON.stringify(settings, null, 2)}
        </pre>
      </div>

      {/* Test Instructions */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#fff3cd',
        borderRadius: '8px',
        border: '1px solid #ffc107'
      }}>
        <strong>Test:</strong> Change settings, refresh the page, and verify settings persist.
      </div>
    </div>
  )
}

export default Question1
