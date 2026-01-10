import React, { useState, useEffect, useRef } from 'react'

const Question1 = () => {
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0) // in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef(null)

  // Update timeLeft when minutes or seconds change
  useEffect(() => {
    if (!isRunning && !isPaused) {
      setTimeLeft(minutes * 60 + seconds)
    }
  }, [minutes, seconds, isRunning, isPaused])

  // Countdown logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            alert("Time's Up!")
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  const handleStart = () => {
    if (timeLeft > 0) {
      setIsRunning(true)
      setIsPaused(false)
    }
  }

  const handlePause = () => {
    setIsRunning(false)
    setIsPaused(true)
  }

  const handleResume = () => {
    if (timeLeft > 0) {
      setIsRunning(true)
      setIsPaused(false)
    }
  }

  const handleReset = () => {
    setIsRunning(false)
    setIsPaused(false)
    setTimeLeft(minutes * 60 + seconds)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const displayMinutes = Math.floor(timeLeft / 60)
  const displaySeconds = timeLeft % 60

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1>Live Countdown Timer</h1>

      {/* Time Input */}
      <div style={{
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        alignItems: 'center'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Minutes:
          </label>
          <input
            type="number"
            min="0"
            max="59"
            value={minutes}
            onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
            disabled={isRunning}
            style={{
              width: '80px',
              padding: '10px',
              fontSize: '18px',
              textAlign: 'center',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
        <div style={{ fontSize: '24px', marginTop: '30px' }}>:</div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Seconds:
          </label>
          <input
            type="number"
            min="0"
            max="59"
            value={seconds}
            onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
            disabled={isRunning}
            style={{
              width: '80px',
              padding: '10px',
              fontSize: '18px',
              textAlign: 'center',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
      </div>

      {/* Timer Display */}
      <div style={{
        fontSize: '72px',
        fontWeight: 'bold',
        color: timeLeft === 0 ? '#dc3545' : '#007bff',
        marginBottom: '30px',
        fontFamily: 'monospace'
      }}>
        {formatTime(timeLeft)}
      </div>

      {/* Control Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {!isRunning && !isPaused && (
          <button
            onClick={handleStart}
            disabled={timeLeft === 0}
            style={{
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: timeLeft === 0 ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              opacity: timeLeft === 0 ? 0.6 : 1
            }}
          >
            Start
          </button>
        )}

        {isRunning && (
          <button
            onClick={handlePause}
            style={{
              padding: '12px 24px',
              backgroundColor: '#ffc107',
              color: 'black',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Pause
          </button>
        )}

        {isPaused && (
          <>
            <button
              onClick={handleResume}
              style={{
                padding: '12px 24px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Resume
            </button>
          </>
        )}

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
          Reset
        </button>
      </div>

      {/* Status */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#666'
      }}>
        Status: {isRunning ? '⏱️ Running' : isPaused ? '⏸️ Paused' : '⏹️ Stopped'}
      </div>
    </div>
  )
}

export default Question1
