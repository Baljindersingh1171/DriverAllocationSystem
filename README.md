# Driver Allocation System

A simple Node.js service for allocating drivers to ride requests using MongoDB for persistent data and Redis for geospatial driver location lookups.

## Project Structure

- `src/app.js` - Express app configuration and route mounting.
- `src/server.js` - App bootstrap and MongoDB connection.
- `src/config/mongo.js` - MongoDB connection helper.
- `src/config/redis.js` - Redis connection helper.
- `src/routes/driver.routes.js` - Driver route definitions.
- `src/routes/ride.routes.js` - Ride route definitions.
- `src/controllers/driver.controller.js` - Driver request handlers.
- `src/controllers/ride.controller.js` - Ride request handlers.
- `src/services/geo.service.js` - Redis geospatial operations for driver locations.
- `src/services/ride.service.js` - Ride allocation and retry logic.
- `src/models/Driver.js` - Driver Mongoose model.
- `src/models/Ride.js` - Ride Mongoose model.
- `src/models/Rider.js` - Rider Mongoose model.

## Features

- Register drivers
- Update driver location via Redis geospatial index
- Update driver availability and status
- Request a ride and locate nearby online drivers
- Accept a ride with optimistic locking to avoid duplicate assignments
- Retry ride allocation after timeout if no drivers accept

## Requirements

- Node.js 18+ (or compatible)
- MongoDB
- Redis

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with the required values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/driver-allocation
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

3. Start the application:

```bash
npm start
```

4. For development with auto-reload:

```bash
npm run dev
```

## API Endpoints

### Driver endpoints

- `POST /api/drivers/register`
  - Request body: `{ "name": "string", "phone": "string" }`
  - Registers a new driver.

- `PATCH /api/drivers/location`
  - Request body: `{ "driverId": "string", "latitude": number, "longitude": number }`
  - Updates a driver's location in Redis.

- `PATCH /api/drivers/status`
  - Request body: `{ "driverId": "string", "status": "ONLINE" | "OFFLINE", "isAvailable": boolean }`
  - Updates driver status and availability.

### Ride endpoints

- `POST /api/rides/request`
  - Request body: `{ "riderId": "string", "latitude": number, "longitude": number }`
  - Creates a ride request and returns nearby available drivers.

- `POST /api/rides/accept`
  - Request body: `{ "rideId": "string", "driverId": "string" }`
  - Driver accepts a ride and the ride is assigned.

## Notes

- Redis is used for driver location and proximity queries.
- The ride retry mechanism triggers after 20 seconds when a ride remains in `SEARCHING` state.
- Locking is used to prevent multiple drivers from accepting the same ride concurrently.

## Improvements

- Add validation for request payloads
- Add rider registration and authentication flows
- Publish notifications to drivers when a ride is available
- Add tests for controllers and services
- Support pagination and filtering for drivers and rides

## Architecture Diagram

For a system overview, see [ARCHITECTURE.md](ARCHITECTURE.md).
"# DriverAllocationSystem" 
