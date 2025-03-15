const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// Get all todos with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;
    
    console.log(`Pagination params: page=${page}, limit=${limit}, skip=${skip}`);
    
    const totalTodos = await Todo.countDocuments();
    console.log(`Total todos in database: ${totalTodos}`);
    
    const todos = await Todo.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    console.log(`Returning ${todos.length} todos for page ${page}`);
    
    const response = {
      todos,
      totalPages: Math.ceil(totalTodos / limit),
      currentPage: page,
      totalTodos
    };
    
    console.log(`Response metadata: totalPages=${response.totalPages}, currentPage=${response.currentPage}`);
    
    res.json(response);
  } catch (err) {
    console.error('Error in GET /todos:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get a single todo
router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a todo
router.post('/', async (req, res) => {
  const todo = new Todo({
    title: req.body.title,
    description: req.body.description || '', // Default to empty string if description is not provided
    completed: req.body.completed || false // Include completed status from request body
  });

  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a todo
router.put('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    if (req.body.title) todo.title = req.body.title;
    // Allow empty description by checking if it's defined, not if it has a value
    if (req.body.description !== undefined) todo.description = req.body.description || '';
    if (req.body.completed !== undefined) todo.completed = req.body.completed;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 