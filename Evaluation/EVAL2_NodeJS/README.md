# Hospital Support & Appointment Management System

A comprehensive RESTful backend system for managing hospital appointments, support tickets, and user operations built with Node.js, Express.js, and MongoDB.

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Redis** - Caching
- **express-rate-limit** - Rate limiting

## Features

- ✅ User authentication (JWT-based)
- ✅ Role-based access control (Patient, Doctor, Admin)
- ✅ Appointment booking and management
- ✅ Support ticket system
- ✅ Medical records (embedded in User)
- ✅ Complex MongoDB aggregations
- ✅ Transaction support for appointment booking
- ✅ Redis caching for doctors list
- ✅ Rate limiting
- ✅ Request logging
- ✅ Central error handling
- ✅ Soft delete functionality

## Project Structure

```
├── controllers/     # Business logic
│   ├── authController.js
│   ├── patientController.js
│   ├── doctorController.js
│   └── adminController.js
├── models/          # Database schemas
│   ├── User.js
│   ├── Appointment.js
│   └── SupportTicket.js
├── routes/          # API routes
│   ├── authRoutes.js
│   ├── patientRoutes.js
│   ├── doctorRoutes.js
│   └── adminRoutes.js
├── middlewares/     # Custom middlewares
│   ├── auth.js
│   ├── roleAuth.js
│   ├── errorHandler.js
│   └── logger.js
├── utils/           # Utility functions
│   ├── jwt.js
│   └── redis.js
├── configs/         # Configuration files
│   └── mongo.db.js
├── app.js           # Express app configuration
└── server.js        # Server entry point
```

## Database Schema Design

### User Schema

Handles Patients, Doctors, and Admin users.

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: "patient" | "doctor" | "admin" (required),
  specialization: String (required for doctors),
  isActive: Boolean (default: true),
  medicalHistory: [
    {
      appointmentId: ObjectId (ref: Appointment),
      diagnosis: String,
      notes: String,
      date: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment Schema

```javascript
{
  patientId: ObjectId (ref: User, required),
  doctorId: ObjectId (ref: User, required),
  appointmentDate: Date (required),
  status: "booked" | "completed" | "cancelled" (default: "booked"),
  symptoms: String (required),
  prescription: String (default: ""),
  createdAt: Date,
  updatedAt: Date
}
```

### Support Ticket Schema

```javascript
{
  title: String (required),
  description: String (required),
  priority: "low" | "medium" | "high" (default: "medium"),
  status: "open" | "in-progress" | "resolved" (default: "open"),
  patientId: ObjectId (ref: User, required),
  assignedDoctorId: ObjectId (ref: User),
  closedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication

#### Register
- **POST** `/api/auth/register`
- **Description**: Register a new user (patient, doctor, or admin)
- **Auth**: Not required
- **Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "patient",
  "specialization": "Cardiology" // Required only for doctors
}
```

#### Login
- **POST** `/api/auth/login`
- **Description**: Login and get JWT token
- **Auth**: Not required
- **Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "patient"
    },
    "token": "jwt_token_here"
  }
}
```

### Patient APIs

All patient routes require authentication token in header: `Authorization: Bearer <token>`

#### Book Appointment
- **POST** `/api/patient/appointments`
- **Description**: Book a new appointment with a doctor
- **Auth**: Required (Patient role)
- **Body**:
```json
{
  "doctorId": "doctor_id_here",
  "appointmentDate": "2024-12-25T10:00:00Z",
  "symptoms": "Fever and headache"
}
```

#### View Own Appointments
- **GET** `/api/patient/appointments`
- **Description**: Get all appointments for the logged-in patient
- **Auth**: Required (Patient role)
- **Query Parameters**: 
  - `status` (optional): Filter by status (booked, completed, cancelled)

#### Raise Support Ticket
- **POST** `/api/patient/support-tickets`
- **Description**: Create a new support ticket
- **Auth**: Required (Patient role)
- **Body**:
```json
{
  "title": "Billing Issue",
  "description": "I have a question about my bill",
  "priority": "medium" // Optional: low, medium, high
}
```

### Doctor APIs

All doctor routes require authentication token in header: `Authorization: Bearer <token>`

#### View Assigned Appointments
- **GET** `/api/doctor/appointments`
- **Description**: Get all appointments assigned to the logged-in doctor
- **Auth**: Required (Doctor role)
- **Query Parameters**: 
  - `status` (optional): Filter by status

#### Update Appointment
- **PATCH** `/api/doctor/appointments/:appointmentId`
- **Description**: Update appointment (add prescription, change status)
- **Auth**: Required (Doctor role)
- **Body**:
```json
{
  "prescription": "Take paracetamol 500mg twice daily",
  "status": "completed" // Optional: booked, completed, cancelled
}
```

#### View Assigned Tickets
- **GET** `/api/doctor/support-tickets`
- **Description**: Get all support tickets assigned to the doctor
- **Auth**: Required (Doctor role)
- **Query Parameters**: 
  - `status` (optional): Filter by status
  - `priority` (optional): Filter by priority

#### Resolve Ticket
- **PATCH** `/api/doctor/support-tickets/:ticketId/resolve`
- **Description**: Mark a support ticket as resolved
- **Auth**: Required (Doctor role)

### Admin APIs

All admin routes require authentication token in header: `Authorization: Bearer <token>`

#### Get All Users
- **GET** `/api/admin/users`
- **Description**: Get all users in the system
- **Auth**: Required (Admin role)
- **Query Parameters**: 
  - `role` (optional): Filter by role (patient, doctor, admin)
  - `isActive` (optional): Filter by active status (true/false)

#### Get System Statistics
- **GET** `/api/admin/stats`
- **Description**: Get comprehensive system statistics with aggregations
- **Auth**: Required (Admin role)
- **Response**:
```json
{
  "success": true,
  "data": {
    "totalPatients": 100,
    "totalDoctors": 20,
    "appointmentsPerDoctor": [
      {
        "doctorId": "id",
        "doctorName": "Dr. Smith",
        "doctorEmail": "smith@example.com",
        "specialization": "Cardiology",
        "appointmentCount": 15
      }
    ],
    "ticketsByPriority": [
      {
        "priority": "high",
        "count": 5
      }
    ],
    "monthlyAppointmentStats": [
      {
        "month": "2024-12",
        "totalAppointments": 50,
        "booked": 20,
        "completed": 25,
        "cancelled": 5
      }
    ]
  }
}
```

#### Get Doctors List (Cached)
- **GET** `/api/admin/doctors`
- **Description**: Get list of all active doctors (cached in Redis)
- **Auth**: Required (Admin role)

#### Soft Delete User
- **PATCH** `/api/admin/users/:userId/deactivate`
- **Description**: Deactivate a user (soft delete)
- **Auth**: Required (Admin role)

#### Assign Ticket to Doctor
- **PATCH** `/api/admin/support-tickets/:ticketId/assign`
- **Description**: Assign a support ticket to a doctor
- **Auth**: Required (Admin role)
- **Body**:
```json
{
  "doctorId": "doctor_id_here"
}
```

## Business Rules

1. **Only patients can create appointments**
2. **Only doctors can update prescriptions**
3. **Closed tickets cannot be edited**
4. **Cancelling an appointment adds a record to medical history**
5. **Doctors cannot have overlapping appointments** (same date/time)
6. **Users are soft deleted** (isActive=false) instead of hard delete
7. **Doctors must have specialization**
8. **Only active users can login**

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd EVAL2_NodeJS
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/hospital_db
JWT_SECRET=your-secret-key-change-in-production
REDIS_URL=redis://localhost:6379
NODE_ENV=development
```

4. Make sure MongoDB and Redis are running

5. Start the server
```bash
npm run dev  # Development mode with nodemon
# or
npm start    # Production mode
```

## Environment Variables

- `PORT` - Server port (default: 8000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `REDIS_URL` - Redis connection URL (optional)
- `NODE_ENV` - Environment (development/production)

## Middleware

### Authentication Middleware
- Validates JWT token
- Attaches user info to request object

### Role-Based Access Middleware
- Restricts routes based on user role
- Used in combination with authentication

### Error Handler
- Central error handling
- Formats error responses
- Handles Mongoose errors

### Request Logger
- Logs all incoming requests
- Logs response status codes

### Rate Limiter
- Limits requests per IP (100 requests per 15 minutes)
- Prevents abuse

## Aggregations

The system includes several MongoDB aggregations:

1. **Appointments per Doctor**: Groups appointments by doctor with counts
2. **Tickets by Priority**: Groups support tickets by priority level
3. **Monthly Appointment Stats**: Monthly breakdown of appointments by status

## Additional Features

### Transactions
- Appointment booking uses MongoDB transactions to ensure data consistency
- Prevents race conditions when checking for overlapping appointments

### Redis Caching
- Doctors list is cached in Redis for 1 hour
- Improves performance for frequently accessed data
- Cache is cleared when a doctor is deactivated

### Rate Limiting
- Global rate limiting: 100 requests per 15 minutes per IP
- Prevents API abuse

## Testing the API

You can use tools like Postman, Thunder Client, or curl to test the APIs.

### Example: Register a Patient
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "patient"
  }'
```

### Example: Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Example: Book Appointment (with token)
```bash
curl -X POST http://localhost:8000/api/patient/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "doctorId": "doctor_id_here",
    "appointmentDate": "2024-12-25T10:00:00Z",
    "symptoms": "Fever and headache"
  }'
```

## Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error message here"
}
```

## Success Responses

All success responses follow this format:
```json
{
  "success": true,
  "message": "Success message here",
  "data": { ... }
}
```

## License

ISC

## Author

Hospital Management System - Node.js Backend

