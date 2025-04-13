# Password Manager API Documentation

## Base URL

`/api`

## Authentication

All endpoints require authentication unless specified otherwise.

## Role-Based Access Control (RBAC)

The API implements role-based access control with two roles:

### User Role
- Can only access their own resources
- Limited to CRUD operations on their own passwords
- Cannot view or modify other users' data

### Admin Role
- Can access all resources
- Can perform administrative actions
- Can manage all users and passwords

## Password Management APIs

### 1. Store Password

- **Endpoint:** `POST /api/passwords/user/{userId}`
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

- **Access Control:** 
  - Users can only store passwords for their own account
  - Admins can store passwords for any user account

### 2. Update Password

- **Endpoint:** `PUT /api/passwords/user/{userId}/{passwordId}`
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

- **Access Control:** 
  - Users can only update passwords they own
  - Admins can update any password

### 3. Get Password

- **Endpoint:** `GET /api/passwords/user/{userId}/{passwordId}`
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

- **Access Control:** 
  - Users can only retrieve their own passwords
  - Admins can retrieve any password

### 4. Get All Passwords

- **Endpoint:** `GET /api/passwords/user/{userId}`
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

- **Access Control:** 
  - Users can only retrieve their own passwords
  - Admins can retrieve passwords for any user

### 5. Delete Password

- **Endpoint:** `DELETE /api/passwords/user/{userId}/{passwordId}`
- **Description:** Delete a specific password
- **URL Parameters:**
  - `userId`: Long (User ID)
  - `passwordId`: Long (Password ID)
- **Response:** `204 No Content`

- **Access Control:** 
  - Users can only delete their own passwords
  - Admins can delete any password

## User Management APIs

### 1. Create User

- **Endpoint:** `POST /api/users/register`
- **Description:** Create a new user (publicly accessible)
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
  "lastName": "string",
  "role": "string"
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
  "lastName": "string",
  "role": "string"
}
```

- **Access Control:** 
  - Users can only retrieve their own information
  - Admins can retrieve any user's information

### 3. Get All Users

- **Endpoint:** `GET /api/users`
- **Description:** Retrieve all users
- **Response:** `200 OK`

```json
[
  {
    "id": "long",
    "username": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "role": "string"
  }
]
```

- **Access Control:** Admin only

### 4. Update User

- **Endpoint:** `PUT /api/users/{userId}`
- **Description:** Update user information
- **URL Parameters:**
  - `userId`: Long (User ID)
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

- **Response:** `200 OK`

- **Access Control:** 
  - Users can only update their own information (cannot change role)
  - Admins can update any user's information (including role)

### 5. Delete User

- **Endpoint:** `DELETE /api/users/{userId}`
- **Description:** Delete a user
- **URL Parameters:**
  - `userId`: Long (User ID)
- **Response:** `204 No Content`

- **Access Control:** 
  - Users can only delete their own account
  - Admins can delete any user account

### 6. Promote to Admin

- **Endpoint:** `POST /api/users/promote/{userId}`
- **Description:** Promote a user to admin role
- **URL Parameters:**
  - `userId`: Long (User ID)
- **Response:** `200 OK`

- **Access Control:** Admin only

### 7. Demote to User

- **Endpoint:** `POST /api/users/demote/{userId}`
- **Description:** Demote an admin to user role
- **URL Parameters:**
  - `userId`: Long (User ID)
- **Response:** `200 OK`

- **Access Control:** Admin only

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
