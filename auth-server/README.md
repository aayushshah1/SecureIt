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

