import React, { useEffect, useRef, useState } from 'react'

const DEFAULT_TIME = 300
const App = () => {
  const [time, setTime] = useState(DEFAULT_TIME)
  const [isRunning, setIsRunning] = useState(false)
  const [isEditting, setIsEditting] = useState(false)
  const [inputValue, setInputValue] = useState("")

  const inputRef = useRef(null)

  /// Timer Logic
  useEffect(() => {
    if(!isRunning || time === 0) return;

    const intervalID = setInterval(() => {
      setTime((prev) => {
        if(prev <= 1){
          setIsRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // cleanup function
    return () => clearInterval(intervalID);
  },[isRunning, time])

  /// format time MM:SS
  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0")
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`
  }

  /// Edit Mode Handlers
  const handledEditStart = () => {
    if(isRunning) return;
    setIsEditting(true)
    setInputValue(time)
  }

  const confirmEdit = () => {
    const newTime = Number(inputValue)
    if(!isNaN(newTime) && newTime >= 0){
      setTime(newTime)
    }
    setIsEditting(false)
  }

  useEffect(() => {
    if(isEditting && inputRef.current){
      inputRef.current.focus
    }
  }, [isEditting])

  /// control buttons
  const toggleStartStop = () => {
    if(time === 0) return;
    setIsRunning((prev) => !prev)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setIsEditting(false)
    setTime(DEFAULT_TIME)
  }
  return (
    <div style={styles.container}>
      <h2>Countdown Timer</h2>

      {/* Timer Display */}
      <div>
        {isEditting ? (
          <input 
            ref={inputRef}
            type='number'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={confirmEdit}
            onKeyDown={(e) => e.key === "Enter" && confirmEdit()}
            style={styles.input}
          />
        ):(
          formatTime(time)
        )}
      </div>
      {time === 0 && <p style={styles.zeroMsg}>Time's Up!!</p>}

      {/* CONTROLS */}
      <div style={styles.buttons}>
        <button onClick={toggleStartStop}>
          {isRunning ? "Stop" : "Start"}
        </button>
        <button onClick={resetTimer}>Reset</button>
      </div>
    </div>
  )
}

/// Basic Styles

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
    fontFamily: "Arial"
  },
  timer: (isZero) => ({
    fontSize: "48px",
    fontWeight: "bold",
    margin:"20px",
    color: isZero ? "red" : "black",
    cursor: "pointer"
  }),
  input:{
    fontSize: "32px",
    width: "120px",
    textAlign: "center"
  },
  buttons:{
    display: "flex",
    justifyContent: "center",
    gap: "15px"
  },
  zeroMsg: {
    color: "red",
    fontWeight: "bold"
  }
}

export default App