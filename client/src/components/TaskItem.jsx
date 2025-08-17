import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import TaskDialog from './TaskDialog.jsx';
import { useTaskContext } from '../context/TaskContext.jsx';
import dayjs from 'dayjs';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import TimerIcon from '@mui/icons-material/Timer';

// Quadrant metadata for colors and names
const quadrantMeta = [
  { color: '#e53935', name: 'Urgent & Important' },
  { color: '#43a047', name: 'Not Urgent & Important' },
  { color: '#fbc02d', name: 'Urgent & Not Important' },
  { color: '#1e88e5', name: 'Not Urgent & Not Important' },
];

export default function TaskItem({ task, dragHandleProps, onStartPomodoro }) {
  const { removeTask, toggleCompletion, moveTask, setTaskStatus, editTask } = useTaskContext();
  const [editOpen, setEditOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [moveMenuAnchor, setMoveMenuAnchor] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const moveMenuOpen = Boolean(moveMenuAnchor);

  // Debug: log on every render
  console.log('[TaskItem render]', task);

  // Only open dialog on card click, not on checkbox or menu
  const handleCardClick = (e) => {
    // Prevent dialog from opening if click is on checkbox or menu
    if (
      e.target.closest('.MuiCheckbox-root') ||
      e.target.closest('.MuiIconButton-root')
    ) {
      return;
    }
    console.log('[TaskItem] Card clicked, opening dialog for task:', task.id);
    setEditOpen(true);
  };

  // Checkbox toggles completion only
  const handleToggle = (event) => {
    event.stopPropagation();
    console.log('[TaskItem] Checkbox toggled for task:', task.id, 'Current completed:', task.completed, 'Setting to:', !task.completed);
    toggleCompletion(task.id, !task.completed);
  };

  // Menu open/close
  const handleMenuOpen = (event) => {
    event.stopPropagation();
    console.log('[TaskItem] 3-dot menu opened for task:', task.id);
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = (event) => {
    if (event) event.stopPropagation();
    console.log('[TaskItem] 3-dot menu closed for task:', task.id);
    setAnchorEl(null);
  };
  const handleMoveMenuOpen = (event) => {
    event.stopPropagation();
    console.log('[TaskItem] Move menu opened for task:', task.id);
    setMoveMenuAnchor(event.currentTarget);
  };
  const handleMoveMenuClose = (event) => {
    if (event) event.stopPropagation();
    console.log('[TaskItem] Move menu closed for task:', task.id);
    setMoveMenuAnchor(null);
  };

  // Menu actions
  const handleEdit = (event) => {
    if (event) event.stopPropagation();
    console.log('[TaskItem] Edit selected for task:', task.id);
    setEditOpen(true);
    handleMenuClose(event);
  };
  const handleDelete = (event) => {
    if (event) event.stopPropagation();
    console.log('[TaskItem] Delete selected for task:', task.id);
    removeTask(task.id);
    handleMenuClose(event);
  };
  const handleMoveTask = (newQuadrant, event) => {
    if (event) event.stopPropagation();
    console.log('[TaskItem] Move selected for task:', task.id, 'to quadrant:', newQuadrant);
    moveTask(task.id, newQuadrant);
    handleMoveMenuClose(event);
    handleMenuClose(event);
  };
  const handleStartPomodoro = (event) => {
    if (event) event.stopPropagation();
    if (onStartPomodoro) onStartPomodoro(task);
    handleMenuClose(event);
  };
  const handleReopen = async (event) => {
    if (event) event.stopPropagation();
    await editTask(task.id, { status: 'Pending', completed: false });
    handleMenuClose(event);
  };

  const isOverdue = task.dueDate && !task.completed && dayjs(task.dueDate).isBefore(dayjs());
  const quadrantColor = quadrantMeta[task.quadrant - 1]?.color || '#666';

  return (
    <>
      <Card 
        onClick={(e) => { if (dragHandleProps && dragHandleProps.isDragging) return; handleCardClick(e); }}
        sx={{ 
          mb: 1.5, 
          background: task.completed ? '#f5f5f5' : 'white', 
          borderRadius: 2, 
          boxShadow: task.completed ? 1 : 2,
          borderLeft: `4px solid ${quadrantColor}`,
          opacity: task.completed ? 0.7 : 1,
          transition: 'all 0.2s ease-in-out',
          cursor: 'pointer',
          '&:hover': {
            boxShadow: task.completed ? 2 : 4,
            transform: 'translateY(-1px)',
            backgroundColor: task.completed ? '#f0f0f0' : '#fafafa',
          }
        }}
      >
        <CardContent sx={{ display: 'flex', alignItems: 'center', p: 1.5 }}>
          {/* Drag handle */}
          <Box {...(dragHandleProps || {})} sx={{ cursor: dragHandleProps ? 'grab' : 'default', mr: 1, display: 'flex', alignItems: 'center', color: dragHandleProps ? '#888' : 'transparent' }}>
            <DragIndicatorIcon fontSize="small" />
          </Box>
          <Box>
            <Checkbox 
              checked={!!task.completed} 
              onChange={handleToggle} 
              sx={{ 
                mr: 1.5,
                '&.Mui-checked': {
                  color: quadrantColor,
                }
              }} 
            />
          </Box>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Typography
                variant="subtitle1"
                sx={{ 
                  textDecoration: task.completed ? 'line-through' : 'none', 
                  fontWeight: 600, 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis',
                  color: task.completed ? '#666' : '#333',
                  flexGrow: 1
                }}
              >
                {task.title}
              </Typography>
              {/* Status Chip */}
              {task.status && (
                <Chip
                  label={task.status}
                  size="small"
                  sx={{
                    ml: 1,
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    height: 20,
                    backgroundColor:
                      task.status === 'In Progress' ? '#1976d2' :
                      task.status === 'Closed' ? '#43a047' :
                      '#e0e0e0',
                    color:
                      task.status === 'In Progress' ? 'white' :
                      task.status === 'Closed' ? 'white' :
                      '#333',
                  }}
                />
              )}
            </Box>
            {isOverdue && (
              <Chip 
                label="Overdue" 
                color="error" 
                size="small" 
                sx={{ 
                  mt: 0.5, 
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: 20
                }} 
              />
            )}
          </Box>
          <Box>
            <IconButton 
              size="small" 
              onClick={handleMenuOpen}
              sx={{ 
                ml: 1,
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                }
              }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
          {/* Main Menu */}
          <Menu 
            anchorEl={anchorEl} 
            open={menuOpen} 
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                borderRadius: 2,
                boxShadow: 4,
                minWidth: 180,
              }
            }}
          >
            {task.status === 'Closed' ? (
              <MenuItem onClick={handleReopen} sx={{ py: 1.2 }}>
                <EditIcon fontSize="small" sx={{ mr: 1.5, color: '#1976d2' }} />
                Reopen Task
              </MenuItem>
            ) : (
              <>
                <MenuItem onClick={handleEdit} sx={{ py: 1.2 }}>
                  <EditIcon fontSize="small" sx={{ mr: 1.5, color: '#2196f3' }} /> 
                  Edit Task
                </MenuItem>
                <MenuItem onClick={handleMoveMenuOpen} sx={{ py: 1.2 }}>
                  <MoveToInboxIcon fontSize="small" sx={{ mr: 1.5, color: '#ff9800' }} /> 
                  Move Task
                </MenuItem>
                <MenuItem onClick={handleStartPomodoro} sx={{ py: 1.2 }}>
                  <TimerIcon fontSize="small" sx={{ mr: 1.5, color: '#1976d2' }} />
                  Start with Pomodoro
                </MenuItem>
              </>
            )}
            <Divider />
            <MenuItem onClick={handleDelete} sx={{ py: 1.2, color: '#f44336' }}>
              <DeleteIcon fontSize="small" sx={{ mr: 1.5 }} /> 
              Delete Task
            </MenuItem>
          </Menu>
          {/* Move Task Submenu */}
          <Menu
            anchorEl={moveMenuAnchor}
            open={moveMenuOpen}
            onClose={handleMoveMenuClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            PaperProps={{
              sx: {
                borderRadius: 2,
                boxShadow: 4,
                minWidth: 200,
              }
            }}
          >
            <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: 600, color: '#666' }}>
              Move to Quadrant:
            </Typography>
            {quadrantMeta.map((quadrant, index) => (
              <MenuItem 
                key={index + 1}
                onClick={(e) => handleMoveTask(index + 1, e)}
                disabled={task.quadrant === index + 1}
                sx={{ 
                  py: 1.2,
                  '&:disabled': {
                    opacity: 0.5,
                    backgroundColor: 'transparent',
                  }
                }}
              >
                <Box 
                  sx={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    backgroundColor: quadrant.color, 
                    mr: 1.5 
                  }} 
                />
                {quadrant.name}
                {task.quadrant === index + 1 && (
                  <Chip 
                    label="Current" 
                    size="small" 
                    sx={{ 
                      ml: 'auto', 
                      fontSize: '0.7rem',
                      height: 20,
                      backgroundColor: '#e0e0e0'
                    }} 
                  />
                )}
              </MenuItem>
            ))}
          </Menu>
        </CardContent>
      </Card>
      <TaskDialog open={editOpen} onClose={() => setEditOpen(false)} task={task} />
    </>
  );
} 