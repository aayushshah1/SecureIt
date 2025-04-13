#!/bin/bash

# Local Development Script for SecureIt Password Manager
# This script starts all the microservices for local development

echo "Starting SecureIt Password Manager Development Environment"
echo "==========================================================="

# Set environment variables
export JWT_SECRET="secureit-jwt-secret-key-local-dev"
export PASSWORD_ENCRYPTION_SECRET="password-encryption-secret-key-secure-local-dev"
export DB_PASSWORD="root"

# Start Eureka Server
echo "Starting Eureka Server..."
cd EurekaServer
./mvnw spring-boot:run &
EUREKA_PID=$!
cd ..
echo "Eureka Server started with PID: $EUREKA_PID"
echo "Waiting for Eureka Server to start up..."
sleep 10

# Start Auth Server
echo "Starting Auth Server..."
cd auth-server
./mvnw spring-boot:run &
AUTH_PID=$!
cd ..
echo "Auth Server started with PID: $AUTH_PID"
echo "Waiting for Auth Server to start up..."
sleep 10

# Start PM Backend
echo "Starting PM Backend..."
cd pmbackend
./mvnw spring-boot:run &
BACKEND_PID=$!
cd ..
echo "PM Backend started with PID: $BACKEND_PID"
echo "Waiting for PM Backend to start up..."
sleep 10

# Start Frontend
echo "Starting Frontend..."
cd client
npm run dev &
FRONTEND_PID=$!
cd ..
echo "Frontend started with PID: $FRONTEND_PID"

echo "==========================================================="
echo "All services are now running:"
echo "Eureka Server: http://localhost:8761"
echo "Auth Server: http://localhost:8081"
echo "PM Backend: http://localhost:8080"
echo "Frontend: http://localhost:5173"
echo "==========================================================="
echo "Press Ctrl+C to stop all services"

# Wait for user to press Ctrl+C
trap "echo 'Stopping all services...'; kill $EUREKA_PID $AUTH_PID $BACKEND_PID $FRONTEND_PID; echo 'All services stopped.'; exit 0" INT
wait