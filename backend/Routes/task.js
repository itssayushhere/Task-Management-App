import express from 'express';
import Task from '../Schema/taskSchema.js';  // Adjust the path based on your folder structure
import { isAuthenticated } from '../verifyauth.js';  // Assuming you have these middlewares for auth
import User from '../Schema/userSchema.js'
const router = express.Router();

// Create a new task
router.post('/', isAuthenticated, async (req, res) => {
  const userId = req.userId;
  try {
    const { title, description, dueDate, status, priority, taskType } = req.body;

    const assignedUser = req.body.assignedUser && req.body.assignedUser.length > 0 
      ? req.body.assignedUser 
      : [userId];
    
    // Create a new task
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
    await Promise.all(assignedUser.map(async (userId) => {
      await User.findByIdAndUpdate(userId, {
        $push: { tasks: task._id }
      });
    }));

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});


// Get all tasks
router.get('/tasks', isAuthenticated, async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedUser', 'name email');
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
router.put('/:id', isAuthenticated, async (req, res) => {
 const role = req.role
  try {
    const { title, description, dueDate, status, assignedUser, priority, taskType } = req.body;
    if(role != "admin"){
      return res.status(404).json({message:"Not authourized"})
    }
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, dueDate, status, assignedUser, priority, taskType },
      { new: true, runValidators: true }
    ).populate('assignedUser', 'name email');

    if (!task) {
      return res.status(401).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a task
router.delete('/tasks/:id', isAuthenticated, async (req, res) => {
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
