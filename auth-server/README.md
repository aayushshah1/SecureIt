# Password Manager

## Overview
Password Manager is a secure authentication and password management system built using Spring Boot and JWT-based authentication. It ensures encrypted storage and retrieval of user credentials with robust security measures.

## Features
- **User Authentication**: Secure login and registration with hashed passwords.
- **JWT Authentication**: Token-based authentication for secure API access.
- **Role-Based Access Control (RBAC)**: Different permissions for users and admins.
- **Encrypted Password Storage**: Uses strong encryption algorithms.
- **Spring Security Integration**: Ensures protection against unauthorized access.
- **Microservices Architecture (Optional)**: Can be expanded into a distributed system.

## Technologies Used
- **Backend**: Spring Boot, Spring Security, JWT, Hibernate, PostgreSQL/MySQL
- **Frontend**: React (Optional for UI-based management)
- **Database**: PostgreSQL or MySQL
- **Build Tool**: Maven or Gradle
- **Containerization**: Docker (Optional)

## Installation & Setup

### Clone the Repository

```shell
git clone https://github.com/your-repo/password-manager.git cd password-manager
```

### Configure the Database
Modify `application.properties` or `application.yml` to set up database configurations.

### Run the Application

## Role-Based Access Control (RBAC)

The system supports two roles:
- **USER**: Regular users who can manage only their own passwords
- **ADMIN**: Administrative users who can manage all users and passwords

### Role Permissions

#### USER Role
- Access and manage own user profile
- Create, read, update, and delete own passwords
- Cannot access other users' data

#### ADMIN Role
- Access and manage all user profiles
- Create, read, update, and delete all passwords
- Promote or demote users (change roles)
- View system-wide information

### JWT Token Structure

JWT tokens include the following claims:
- `sub`: User email/username
- `iat`: Token issue timestamp
- `exp`: Token expiration timestamp
- `roles`: List of user roles

## API Endpoints

### Authentication
**Register a new user**
```shell
POST /api/auth/register
```

**Authenticate and receive JWT token**
```shell
POST /api/auth/login
```

### JWT Validation
**Validate a JWT token**
```shell
POST /api/jwt/validate
```

**Check if a token is expired**
```shell
GET /api/jwt/check-expiration
```

**Verify user access to resources**
```shell
GET /api/jwt/verify-user-access
```

**Check user role**
```shell
GET /api/jwt/check-role
```

### Password Management
**Retrieve stored passwords (Secure access)**
```shell
GET /api/passwords
```

**Save a new encrypted password**
```shell
POST /api/passwords
```

## Security Measures
- **BCrypt Password Hashing**
- **JWT-based Authentication**
- **Role-Based Access Control (RBAC)**
- **CSRF Protection** (If using a web UI)

