# Password Manager - Kubernetes Local Deployment

This guide provides step-by-step instructions to build, deploy, and manage the SecureIt Password Manager application using Kubernetes (via Minikube or Docker Desktop) based on the `local-deployment.sh` script.

## Prerequisites

Ensure you have the following installed:

- [Docker](https://www.docker.com/get-started)
- A local Kubernetes cluster (e.g., [Minikube](https://minikube.sigs.k8s.io/docs/start/) or Docker Desktop Kubernetes)
- [Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

---

## 1. Deployment Script

The primary way to deploy locally is using the `local-deployment.sh` script located in the project root.

```sh
# Navigate to the project root directory
cd .. 

# Run the deployment script
./local-deployment.sh 
```

This script performs the following actions:
- Builds the Java projects (Eureka, Auth Server, PM Backend).
- Builds the Frontend project.
- Builds Docker images for all microservices.
- Applies Kubernetes configurations from the `k8s` directory in the correct order:
    - `k8s/backend/app-secrets.yaml`
    - `k8s/db/mysql-deployment.yaml`
    - `k8s/backend/eureka-server-deployment.yaml`
    - `k8s/backend/auth-server-deployment.yaml`
    - `k8s/backend/backend-deployment.yaml`
    - `k8s/frontend/frontend-deployment.yaml`
    - `k8s/ingress/ingress.yaml`

---

## 2. Manual Deployment Steps (Alternative)

If you prefer manual deployment:

### a. Build Docker Images

Navigate to the project root and run:

```sh
# Build Eureka Server image
docker build -t eureka-server:latest ./EurekaServer

# Build Auth Server image
docker build -t auth-server:latest ./auth-server

# Build PM Backend image
docker build -t pmbackend:latest ./pmbackend

# Build Frontend image
docker build -t frontend:latest ./client
```
*Note: Ensure your Kubernetes environment can access these local images (e.g., using `minikube image load <image-name>` or configuring Docker Desktop).*

### b. Apply Kubernetes Manifests

Navigate to the `k8s` directory (`cd k8s`) and apply the manifests in order:

```sh
# Apply Secrets (Ensure this file exists and is configured)
kubectl apply -f backend/app-secrets.yaml

# Deploy MySQL database
kubectl apply -f db/mysql-deployment.yaml
echo "Waiting for MySQL..." && sleep 20 # Adjust sleep time as needed

# Deploy Eureka Server (Ensure this file exists)
kubectl apply -f backend/eureka-server-deployment.yaml
echo "Waiting for Eureka..." && sleep 15 # Adjust sleep time as needed

# Deploy Auth Server (Ensure this file exists)
kubectl apply -f backend/auth-server-deployment.yaml

# Deploy PM Backend
kubectl apply -f backend/backend-deployment.yaml

# Deploy Frontend
kubectl apply -f frontend/frontend-deployment.yaml

# Deploy Ingress
kubectl apply -f ingress/ingress.yaml
```

---

## 3. Accessing the Application

The `local-deployment.sh` script outputs the NodePort URLs:

- **Frontend:** `http://localhost:30080`
- **PM Backend API:** `http://localhost:30081` (Primarily for direct testing)
- **Auth Server API:** `http://localhost:30082` (Primarily for direct testing)
- **Eureka Server Dashboard:** `http://localhost:30761`

If using the Ingress (requires setting up `secureit.local` in your hosts file or using `minikube tunnel`):

- **Frontend:** `http://secureit.local/`
- **Auth API:** `http://secureit.local/api/auth/`
- **Backend API:** `http://secureit.local/api/`
- **Eureka:** `http://secureit.local/eureka/`

---

## 4. Stopping and Cleaning Up

To remove all deployed resources:

```sh
# Navigate to the k8s directory
cd k8s 

kubectl delete -f ingress/ingress.yaml
kubectl delete -f frontend/frontend-deployment.yaml
kubectl delete -f backend/backend-deployment.yaml
kubectl delete -f backend/auth-server-deployment.yaml # If file exists
kubectl delete -f backend/eureka-server-deployment.yaml # If file exists
kubectl delete -f db/mysql-deployment.yaml
kubectl delete -f backend/app-secrets.yaml # If file exists
```

To stop/delete your local Kubernetes cluster:
```sh
# Example for Minikube
minikube stop
minikube delete 
```

---

## Troubleshooting

- Run `kubectl get pods` to check the status of pods.
- Run `kubectl logs <pod-name>` for debugging logs (e.g., `kubectl logs deployment/backend`).
- If a pod fails to start, check events using `kubectl describe pod <pod-name>`.
- Verify service discovery with `kubectl get services`.
- Check ingress status with `kubectl get ingress`.

---
