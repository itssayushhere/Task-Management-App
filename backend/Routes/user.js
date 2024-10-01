import express from 'express';
import User from '../Schema/userSchema.js';  
import bcrypt from 'bcryptjs';
import validator from 'validator';  
import jwt from 'jsonwebtoken'
import { isAuthenticated } from '../verifyauth.js';
import Task from '../Schema/taskSchema.js';
const router = express.Router();

//// Registration Route
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (!validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

//// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (validator.isEmpty(password)) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role,name: user.name , email: user.email}, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ message: 'Login successful',token:token,name:user.name,role:user.role});
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error', error });
  }
});

//// Get All Users Route
router.get('/', async (req, res) => { 
  try {
      const users = await User.find().select('-password -tasks');
      const tasks = await Task.find({ taskType: 'team' }).populate("assignedUser", "name");
      return res.status(200).json({ users, tasks });
  } catch (error) {
    
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});


//// Get User By ID Route
router.get('/me',isAuthenticated, async (req, res) => {
  const userId = req.userId
  try {
    const user = await User.findById(userId).select("-password").populate('tasks',"title description dueDate status priority taskType")
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

//// Update User 
router.put('/',isAuthenticated, async (req, res) => {
  const userId = req.userId
  try {
    const { name, email, password, role } = req.body;

    // Validation for email and password
    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    let hashedPassword;
    if (password && validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })) {
      hashedPassword = await bcrypt.hash(password, 10);
    } else if (password) {
      return res.status(400).json({ message: 'Password must meet strength requirements' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        password: hashedPassword || undefined,
        role
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

//// Delete User Route
router.delete('/',isAuthenticated, async (req, res) => {
  const userId = req.userId 
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
