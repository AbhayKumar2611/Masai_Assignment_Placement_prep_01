const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory storage for tasks
let tasks = [];
let nextId = 1;

// Helper function to validate task data
const validateTask = (req, res, next) => {
  const { title, description, status } = req.body;
  
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ 
      error: 'Title is required and must be a non-empty string' 
    });
  }
  
  if (description && typeof description !== 'string') {
    return res.status(400).json({ 
      error: 'Description must be a string' 
    });
  }
  
  const validStatuses = ['pending', 'in-progress', 'completed'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ 
      error: `Status must be one of: ${validStatuses.join(', ')}` 
    });
  }
  
  next();
};

// GET /api/tasks - Get all tasks
app.get('/api/tasks', (req, res) => {
  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

// GET /api/tasks/:id - Get a single task by ID
app.get('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  
  if (!task) {
    return res.status(404).json({ 
      success: false,
      error: `Task with ID ${id} not found` 
    });
  }
  
  res.status(200).json({
    success: true,
    data: task
  });
});

// POST /api/tasks - Create a new task
app.post('/api/tasks', validateTask, (req, res) => {
  const { title, description, status } = req.body;
  
  const newTask = {
    id: nextId++,
    title: title.trim(),
    description: description ? description.trim() : '',
    status: status || 'pending',
    createdAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  
  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: newTask
  });
});

// PUT /api/tasks/:id - Update an entire task (replace)
app.put('/api/tasks/:id', validateTask, (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ 
      success: false,
      error: `Task with ID ${id} not found` 
    });
  }
  
  const { title, description, status } = req.body;
  
  tasks[taskIndex] = {
    id: id,
    title: title.trim(),
    description: description ? description.trim() : '',
    status: status || 'pending',
    createdAt: tasks[taskIndex].createdAt,
    updatedAt: new Date().toISOString()
  };
  
  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: tasks[taskIndex]
  });
});

// PATCH /api/tasks/:id - Partially update a task
app.patch('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ 
      success: false,
      error: `Task with ID ${id} not found` 
    });
  }
  
  const { title, description, status } = req.body;
  const validStatuses = ['pending', 'in-progress', 'completed'];
  
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Title must be a non-empty string' 
      });
    }
    tasks[taskIndex].title = title.trim();
  }
  
  if (description !== undefined) {
    if (typeof description !== 'string') {
      return res.status(400).json({ 
        error: 'Description must be a string' 
      });
    }
    tasks[taskIndex].description = description.trim();
  }
  
  if (status !== undefined) {
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: `Status must be one of: ${validStatuses.join(', ')}` 
      });
    }
    tasks[taskIndex].status = status;
  }
  
  tasks[taskIndex].updatedAt = new Date().toISOString();
  
  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: tasks[taskIndex]
  });
});

// DELETE /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ 
      success: false,
      error: `Task with ID ${id} not found` 
    });
  }
  
  const deletedTask = tasks.splice(taskIndex, 1)[0];
  
  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
    data: deletedTask
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api/tasks`);
});

