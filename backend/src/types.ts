export interface Task {
    id: string;
    type: 'A' | 'B' | 'C';
    interval: number;
    status: 'Scheduled' | 'Cancelled';
    startTime: number;
    nextExecutionTime: number;
}

export interface TaskOutput {
    timestamp: string;
    taskId: string;
    output: string;
}