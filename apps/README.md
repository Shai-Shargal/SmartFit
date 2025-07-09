# SmartFit Development Setup

This directory contains both the Frontend (React Native) and Backend (Express.js) applications for SmartFit.

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm
- React Native development environment set up

### Installation

1. **Install dependencies for both frontend and backend:**

   ```bash
   npm run install:all
   ```

2. **Start both applications in development mode:**
   ```bash
   npm run dev
   ```

This will start:

- **Frontend**: React Native Metro bundler (usually on port 8081)
- **Backend**: Express server with nodemon (on port 5000)

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run start` - Start both frontend and backend in production mode
- `npm run frontend:dev` - Start only the frontend
- `npm run backend:dev` - Start only the backend with nodemon
- `npm run frontend:start` - Start only the frontend
- `npm run backend:start` - Start only the backend
- `npm run install:all` - Install dependencies for both apps
- `npm run install:frontend` - Install only frontend dependencies
- `npm run install:backend` - Install only backend dependencies
- `npm run clean` - Remove node_modules from both apps

### Development Workflow

1. Run `npm run dev` from the `/apps` directory
2. The terminal will show colored output:
   - **[Frontend]** - Cyan colored logs for React Native
   - **[Backend]** - Yellow colored logs for Express server
3. Make changes to either frontend or backend code
4. Both will automatically reload when you save changes

### API Configuration

The frontend is configured to connect to the backend at `http://localhost:5000`. Make sure:

- The backend is running on port 5000
- Your React Native app can reach localhost (use your computer's IP address if testing on a physical device)

### Troubleshooting

- If you get port conflicts, check that ports 5000 and 8081 are available
- For physical device testing, update the `API_BASE_URL` in `Frontend/services/apiService.js`
- Run `npm run clean` and then `npm run install:all` if you encounter dependency issues
