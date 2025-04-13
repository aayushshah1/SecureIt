#!/bin/bash

# Local Deployment Script for SecureIt Password Manager
# This script builds Docker images and deploys the application to local Kubernetes

echo "Building and Deploying SecureIt Password Manager"
echo "==========================================================="

# Set environment variables
export JWT_SECRET="5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437"
export PASSWORD_ENCRYPTION_SECRET="7dxreSamXN8F03/fxzcLXUPZgGkUYuoztfR+FJeVqlE="
export DB_PASSWORD="root"

# Build the Java projects
echo "Building Eureka Server..."
cd EurekaServer
./mvnw clean package -DskipTests
cd ..

echo "Building Auth Server..."
cd auth-server
./mvnw clean package -DskipTests
cd ..

echo "Building PM Backend..."
cd pmbackend
./mvnw clean package -DskipTests
cd ..

echo "Building Frontend..."
cd client
npm install
npm run build
cd ..

# Build Docker images
echo "Building Docker images..."
docker build -t eureka-server:latest ./EurekaServer
docker build -t auth-server:latest ./auth-server
docker build -t pmbackend:latest ./pmbackend
docker build -t frontend:latest ./client

# Apply Kubernetes configurations
echo "Deploying to Kubernetes..."
kubectl apply -f k8s/backend/app-secrets.yaml
kubectl apply -f k8s/db/mysql-deployment.yaml
echo "Waiting for MySQL to start..."
sleep 20
kubectl apply -f k8s/backend/eureka-server-deployment.yaml
echo "Waiting for Eureka Server to start..."
sleep 15
kubectl apply -f k8s/backend/auth-server-deployment.yaml
kubectl apply -f k8s/backend/backend-deployment.yaml
kubectl apply -f k8s/frontend/frontend-deployment.yaml
kubectl apply -f k8s/ingress/ingress.yaml

echo "==========================================================="
echo "Deployment completed. Services are available at:"
echo "Eureka Server: http://localhost:30761"
echo "Auth Server: http://localhost:30082"
echo "PM Backend: http://localhost:30081"
echo "Frontend: http://localhost:30080"
echo "==========================================================="
echo "To check the status of the pods:"
echo "kubectl get pods"