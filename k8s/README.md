# Password Manager - Minikube Deployment

This guide provides step-by-step instructions to build, deploy, and manage the Password Manager application using Minikube, Kubernetes, and Prometheus.

## Prerequisites

Ensure you have the following installed:

- [Docker](https://www.docker.com/get-started)
- [Minikube](https://minikube.sigs.k8s.io/docs/start/)
- [Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

---

## 1. Build Docker Images

Run the following commands to build the frontend and backend Docker images:

```sh
# Build the frontend image
docker build -t pmfrontend:latest ./client

# Build the backend image
docker build -t pmbackend:latest ./pmbackend
```

---

## 2. Start Minikube Cluster

Start Minikube and verify the cluster is running:

```sh
minikube start
kubectl get pods
cd k8s
```

---

## 3. Deploy Services to Minikube

Apply Kubernetes configurations for MySQL, Prometheus, backend, and frontend.

```sh
# Deploy MySQL database
kubectl apply -f mysql-deployment.yaml

# Apply Prometheus configuration
kubectl apply -f prometheus-config.yaml

# Deploy Prometheus
kubectl apply -f prometheus-deployment.yaml

# Deploy backend service
kubectl apply -f backend-deployment.yaml

# Deploy frontend service
kubectl apply -f frontend-deployment.yaml
```

---

## 4. Port Forwarding

To access the services, use the following port-forwarding commands:

```sh
# Port forward backend (Spring Boot) on port 8080
kubectl port-forward pod/backend-6b9d689594-hvntv 8080:8080

# Port forward frontend (Next.js) on port 3000
kubectl port-forward pod/pmfrontend-67f64f5b66-zt4wj 3000:80

# Port forward Prometheus monitoring on port 9090
kubectl port-forward pod/prometheus-67bb7f88-jct2h 9090:9090
```

---

## 5. Accessing the Application

- **Frontend:** Open `http://localhost:3000`
- **Backend API:** `http://localhost:8080`
- **Prometheus Dashboard:** `http://localhost:9090`

---

## 6. Stopping and Cleaning Up

To stop Minikube and delete the cluster:

```sh
minikube stop
minikube delete
```

To remove all deployments:

```sh
kubectl delete -f mysql-deployment.yaml
kubectl delete -f prometheus-config.yaml
kubectl delete -f prometheus-deployment.yaml
kubectl delete -f backend-deployment.yaml
kubectl delete -f frontend-deployment.yaml
```

---

## Troubleshooting

- Run `kubectl get pods` to check the status of pods.
- Run `kubectl logs <pod-name>` for debugging logs.
- If a pod fails to start, check events using `kubectl describe pod <pod-name>`.

---

## Notes

- Ensure Minikube has sufficient resources allocated (CPU, RAM, Disk).
- Consider using `minikube dashboard` for visual monitoring.
- Use `kubectl get services` to verify service deployments.

---

This setup enables you to run a password manager application with monitoring capabilities using Kubernetes on a Minikube cluster. 🚀
