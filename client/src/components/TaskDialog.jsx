import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useTaskContext } from '../context/TaskContext.jsx';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';

const quadrantOptions = [
  { value: 1, label: 'Urgent & Important' },
  { value: 2, label: 'Not Urgent & Important' },
  { value: 3, label: 'Urgent & Not Important' },
  { value: 4, label: 'Not Urgent & Not Important' },
];

export default function TaskDialog({ open, onClose, task, defaultQuadrant }) {
  const { addTask, editTask } = useTaskContext();
  const isEdit = !!task;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quadrant, setQuadrant] = useState(defaultQuadrant || 1);
  const [dueDate, setDueDate] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setQuadrant(task.quadrant || defaultQuadrant || 1);
      setDueDate(task.dueDate ? dayjs(task.dueDate) : null);
    } else {
      setTitle('');
      setDescription('');
      setQuadrant(defaultQuadrant || 1);
      setDueDate(null);
    }
    setError('');
  }, [open, isEdit, task, defaultQuadrant]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (isEdit) {
      await editTask(task.id, {
        title,
        description,
        quadrant,
        dueDate: dueDate ? dayjs(dueDate).toISOString() : null,
        updatedAt: new Date().toISOString(),
      });
    } else {
      await addTask({
        title,
        description,
        quadrant,
        dueDate: dueDate ? dayjs(dueDate).toISOString() : null,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 700, pb: 0 }}>{isEdit ? 'Edit Task' : 'Add Task'}</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              error={!!error}
              helperText={error}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              minRows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <TextField
              select
              margin="dense"
              label="Quadrant"
              fullWidth
              value={quadrant}
              onChange={e => setQuadrant(Number(e.target.value))}
            >
              {quadrantOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
            <DateTimePicker
              label="Due Date"
              value={dueDate}
              onChange={setDueDate}
              slotProps={{ textField: { fullWidth: true, margin: 'dense', variant: 'outlined' } }}
              ampm={false}
              disablePast={false}
              clearable
              sx={{ width: '100%' }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, pt: 2 }}>
          <Button onClick={onClose} variant="outlined">Cancel</Button>
          <Button type="submit" variant="contained">{isEdit ? 'Save' : 'Add'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 