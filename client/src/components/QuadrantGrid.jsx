import React, { useState } from 'react';
import { DndContext, closestCenter, useDraggable, useDroppable } from '@dnd-kit/core';
import Box from '@mui/material/Box';
import { useTaskContext } from '../context/TaskContext.jsx';
import QuadrantDialog from './QuadrantDialog.jsx';
import Typography from '@mui/material/Typography';
import TaskItem from './TaskItem.jsx';
import PomodoroTimer from './PomodoroTimer.jsx';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const quadrantMeta = [
  {
    color: '#e53935',
    border: '2px solid #e53935',
    title: 'Urgent & Important',
    subtitle: 'Do First',
  },
  {
    color: '#43a047',
    border: '2px solid #43a047',
    title: 'Not Urgent & Important',
    subtitle: 'Schedule',
  },
  {
    color: '#fbc02d',
    border: '2px solid #fbc02d',
    title: 'Urgent & Not Important',
    subtitle: 'Delegate',
  },
  {
    color: '#1e88e5',
    border: '2px solid #1e88e5',
    title: 'Not Urgent & Not Important',
    subtitle: 'Eliminate',
  },
];

function DraggableTask({ task, onStartPomodoro }) {
  // Only the drag handle is draggable
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: task.id });
  return (
    <div ref={setNodeRef} style={{ width: '100%' }}>
      <TaskItem task={task} dragHandleProps={{ ...attributes, ...listeners, isDragging }} onStartPomodoro={onStartPomodoro} />
    </div>
  );
}

function Quadrant({
  id,
  color,
  border,
  title,
  subtitle,
  children,
  isEmpty,
  onLabelClick,
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <Box
      ref={setNodeRef}
      sx={{
        minHeight: 280,
        p: { xs: 1.5, sm: 2 },
        border,
        borderRadius: 3,
        background: isOver ? `${color}08` : '#fafbfc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        position: 'relative',
        boxShadow: isOver ? 4 : 1,
        transition: 'all 0.3s ease-in-out',
        mb: { xs: 2, md: 0 },
        '&::before': isOver ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          border: `2px dashed ${color}`,
          borderRadius: 3,
          pointerEvents: 'none',
          animation: 'pulse 1.5s infinite',
        } : {},
        '@keyframes pulse': {
          '0%': { opacity: 0.3 },
          '50%': { opacity: 0.7 },
          '100%': { opacity: 0.3 },
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '100%' }}>
        <Typography
          variant="subtitle1"
          sx={{ 
            mb: 0.5, 
            fontWeight: 700, 
            color, 
            cursor: 'pointer', 
            flexGrow: 1
          }}
          onClick={onLabelClick}
        >
          {title}
        </Typography>
        {isOver && (
          <Box
            sx={{
              backgroundColor: color,
              color: 'white',
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.75rem',
              fontWeight: 600,
              animation: 'fadeIn 0.3s ease-in-out',
              '@keyframes fadeIn': {
                from: { opacity: 0, transform: 'translateY(-10px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            Drop here
          </Box>
        )}
      </Box>
      <Typography variant="caption" sx={{ mb: 1.5, color: color, fontWeight: 500 }}>
        {subtitle}
      </Typography>
      {isEmpty ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
            opacity: 0.5,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            No tasks in this quadrant
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Drag tasks here or click the title to add new ones
          </Typography>
        </Box>
      ) : (
        <Box sx={{ width: '100%', maxHeight: 400, overflowY: 'auto', overflowX: 'hidden', '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-track': { background: '#f1f1f1', borderRadius: '3px' }, '&::-webkit-scrollbar-thumb': { background: '#c1c1c1', borderRadius: '3px', '&:hover': { background: '#a8a8a8' } } }}>
          {children}
        </Box>
      )}
    </Box>
  );
}

export default function QuadrantGrid() {
  const { tasks, loading, error, moveTask, setTaskStatus } = useTaskContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedQuadrant, setSelectedQuadrant] = useState(1);
  const [pomodoroTask, setPomodoroTask] = useState(null);
  const [pendingPomodoro, setPendingPomodoro] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && ['1', '2', '3', '4'].includes(over.id) && active.id !== over.id) {
      moveTask(active.id, Number(over.id));
    }
  };

  const handleLabelClick = (q) => {
    setSelectedQuadrant(q);
    setDialogOpen(true);
  };

  const handleStartPomodoro = async (task) => {
    if (pomodoroTask && pomodoroTask.id !== task.id) {
      setPendingPomodoro(task);
      setConfirmOpen(true);
      return;
    }
    setPomodoroTask(task);
    await setTaskStatus(task.id, 'In Progress');
  };

  const handlePomodoroComplete = async () => {
    if (pomodoroTask) {
      await setTaskStatus(pomodoroTask.id, 'Closed');
      setPomodoroTask(null);
    }
  };

  const handleConfirmSwitch = async () => {
    if (pomodoroTask && pomodoroTask.status !== 'Closed') {
      await setTaskStatus(pomodoroTask.id, 'Pending');
    }
    setPomodoroTask(pendingPomodoro);
    await setTaskStatus(pendingPomodoro.id, 'In Progress');
    setPendingPomodoro(null);
    setConfirmOpen(false);
  };

  const handleCancelSwitch = () => {
    setPendingPomodoro(null);
    setConfirmOpen(false);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      {pomodoroTask && (
        <PomodoroTimer
          key={pomodoroTask.id}
          taskTitle={pomodoroTask.title}
          onComplete={handlePomodoroComplete}
        />
      )}
      <Dialog open={confirmOpen} onClose={handleCancelSwitch}>
        <DialogTitle>
          A Pomodoro is already running for "{pomodoroTask?.title}".<br />
          Stop it and start a new one for "{pendingPomodoro?.title}"?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCancelSwitch}>Cancel</Button>
          <Button onClick={handleConfirmSwitch} variant="contained" color="primary">Switch</Button>
        </DialogActions>
      </Dialog>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gridTemplateRows: { xs: 'repeat(4, 1fr)', md: '1fr 1fr' },
            gap: { xs: 2, md: 3 },
            px: { xs: 0, sm: 2 },
          }}
        >
          {[1, 2, 3, 4].map((q) => {
            const meta = quadrantMeta[q - 1];
            const quadrantTasks = tasks.filter((t) => t.quadrant === q);
            return (
              <Quadrant
                key={q}
                id={String(q)}
                color={meta.color}
                border={meta.border}
                title={meta.title}
                subtitle={meta.subtitle}
                isEmpty={quadrantTasks.length === 0}
                onLabelClick={() => handleLabelClick(q)}
              >
                {quadrantTasks.map((task) => (
                  <DraggableTask key={task.id} task={task} onStartPomodoro={handleStartPomodoro} />
                ))}
              </Quadrant>
            );
          })}
        </Box>
      </DndContext>
      <QuadrantDialog open={dialogOpen} onClose={() => setDialogOpen(false)} quadrant={selectedQuadrant} />
    </>
  );
} 