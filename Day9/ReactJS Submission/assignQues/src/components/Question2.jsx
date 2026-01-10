import React, { useState } from 'react'

const Question2 = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])
  
  const [formData, setFormData] = useState({
    shipping: {
      name: '',
      address: '',
      city: '',
      zipCode: ''
    },
    billing: {
      billingName: '',
      billingAddress: '',
      cardNumber: ''
    },
    payment: {
      cardHolder: '',
      expiryDate: '',
      cvv: ''
    },
    review: {}
  })

  const [errors, setErrors] = useState({
    shipping: {},
    billing: {},
    payment: {},
    review: {}
  })

  const steps = [
    { id: 0, name: 'Shipping', key: 'shipping' },
    { id: 1, name: 'Billing', key: 'billing' },
    { id: 2, name: 'Payment', key: 'payment' },
    { id: 3, name: 'Review', key: 'review' }
  ]

  // Validation rules for each step
  const validateStep = (stepIndex) => {
    const stepErrors = {}
    const stepKey = steps[stepIndex].key

    switch (stepIndex) {
      case 0: // Shipping
        if (!formData.shipping.name.trim()) {
          stepErrors.name = 'Name is required'
        }
        if (!formData.shipping.address.trim()) {
          stepErrors.address = 'Address is required'
        }
        if (!formData.shipping.city.trim()) {
          stepErrors.city = 'City is required'
        }
        if (!formData.shipping.zipCode.trim()) {
          stepErrors.zipCode = 'ZIP code is required'
        } else if (!/^\d{5,6}$/.test(formData.shipping.zipCode)) {
          stepErrors.zipCode = 'ZIP code must be 5-6 digits'
        }
        break

      case 1: // Billing
        if (!formData.billing.billingName.trim()) {
          stepErrors.billingName = 'Billing name is required'
        }
        if (!formData.billing.billingAddress.trim()) {
          stepErrors.billingAddress = 'Billing address is required'
        }
        if (!formData.billing.cardNumber.trim()) {
          stepErrors.cardNumber = 'Card number is required'
        } else if (!/^\d{13,19}$/.test(formData.billing.cardNumber.replace(/\s/g, ''))) {
          stepErrors.cardNumber = 'Card number must be 13-19 digits'
        }
        break

      case 2: // Payment
        if (!formData.payment.cardHolder.trim()) {
          stepErrors.cardHolder = 'Card holder name is required'
        }
        if (!formData.payment.expiryDate.trim()) {
          stepErrors.expiryDate = 'Expiry date is required'
        } else if (!/^\d{2}\/\d{2}$/.test(formData.payment.expiryDate)) {
          stepErrors.expiryDate = 'Expiry date must be in MM/YY format'
        }
        if (!formData.payment.cvv.trim()) {
          stepErrors.cvv = 'CVV is required'
        } else if (!/^\d{3,4}$/.test(formData.payment.cvv)) {
          stepErrors.cvv = 'CVV must be 3-4 digits'
        }
        break

      case 3: // Review - no validation needed, just display
        break
    }

    setErrors(prev => ({
      ...prev,
      [stepKey]: stepErrors
    }))

    return Object.keys(stepErrors).length === 0
  }

  const isStepValid = (stepIndex) => {
    const stepErrors = errors[steps[stepIndex].key] || {}
    return Object.keys(stepErrors).length === 0 && 
           validateStep(stepIndex) // Re-validate to ensure current state
  }

  const handleInputChange = (stepKey, field, value) => {
    setFormData(prev => ({
      ...prev,
      [stepKey]: {
        ...prev[stepKey],
        [field]: value
      }
    }))

    // Clear error for this field when user starts typing
    if (errors[stepKey] && errors[stepKey][field]) {
      setErrors(prev => ({
        ...prev,
        [stepKey]: {
          ...prev[stepKey],
          [field]: ''
        }
      }))
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }

      // Move to next step if not at the end
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (stepIndex) => {
    // Allow jumping only to completed steps or the next uncompleted step
    if (stepIndex <= currentStep || completedSteps.includes(stepIndex)) {
      setCurrentStep(stepIndex)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Shipping
        return (
          <div>
            <h3>Shipping Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
              <div>
                <label>Full Name *</label>
                <input
                  type="text"
                  value={formData.shipping.name}
                  onChange={(e) => handleInputChange('shipping', 'name', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '14px',
                    border: errors.shipping.name ? '2px solid red' : '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
                {errors.shipping.name && (
                  <span style={{ color: 'red', fontSize: '12px' }}>{errors.shipping.name}</span>
                )}
              </div>

              <div>
                <label>Address *</label>
                <input
                  type="text"
                  value={formData.shipping.address}
                  onChange={(e) => handleInputChange('shipping', 'address', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '14px',
                    border: errors.shipping.address ? '2px solid red' : '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
                {errors.shipping.address && (
                  <span style={{ color: 'red', fontSize: '12px' }}>{errors.shipping.address}</span>
                )}
              </div>

              <div>
                <label>City *</label>
                <input
                  type="text"
                  value={formData.shipping.city}
                  onChange={(e) => handleInputChange('shipping', 'city', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '14px',
                    border: errors.shipping.city ? '2px solid red' : '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
                {errors.shipping.city && (
                  <span style={{ color: 'red', fontSize: '12px' }}>{errors.shipping.city}</span>
                )}
              </div>

              <div>
                <label>ZIP Code *</label>
                <input
                  type="text"
                  value={formData.shipping.zipCode}
                  onChange={(e) => handleInputChange('shipping', 'zipCode', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '14px',
                    border: errors.shipping.zipCode ? '2px solid red' : '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
                {errors.shipping.zipCode && (
                  <span style={{ color: 'red', fontSize: '12px' }}>{errors.shipping.zipCode}</span>
                )}
              </div>
            </div>
          </div>
        )

      case 1: // Billing
        return (
          <div>
            <h3>Billing Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
              <div>
                <label>Billing Name *</label>
                <input
                  type="text"
                  value={formData.billing.billingName}
                  onChange={(e) => handleInputChange('billing', 'billingName', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '14px',
                    border: errors.billing.billingName ? '2px solid red' : '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
                {errors.billing.billingName && (
                  <span style={{ color: 'red', fontSize: '12px' }}>{errors.billing.billingName}</span>
                )}
              </div>

              <div>
                <label>Billing Address *</label>
                <input
                  type="text"
                  value={formData.billing.billingAddress}
                  onChange={(e) => handleInputChange('billing', 'billingAddress', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '14px',
                    border: errors.billing.billingAddress ? '2px solid red' : '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
                {errors.billing.billingAddress && (
                  <span style={{ color: 'red', fontSize: '12px' }}>{errors.billing.billingAddress}</span>
                )}
              </div>

              <div>
                <label>Card Number *</label>
                <input
                  type="text"
                  value={formData.billing.cardNumber}
                  onChange={(e) => handleInputChange('billing', 'cardNumber', e.target.value.replace(/\D/g, ''))}
                  placeholder="13-19 digits"
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '14px',
                    border: errors.billing.cardNumber ? '2px solid red' : '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
                {errors.billing.cardNumber && (
                  <span style={{ color: 'red', fontSize: '12px' }}>{errors.billing.cardNumber}</span>
                )}
              </div>
            </div>
          </div>
        )

      case 2: // Payment
        return (
          <div>
            <h3>Payment Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
              <div>
                <label>Card Holder Name *</label>
                <input
                  type="text"
                  value={formData.payment.cardHolder}
                  onChange={(e) => handleInputChange('payment', 'cardHolder', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '14px',
                    border: errors.payment.cardHolder ? '2px solid red' : '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
                {errors.payment.cardHolder && (
                  <span style={{ color: 'red', fontSize: '12px' }}>{errors.payment.cardHolder}</span>
                )}
              </div>

              <div>
                <label>Expiry Date (MM/YY) *</label>
                <input
                  type="text"
                  value={formData.payment.expiryDate}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '')
                    if (value.length >= 2) {
                      value = value.slice(0, 2) + '/' + value.slice(2, 4)
                    }
                    handleInputChange('payment', 'expiryDate', value)
                  }}
                  placeholder="MM/YY"
                  maxLength={5}
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '14px',
                    border: errors.payment.expiryDate ? '2px solid red' : '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
                {errors.payment.expiryDate && (
                  <span style={{ color: 'red', fontSize: '12px' }}>{errors.payment.expiryDate}</span>
                )}
              </div>

              <div>
                <label>CVV *</label>
                <input
                  type="text"
                  value={formData.payment.cvv}
                  onChange={(e) => handleInputChange('payment', 'cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="3-4 digits"
                  maxLength={4}
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '14px',
                    border: errors.payment.cvv ? '2px solid red' : '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
                {errors.payment.cvv && (
                  <span style={{ color: 'red', fontSize: '12px' }}>{errors.payment.cvv}</span>
                )}
              </div>
            </div>
          </div>
        )

      case 3: // Review
        return (
          <div>
            <h3>Review Your Information</h3>
            <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h4>Shipping Information</h4>
                <p><strong>Name:</strong> {formData.shipping.name || 'N/A'}</p>
                <p><strong>Address:</strong> {formData.shipping.address || 'N/A'}</p>
                <p><strong>City:</strong> {formData.shipping.city || 'N/A'}</p>
                <p><strong>ZIP Code:</strong> {formData.shipping.zipCode || 'N/A'}</p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4>Billing Information</h4>
                <p><strong>Billing Name:</strong> {formData.billing.billingName || 'N/A'}</p>
                <p><strong>Billing Address:</strong> {formData.billing.billingAddress || 'N/A'}</p>
                <p><strong>Card Number:</strong> {formData.billing.cardNumber ? '****' + formData.billing.cardNumber.slice(-4) : 'N/A'}</p>
              </div>

              <div>
                <h4>Payment Details</h4>
                <p><strong>Card Holder:</strong> {formData.payment.cardHolder || 'N/A'}</p>
                <p><strong>Expiry Date:</strong> {formData.payment.expiryDate || 'N/A'}</p>
                <p><strong>CVV:</strong> ***</p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2>Wizard with Validation</h2>

      {/* Step Indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', position: 'relative' }}>
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index)
          const isCurrent = currentStep === index
          const isAccessible = index <= currentStep || isCompleted

          return (
            <div
              key={step.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                position: 'relative',
                cursor: isAccessible ? 'pointer' : 'not-allowed'
              }}
              onClick={() => handleStepClick(index)}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: isCurrent
                    ? '#007bff'
                    : isCompleted
                    ? '#28a745'
                    : '#ccc',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  border: isCurrent ? '3px solid #0056b3' : 'none'
                }}
              >
                {isCompleted && !isCurrent ? '✓' : step.id + 1}
              </div>
              <span
                style={{
                  fontSize: '12px',
                  color: isCurrent || isCompleted ? '#333' : '#999',
                  fontWeight: isCurrent ? 'bold' : 'normal'
                }}
              >
                {step.name}
              </span>
              {index < steps.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '20px',
                    left: 'calc(50% + 20px)',
                    width: 'calc(100% - 40px)',
                    height: '2px',
                    backgroundColor: isCompleted ? '#28a745' : '#ddd',
                    zIndex: -1
                  }}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Step Content */}
      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '30px',
          minHeight: '400px',
          backgroundColor: 'white'
        }}
      >
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
            backgroundColor: currentStep === 0 ? '#ccc' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={currentStep === steps.length - 1 || !isStepValid(currentStep)}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            cursor:
              currentStep === steps.length - 1 || !isStepValid(currentStep)
                ? 'not-allowed'
                : 'pointer',
            backgroundColor:
              currentStep === steps.length - 1 || !isStepValid(currentStep)
                ? '#ccc'
                : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  )
}

export default Question2
