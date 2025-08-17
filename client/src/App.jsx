import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import TimerIcon from '@mui/icons-material/Timer';
import AddTaskButton from './components/AddTaskButton.jsx';
import QuadrantGrid from './components/QuadrantGrid.jsx';
import PomodoroTimer from './components/PomodoroTimer.jsx';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// Placeholder import for QuadrantGrid
// import QuadrantGrid from './components/QuadrantGrid';

function App() {
  const [showManualPomodoro, setShowManualPomodoro] = useState(false);

  const handleManualPomodoro = () => {
    setShowManualPomodoro(true);
  };
  const handleManualPomodoroComplete = () => {
    setShowManualPomodoro(false);
  };

  // Placeholder states
  const loading = false;
  const error = null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Quadrant Todo
          </Typography>
          <IconButton
            color={showManualPomodoro ? 'primary' : 'inherit'}
            sx={{ ml: 2 }}
            aria-label="Manual Pomodoro Timer"
            onClick={handleManualPomodoro}
            title="Start a manual Pomodoro"
          >
            <TimerIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4, mb: 4 }}>
        {showManualPomodoro && (
          <PomodoroTimer
            key="manual"
            taskTitle={"Manual Pomodoro"}
            onComplete={handleManualPomodoroComplete}
          />
        )}
        {loading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <QuadrantGrid />
        )}
      </Container>
      <AddTaskButton />
    </LocalizationProvider>
  );
}

export default App; 