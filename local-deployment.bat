@echo off
rem Local Deployment Script for SecureIt Password Manager
rem This script builds Docker images and deploys the application to local Kubernetes

echo Building and Deploying SecureIt Password Manager
echo ===========================================================

rem Set environment variables
set JWT_SECRET=secureit-jwt-secret-key-local-dev
set PASSWORD_ENCRYPTION_SECRET=password-encryption-secret-key-secure-local-dev
set DB_PASSWORD=root

rem Build the Java projects
echo Building Eureka Server...
cd EurekaServer
call mvnw.cmd clean package -DskipTests
cd ..

echo Building Auth Server...
cd auth-server
call mvnw.cmd clean package -DskipTests
cd ..

echo Building PM Backend...
cd pmbackend
call mvnw.cmd clean package -DskipTests
cd ..

echo Building Frontend...
cd client
call npm install
call npm run build
cd ..

rem Build Docker images
echo Building Docker images...
docker build -t eureka-server:latest .\EurekaServer
docker build -t auth-server:latest .\auth-server
docker build -t pmbackend:latest .\pmbackend
docker build -t frontend:latest .\client

rem Apply Kubernetes configurations
echo Deploying to Kubernetes...
kubectl apply -f k8s/backend/app-secrets.yaml
kubectl apply -f k8s/db/mysql-deployment.yaml
echo Waiting for MySQL to start...
timeout /t 20 /nobreak > nul
kubectl apply -f k8s/backend/eureka-server-deployment.yaml
echo Waiting for Eureka Server to start...
timeout /t 15 /nobreak > nul
kubectl apply -f k8s/backend/auth-server-deployment.yaml
kubectl apply -f k8s/backend/backend-deployment.yaml
kubectl apply -f k8s/frontend/frontend-deployment.yaml
kubectl apply -f k8s/ingress/ingress.yaml

echo ===========================================================
echo Deployment completed. Services are available at:
echo Eureka Server: http://localhost:30761
echo Auth Server: http://localhost:30082
echo PM Backend: http://localhost:30081
echo Frontend: http://localhost:30080
echo ===========================================================
echo To check the status of the pods:
echo kubectl get pods

pause