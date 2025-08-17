import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import TaskItem from './TaskItem.jsx';
import AddTaskButton from './AddTaskButton.jsx';
import { useTaskContext } from '../context/TaskContext.jsx';
import Slide from '@mui/material/Slide';
import Fade from '@mui/material/Fade';

const quadrantLabels = [
  'Urgent & Important',
  'Not Urgent & Important',
  'Urgent & Not Important',
  'Not Urgent & Not Important',
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function QuadrantDialog({ open, onClose, quadrant }) {
  const { tasks } = useTaskContext();
  const quadrantTasks = tasks.filter((t) => t.quadrant === quadrant);
  const label = quadrantLabels[quadrant - 1];

  return (
    <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {label}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
        {quadrantTasks.length === 0 ? (
          <Typography color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
            No tasks in this quadrant
          </Typography>
        ) : (
          quadrantTasks.map((task) => (
            <Fade in={open} key={task.id} timeout={400}>
              <div><TaskItem task={task} showDescription={true} /></div>
            </Fade>
          ))
        )}
      </Box>
      <AddTaskButton defaultQuadrant={quadrant} />
    </Dialog>
  );
} 