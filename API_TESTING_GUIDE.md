# Skybound Survey API Testing Guide

This guide will help you test the Skybound Survey API endpoints and understand how to use the API documentation.

## Running the API Server

1. Start the server:
   ```
   npm start
   ```
   
2. For development with auto-reload:
   ```
   npm run dev
   ```

3. Seed the database with sample data:
   ```
   npm run seed
   ```

## Using Swagger Documentation

We've integrated Swagger UI for interactive API documentation:

1. Start the server
2. Visit [http://localhost:5000/api-docs](http://localhost:5000/api-docs) in your browser

The Swagger UI provides:
- Complete endpoint documentation
- Request/response schemas
- Interactive testing capability
- Authentication support

## Testing with Postman

### Setup

1. Download [Postman](https://www.postman.com/downloads/)
2. Create a new collection named "Skybound Survey API"
3. Set up environment variables:
   - `baseUrl`: http://localhost:5000
   - `token`: (will be populated after login)

### Authentication Testing

1. **Login**
   - Method: POST
   - URL: {{baseUrl}}/api/auth/login
   - Body (JSON):
     ```json
     {
       "email": "admin@skybound.com",
       "password": "password123"
     }
     ```
   - Save the returned token to your environment variable:
     - In Tests tab: `pm.environment.set("token", pm.response.json().token);`

2. **Get Current User**
   - Method: GET
   - URL: {{baseUrl}}/api/auth/me
   - Headers: 
     - Authorization: Bearer {{token}}

### Mission Testing

1. **Get All Missions**
   - Method: GET
   - URL: {{baseUrl}}/api/missions

2. **Get Single Mission**
   - Method: GET
   - URL: {{baseUrl}}/api/missions/:id
   - (Replace :id with an actual mission ID from the database)

3. **Create Mission**
   - Method: POST
   - URL: {{baseUrl}}/api/missions
   - Headers: Authorization: Bearer {{token}}
   - Body (JSON):
     ```json
     {
       "name": "Test Mission",
       "location": {
         "type": "Point",
         "coordinates": [73.8567, 18.5204],
         "address": "Test Location, City, Country"
       },
       "startTime": "2025-05-01T10:00:00Z",
       "recurrenceType": "Once",
       "flightPath": [
         { "type": "Point", "coordinates": [73.856, 18.520] },
         { "type": "Point", "coordinates": [73.858, 18.522] }
       ],
       "flightAltitude": 100,
       "patternType": "Grid",
       "sensorType": "RGB",
       "status": "Scheduled"
     }
     ```

4. **Update Mission**
   - Method: PUT
   - URL: {{baseUrl}}/api/missions/:id
   - Headers: Authorization: Bearer {{token}}
   - Body: (Same as create but with updated fields)

5. **Delete Mission**
   - Method: DELETE
   - URL: {{baseUrl}}/api/missions/:id
   - Headers: Authorization: Bearer {{token}}

### Drone Testing

1. **Get All Drones**
   - Method: GET
   - URL: {{baseUrl}}/api/drones

2. **Get Single Drone**
   - Method: GET
   - URL: {{baseUrl}}/api/drones/:id

3. **Create Drone**
   - Method: POST
   - URL: {{baseUrl}}/api/drones
   - Headers: Authorization: Bearer {{token}}
   - Body (JSON):
     ```json
     {
       "droneId": "SKY-D1004",
       "model": "SkyScout X3",
       "batteryLevel": 100,
       "location": {
         "type": "Point",
         "coordinates": [73.8567, 18.5204]
       },
       "status": "Idle"
     }
     ```

4. **Update Drone Status**
   - Method: PUT
   - URL: {{baseUrl}}/api/drones/:id/status
   - Headers: Authorization: Bearer {{token}}
   - Body (JSON):
     ```json
     {
       "status": "Charging"
     }
     ```

### Mission Monitoring Testing

1. **Get Mission Status**
   - Method: GET
   - URL: {{baseUrl}}/api/monitor/:missionId

2. **Update Mission Status (Simulation)**
   - Method: POST
   - URL: {{baseUrl}}/api/monitor/:missionId/update
   - Headers: Authorization: Bearer {{token}}
   - Body (JSON):
     ```json
     {
       "status": "In Progress",
       "currentLocation": {
         "type": "Point",
         "coordinates": [73.857, 18.521]
       },
       "progress": 45,
       "batteryLevel": 85
     }
     ```

### Reports Testing

1. **Get All Reports**
   - Method: GET
   - URL: {{baseUrl}}/api/reports

2. **Get Report by Mission**
   - Method: GET
   - URL: {{baseUrl}}/api/reports/:missionId

## Testing with cURL

You can also test the API using cURL commands:

### Authentication

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@skybound.com","password":"password123"}'

# Get current user (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

### Missions

```bash
# Get all missions
curl -X GET http://localhost:5000/api/missions

# Create mission (replace TOKEN with actual token)
curl -X POST http://localhost:5000/api/missions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name":"Test Mission","location":{"type":"Point","coordinates":[73.8567,18.5204],"address":"Test Location"},"startTime":"2025-05-01T10:00:00Z","recurrenceType":"Once","flightPath":[{"type":"Point","coordinates":[73.856,18.520]},{"type":"Point","coordinates":[73.858,18.522]}],"flightAltitude":100,"patternType":"Grid","sensorType":"RGB","status":"Scheduled"}'
```

## Automated Testing

For more comprehensive testing, consider setting up automated tests using tools like:

1. **Jest** or **Mocha** for unit and integration testing
2. **Supertest** for API endpoint testing

Example setup:
```
npm install --save-dev jest supertest
```

Then create test files in a `/tests` directory.

## Troubleshooting

- **Authentication Issues**: Ensure your JWT token is valid and not expired
- **404 Errors**: Check that the ID you're using exists in the database
- **Validation Errors**: Review the request body against the schema requirements
- **Database Connection**: Verify MongoDB is running and accessible
