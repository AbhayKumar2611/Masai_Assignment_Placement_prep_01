import React, { useState, useEffect } from 'react'

const Question1 = () => {
  const [note, setNote] = useState('')
  const [saveStatus, setSaveStatus] = useState('') // '', 'saving', 'saved'
  const [isTyping, setIsTyping] = useState(false)

  // Effect to handle auto-save with debouncing
  useEffect(() => {
    // Don't run on initial mount (empty note)
    if (note === '') {
      setSaveStatus('')
      return
    }

    // Show "Saving..." immediately when user types
    setSaveStatus('saving')
    setIsTyping(true)

    // Set up debounced save after 2 seconds of inactivity
    const saveTimeout = setTimeout(() => {
      // Simulate saving the note
      console.log('💾 Saving note:', note)
      console.log('📅 Saved at:', new Date().toLocaleTimeString())
      
      setSaveStatus('saved')
      setIsTyping(false)
    }, 2000)

    // Cleanup function: cancel pending save if user types again
    return () => {
      console.log('🧹 Cleanup: Cancelling previous save timeout')
      clearTimeout(saveTimeout)
    }
  }, [note]) // Dependency array - run effect whenever note changes

  const handleNoteChange = (e) => {
    setNote(e.target.value)
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📝 Auto-save Notes</h1>
      
      <div style={styles.editorContainer}>
        <textarea
          value={note}
          onChange={handleNoteChange}
          placeholder="Start typing your notes..."
          style={styles.textarea}
          rows={10}
        />
        
        <div style={styles.statusBar}>
          {saveStatus === 'saving' && (
            <span style={styles.savingStatus}>
              💭 Saving...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span style={styles.savedStatus}>
              ✓ Saved
            </span>
          )}
          {note === '' && (
            <span style={styles.emptyStatus}>
              No content yet
            </span>
          )}
        </div>
      </div>

      <div style={styles.info}>
        <p><strong>How it works:</strong></p>
        <ul>
          <li>Type in the textarea above</li>
          <li>See "Saving..." appear immediately</li>
          <li>Stop typing for 2 seconds</li>
          <li>Status changes to "Saved ✓"</li>
          <li>Check console for save logs</li>
        </ul>
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
  },
  editorContainer: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '20px',
    marginBottom: '20px',
  },
  textarea: {
    width: '100%',
    padding: '15px',
    fontSize: '16px',
    border: '2px solid #e0e0e0',
    borderRadius: '6px',
    resize: 'vertical',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  statusBar: {
    marginTop: '15px',
    minHeight: '24px',
    fontSize: '14px',
    fontWeight: '500',
  },
  savingStatus: {
    color: '#ff9800',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  savedStatus: {
    color: '#4caf50',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  emptyStatus: {
    color: '#999',
  },
  info: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#555',
  },
}

export default Question1