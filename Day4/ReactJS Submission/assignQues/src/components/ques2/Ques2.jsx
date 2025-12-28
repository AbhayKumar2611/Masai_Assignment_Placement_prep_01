import React, { useState } from 'react'

const Ques2 = () => {
  // Initial tasks with stable IDs
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Design homepage mockup', category: 'Design' },
    { id: '2', title: 'Implement authentication', category: 'Development' },
    { id: '3', title: 'Write API documentation', category: 'Documentation' },
    { id: '4', title: 'Review pull requests', category: 'Development' },
    { id: '5', title: 'Update user guide', category: 'Documentation' },
  ])

  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Development')

  // Move task up - Immutable array manipulation
  const moveUp = (index) => {
    if (index === 0) return // Already at top

    // Create new array with swapped elements (immutable)
    const newTasks = [...tasks]
    const temp = newTasks[index]
    newTasks[index] = newTasks[index - 1]
    newTasks[index - 1] = temp

    setTasks(newTasks)
    console.log(`⬆️ Moved task "${temp.title}" up from position ${index + 1} to ${index}`)
  }

  // Move task down - Immutable array manipulation
  const moveDown = (index) => {
    if (index === tasks.length - 1) return // Already at bottom

    // Create new array with swapped elements (immutable)
    const newTasks = [...tasks]
    const temp = newTasks[index]
    newTasks[index] = newTasks[index + 1]
    newTasks[index + 1] = temp

    setTasks(newTasks)
    console.log(`⬇️ Moved task "${temp.title}" down from position ${index + 1} to ${index + 2}`)
  }

  // Add new task
  const handleAddTask = () => {
    if (newTaskTitle.trim() === '') {
      alert('Please enter a task title!')
      return
    }

    const newTask = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: newTaskTitle,
      category: selectedCategory
    }

    setTasks([...tasks, newTask])
    setNewTaskTitle('')
    console.log('✅ Added new task:', newTask)
  }

  // Delete task
  const handleDeleteTask = (id) => {
    const taskToDelete = tasks.find(task => task.id === id)
    setTasks(tasks.filter(task => task.id !== id))
    console.log('🗑️ Deleted task:', taskToDelete)
  }

  // Get category color
  const getCategoryColor = (category) => {
    switch(category) {
      case 'Design': return '#e91e63'
      case 'Development': return '#2196f3'
      case 'Documentation': return '#ff9800'
      case 'Testing': return '#4caf50'
      default: return '#999'
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📋 Drag-to-Reorder List</h1>

      <div style={styles.description}>
        <p>Use the arrow buttons to reorder tasks. The position number updates automatically!</p>
      </div>

      {/* Add Task Form */}
      <div style={styles.addTaskCard}>
        <h3 style={styles.addTaskTitle}>Add New Task</h3>
        <div style={styles.addTaskForm}>
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder="Enter task title..."
            style={styles.taskInput}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={styles.categorySelect}
          >
            <option value="Development">Development</option>
            <option value="Design">Design</option>
            <option value="Documentation">Documentation</option>
            <option value="Testing">Testing</option>
          </select>
          <button 
            onClick={handleAddTask}
            style={styles.addButton}
          >
            + Add Task
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div style={styles.taskListCard}>
        <div style={styles.taskListHeader}>
          <h3 style={styles.taskListTitle}>Task Queue ({tasks.length} tasks)</h3>
          <p style={styles.taskListSubtitle}>Tasks are executed in order from top to bottom</p>
        </div>

        {tasks.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyStateText}>📭 No tasks yet! Add one above to get started.</p>
          </div>
        ) : (
          <div style={styles.taskList}>
            {/* Using stable id as key */}
            {tasks.map((task, index) => (
              <TaskItem
                key={task.id} // Stable unique key
                task={task}
                index={index}
                isFirst={index === 0}
                isLast={index === tasks.length - 1}
                onMoveUp={moveUp}
                onMoveDown={moveDown}
                onDelete={handleDeleteTask}
                getCategoryColor={getCategoryColor}
              />
            ))}
          </div>
        )}
      </div>

      <div style={styles.info}>
        <p><strong>Features:</strong></p>
        <ul style={styles.infoList}>
          <li>Move tasks up or down to reorder them</li>
          <li>Position numbers update automatically</li>
          <li>First task can't move up (button disabled)</li>
          <li>Last task can't move down (button disabled)</li>
          <li>Add new tasks with categories</li>
          <li>Delete tasks you no longer need</li>
        </ul>
      </div>
    </div>
  )
}

// Task Item Component
const TaskItem = ({ task, index, isFirst, isLast, onMoveUp, onMoveDown, onDelete, getCategoryColor }) => {
  return (
    <div style={styles.taskItem}>
      {/* Position Number */}
      <div style={styles.positionBadge}>
        <span style={styles.positionNumber}>#{index + 1}</span>
      </div>

      {/* Task Content */}
      <div style={styles.taskContent}>
        <div style={styles.taskHeader}>
          <h4 style={styles.taskTitle}>{task.title}</h4>
          <span
            style={{
              ...styles.categoryBadge,
              backgroundColor: getCategoryColor(task.category),
            }}
          >
            {task.category}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={styles.actionButtons}>
        <button
          onClick={() => onMoveUp(index)}
          disabled={isFirst}
          style={{
            ...styles.moveButton,
            ...styles.moveUpButton,
            opacity: isFirst ? 0.3 : 1,
            cursor: isFirst ? 'not-allowed' : 'pointer',
          }}
          title={isFirst ? 'Already at top' : 'Move up'}
        >
          ▲
        </button>
        <button
          onClick={() => onMoveDown(index)}
          disabled={isLast}
          style={{
            ...styles.moveButton,
            ...styles.moveDownButton,
            opacity: isLast ? 0.3 : 1,
            cursor: isLast ? 'not-allowed' : 'pointer',
          }}
          title={isLast ? 'Already at bottom' : 'Move down'}
        >
          ▼
        </button>
        <button
          onClick={() => onDelete(task.id)}
          style={styles.deleteButton}
          title="Delete task"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '15px',
    fontSize: '28px',
  },
  description: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '30px',
    fontSize: '14px',
  },
  addTaskCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '25px',
    marginBottom: '25px',
  },
  addTaskTitle: {
    fontSize: '18px',
    color: '#333',
    marginBottom: '15px',
    fontWeight: '600',
  },
  addTaskForm: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  taskInput: {
    flex: '1',
    minWidth: '250px',
    padding: '12px 15px',
    fontSize: '15px',
    border: '2px solid #e0e0e0',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  categorySelect: {
    padding: '12px 15px',
    fontSize: '15px',
    border: '2px solid #e0e0e0',
    borderRadius: '6px',
    outline: 'none',
    backgroundColor: 'white',
    cursor: 'pointer',
    minWidth: '150px',
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
  taskListCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '25px',
    marginBottom: '25px',
  },
  taskListHeader: {
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '2px solid #f0f0f0',
  },
  taskListTitle: {
    fontSize: '18px',
    color: '#333',
    marginBottom: '5px',
    fontWeight: '600',
  },
  taskListSubtitle: {
    fontSize: '13px',
    color: '#999',
    margin: 0,
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  taskItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '18px',
    border: '2px solid #f0f0f0',
    borderRadius: '8px',
    backgroundColor: 'white',
    transition: 'all 0.2s',
  },
  positionBadge: {
    minWidth: '45px',
    height: '45px',
    borderRadius: '50%',
    backgroundColor: '#2196f3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  positionNumber: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'white',
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  taskTitle: {
    fontSize: '16px',
    color: '#333',
    margin: 0,
    fontWeight: '500',
  },
  categoryBadge: {
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
    borderRadius: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
  },
  moveButton: {
    width: '36px',
    height: '36px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: 'white',
    transition: 'all 0.2s',
  },
  moveUpButton: {
    backgroundColor: '#4caf50',
  },
  moveDownButton: {
    backgroundColor: '#ff9800',
  },
  deleteButton: {
    width: '36px',
    height: '36px',
    background: 'none',
    border: '2px solid #f44336',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s',
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

export default Ques2