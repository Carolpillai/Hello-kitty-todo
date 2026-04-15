import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Task from './models/Task.js';
import { sendTaskNotification } from './utils/mailer.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('🎀 Hello Kitty Backend is alive and purring! 🎀');
});

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const user = req.query.user || 'guest';
    
    // Default: finding all if no user constraint is needed, but we explicitly want isolation
    let query = { $or: [{ owner: user }, { collaborators: user }] };
    
    // If the user profile literally happens to be an admin viewing overall, we could bypass this.
    // For now we strictly filter by the query user.
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new task
app.post('/api/tasks', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    
    // Attempt to notify any assigned collaborators
    if (savedTask.collaborators && savedTask.collaborators.length > 0) {
      // Find the actual email formats only, avoiding basic names
      const validEmails = savedTask.collaborators.filter(c => c.includes('@'));
      if (validEmails.length > 0) {
        // Fire off without awaiting, so it doesn't block UI response
        sendTaskNotification(validEmails, savedTask.title, savedTask.id);
      }
    }

    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { id: req.params.id }, 
      req.body, 
      { new: true }
    );
    if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({ id: req.params.id });
    if (!deletedTask) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
