import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

const DURATIONS = [
  { label: '5 min', value: 5 * 60 },
  { label: '15 min', value: 15 * 60 },
  { label: '25 min', value: 25 * 60 },
  { label: '50 min', value: 50 * 60 },
];

// Strict Pomodoro cycle: [work, short break, work, short break, work, long break]
const STRICT_CYCLE = [
  { type: 'Work', duration: 25 * 60 },
  { type: 'Short Break', duration: 5 * 60 },
  { type: 'Work', duration: 25 * 60 },
  { type: 'Short Break', duration: 5 * 60 },
  { type: 'Work', duration: 25 * 60 },
  { type: 'Long Break', duration: 15 * 60 },
];

export default function PomodoroTimer({ taskTitle, onComplete }) {
  const [strictMode, setStrictMode] = useState(false);
  const [manualDuration, setManualDuration] = useState(25 * 60);
  const [duration, setDuration] = useState(25 * 60);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(true);
  const [cycleIndex, setCycleIndex] = useState(0); // For strict mode
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  // Handle mode switch
  useEffect(() => {
    if (strictMode) {
      setCycleIndex(0);
      setDuration(STRICT_CYCLE[0].duration);
      setSecondsLeft(STRICT_CYCLE[0].duration);
      setRunning(true);
    } else {
      setDuration(manualDuration);
      setSecondsLeft(manualDuration);
      setRunning(true);
    }
  }, [strictMode]);

  // Handle manual duration change
  useEffect(() => {
    if (!strictMode) {
      setDuration(manualDuration);
      setSecondsLeft(manualDuration);
      setRunning(true);
    }
  }, [manualDuration, strictMode]);

  // Timer logic
  useEffect(() => {
    if (!running) return;
    if (secondsLeft <= 0) {
      if (strictMode) {
        // If work session completed, increment Pomodoro count
        if (STRICT_CYCLE[cycleIndex].type === 'Work') {
          setCompletedPomodoros((c) => c + 1);
        }
        // Move to next session in cycle
        const nextIndex = (cycleIndex + 1) % STRICT_CYCLE.length;
        setCycleIndex(nextIndex);
        setDuration(STRICT_CYCLE[nextIndex].duration);
        setSecondsLeft(STRICT_CYCLE[nextIndex].duration);
        setRunning(true);
      } else {
        if (onComplete) onComplete();
      }
      return;
    }
    const interval = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [running, secondsLeft, strictMode, cycleIndex, onComplete]);

  // When cycleIndex changes in strict mode, update timer
  useEffect(() => {
    if (strictMode) {
      setDuration(STRICT_CYCLE[cycleIndex].duration);
      setSecondsLeft(STRICT_CYCLE[cycleIndex].duration);
      setRunning(true);
    }
    // eslint-disable-next-line
  }, [cycleIndex]);

  const handleStop = () => setRunning(false);
  const handleStart = () => setRunning(true);
  const handleDurationChange = (e) => {
    setManualDuration(Number(e.target.value));
  };
  const handleModeToggle = (e) => {
    setStrictMode(e.target.checked);
  };

  // Display helpers
  const sessionLabel = strictMode ? STRICT_CYCLE[cycleIndex].type : 'Manual';
  const sessionNumber = strictMode ? Math.floor(cycleIndex / 2) + 1 : null;

  return (
    <Box sx={{
      p: { xs: 2, sm: 3 },
      mb: { xs: 2, sm: 3 },
      borderRadius: 2,
      boxShadow: 4,
      background: '#fffbe6',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      maxWidth: { xs: '100%', sm: 340 },
      mx: 'auto',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '100%', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mr: 1, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
          Pomodoro Timer
        </Typography>
        <FormControlLabel
          control={<Switch checked={strictMode} onChange={handleModeToggle} color="primary" />}
          label="Strict Mode"
          sx={{ ml: 0 }}
        />
      </Box>
      {taskTitle && (
        <Typography variant="subtitle1" sx={{ mb: 2, color: '#1976d2', fontWeight: 600, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
          {taskTitle}
        </Typography>
      )}
      {!strictMode && (
        <Select
          value={manualDuration}
          onChange={handleDurationChange}
          size="small"
          sx={{ mb: 2, minWidth: 120, width: '100%' }}
          disabled={running && secondsLeft !== duration}
          fullWidth
        >
          {DURATIONS.map((d) => (
            <MenuItem key={d.value} value={d.value}>{d.label}</MenuItem>
          ))}
        </Select>
      )}
      {strictMode && (
        <Typography variant="subtitle2" sx={{ mb: 1, color: '#388e3c', fontSize: { xs: '0.95rem', sm: '1rem' } }}>
          {sessionLabel} {sessionLabel === 'Work' ? `(Session ${sessionNumber})` : ''}
        </Typography>
      )}
      <Typography variant="h3" sx={{ mb: 2, fontSize: { xs: '2.2rem', sm: '2.8rem' } }}>
        {Math.floor(secondsLeft / 60).toString().padStart(2, '0')}:{(secondsLeft % 60).toString().padStart(2, '0')}
      </Typography>
      <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2 }, width: '100%' }}>
        {running ? (
          <Button variant="outlined" color="warning" onClick={handleStop} fullWidth sx={{ py: 1, fontSize: { xs: '1rem', sm: '1.05rem' } }}>Pause</Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleStart} fullWidth sx={{ py: 1, fontSize: { xs: '1rem', sm: '1.05rem' } }}>Resume</Button>
        )}
      </Box>
      <Box sx={{ mt: 2, width: '100%' }}>
        <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
          {strictMode ? `Completed Pomodoros: ${completedPomodoros}` : ''}
        </Typography>
      </Box>
    </Box>
  );
} 