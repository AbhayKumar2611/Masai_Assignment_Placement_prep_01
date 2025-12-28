import React, { useState } from 'react'

const Question1 = () => {
  const [password, setPassword] = useState('')

  // Validation criteria - derived from password state
  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)

  // Count criteria met
  const criteriaMet = [hasMinLength, hasUppercase, hasNumber, hasSpecialChar].filter(Boolean).length

  // Determine border color based on criteria met
  const getBorderColor = () => {
    if (criteriaMet <= 1) return '#f44336' // Red
    if (criteriaMet <= 3) return '#ff9800' // Yellow/Orange
    return '#4caf50' // Green
  }

  // Determine strength text and color
  const getStrengthInfo = () => {
    if (criteriaMet <= 1) return { text: 'Weak', color: '#f44336' }
    if (criteriaMet <= 3) return { text: 'Medium', color: '#ff9800' }
    return { text: 'Strong', color: '#4caf50' }
  }

  const strengthInfo = getStrengthInfo()

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🔐 Password Strength Validator</h1>

      <div style={styles.card}>
        <div style={styles.inputSection}>
          <label style={styles.label}>Enter Password</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Type your password..."
            style={{
              ...styles.input,
              borderColor: password ? getBorderColor() : '#e0e0e0',
              borderWidth: password ? '3px' : '2px',
            }}
          />
          {password && (
            <div style={styles.strengthBadge}>
              <span style={{ ...styles.strengthText, color: strengthInfo.color }}>
                {strengthInfo.text}
              </span>
              <span style={styles.criteriaCount}>
                {criteriaMet}/4 criteria met
              </span>
            </div>
          )}
        </div>

        <div style={styles.criteriaSection}>
          <h3 style={styles.criteriaTitle}>Password Requirements</h3>
          <div style={styles.criteriaList}>
            <CriteriaItem
              met={hasMinLength}
              text="At least 8 characters"
            />
            <CriteriaItem
              met={hasUppercase}
              text="Contains uppercase letter (A-Z)"
            />
            <CriteriaItem
              met={hasNumber}
              text="Contains number (0-9)"
            />
            <CriteriaItem
              met={hasSpecialChar}
              text="Contains special character (!@#$%...)"
            />
          </div>
        </div>

        {password && (
          <div style={styles.progressSection}>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${(criteriaMet / 4) * 100}%`,
                  backgroundColor: strengthInfo.color,
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div style={styles.info}>
        <p><strong>How it works:</strong></p>
        <ul style={styles.infoList}>
          <li>Type a password to see real-time validation</li>
          <li>Border color changes: Red (weak) → Yellow (medium) → Green (strong)</li>
          <li>Each criterion shows ✓ (met) or ✗ (not met)</li>
          <li>Progress bar shows overall strength</li>
        </ul>
      </div>
    </div>
  )
}

// Criteria Item Component
const CriteriaItem = ({ met, text }) => {
  return (
    <div style={styles.criteriaItem}>
      <span style={{
        ...styles.criteriaIcon,
        color: met ? '#4caf50' : '#f44336'
      }}>
        {met ? '✓' : '✗'}
      </span>
      <span style={{
        ...styles.criteriaText,
        color: met ? '#333' : '#999'
      }}>
        {text}
      </span>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '30px',
    fontSize: '28px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: '30px',
    marginBottom: '25px',
  },
  inputSection: {
    marginBottom: '30px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#555',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '15px',
    fontSize: '16px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.3s, border-width 0.3s',
    boxSizing: 'border-box',
    fontFamily: 'monospace',
    letterSpacing: '1px',
  },
  strengthBadge: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    padding: '10px 15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
  },
  strengthText: {
    fontSize: '16px',
    fontWeight: '700',
  },
  criteriaCount: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '500',
  },
  criteriaSection: {
    marginBottom: '20px',
  },
  criteriaTitle: {
    fontSize: '16px',
    color: '#333',
    marginBottom: '15px',
    fontWeight: '600',
  },
  criteriaList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  criteriaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    transition: 'background-color 0.2s',
  },
  criteriaIcon: {
    fontSize: '20px',
    fontWeight: 'bold',
    minWidth: '24px',
    textAlign: 'center',
  },
  criteriaText: {
    fontSize: '14px',
    transition: 'color 0.2s',
  },
  progressSection: {
    marginTop: '20px',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.3s ease, background-color 0.3s ease',
    borderRadius: '4px',
  },
  info: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#555',
  },
  infoList: {
    marginTop: '10px',
    marginBottom: '0',
    paddingLeft: '20px',
    lineHeight: '1.8',
  },
}

export default Question1