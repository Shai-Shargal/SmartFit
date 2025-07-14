# SmartFit Firebase to PostgreSQL Migration Guide

This guide will help you migrate from Firebase to PostgreSQL using Prisma for your SmartFit application.

## What Changed

### Backend Changes

- ✅ Replaced Firebase Admin SDK with Prisma ORM
- ✅ Implemented JWT-based authentication
- ✅ Created RESTful API endpoints
- ✅ Added proper validation and error handling
- ✅ Implemented database schema with Prisma models

### Frontend Changes

- ✅ Replaced Firebase SDK with custom API service
- ✅ Updated authentication to use JWT tokens
- ✅ Modified all services to use REST API calls
- ✅ Removed Firebase dependencies

## Setup Instructions

### 1. Backend Setup

```bash
cd apps/Backend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env file with your Prisma connection string
# Update DATABASE_URL and JWT_SECRET

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Start the server
npm run dev
```

### 2. Frontend Setup

```bash
cd apps/Frontend

# Install dependencies (remove Firebase packages)
npm uninstall firebase @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore
npm install

# Start the app
npm start
```

## Environment Variables

Create a `.env` file in `apps/Backend/` with:

```env
# Database Configuration (Prisma)
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=your_api_key_here"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Server Configuration
PORT=5000
```

## Prisma Commands

- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and apply migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users

- `GET /api/user/greeting` - Get user greeting
- `GET /api/user/profile-setup-status` - Get profile setup status
- `POST /api/user/setup-profile` - Setup user profile
- `GET /api/user/profile` - Get user profile

### Meals

- `GET /api/meals` - Get user's meals
- `POST /api/meals` - Add new meal
- `GET /api/meals/:id` - Get specific meal
- `PUT /api/meals/:id` - Update meal
- `DELETE /api/meals/:id` - Delete meal

### Workouts

- `GET /api/workouts` - Get user's workouts
- `POST /api/workouts` - Add new workout
- `GET /api/workouts/:id` - Get specific workout
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout

## Database Schema

The Prisma schema includes three main models:

1. **User** - User accounts and profiles
2. **Meal** - Meal tracking data
3. **Workout** - Workout tracking data

All models include proper relationships, automatic timestamps, and type safety.

## Testing the Migration

1. Start the backend server
2. Start the frontend app
3. Try registering a new user
4. Test login functionality
5. Try adding meals and workouts
6. Verify data is stored in PostgreSQL

## Troubleshooting

### Database Connection Issues

- Verify your Prisma connection string is correct
- Check that your API key is valid
- Ensure the database is accessible

### Authentication Issues

- Check JWT_SECRET is set
- Verify token is being sent in Authorization header
- Check token expiration

### API Issues

- Verify backend server is running on correct port
- Check CORS configuration
- Review server logs for errors

### Prisma Issues

- Run `npm run db:generate` after schema changes
- Use `npm run db:push` to sync schema changes
- Check Prisma logs for connection issues

## Benefits of Prisma Migration

1. **Type Safety**: Full TypeScript support with generated types
2. **Developer Experience**: Excellent IDE support and auto-completion
3. **Database Agnostic**: Easy to switch between databases
4. **Migrations**: Built-in migration system
5. **Relationships**: Easy to define and query relationships
6. **Performance**: Optimized queries and connection pooling

## Next Steps

1. Set up proper production environment
2. Implement database backups
3. Add monitoring and logging
4. Consider using Prisma Accelerate for production
5. Implement rate limiting and security measures
6. Set up Prisma Studio for database management
