import { Task, TaskOutput } from "./types";

class TaskScheduler {
    private tasks: Map<string, Task> = new Map();
    private outputs: TaskOutput[] = [];
    private counters: { [key: string]: number } = { A: 0, B: 0, C: 0 };
    private timeoutId: NodeJS.Timeout | null = null;
    private isRunning: boolean = false;

    generateTaskId(type: 'A' | 'B' | 'C'): string {
        this.counters[type]++;
        return `${type}${this.counters[type]}`;
    }

    createTask(type: 'A' | 'B' | 'C', interval: number): Task {
        const id = this.generateTaskId(type);
        const now = Date.now();
        const task: Task = {
            id,
            type,
            interval,
            status: 'Scheduled',
            startTime: now,
            nextExecutionTime: now + interval
        }

        console.log(`Creating task: ${JSON.stringify(task)}`);
        this.tasks.set(id, task);
        
        // If scheduler is not running, start it
        if (!this.isRunning) {
            console.log('Scheduler not running, starting it');
            this.startScheduler();
        } else {
            console.log('Scheduler already running, adjusting timeout');
            this.adjustSchedulerTimeout();
        }

        return task;
    }

    private startScheduler(): void {
        console.log('Starting scheduler');
        this.isRunning = true;
        this.scheduleNextExecution();
    }

    private scheduleNextExecution(): void {
        console.log('Scheduling next execution');
        if (this.timeoutId) {
            console.log(`Clearing existing timeout`);
            clearTimeout(this.timeoutId);
        }

        const now = Date.now();
        let nextExecutionTime = Infinity;
        let tasksToExecute: Task[] = []

        // Find tasks that need to be executed and determine next execution time
        this.tasks.forEach(task => {
            if (task.status === 'Scheduled') {
                console.log(`Checking task ${task.id}, next execution: ${new Date(task.nextExecutionTime).toISOString()}`);
                // Execute any tasks that should have previously been executed
                while (task.nextExecutionTime <= now) {
                    console.log(`Task ${task.id} due for execution`);
                    tasksToExecute.push({...task})
                    task.nextExecutionTime += task.interval;
                }
                nextExecutionTime = Math.min(nextExecutionTime, task.nextExecutionTime)
                this.tasks.set(task.id, task)
            }
        });

        console.log(`Tasks to execute: ${tasksToExecute.length}`);
        // Execute tasks that are due
        tasksToExecute.forEach(task => {
            this.executeTask(task);
        });

        // If there are no more scheduled tasks, stop the scheduler
        if (nextExecutionTime === Infinity) {
            console.log('No more scheduled tasks, stopping scheduler');
            this.isRunning = false;
            return;
        }

        // Schedule next execution
        const delay = Math.max(0, nextExecutionTime - Date.now());
        console.log(`Scheduling next execution in ${delay}ms`);
        this.timeoutId = setTimeout(() => {
            this.scheduleNextExecution();
        }, delay);
        console.log(`Set new timeout`);
    }

    private executeTask(task: Task): void {
        console.log(`Executing task ${task.id}`);
        const output: TaskOutput = {
            timestamp: new Date().toISOString(),
            taskId: task.id,
            output: task.type
        };
        this.outputs.push(output);
        console.log(`New output created: ${JSON.stringify(output)}`);
    }

    private adjustSchedulerTimeout(): void {
        if (this.isRunning) {
            console.log('Adjusting scheduler timeout');
            this.scheduleNextExecution();
        }
    }

    cancelTask(taskId: string): boolean {
        const task = this.tasks.get(taskId);
        if (task) {
            console.log(`Cancelling task ${taskId}`);
            task.status = 'Cancelled';
            this.tasks.set(taskId, task);
            this.adjustSchedulerTimeout();
            return true;
        }
        return false;
    }

    getTasks(): Task[] {
        return Array.from(this.tasks.values());
    }

    getOutputs(): TaskOutput[] {
        return this.outputs;
    }
}

export const scheduler = new TaskScheduler();