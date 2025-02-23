# Password Manager with Security Features

## Overview

This project is a **Password Manager** with advanced security features that not only securely stores user credentials but also provides **digital footprint monitoring** capabilities. It helps users manage their passwords across multiple platforms while identifying where their personal information appears online, enhancing digital privacy and security.

## Features

- **Secure Password Storage:** AES-256 encrypted storage for passwords.
- **Digital Footprint Monitoring:** Tracks where personal information appears online.
- **User Authentication:** Secure login with JWT & OAuth 2.0 authentication.
- **Real-Time Alerts:** Notifies users of potential security breaches.
- **Cross-Platform Support:** Available on web, mobile, and desktop.
- **Microservices Architecture:** Scalable and modular system design.

## Technologies Used

### Frontend

- React.js (Web Interface)
- React Native (Mobile Applications)
- Electron (Desktop Applications)
- Redux (State Management)

### Backend

- Node.js with Express (API Services)
- Java Spring Boot (Core Security Services)
- Python (Web Scraping & Monitoring Services)

### Database

- PostgreSQL (User & Credentials Data)
- MongoDB (Digital Footprint Data)
- Redis (Caching & Temporary Storage)

### Security

- AES-256 Encryption
- OAuth 2.0 & JWT Authentication
- CloudFlare for DDoS Protection

### Infrastructure

- Docker & Kubernetes (Containerization)
- AWS/Azure (Cloud Hosting)
- CI/CD (GitHub Actions)

## ERD Entity Relation Diagram

![mermaid-diagram-2025-02-17-181529](https://github.com/user-attachments/assets/83ba084c-fe32-474f-9558-3f1aaa5e331d)

## Microservices Breakdown

1. **Authentication Service:** Handles user registration, login, and session management.
2. **Password Vault Service:** Manages secure storage and retrieval of passwords.
3. **Digital Footprint Monitor:** Scans the web for instances of user data.
4. **Notification Service:** Sends alerts and manages user preferences.
5. **Analytics Service:** Tracks user behavior and security insights.

## Team Members

Prabir Kalwani  
Aayush Shah  
Snehil Sinha  
Siddhi Shivhare
