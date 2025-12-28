import React, { useState } from 'react'

const Question2 = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Step 2: Account Details
    username: '',
    password: '',
    confirmPassword: '',
    // Step 3: Preferences
    newsletter: false,
    notifications: false,
    theme: 'light',
  })

  const totalSteps = 3

  // Update form data (lifted state)
  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1)
      console.log(`📝 Moving to Step ${currentStep + 1}`)
      console.log('Current form data:', formData)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      console.log(`⬅️ Going back to Step ${currentStep - 1}`)
    }
  }

  const handleSubmit = () => {
    console.log('✅ Form submitted with data:', formData)
    alert('Registration Complete! Check console for submitted data.')
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📋 Multi-step Registration</h1>

      {/* Progress Indicator */}
      <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />

      {/* Form Steps */}
      <div style={styles.formCard}>
        {currentStep === 1 && (
          <PersonalInfoStep 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        )}
        {currentStep === 2 && (
          <AccountDetailsStep 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        )}
        {currentStep === 3 && (
          <PreferencesStep 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        )}

        {/* Navigation Buttons */}
        <div style={styles.buttonContainer}>
          {currentStep > 1 && (
            <button 
              onClick={handleBack} 
              style={styles.backButton}
            >
              ← Back
            </button>
          )}
          {currentStep < totalSteps && (
            <button 
              onClick={handleNext} 
              style={styles.nextButton}
            >
              Next →
            </button>
          )}
          {currentStep === totalSteps && (
            <button 
              onClick={handleSubmit} 
              style={styles.submitButton}
            >
              Submit Registration
            </button>
          )}
        </div>
      </div>

      {/* Summary Section (visible on step 3) */}
      {currentStep === 3 && <SummarySection formData={formData} />}

      <div style={styles.info}>
        <p><strong>Features:</strong></p>
        <ul style={styles.infoList}>
          <li>Navigate between steps with Next/Back buttons</li>
          <li>Form data persists when moving between steps</li>
          <li>Progress indicator shows current step</li>
          <li>Review all data before submission</li>
        </ul>
      </div>
    </div>
  )
}

// Progress Indicator Component
const ProgressIndicator = ({ currentStep, totalSteps }) => {
  return (
    <div style={styles.progressContainer}>
      {[...Array(totalSteps)].map((_, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber === currentStep
        const isCompleted = stepNumber < currentStep
        
        return (
          <div key={stepNumber} style={styles.progressStepWrapper}>
            <div style={styles.progressStepContainer}>
              <div
                style={{
                  ...styles.progressCircle,
                  backgroundColor: isCompleted ? '#4caf50' : isActive ? '#2196f3' : '#e0e0e0',
                  color: isCompleted || isActive ? 'white' : '#999',
                }}
              >
                {isCompleted ? '✓' : stepNumber}
              </div>
              <span style={{
                ...styles.progressLabel,
                color: isActive ? '#2196f3' : '#999',
                fontWeight: isActive ? '600' : '400',
              }}>
                {stepNumber === 1 && 'Personal Info'}
                {stepNumber === 2 && 'Account Details'}
                {stepNumber === 3 && 'Preferences'}
              </span>
            </div>
            {stepNumber < totalSteps && (
              <div style={{
                ...styles.progressLine,
                backgroundColor: isCompleted ? '#4caf50' : '#e0e0e0',
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// Step 1: Personal Info
const PersonalInfoStep = ({ formData, updateFormData }) => {
  return (
    <div style={styles.stepContent}>
      <h2 style={styles.stepTitle}>Step 1: Personal Information</h2>
      <div style={styles.formGroup}>
        <label style={styles.label}>First Name</label>
        <input
          type="text"
          value={formData.firstName}
          onChange={(e) => updateFormData('firstName', e.target.value)}
          placeholder="Enter first name"
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Last Name</label>
        <input
          type="text"
          value={formData.lastName}
          onChange={(e) => updateFormData('lastName', e.target.value)}
          placeholder="Enter last name"
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData('email', e.target.value)}
          placeholder="Enter email"
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Phone</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => updateFormData('phone', e.target.value)}
          placeholder="Enter phone number"
          style={styles.input}
        />
      </div>
    </div>
  )
}

// Step 2: Account Details
const AccountDetailsStep = ({ formData, updateFormData }) => {
  return (
    <div style={styles.stepContent}>
      <h2 style={styles.stepTitle}>Step 2: Account Details</h2>
      <div style={styles.formGroup}>
        <label style={styles.label}>Username</label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => updateFormData('username', e.target.value)}
          placeholder="Choose a username"
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Password</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => updateFormData('password', e.target.value)}
          placeholder="Enter password"
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Confirm Password</label>
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => updateFormData('confirmPassword', e.target.value)}
          placeholder="Confirm password"
          style={styles.input}
        />
      </div>
    </div>
  )
}

// Step 3: Preferences
const PreferencesStep = ({ formData, updateFormData }) => {
  return (
    <div style={styles.stepContent}>
      <h2 style={styles.stepTitle}>Step 3: Preferences</h2>
      <div style={styles.checkboxGroup}>
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={formData.newsletter}
            onChange={(e) => updateFormData('newsletter', e.target.checked)}
            style={styles.checkbox}
          />
          <span>Subscribe to newsletter</span>
        </label>
      </div>
      <div style={styles.checkboxGroup}>
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={formData.notifications}
            onChange={(e) => updateFormData('notifications', e.target.checked)}
            style={styles.checkbox}
          />
          <span>Enable notifications</span>
        </label>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Theme</label>
        <select
          value={formData.theme}
          onChange={(e) => updateFormData('theme', e.target.value)}
          style={styles.select}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
      </div>
    </div>
  )
}

// Summary Section Component
const SummarySection = ({ formData }) => {
  return (
    <div style={styles.summaryCard}>
      <h3 style={styles.summaryTitle}>📋 Review Your Information</h3>
      <div style={styles.summaryGrid}>
        <div style={styles.summarySection}>
          <h4 style={styles.summarySectionTitle}>Personal Information</h4>
          <div style={styles.summaryItem}>
            <strong>Name:</strong> {formData.firstName} {formData.lastName}
          </div>
          <div style={styles.summaryItem}>
            <strong>Email:</strong> {formData.email || 'Not provided'}
          </div>
          <div style={styles.summaryItem}>
            <strong>Phone:</strong> {formData.phone || 'Not provided'}
          </div>
        </div>
        <div style={styles.summarySection}>
          <h4 style={styles.summarySectionTitle}>Account Details</h4>
          <div style={styles.summaryItem}>
            <strong>Username:</strong> {formData.username || 'Not provided'}
          </div>
          <div style={styles.summaryItem}>
            <strong>Password:</strong> {formData.password ? '••••••••' : 'Not set'}
          </div>
        </div>
        <div style={styles.summarySection}>
          <h4 style={styles.summarySectionTitle}>Preferences</h4>
          <div style={styles.summaryItem}>
            <strong>Newsletter:</strong> {formData.newsletter ? '✓ Yes' : '✗ No'}
          </div>
          <div style={styles.summaryItem}>
            <strong>Notifications:</strong> {formData.notifications ? '✓ Yes' : '✗ No'}
          </div>
          <div style={styles.summaryItem}>
            <strong>Theme:</strong> {formData.theme.charAt(0).toUpperCase() + formData.theme.slice(1)}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '800px',
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
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '40px',
    padding: '0 20px',
  },
  progressStepWrapper: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  progressStepContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  progressCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
    transition: 'all 0.3s ease',
  },
  progressLabel: {
    fontSize: '12px',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s ease',
  },
  progressLine: {
    flex: 1,
    height: '3px',
    marginLeft: '10px',
    marginRight: '10px',
    marginBottom: '28px',
    transition: 'background-color 0.3s ease',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: '40px',
    marginBottom: '25px',
  },
  stepContent: {
    minHeight: '300px',
  },
  stepTitle: {
    fontSize: '22px',
    color: '#333',
    marginBottom: '25px',
    paddingBottom: '15px',
    borderBottom: '2px solid #f0f0f0',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#555',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '15px',
    border: '2px solid #e0e0e0',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '12px',
    fontSize: '15px',
    border: '2px solid #e0e0e0',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    backgroundColor: 'white',
  },
  checkboxGroup: {
    marginBottom: '15px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '15px',
    color: '#555',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '2px solid #f0f0f0',
  },
  backButton: {
    padding: '12px 30px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#666',
    backgroundColor: '#f5f5f5',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  nextButton: {
    padding: '12px 30px',
    fontSize: '15px',
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#2196f3',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginLeft: 'auto',
    transition: 'all 0.2s',
  },
  submitButton: {
    padding: '12px 30px',
    fontSize: '15px',
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#4caf50',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginLeft: 'auto',
    transition: 'all 0.2s',
  },
  summaryCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '25px',
  },
  summaryTitle: {
    fontSize: '20px',
    color: '#333',
    marginBottom: '20px',
    textAlign: 'center',
  },
  summaryGrid: {
    display: 'grid',
    gap: '20px',
  },
  summarySection: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
  },
  summarySectionTitle: {
    fontSize: '16px',
    color: '#2196f3',
    marginBottom: '15px',
    fontWeight: '600',
  },
  summaryItem: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '8px',
    lineHeight: '1.6',
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

export default Question2