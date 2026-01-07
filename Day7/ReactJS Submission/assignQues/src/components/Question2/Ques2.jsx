import React, { useState, useMemo, useEffect, useRef } from 'react'

const Ques2 = () => {
  const [number, setNumber] = useState('')
  const [theme, setTheme] = useState('light')
  const [calculationCount, setCalculationCount] = useState(0)
  const prevNumberRef = useRef('')

  // Expensive calculation: Check if number is prime
  const isPrime = (num) => {
    if (num < 2) return false
    if (num === 2) return true
    if (num % 2 === 0) return false
    
    for (let i = 3; i <= Math.sqrt(num); i += 2) {
      if (num % i === 0) return false
    }
    return true
  }

  // Expensive calculation: Get all factors
  const getFactors = (num) => {
    const factors = []
    for (let i = 1; i <= num; i++) {
      if (num % i === 0) {
        factors.push(i)
      }
    }
    return factors
  }

  // Expensive calculation: Sum of factors
  const sumOfFactors = (factors) => {
    return factors.reduce((sum, factor) => sum + factor, 0)
  }

  // Memoize expensive calculations - only recalculate when number changes
  // This prevents recalculation when theme changes
  const analysisResult = useMemo(() => {
    const num = parseInt(number)
    
    if (!number || isNaN(num) || num <= 0) {
      return {
        isValid: false,
        isPrime: false,
        factors: [],
        sumOfFactors: 0
      }
    }

    const factors = getFactors(num)
    const sum = sumOfFactors(factors)
    const prime = isPrime(num)

    return {
      isValid: true,
      isPrime: prime,
      factors: factors,
      sumOfFactors: sum
    }
  }, [number]) // Only recalculate when number changes, not when theme changes

  // Track calculation count separately - only increment when number actually changes
  useEffect(() => {
    const num = parseInt(number)
    if (number && !isNaN(num) && num > 0 && prevNumberRef.current !== number) {
      setCalculationCount(prev => prev + 1)
      prevNumberRef.current = number
    }
  }, [number])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const themeStyles = {
    light: {
      backgroundColor: '#ffffff',
      color: '#213547',
      borderColor: '#ddd'
    },
    dark: {
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      borderColor: '#444'
    }
  }

  const currentTheme = themeStyles[theme]

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: currentTheme.backgroundColor,
        color: currentTheme.color,
        borderRadius: '8px',
        transition: 'background-color 0.3s, color 0.3s'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Number Analyzer</h2>
        <button
          onClick={toggleTheme}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: `1px solid ${currentTheme.borderColor}`,
            backgroundColor: currentTheme.backgroundColor,
            color: currentTheme.color,
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '16px' }}>
          Enter a number:
        </label>
        <input
          type="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Enter a positive number"
          min="1"
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '4px',
            border: `1px solid ${currentTheme.borderColor}`,
            backgroundColor: currentTheme.backgroundColor,
            color: currentTheme.color,
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div
        style={{
          padding: '15px',
          border: `1px solid ${currentTheme.borderColor}`,
          borderRadius: '8px',
          backgroundColor: theme === 'light' ? '#f9f9f9' : '#242424',
          marginBottom: '15px'
        }}
      >
        <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#888' }}>
          Calculation Count: <strong>{calculationCount}</strong>
        </p>
        <p style={{ fontSize: '12px', color: '#888', fontStyle: 'italic' }}>
          (This count should only increase when the number changes, not when theme toggles)
        </p>
      </div>

      {analysisResult.isValid ? (
        <div
          style={{
            padding: '20px',
            border: `1px solid ${currentTheme.borderColor}`,
            borderRadius: '8px',
            backgroundColor: theme === 'light' ? '#f9f9f9' : '#242424'
          }}
        >
          <div style={{ marginBottom: '15px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Analysis Results:</h3>
            <p style={{ margin: '5px 0', fontSize: '16px' }}>
              <strong>Is Prime?</strong> {analysisResult.isPrime ? '✅ Yes' : '❌ No'}
            </p>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
              <strong>Factors:</strong>
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                padding: '10px',
                backgroundColor: currentTheme.backgroundColor,
                borderRadius: '4px',
                border: `1px solid ${currentTheme.borderColor}`
              }}
            >
              {analysisResult.factors.map((factor, index) => (
                <span
                  key={index}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: theme === 'light' ? '#e0e0e0' : '#333',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  {factor}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p style={{ margin: '0', fontSize: '16px' }}>
              <strong>Sum of Factors:</strong>{' '}
              <span style={{ color: '#646cff', fontSize: '18px', fontWeight: 'bold' }}>
                {analysisResult.sumOfFactors}
              </span>
            </p>
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: '20px',
            border: `1px solid ${currentTheme.borderColor}`,
            borderRadius: '8px',
            textAlign: 'center',
            color: '#888'
          }}
        >
          Enter a valid positive number to see analysis
        </div>
      )}
    </div>
  )
}

export default Ques2
