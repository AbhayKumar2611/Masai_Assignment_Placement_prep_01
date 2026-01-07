import React, { useRef, useState } from 'react'

const Ques1 = () => {
  const OTP_LENGTH = 6
  const [otpValues, setOtpValues] = useState(Array(OTP_LENGTH).fill(''))
  const inputRefs = useRef([])

  const focusInput = (index) => {
    const input = inputRefs.current[index]
    if (input) {
      input.focus()
      input.select()
    }
  }

  const handleChange = (e, index) => {
    const value = e.target.value

    // Allow only digits, take last char if multiple entered (e.g., paste)
    const digit = value.replace(/\D/g, '').slice(-1)

    const updated = [...otpValues]
    updated[index] = digit || ''
    setOtpValues(updated)

    // Move to next input if a digit was entered and not at last index
    if (digit && index < OTP_LENGTH - 1) {
      focusInput(index + 1)
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      // If current box has a value, clear it first
      if (otpValues[index]) {
        const updated = [...otpValues]
        updated[index] = ''
        setOtpValues(updated)
        return
      }
      // If empty and not first, move focus to previous
      if (index > 0) {
        focusInput(index - 1)
      }
    }

    // Optional: arrow key navigation
    if (e.key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1)
    }
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      focusInput(index + 1)
    }
  }

  const handleClear = () => {
    setOtpValues(Array(OTP_LENGTH).fill(''))
    focusInput(0)
  }

  const fullOtp = otpValues.join('')

  return (
    <div style={{ padding: '24px', maxWidth: '480px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '16px' }}>6-Digit OTP Input</h2>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        {otpValues.map((value, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={value}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputRefs.current[index] = el)}
            style={{
              width: '48px',
              height: '48px',
              textAlign: 'center',
              fontSize: '24px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              outline: 'none',
            }}
          />
        ))}
      </div>

      <button
        onClick={handleClear}
        style={{
          padding: '8px 16px',
          borderRadius: '4px',
          border: 'none',
          backgroundColor: '#646cff',
          color: '#fff',
          cursor: 'pointer',
          marginBottom: '16px',
        }}
      >
        Clear
      </button>

      <div>
        <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>Entered OTP:</p>
        <p style={{ fontSize: '20px', letterSpacing: '4px', marginTop: '4px' }}>
          {fullOtp || '______'}
        </p>
      </div>
    </div>
  )
}

export default Ques1
