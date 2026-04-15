import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  id: String,
  text: String,
  author: String,
  timestamp: Date
});

const TaskSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  categoryId: { type: String, default: 'cat_personal' },
  priority: { type: String, default: 'low' },
  status: { type: String, default: 'todo' },
  completed: { type: Boolean, default: false },
  collaborators: { type: [String], default: [] },
  comments: { type: [CommentSchema], default: [] },
  owner: { type: String, default: 'guest' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Task', TaskSchema);
