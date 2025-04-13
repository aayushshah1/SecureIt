@echo off
rem Local Development Script for SecureIt Password Manager
rem This script starts all the microservices for local development

echo Starting SecureIt Password Manager Development Environment
echo ===========================================================

rem Set environment variables
set JWT_SECRET=secureit-jwt-secret-key-local-dev
set PASSWORD_ENCRYPTION_SECRET=password-encryption-secret-key-secure-local-dev
set DB_PASSWORD=root

rem Start Eureka Server
echo Starting Eureka Server...
start cmd /k "cd EurekaServer && mvnw.cmd spring-boot:run"
echo Eureka Server started
echo Waiting for Eureka Server to start up...
timeout /t 10 /nobreak > nul

rem Start Auth Server
echo Starting Auth Server...
start cmd /k "cd auth-server && mvnw.cmd spring-boot:run"
echo Auth Server started
echo Waiting for Auth Server to start up...
timeout /t 10 /nobreak > nul

rem Start PM Backend
echo Starting PM Backend...
start cmd /k "cd pmbackend && mvnw.cmd spring-boot:run"
echo PM Backend started
echo Waiting for PM Backend to start up...
timeout /t 10 /nobreak > nul

rem Start Frontend
echo Starting Frontend...
start cmd /k "cd client && npm run dev"
echo Frontend started

echo ===========================================================
echo All services are now running:
echo Eureka Server: http://localhost:8761
echo Auth Server: http://localhost:8081
echo PM Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo ===========================================================
echo Close this window to exit (individual service windows must be closed manually)

pause