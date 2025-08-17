import React, { useState } from 'react';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import TaskDialog from './TaskDialog.jsx';

export default function AddTaskButton({ defaultQuadrant }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}
        onClick={() => setOpen(true)}
      >
        <AddIcon />
      </Fab>
      <TaskDialog open={open} onClose={() => setOpen(false)} defaultQuadrant={defaultQuadrant} />
    </>
  );
} 