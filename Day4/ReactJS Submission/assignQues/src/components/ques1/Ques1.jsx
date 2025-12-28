import React, { useState } from 'react'

const Ques1 = () => {
  // Initial mock data
  const [todos, setTodos] = useState([
    { id: '1', text: 'Complete React project', priority: 'High', completed: false },
    { id: '2', text: 'Review PRs', priority: 'Medium', completed: true },
    { id: '3', text: 'Update documentation', priority: 'Low', completed: false }
  ])
  
  const [newTodoText, setNewTodoText] = useState('')
  const [selectedPriority, setSelectedPriority] = useState('Medium')

  // Generate unique ID for new todos
  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  // Add new todo
  const handleAddTodo = () => {
    if (newTodoText.trim() === '') {
      alert('Please enter a todo text!')
      return
    }

    const newTodo = {
      id: generateId(), // Stable, unique key
      text: newTodoText,
      priority: selectedPriority,
      completed: false
    }

    setTodos([...todos, newTodo])
    setNewTodoText('')
    console.log('✅ Added todo:', newTodo)
  }

  // Toggle completion status
  const handleToggleComplete = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed }
        : todo
    ))
    console.log('✓ Toggled todo with id:', id)
  }

  // Delete todo
  const handleDeleteTodo = (id) => {
    const todoToDelete = todos.find(todo => todo.id === id)
    setTodos(todos.filter(todo => todo.id !== id))
    console.log('🗑️ Deleted todo:', todoToDelete)
  }

  // Get priority color
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return '#f44336'
      case 'Medium': return '#ff9800'
      case 'Low': return '#4caf50'
      default: return '#999'
    }
  }

  // Calculate stats
  const totalTodos = todos.length
  const completedTodos = todos.filter(t => t.completed).length
  const activeTodos = totalTodos - completedTodos

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>✅ Todo List with Priorities</h1>

      {/* Stats Bar */}
      <div style={styles.statsBar}>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Total:</span>
          <span style={styles.statValue}>{totalTodos}</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Active:</span>
          <span style={styles.statValue}>{activeTodos}</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Completed:</span>
          <span style={styles.statValue}>{completedTodos}</span>
        </div>
      </div>

      {/* Add Todo Form */}
      <div style={styles.addTodoCard}>
        <h3 style={styles.addTodoTitle}>Add New Todo</h3>
        <div style={styles.addTodoForm}>
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
            placeholder="What needs to be done?"
            style={styles.todoInput}
          />
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            style={styles.prioritySelect}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <button 
            onClick={handleAddTodo}
            style={styles.addButton}
          >
            + Add
          </button>
        </div>
      </div>

      {/* Todo List */}
      <div style={styles.todoListCard}>
        <h3 style={styles.todoListTitle}>Your Todos</h3>
        {todos.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyStateText}>🎉 No todos yet! Add one above to get started.</p>
          </div>
        ) : (
          <div style={styles.todoList}>
            {/* Using stable id as key, NOT index */}
            {todos.map((todo) => (
              <TodoItem
                key={todo.id} // Stable unique key
                todo={todo}
                onToggle={handleToggleComplete}
                onDelete={handleDeleteTodo}
                getPriorityColor={getPriorityColor}
              />
            ))}
          </div>
        )}
      </div>

      <div style={styles.info}>
        <p><strong>Features:</strong></p>
        <ul style={styles.infoList}>
          <li>Add todos with priority levels (Low/Medium/High)</li>
          <li>Click checkbox to toggle completion</li>
          <li>Color-coded priority badges</li>
          <li>Delete todos with trash icon</li>
          <li>Press Enter in input field to add todo</li>
        </ul>
      </div>
    </div>
  )
}

// Todo Item Component
const TodoItem = ({ todo, onToggle, onDelete, getPriorityColor }) => {
  return (
    <div 
      style={{
        ...styles.todoItem,
        opacity: todo.completed ? 0.7 : 1,
        backgroundColor: todo.completed ? '#f8f9fa' : 'white',
      }}
    >
      <div style={styles.todoLeft}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          style={styles.checkbox}
        />
        <div style={styles.todoContent}>
          <span
            style={{
              ...styles.todoText,
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#999' : '#333',
            }}
          >
            {todo.text}
          </span>
          <span
            style={{
              ...styles.priorityBadge,
              backgroundColor: getPriorityColor(todo.priority),
            }}
          >
            {todo.priority}
          </span>
        </div>
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        style={styles.deleteButton}
        title="Delete todo"
      >
        🗑️
      </button>
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
  statsBar: {
    display: 'flex',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '20px',
    marginBottom: '25px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '500',
  },
  statValue: {
    fontSize: '24px',
    color: '#2196f3',
    fontWeight: 'bold',
  },
  addTodoCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '25px',
    marginBottom: '25px',
  },
  addTodoTitle: {
    fontSize: '18px',
    color: '#333',
    marginBottom: '15px',
    fontWeight: '600',
  },
  addTodoForm: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  todoInput: {
    flex: '1',
    minWidth: '200px',
    padding: '12px 15px',
    fontSize: '15px',
    border: '2px solid #e0e0e0',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  prioritySelect: {
    padding: '12px 15px',
    fontSize: '15px',
    border: '2px solid #e0e0e0',
    borderRadius: '6px',
    outline: 'none',
    backgroundColor: 'white',
    cursor: 'pointer',
    minWidth: '120px',
  },
  addButton: {
    padding: '12px 30px',
    fontSize: '15px',
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#2196f3',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  todoListCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '25px',
    marginBottom: '25px',
  },
  todoListTitle: {
    fontSize: '18px',
    color: '#333',
    marginBottom: '20px',
    fontWeight: '600',
  },
  todoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  todoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    border: '2px solid #f0f0f0',
    borderRadius: '8px',
    transition: 'all 0.2s',
  },
  todoLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    flex: 1,
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
  },
  todoContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
    flexWrap: 'wrap',
  },
  todoText: {
    fontSize: '15px',
    transition: 'all 0.2s',
  },
  priorityBadge: {
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
    borderRadius: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '5px 10px',
    transition: 'transform 0.2s',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  emptyStateText: {
    fontSize: '16px',
    color: '#999',
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

export default Ques1