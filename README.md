# Task Scheduler Application

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install express cors typescript @types/express @types/cors ts-node-dev
```

3. Create a `tsconfig.json` file with the following content:
```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"]
}
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install @mui/material
```

## Running the Application

### Running the Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Start the backend server (from the backend directory):
```bash
npm run dev
```

### Running the Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. In a new terminal, start the frontend (from the frontend directory):
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001