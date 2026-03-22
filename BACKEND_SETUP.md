# Backend Setup Instructions

## Prerequisites

Make sure you have your backend server set up and running on `http://localhost:8000`.

## Quick Start

1. **Start your backend server** on port 8000
2. **Start the frontend** with `npm run dev`
3. The frontend will automatically proxy API calls to your backend

## API Requirements

Your backend should provide these endpoints:

### GET /api/v1/department/list-departments

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "departments": [
    {
      "department_id": 1,
      "department_name": "Computer Science"
    },
    {
      "department_id": 2,
      "department_name": "Information Technology"
    }
  ]
}
```

### POST /api/v1/department/add-department-admin

**Headers:**

- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "TempPass123!",
  "phone_number": "+9779841234567",
  "department_id": 1
}
```

**Response:**

```json
{
  "message": "Department admin created successfully",
  "admin_id": 123
}
```

## Troubleshooting

- **Empty department dropdown:** Backend server not running
- **API errors:** Check backend logs and ensure endpoints match the specifications above
- **Authentication issues:** Verify JWT token format and validity
