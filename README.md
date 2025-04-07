# Skybound Drone Survey Management System - Backend

This is the backend API for the Skybound Drone Survey Management System, built with Node.js, Express.js, and MongoDB.

## Features

- JWT Authentication for secure access
- Complete Mission Management System
- Drone Fleet Management
- Real-time Mission Monitoring (simulated)
- Survey Reports Generation
- RESTful API endpoints for all functionality

## Tech Stack

- Node.js with Express.js
- MongoDB with Mongoose ORM
- JWT for authentication
- CORS for cross-origin requests
- Organized modular code structure (MVC pattern)

## Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory (use `.env.example` as a template)
4. Set up your MongoDB connection in the `.env` file

## Environment Variables

Create a `.env` file with the following variables:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/skybound-survey
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
```

## Running the Application

- **Start in production mode**:
  ```
  npm start
  ```

- **Start in development mode** (with nodemon):
  ```
  npm run dev
  ```

- **Seed the database** with sample data:
  ```
  npm run seed
  ```

- **Remove all sample data**:
  ```
  npm run seed:delete
  ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email and password
- `GET /api/auth/me` - Get current user (Protected)

### Missions
- `GET /api/missions` - Get all missions
- `GET /api/missions/:id` - Get a single mission
- `POST /api/missions` - Create a new mission (Protected)
- `PUT /api/missions/:id` - Update a mission (Protected)
- `DELETE /api/missions/:id` - Delete a mission (Protected)

### Drones
- `GET /api/drones` - Get all drones
- `GET /api/drones/:id` - Get a single drone
- `POST /api/drones` - Create a new drone (Protected)
- `PUT /api/drones/:id/status` - Update drone status (Protected)

### Mission Monitoring
- `GET /api/monitor/:missionId` - Get real-time status of a mission
- `POST /api/monitor/:missionId/update` - Update mission status (Protected)

### Reports
- `GET /api/reports` - Get all reports
- `GET /api/reports/:missionId` - Get report for a specific mission

## Sample Data

The application comes with a seeder utility that creates:

- 2 user accounts (admin and regular user)
- 3 drones with different statuses
- 3 missions (scheduled, in progress, completed)
- 1 sample report

**Default Admin Login**:
- Email: admin@skybound.com
- Password: password123

## API Documentation

This project includes Swagger UI for interactive API documentation:

1. Start the server: `npm start`
2. Visit: http://localhost:5000/api-docs

The Swagger UI provides:
- Complete documentation for all endpoints
- Request/response schemas
- Interactive testing capability
- Authentication support

For more detailed testing instructions, see the [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md) file.

## Connecting to Frontend

This backend is designed to work with a React + Chakra UI frontend. The API returns JSON responses with appropriate HTTP status codes.

## License

ISC
