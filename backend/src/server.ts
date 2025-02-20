import express from 'express';
import cors from 'cors';
import { scheduler } from './taskScheduler'

const app = express();
app.use(cors());
app.use(express.json());

app.post('/tasks', (req, res) => {
    const { type, interval } = req.body;
    const task = scheduler.createTask(type, interval);
    res.json(task);
});

app.get('/tasks', (_, res) => {
    const tasks = scheduler.getTasks();
    res.json(tasks);
});

app.get('/outputs', (_, res) => {
    const outputs = scheduler.getOutputs();
    res.json(outputs);
});

app.delete('/tasks/:id', (req, res) => {
    const success = scheduler.cancelTask(req.params.id);
    if (success) {
        res.sendStatus(200);
    } else {
        res.sendStatus(404)
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});