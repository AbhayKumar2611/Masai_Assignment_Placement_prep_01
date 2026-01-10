import React, { useState, useRef, useEffect } from 'react'

const Question1 = () => {
  const [history, setHistory] = useState(['']) // Array of text states (snapshots)
  const [currentIndex, setCurrentIndex] = useState(0) // Current position in history
  const [text, setText] = useState('') // Current text value
  const timeoutRef = useRef(null)
  const historyRef = useRef(history)
  const indexRef = useRef(0)

  // Keep refs in sync
  useEffect(() => {
    historyRef.current = history
    indexRef.current = currentIndex
  }, [history, currentIndex])

  // Sync text with history when index changes (from undo/redo)
  useEffect(() => {
    if (history[currentIndex] !== undefined) {
      setText(history[currentIndex])
    }
  }, [currentIndex])

  // Handle text change with debounce for history tracking
  const handleTextChange = (e) => {
    const newText = e.target.value
    setText(newText) // Update text immediately for UI responsiveness

    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Save to history after a delay (debounce)
    timeoutRef.current = setTimeout(() => {
      const currentHistory = historyRef.current
      const currentIdx = indexRef.current
      
      let newHistory
      let newIndex
      
      // If we're not at the end of history (after undo), clear redo history
      if (currentIdx < currentHistory.length - 1) {
        // Remove all states after current index (clear redo history)
        const trimmedHistory = currentHistory.slice(0, currentIdx + 1)
        newHistory = [...trimmedHistory, newText]
        newIndex = newHistory.length - 1
      } else {
        // Normal case: we're at the end, just add new state
        newHistory = [...currentHistory, newText]
        newIndex = newHistory.length - 1
      }
      
      // Update both state values separately
      setHistory(newHistory)
      setCurrentIndex(newIndex)
    }, 300) // 300ms debounce
  }

  const handleUndo = () => {
    if (currentIndex > 0) {
      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
        
        // Save current text before undoing (if it changed)
        const currentText = text
        const currentHistoryState = historyRef.current
        const currentIndexState = indexRef.current
        
        if (currentText !== currentHistoryState[currentIndexState]) {
          if (currentIndexState < currentHistoryState.length - 1) {
            // Clear redo history and save current state
            const trimmedHistory = currentHistoryState.slice(0, currentIndexState + 1)
            const newHistory = [...trimmedHistory, currentText]
            setHistory(newHistory)
            setCurrentIndex(newHistory.length - 2)
          } else {
            // At end, save then go back
            const newHistory = [...currentHistoryState, currentText]
            setHistory(newHistory)
            setCurrentIndex(newHistory.length - 2)
          }
        } else {
          // Just go back
          setCurrentIndex(currentIndexState - 1)
        }
      } else {
        // No pending save, just go back
        setCurrentIndex(currentIndex - 1)
      }
    }
  }

  const handleRedo = () => {
    if (currentIndex < history.length - 1) {
      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      
      setCurrentIndex(currentIndex + 1)
    }
  }

  const canUndo = currentIndex > 0
  const canRedo = currentIndex < history.length - 1

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Undo/Redo Text Editor</h2>
      
      <div style={{ marginBottom: '10px' }}>
        <span style={{ fontSize: '14px', color: '#666' }}>
          History: {currentIndex + 1}/{history.length}
        </span>
      </div>

      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            cursor: canUndo ? 'pointer' : 'not-allowed',
            backgroundColor: canUndo ? '#007bff' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Undo
        </button>
        
        <button
          onClick={handleRedo}
          disabled={!canRedo}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            cursor: canRedo ? 'pointer' : 'not-allowed',
            backgroundColor: canRedo ? '#007bff' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Redo
        </button>
      </div>

      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="Start typing..."
        style={{
          width: '100%',
          minHeight: '300px',
          padding: '10px',
          fontSize: '16px',
          border: '2px solid #ddd',
          borderRadius: '4px',
          fontFamily: 'monospace',
          resize: 'vertical'
        }}
      />

      <div style={{ marginTop: '15px', fontSize: '12px', color: '#888' }}>
        <p><strong>Instructions:</strong></p>
        <ul>
          <li>Type in the text area to create history snapshots</li>
          <li>Use Undo to go back to previous states</li>
          <li>Use Redo to move forward in history</li>
          <li>Typing after undo will clear redo history</li>
        </ul>
      </div>
    </div>
  )
}

export default Question1
