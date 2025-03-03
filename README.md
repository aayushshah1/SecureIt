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
- **Monitoring & Observability:** Integrated with Prometheus and Grafana for system monitoring.
- **Containerized Deployment:** Docker and Kubernetes for consistent deployment environments.

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
- MySQL (Configuration and System Data)

### Security

- AES-256 Encryption
- OAuth 2.0 & JWT Authentication
- CloudFlare for DDoS Protection
- End-to-End Encryption

### Infrastructure

- Docker & Kubernetes (Containerization)
- AWS/Azure (Cloud Hosting)
- CI/CD (GitHub Actions)
- Nginx (Ingress Controller)
- Minikube (Local Kubernetes Development)

### Monitoring

- Prometheus (Metrics Collection)
- Grafana (Visualization & Alerting)

## ERD Entity Relation Diagram

![mermaid-diagram-2025-02-17-181529](https://github.com/user-attachments/assets/83ba084c-fe32-474f-9558-3f1aaa5e331d)

## Microservices Architecture

Our password manager is built on a robust microservices architecture, allowing for independent scaling, development, and deployment of each component:

### Core Services

1. **Authentication Service:**
   - Handles user registration, login, and session management
   - Implements OAuth 2.0 and JWT for secure authentication
   - Manages MFA (Multi-Factor Authentication)
   - Rate limiting and brute force protection

2. **Password Vault Service:**
   - Manages secure storage and retrieval of passwords
   - Implements AES-256 encryption for all stored credentials
   - Provides password generation and strength analysis
   - Zero-knowledge architecture where decryption occurs client-side

3. **Digital Footprint Monitor:**
   - Scans the web for instances of user data
   - Maintains a database of known data breaches
   - Performs regular scans for new exposures
   - Uses machine learning to identify potential identity theft risks

4. **Notification Service:**
   - Sends real-time alerts about security incidents
   - Manages user notification preferences
   - Supports multiple channels (email, SMS, push notifications)
   - Implements smart notification batching to prevent alert fatigue

5. **Analytics Service:**
   - Tracks anonymized user behavior for product improvement
   - Generates security insights and recommendations
   - Provides dashboard for security posture assessment
   - Strictly privacy-focused with opt-out capabilities

### Supporting Services

6. **API Gateway:**
   - Handles routing to appropriate microservices
   - Implements rate limiting and request validation
   - Manages API versioning and documentation
   - Provides unified endpoint for client applications

7. **Synchronization Service:**
   - Ensures consistent data across multiple user devices
   - Handles conflict resolution for offline changes
   - Manages selective sync for bandwidth conservation
   - Implements efficient delta updates

8. **Audit Service:**
   - Maintains comprehensive logs of all system activities
   - Provides tamper-evident logging capabilities
   - Supports compliance requirements (GDPR, CCPA)
   - Implements log rotation and retention policies

### Infrastructure Services

9. **Prometheus:**
   - Collects and stores metrics from all services
   - Monitors system health and performance
   - Provides alerting based on predefined thresholds
   - Enables capacity planning and bottleneck identification

10. **Grafana:**
    - Visualizes metrics collected by Prometheus
    - Provides customizable dashboards for different stakeholders
    - Supports alerting and notification integration
    - Enables historical performance analysis

## Deployment Architecture

The system is containerized using Docker and orchestrated with Kubernetes:

- **Local Development:** Minikube for local Kubernetes development environment
- **Ingress Controller:** Nginx for managing external access to services
- **Service Discovery:** Kubernetes native service discovery
- **Database:** Stateful MySQL deployment with persistent volumes
- **Horizontal Scaling:** Auto-scaling based on CPU/memory utilization
- **Blue/Green Deployments:** Supported for zero-downtime updates

## Deployment Instructions

### Prerequisites
- Docker
- Kubernetes (Minikube for local development)
- kubectl

### Setup and Deployment

1. Clone the repository:
   ```bash
   git clone https://github.com/your-organization/password-manager.git
   cd password-manager
   ```

2. Run the deployment script:
   ```bash
   ./deploy.sh
   ```

The deployment script performs the following actions:
- Builds Docker images for backend and frontend
- Updates hosts file for local development
- Starts Minikube
- Loads Docker images into Minikube
- Deploys MySQL database
- Deploys backend services
- Deploys frontend application
- Sets up monitoring with Grafana and Prometheus
- Configures Nginx ingress controller
- Establishes Minikube tunnel for external access

### Accessing the Application

After deployment, the application is accessible at:
- Web interface: http://pm.local
- Backend API: http://pm.backend
- Grafana dashboard: http://pm.grafana
- Prometheus metrics: http://pm.prometheus

## Development Workflow

1. Make changes to the codebase
2. Build and test locally
3. Submit changes via pull request
4. Automated CI/CD pipeline runs tests
5. Upon approval, changes are automatically deployed

## Team Members

- **Prabir Kalwani** - _Project Lead & Backend Architecture_
- **Aayush Shah** - _DevOps & Infrastructure_ 
- **Snehil Sinha** - _Security Architecture & Cryptography_
- **Siddhi Shivhare** - _Frontend Development & UX Design_
