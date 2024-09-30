import express from 'express';
import Task from '../models/task.js';  // Adjust the path based on your folder structure
import { isAuthenticated, isAdmin } from '../middleware/auth.js';  // Assuming you have these middlewares for auth

const router = express.Router();

// Create a new task
router.post('/tasks', isAuthenticated, async (req, res) => {
  try {
    const { title, description, dueDate, status, assignedUser, priority, taskType } = req.body;
    const task = new Task({
      title,
      description,
      dueDate,
      status,
      assignedUser,
      priority,
      taskType,
    });
    await task.save();
    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all tasks
router.get('/tasks', isAuthenticated, async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedUser', 'name email');  // Populate user details
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific task by ID
router.get('/tasks/:id', isAuthenticated, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedUser', 'name email');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a task
router.put('/tasks/:id', isAuthenticated, async (req, res) => {
  try {
    const { title, description, dueDate, status, assignedUser, priority, taskType } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, dueDate, status, assignedUser, priority, taskType },
      { new: true, runValidators: true }
    ).populate('assignedUser', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a task
router.delete('/tasks/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search tasks by assigned user
router.get('/tasks/search/:userId', isAuthenticated, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedUser: req.params.userId }).populate('assignedUser', 'name email');
    if (!tasks.length) {
      return res.status(404).json({ message: 'No tasks found for the specified user' });
    }
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
