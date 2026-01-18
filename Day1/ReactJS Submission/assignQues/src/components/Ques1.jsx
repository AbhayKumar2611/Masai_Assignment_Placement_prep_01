import React, { useState } from 'react'

const Ques1 = () => {
  const [questions, setQuestions] = useState([])

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now(), text: '', type: 'text' }])
  }

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ))
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Dynamic Form Builder</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={addQuestion}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          + Add Question
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        {questions.map((question) => (
          <div 
            key={question.id} 
            style={{
              marginBottom: '15px',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              display: 'flex',
              gap: '10px',
              alignItems: 'center'
            }}
          >
            <input
              type="text"
              placeholder="Question text"
              value={question.text}
              onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
            <select
              value={question.type}
              onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
              style={{
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="email">Email</option>
            </select>
            <button
              onClick={() => removeQuestion(question.id)}
              style={{
                padding: '8px 15px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {questions.length > 0 && (
        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <h2>Live Preview</h2>
          {questions.map((question) => (
            <div key={question.id} style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                {question.text || '(Untitled Question)'}
              </label>
              <input
                type={question.type}
                placeholder={`Enter ${question.type}...`}
                disabled
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                  opacity: 0.7
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Ques1