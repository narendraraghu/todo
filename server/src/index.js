const express = require('express');
const cors = require('cors');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3100;

app.use(cors());
app.use(express.json());

// Setup LowDB
const dbFile = path.join(__dirname, 'db.json');
const adapter = new FileSync(dbFile);
const db = low(adapter);

db.defaults({ tasks: [] }).write();

// GET /api/tasks - fetch all tasks
app.get('/api/tasks', (req, res) => {
  res.json(db.get('tasks').value());
});

// GET /api/tasks/:id - fetch a single task
app.get('/api/tasks/:id', (req, res) => {
  const task = db.get('tasks').find({ id: req.params.id }).value();
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

// POST /api/tasks - create a new task
app.post('/api/tasks', (req, res) => {
  const { title, description, quadrant, dueDate, completed, createdAt, updatedAt, status } = req.body;
  if (!title || !quadrant) {
    return res.status(400).json({ error: 'Title and quadrant are required' });
  }
  const newTask = {
    id: uuidv4(),
    title,
    description: description || '',
    quadrant,
    dueDate: dueDate || null,
    completed: completed || false,
    createdAt: createdAt || new Date().toISOString(),
    updatedAt: updatedAt || new Date().toISOString(),
    status: status || 'Pending',
  };
  db.get('tasks').push(newTask).write();
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id - update a task
app.put('/api/tasks/:id', (req, res) => {
  const task = db.get('tasks').find({ id: req.params.id }).value();
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const updates = req.body;
  updates.updatedAt = new Date().toISOString();
  if (typeof updates.status === 'undefined') {
    updates.status = task.status || 'Pending';
  }

  db.get('tasks').find({ id: req.params.id }).assign(updates).write();
  const updatedTask = db.get('tasks').find({ id: req.params.id }).value();
  res.json(updatedTask);
});

// DELETE /api/tasks/:id - delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const task = db.get('tasks').find({ id: req.params.id }).value();
  if (!task) return res.status(404).json({ error: 'Task not found' });

  db.get('tasks').remove({ id: req.params.id }).write();
  res.json({ success: true });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 