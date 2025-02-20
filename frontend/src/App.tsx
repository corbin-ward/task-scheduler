import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  FormControl,
  InputLabel
} from '@mui/material';

interface Task {
  id: string;
  type: 'A' | 'B' | 'C';
  interval: number;
  status: 'Scheduled' | 'Cancelled';
  startTime: number;
  nextExecutionTime: number;
}

interface TaskOutput {
  timestamp: string;
  taskId: string;
  output: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [outputs, setOutputs] = useState<TaskOutput[]>([]);
  const [taskType, setTaskType] = useState<'A' | 'B' | 'C'>('A');
  const [interval, setInterval] = useState<number>(1000);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, []);

  const fetchOutputs = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/outputs');
      const data = await response.json();
      setOutputs(data);
    } catch (error) {
      console.error('Error fetching outputs:', error);
    }
  }, []);

  useEffect(() => {
    const fetchData = () => {
      fetchTasks();
      fetchOutputs();
    };

    const intervalId = window.setInterval(fetchData, 100);
    return () => window.clearInterval(intervalId);
  }, [fetchTasks, fetchOutputs]);

  const createTask = async () => {
    try {
      await fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: taskType, interval }),
      });
      await fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const cancelTask = async (taskId: string) => {
    try {
      await fetch(`http://localhost:3001/tasks/${taskId}`, {
        method: 'DELETE',
      });
      await fetchTasks();
    } catch (error) {
      console.error('Error canceling task:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>Create New Task</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Task Type</InputLabel>
            <Select
              value={taskType}
              label="Task Type"
              onChange={(e) => setTaskType(e.target.value as 'A' | 'B' | 'C')}
            >
              <MenuItem value="A">Type A</MenuItem>
              <MenuItem value="B">Type B</MenuItem>
              <MenuItem value="C">Type C</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Interval (ms)"
            type="number"
            value={interval}
            onChange={(e) => setInterval(Number(e.target.value))}
            inputProps={{ min: 100 }}
          />
          <Button variant="contained" onClick={createTask}>
            Create Task
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>Running Tasks</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Task ID</TableCell>
                <TableCell>Task Type</TableCell>
                <TableCell>Interval (ms)</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Next Execution</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.id}</TableCell>
                  <TableCell>{task.type}</TableCell>
                  <TableCell>{task.interval}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>{new Date(task.nextExecutionTime).toLocaleTimeString()}</TableCell>
                  <TableCell>
                    {task.status === 'Scheduled' && (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => cancelTask(task.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Task Outputs</Typography>
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Task ID</TableCell>
                <TableCell>Output</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {outputs.map((output, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {new Date(output.timestamp).toISOString()
                      .replace('T', ' ')
                      .slice(0, -1)  // Remove the 'Z'
                      .split('.')[0] + '.' + new Date(output.timestamp).getMilliseconds().toString().padStart(3, '0')}
                  </TableCell>
                  <TableCell>{output.taskId}</TableCell>
                  <TableCell>{output.output}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}

export default App;