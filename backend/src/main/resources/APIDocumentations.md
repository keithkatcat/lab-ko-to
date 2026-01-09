# Lab Reservation System - API Documentation

**Base URL:** `http://localhost:9090`

**Authentication:** JWT Bearer token in `Authorization` header

**Version:** 1.0.0

---

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [User Management](#user-management)
- [Admin User Management](#admin-user-management)
- [Labs Management](#labs-management)
- [Reservations](#reservations)
- [Admin Reservations](#admin-reservations)
- [OTP (Email Verification)](#otp-email-verification)
- [Reporting](#reporting)
- [Status Codes](#status-codes)
- [Data Formats](#data-formats)

---

## Overview

This API provides endpoints for managing laboratory reservations, user accounts, and administrative functions.

**Total Endpoints:** 28
- **Public:** 5 endpoints (no authentication required)
- **Protected (Any authenticated user):** 6 endpoints
- **Protected (Admin only):** 17 endpoints

---

## Authentication

### Login

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user and receive JWT token

**Authentication Required:** ❌ No

**Request Body:**
```json
{
  "email": "student1@iskolarngbayan.pup.edu.ph",
  "password": "pass123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login Successful"
}
```

**Response (401 Unauthorized):**
```json
{
  "token": null,
  "message": "Invalid Credentials"
}
```

---

## User Management

### Register New User

**Endpoint:** `POST /api/user/register`

**Description:** Register a new user account

**Authentication Required:** ❌ No

**Request Body:**
```json
{
  "username": "teststudent",
  "email": "student1@iskolarngbayan.pup.edu.ph",
  "password": "pass123",
  "accountType": "student"
}
```

**Account Types:**
- `student` - Regular student user
- `professor` - Professor user
- `admin` - Administrator user

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "teststudent",
  "email": "student1@iskolarngbayan.pup.edu.ph",
  "accountType": "student",
  "emailVerified": false
}
```

**Notes:**
- Password is not included in response for security
- Account type must be one of: `student`, `professor`, or `admin`

---

### Get User by ID

**Endpoint:** `GET /api/user/{id}`

**Description:** Get user details by ID

**Authentication Required:** ✅ Yes (Admin only)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "accountType": "student",
  "emailVerified": true
}
```

**Response (404 Not Found):**
```json
{}
```

---

### Update Own Profile

**Endpoint:** `PUT /api/user/profile`

**Description:** Update current user's own profile (email, username, password)

**Authentication Required:** ✅ Yes

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body (Update email and username only):**
```json
{
  "email": "newemail@example.com",
  "username": "newusername"
}
```

**Request Body (Update with password change):**
```json
{
  "email": "newemail@example.com",
  "username": "newusername",
  "oldPassword": "currentPassword123",
  "newPassword": "newPassword456"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "newusername",
  "email": "newemail@example.com",
  "accountType": "student",
  "emailVerified": true
}
```

**Response (400 Bad Request):**
```json
{
  "message": "Old password is required to change password"
}
```

**Response (401 Unauthorized):**
```json
{
  "message": "Old password is incorrect"
}
```

**Notes:**
- Users can only update their own profile
- Users **CANNOT** change their `accountType`
- Old password is **required** to change password
- All fields are optional - only provide fields you want to update

---

### Update User (Admin)

**Endpoint:** `PUT /api/user/{id}`

**Description:** Admin can update any user's information

**Authentication Required:** ✅ Yes (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "email": "updated@example.com",
  "username": "updateduser",
  "accountType": "admin",
  "password": "newpassword123"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "updateduser",
  "email": "updated@example.com",
  "accountType": "admin",
  "emailVerified": true
}
```

**Notes:**
- Only admins can update any user
- Admins **CAN** change `accountType`
- All fields are optional

---

### Delete User

**Endpoint:** `DELETE /api/user/{id}`

**Description:** Delete a user account

**Authentication Required:** ✅ Yes (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (204 No Content):**
```
(Empty response body)
```

---

## Admin User Management

### Get All Users

**Endpoint:** `GET /api/admin/users`

**Description:** Get list of all registered users

**Authentication Required:** ✅ Yes (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "username": "user1",
    "email": "user1@example.com",
    "accountType": "student",
    "emailVerified": true
  },
  {
    "id": 2,
    "username": "admin",
    "email": "admin@example.com",
    "accountType": "admin",
    "emailVerified": true
  }
]
```

---

### Get User by ID (Admin)

**Endpoint:** `GET /api/admin/users/{id}`

**Description:** Admin gets user details by ID

**Authentication Required:** ✅ Yes (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200 OK):**
```json
{
  "id": 3,
  "username": "admin1",
  "email": "admin1@iskolarngbayan.pup.edu.ph",
  "accountType": "admin",
  "emailVerified": false
}
```

---

### Delete User (Admin)

**Endpoint:** `DELETE /api/admin/users/{id}`

**Description:** Admin deletes a user

**Authentication Required:** ✅ Yes (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (204 No Content):**
```
(Empty response body)
```

---

## Labs Management

### Get Active Labs

**Endpoint:** `GET /api/labs`

**Description:** Get list of all active labs (available for reservation)

**Authentication Required:** ❌ No

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Computer Lab S512",
    "capacity": 50,
    "equipment": "PCs, TV, Whiteboard",
    "isActive": true
  }
]
```

---

### Get All Labs

**Endpoint:** `GET /api/labs/all`

**Description:** Get list of all labs (including inactive)

**Authentication Required:** ✅ Yes (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Computer Lab S512",
    "capacity": 50,
    "equipment": "PCs, TV, Whiteboard",
    "isActive": true
  },
  {
    "id": 2,
    "name": "Chemistry Lab",
    "capacity": 25,
    "equipment": "Lab benches, fume hoods",
    "isActive": false
  }
]
```

---

### Get Lab by ID

**Endpoint:** `GET /api/labs/{id}`

**Description:** Get details of a specific lab

**Authentication Required:** ✅ Yes

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Computer Lab S512",
  "capacity": 50,
  "equipment": "PCs, TV, Whiteboard",
  "isActive": true
}
```

**Response (404 Not Found):**
```json
{}
```

---

### Create Lab

**Endpoint:** `POST /api/labs`

**Description:** Create a new laboratory

**Authentication Required:** ✅ Yes (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "Computer Lab S512",
  "capacity": 50,
  "equipment": "PCs, TV, Whiteboard",
  "isActive": true
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Computer Lab S512",
  "capacity": 50,
  "equipment": "PCs, TV, Whiteboard",
  "isActive": true
}
```

---

### Update Lab

**Endpoint:** `PUT /api/labs/{id}`

**Description:** Update laboratory details

**Authentication Required:** ✅ Yes (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "Computer Lab S512",
  "capacity": 53,
  "equipment": "PCs, TV, Whiteboard",
  "isActive": true
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Computer Lab S512",
  "capacity": 53,
  "equipment": "PCs, TV, Whiteboard",
  "isActive": true
}
```

---

### Update Lab Status

**Endpoint:** `PUT /api/labs/{id}/status?isActive={true|false}`

**Description:** Toggle lab active/inactive status

**Authentication Required:** ✅ Yes (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `isActive` - `true` or `false`

**Example:**
```
PUT /api/labs/1/status?isActive=false
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Computer Lab S512",
  "capacity": 53,
  "equipment": "PCs, TV, Whiteboard",
  "isActive": false
}
```

---

### Delete Lab

**Endpoint:** `DELETE /api/labs/{id}`

**Description:** Delete a laboratory

**Authentication Required:** ✅ Yes (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (204 No Content):**
```
(Empty response body)
```

---

## Reservations

### Get All Reservations

**Endpoint:** `GET /api/reservations`

**Description:** Get list of all reservations

**Authentication Required:** ✅ Yes

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "user": {
      "id": 1,
      "username": "hotdog",
      "email": "user1@iskolarngbayan.pup.edu.ph",
      "accountType": "student",
      "emailVerified": false
    },
    "lab": {
      "id": 1,
      "name": "Computer Lab S512",
      "capacity": 53,
      "equipment": "PCs, TV, Whiteboard",
      "isActive": true
    },
    "date": "2026-01-05",
    "startTime": "09:00:00",
    "endTime": "11:00:00",
    "purpose": "Thesis defense",
    "status": "pending",
    "adminNotes": null,
    "createdAt": "2026-01-08T00:01:44.166"
  }
]
```

---

### Get Reservation by ID

**Endpoint:** `GET /api/reservations/{id}`

**Description:** Get details of a specific reservation

**Authentication Required:** ✅ Yes

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user": {
    "id": 1,
    "username": "hotdog",
    "email": "user1@iskolarngbayan.pup.edu.ph",
    "accountType": "student",
    "emailVerified": false
  },
  "lab": {
    "id": 1,
    "name": "Computer Lab S512",
    "capacity": 53,
    "equipment": "PCs, TV, Whiteboard",
    "isActive": true
  },
  "date": "2026-01-05",
  "startTime": "09:00:00",
  "endTime": "11:00:00",
  "purpose": "Thesis defense",
  "status": "pending",
  "adminNotes": null,
  "createdAt": "2026-01-08T00:01:44.166"
}
```

**Response (404 Not Found):**
```json
{}
```

---

### Create Reservation

**Endpoint:** `POST /api/reservations?userId={userId}&labId={labId}`

**Description:** Create a new laboratory reservation

**Authentication Required:** ✅ Yes

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `userId` - ID of the user making the reservation
- `labId` - ID of the lab to reserve

**Request Body:**
```json
{
  "date": "2026-01-05",
  "startTime": "09:00",
  "endTime": "11:00",
  "purpose": "Thesis defense",
  "program": "Computer Science",
  "section": "3-2"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user": {
    "id": 1,
    "username": "hotdog",
    "email": "user1@iskolarngbayan.pup.edu.ph",
    "accountType": "student",
    "emailVerified": false
  },
  "lab": {
    "id": 1,
    "name": "Computer Lab S512",
    "capacity": 53,
    "equipment": "PCs, TV, Whiteboard",
    "isActive": true
  },
  "date": "2026-01-05",
  "startTime": "09:00:00",
  "endTime": "11:00:00",
  "purpose": "Thesis defense",
  "status": "pending",
  "adminNotes": null,
  "createdAt": "2026-01-08T00:01:44.166288"
}
```

**Notes:**
- Regular users: status = `"pending"` (needs admin approval)
- Admin users: status = `"approved"` (auto-approved)
- System prevents overlapping reservations for the same lab
- Lab must be active (`isActive: true`) to be reserved

---

### Update Reservation

**Endpoint:** `PUT /api/reservations/{id}?userId={adminUserId}`

**Description:** Update an existing reservation

**Authentication Required:** ✅ Yes (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `userId` - Admin user ID

**Request Body:**
```json
{
  "date": "2026-01-05",
  "startTime": "10:00",
  "endTime": "12:00",
  "purpose": "Lecture",
  "status": "approved",
  "adminNotes": "Original Sched was rescheduled"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user": {
    "id": 1,
    "username": "hotdog",
    "email": "user1@iskolarngbayan.pup.edu.ph",
    "accountType": "student",
    "emailVerified": false
  },
  "lab": {
    "id": 1,
    "name": "Computer Lab S512",
    "capacity": 53,
    "equipment": "PCs, TV, Whiteboard",
    "isActive": true
  },
  "date": "2026-01-05",
  "startTime": "10:00:00",
  "endTime": "12:00:00",
  "purpose": "Lecture",
  "status": "approved",
  "adminNotes": "Original Sched was rescheduled",
  "createdAt": "2026-01-08T00:01:44.166"
}
```

---

### Delete Reservation

**Endpoint:** `DELETE /api/reservations/{id}?userId={adminUserId}`

**Description:** Delete a reservation

**Authentication Required:** ✅ Yes (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `userId` - Admin user ID

**Response (204 No Content):**
```
(Empty response body)
```

---

## Admin Reservations

### Get Pending Reservations

**Endpoint:** `GET /api/admin/reservations/pending?userId={adminUserId}`

**Description:** Get list of all pending reservations awaiting approval

**Authentication Required:** ✅ Yes (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `userId` - Admin user ID

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "user": {
      "id": 1,
      "username": "hotdog",
      "email": "user1@iskolarngbayan.pup.edu.ph",
      "accountType": "student",
      "emailVerified": false
    },
    "lab": {
      "id": 1,
      "name": "Computer Lab S512",
      "capacity": 53,
      "equipment": "PCs, TV, Whiteboard",
      "isActive": true
    },
    "date": "2026-01-05",
    "startTime": "09:00:00",
    "endTime": "11:00:00",
    "purpose": "Thesis defense",
    "status": "pending",
    "adminNotes": null,
    "createdAt": "2026-01-08T00:09:27.774"
  }
]
```

---

### Approve Reservation

**Endpoint:** `PUT /api/admin/reservations/{id}/approve?userId={adminUserId}&notes={notes}`

**Description:** Approve a pending reservation

**Authentication Required:** ✅ Yes (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `userId` - Admin user ID
- `notes` - (Optional) Admin approval notes

**Example:**
```
PUT /api/admin/reservations/1/approve?userId=3&notes=Approved
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user": {
    "id": 1,
    "username": "hotdog",
    "email": "user1@iskolarngbayan.pup.edu.ph",
    "accountType": "student",
    "emailVerified": false
  },
  "lab": {
    "id": 1,
    "name": "Computer Lab S512",
    "capacity": 53,
    "equipment": "PCs, TV, Whiteboard",
    "isActive": true
  },
  "date": "2026-01-05",
  "startTime": "09:00:00",
  "endTime": "11:00:00",
  "purpose": "Thesis defense",
  "status": "approved",
  "adminNotes": "Approved by admin",
  "createdAt": "2026-01-08T00:09:27.774"
}
```

---

### Deny Reservation

**Endpoint:** `PUT /api/admin/reservations/{id}/deny?userId={adminUserId}&notes={notes}`

**Description:** Deny a pending reservation

**Authentication Required:** ✅ Yes (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `userId` - Admin user ID
- `notes` - (Optional) Reason for denial

**Example:**
```
PUT /api/admin/reservations/1/deny?userId=3&notes=Schedule Conflict
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user": {
    "id": 1,
    "username": "hotdog",
    "email": "user1@iskolarngbayan.pup.edu.ph",
    "accountType": "student",
    "emailVerified": false
  },
  "lab": {
    "id": 1,
    "name": "Computer Lab S512",
    "capacity": 53,
    "equipment": "PCs, TV, Whiteboard",
    "isActive": true
  },
  "date": "2026-01-05",
  "startTime": "10:00:00",
  "endTime": "12:00:00",
  "purpose": "Lecture",
  "status": "denied",
  "adminNotes": "Schedule Conflict",
  "createdAt": "2026-01-08T00:09:27.774"
}
```

---

## OTP (Email Verification)

### Send OTP

**Endpoint:** `POST /api/otp/send`

**Description:** Send OTP code to user's email

**Authentication Required:** ❌ No

**Request Body:**
```json
{
  "userId": 1,
  "email": "user@example.com",
  "purpose": "email_verification"
}
```

**OTP Purposes:**
- `email_verification` - Verify user's email address
- `password_reset` - Reset forgotten password
- `login` - Two-factor authentication

**Response (200 OK):**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

**Response (500 Internal Server Error):**
```json
{
  "success": false,
  "message": "Failed to send OTP email: <error details>"
}
```

**Notes:**
- OTP code expires in 5 minutes
- OTP is a 6-digit numeric code

---

### Verify OTP

**Endpoint:** `POST /api/otp/verify`

**Description:** Verify the OTP code entered by user

**Authentication Required:** ❌ No

**Request Body:**
```json
{
  "userId": 1,
  "token": "123456",
  "purpose": "email_verification"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Invalid or expired OTP"
}
```

**Notes:**
- OTP can only be used once
- OTP expires after 5 minutes
- If purpose is `email_verification`, user's `emailVerified` field is automatically set to `true`

---

## Reporting

### Get All Reports

**Endpoint:** `GET /api/reports`

**Description:** Get list of all reports (Admin only)

**Authentication Required:** ✅ Yes (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "accountType": "student",
      "emailVerified": true
    },
    "report": "The lab equipment is not working properly.",
    "status": "pending",
    "adminResponse": null,
    "createdAt": "2026-01-08T15:30:45.123",
    "updatedAt": null
  },
  {
    "id": 2,
    "user": {
      "id": 2,
      "username": "janedoe",
      "email": "jane@example.com",
      "accountType": "professor",
      "emailVerified": true
    },
    "report": "AC not working in Computer Lab S512",
    "status": "in_progress",
    "adminResponse": "Technician has been notified",
    "createdAt": "2026-01-08T14:20:30.456",
    "updatedAt": "2026-01-08T15:00:00.000"
  }
]
```

---

### Get Reports by User

**Endpoint:** `GET /api/reports/user/{userId}`

**Description:** Get all reports submitted by a specific user

**Authentication Required:** ✅ Yes

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "accountType": "student",
      "emailVerified": true
    },
    "report": "The lab equipment is not working properly.",
    "status": "pending",
    "adminResponse": null,
    "createdAt": "2026-01-08T15:30:45.123",
    "updatedAt": null
  }
]
```

**Notes:**
- Users can view their own reports
- Admins can view any user's reports

---

### Get Reports by Status

**Endpoint:** `GET /api/reports/status/{status}`

**Description:** Get all reports with a specific status

**Authentication Required:** ✅ Yes (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Path Parameters:**
- `status` - One of: `pending`, `in_progress`, `resolved`, `closed`

**Example:**
```
GET /api/reports/status/pending
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "accountType": "student",
      "emailVerified": true
    },
    "report": "The lab equipment is not working properly.",
    "status": "pending",
    "adminResponse": null,
    "createdAt": "2026-01-08T15:30:45.123",
    "updatedAt": null
  }
]
```

---

### Get Report by ID

**Endpoint:** `GET /api/reports/{id}`

**Description:** Get details of a specific report

**Authentication Required:** ✅ Yes

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "accountType": "student",
    "emailVerified": true
  },
  "report": "The lab equipment is not working properly.",
  "status": "pending",
  "adminResponse": null,
  "createdAt": "2026-01-08T15:30:45.123",
  "updatedAt": null
}
```

**Response (404 Not Found):**
```json
{}
```

---

### Create Report

**Endpoint:** `POST /api/reports`

**Description:** Submit a new report

**Authentication Required:** ✅ Yes

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "userId": 1,
  "report": "The lab equipment is not working properly."
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "accountType": "student",
    "emailVerified": true
  },
  "report": "The lab equipment is not working properly.",
  "status": "pending",
  "adminResponse": null,
  "createdAt": "2026-01-08T15:30:45.123",
  "updatedAt": null
}
```

**Notes:**
- Status is automatically set to `pending`
- `createdAt` is automatically set to current timestamp
- Any authenticated user can create a report

---

### Update Report Status

**Endpoint:** `PUT /api/reports/{id}/status`

**Description:** Update report status and add admin response

**Authentication Required:** ✅ Yes (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "status": "resolved",
  "adminResponse": "Issue has been fixed. Equipment replaced."
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "accountType": "student",
    "emailVerified": true
  },
  "report": "The lab equipment is not working properly.",
  "status": "resolved",
  "adminResponse": "Issue has been fixed. Equipment replaced.",
  "createdAt": "2026-01-08T15:30:45.123",
  "updatedAt": "2026-01-08T16:45:30.789"
}
```

**Notes:**
- Only admins can update report status
- `adminResponse` is optional
- `updatedAt` is automatically set when status is updated

---

### Delete Report

**Endpoint:** `DELETE /api/reports/{id}`

**Description:** Delete a report

**Authentication Required:** ✅ Yes (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (204 No Content):**
```
(Empty response body)
```

**Notes:**
- Only admins can delete reports
- Deletion is permanent

---

## Report Statuses

| Status | Description |
|--------|-------------|
| `pending` | Report submitted, awaiting admin review |
| `in_progress` | Admin is actively working on the issue |
| `resolved` | Issue has been fixed/addressed |
| `closed` | Report closed without action or no longer relevant |


---

## Report Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Integer | Auto | Unique report identifier |
| `userId` | Integer | Yes | ID of user submitting the report |
| `report` | String | Yes | Description of the issue/problem |
| `status` | String | Auto | Current status (default: `pending`) |
| `adminResponse` | String | No | Admin's response or notes |
| `createdAt` | DateTime | Auto | Timestamp when report was created |
| `updatedAt` | DateTime | Auto | Timestamp when report was last updated |

---

## Usage Examples

### User Submits Report

```
POST http://localhost:9090/api/reports
Authorization: Bearer <user_token>

Body:
{
  "userId": 1,
  "report": "Air conditioning not working in Lab S512"
}
```

### User Views Their Reports

```
GET http://localhost:9090/api/reports/user/1
Authorization: Bearer <user_token>
```

### Admin Views All Pending Reports

```
GET http://localhost:9090/api/reports/status/pending
Authorization: Bearer <admin_token>
```

### Admin Updates Report Status

```
PUT http://localhost:9090/api/reports/1/status
Authorization: Bearer <admin_token>

Body:
{
  "status": "in_progress",
  "adminResponse": "Maintenance team has been notified. Will be fixed within 24 hours."
}
```

### Admin Marks Report as Resolved

```
PUT http://localhost:9090/api/reports/1/status
Authorization: Bearer <admin_token>

Body:
{
  "status": "resolved",
  "adminResponse": "AC unit has been repaired and is now functioning properly."
}
```

---

## Status Codes

| Code | Description |
|------|-------------|
| `200` | **Success** - Request completed successfully |
| `204` | **No Content** - Successful delete operation |
| `400` | **Bad Request** - Invalid request body or parameters |
| `401` | **Unauthorized** - Invalid JWT token or credentials |
| `403` | **Forbidden** - Insufficient permissions (requires admin) |
| `404` | **Not Found** - Resource not found |
| `500` | **Internal Server Error** - Server error occurred |

---

## Data Formats

### Date Format
- **Format:** `YYYY-MM-DD`
- **Example:** `2026-01-05`

### Time Format
- **Format:** `HH:MM:SS` or `HH:MM`
- **Examples:** 
  - `09:00:00` (full format)
  - `09:00` (short format, automatically converted to `09:00:00`)

### DateTime Format
- **Format:** ISO 8601
- **Example:** `2026-01-08T00:01:44.166`

### Account Types
- `student` - Regular student account
- `professor` - Professor account
- `admin` - Administrator account

### Reservation Statuses
- `pending` - Awaiting admin approval
- `approved` - Approved by admin
- `denied` - Denied by admin

### OTP Purposes
- `email_verification` - Email address verification
- `password_reset` - Password reset request
- `login` - Two-factor authentication

---

## Authentication Flow

### 1. Register
```
POST /api/user/register
→ Receive user object
```

### 2. Verify Email (Optional)
```
POST /api/otp/send (purpose: "email_verification")
→ Receive OTP via email

POST /api/otp/verify
→ Email verified
```

### 3. Login
```
POST /api/auth/login
→ Receive JWT token
```

### 4. Use Protected Endpoints
```
Add header: Authorization: Bearer <token>
→ Access protected resources
```

---

## Common Use Cases

### Creating a Reservation

1. **Get available labs**
   ```
   GET /api/labs
   ```

2. **Create reservation**
   ```
   POST /api/reservations?userId=1&labId=1
   Body: {
     "date": "2026-01-15",
     "startTime": "09:00",
     "endTime": "11:00",
     "purpose": "Programming class"
   }
   ```

3. **Check reservation status**
   ```
   GET /api/reservations/1
   ```

### Admin Approving Reservations

1. **Get pending reservations**
   ```
   GET /api/admin/reservations/pending?userId=3
   ```

2. **Approve reservation**
   ```
   PUT /api/admin/reservations/1/approve?userId=3&notes=Approved
   ```

### User Updating Profile

1. **Update profile without password**
   ```
   PUT /api/user/profile
   Body: {
     "email": "newemail@example.com",
     "username": "newusername"
   }
   ```

2. **Update profile with password change**
   ```
   PUT /api/user/profile
   Body: {
     "email": "newemail@example.com",
     "username": "newusername",
     "oldPassword": "oldpass123",
     "newPassword": "newpass456"
   }
   ```

---

## Error Handling

All error responses follow this format:

```json
{
  "message": "Error description here"
}
```

### Common Errors

**Invalid JWT Token (401):**
```json
{
  "message": "Unauthorized"
}
```

**Insufficient Permissions (403):**
```json
{
  "message": "Access Denied"
}
```

**Resource Not Found (404):**
```json
{
  "message": "User not found"
}
```

**Validation Error (400):**
```json
{
  "message": "Old password is required to change password"
}
```

---

## Notes

- All timestamps are in ISO 8601 format
- All endpoints return JSON
- JWT tokens expire after 1 hour (3600 seconds)
- Password fields are never returned in API responses
- The `perm` field should not appear in responses (internal use only)
- Overlapping reservations for the same lab are automatically prevented
- Inactive labs cannot be reserved
- Admin reservations are auto-approved; regular user reservations require approval

---

**Documentation Last Updated:** January 8, 2026

**API Version:** 1.0.0

**Backend Port:** 9090
