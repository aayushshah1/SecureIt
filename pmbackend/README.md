# Password Manager API Documentation

## Base URL

`/api`

## Authentication

All endpoints require authentication unless specified otherwise.

## Password Management APIs

### 1. Store Password

- **Endpoint:** `POST /api/passwords/{userId}`
- **Description:** Store a new password for a user
- **URL Parameters:**
  - `userId`: Long (User ID)
- **Request Body:**

```json
{
  "value": "string",
  "website": "string",
  "username": "string",
  "description": "string"
}
```

- **Response:** `200 OK`

```json
{
  "id": "long",
  "value": "string",
  "website": "string",
  "username": "string",
  "description": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 2. Update Password

- **Endpoint:** `PUT /api/passwords/{userId}/{passwordId}`
- **Description:** Update an existing password
- **URL Parameters:**
  - `userId`: Long (User ID)
  - `passwordId`: Long (Password ID)
- **Request Body:**

```json
{
  "value": "string",
  "website": "string",
  "username": "string",
  "description": "string"
}
```

- **Response:** `200 OK`

```json
{
  "id": "long",
  "value": "string",
  "website": "string",
  "username": "string",
  "description": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 3. Get Password

- **Endpoint:** `GET /api/passwords/{userId}/{passwordId}`
- **Description:** Retrieve a specific password
- **URL Parameters:**
  - `userId`: Long (User ID)
  - `passwordId`: Long (Password ID)
- **Response:** `200 OK`

```json
{
  "id": "long",
  "value": "string",
  "website": "string",
  "username": "string",
  "description": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 4. Get All Passwords

- **Endpoint:** `GET /api/passwords/{userId}`
- **Description:** Retrieve all passwords for a user
- **URL Parameters:**
  - `userId`: Long (User ID)
- **Response:** `200 OK`

```json
[
  {
    "id": "long",
    "value": "string",
    "website": "string",
    "username": "string",
    "description": "string",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
]
```

### 5. Delete Password

- **Endpoint:** `DELETE /api/passwords/{userId}/{passwordId}`
- **Description:** Delete a specific password
- **URL Parameters:**
  - `userId`: Long (User ID)
  - `passwordId`: Long (Password ID)
- **Response:** `204 No Content`

## User Management APIs

### 1. Create User

- **Endpoint:** `POST /api/users`
- **Description:** Create a new user
- **Request Body:**

```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string"
}
```

- **Response:** `201 Created`

```json
{
  "id": "long",
  "username": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string"
}
```

### 2. Get User

- **Endpoint:** `GET /api/users/{userId}`
- **Description:** Retrieve user information
- **URL Parameters:**
  - `userId`: Long (User ID)
- **Response:** `200 OK`

```json
{
  "id": "long",
  "username": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "error": "string",
  "message": "string"
}
```

### 401 Unauthorized

```json
{
  "error": "string",
  "message": "Authentication required"
}
```

### 403 Forbidden

```json
{
  "error": "string",
  "message": "Access denied"
}
```

### 404 Not Found

```json
{
  "error": "string",
  "message": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "string",
  "message": "Internal server error"
}
```
