#!/bin/bash

set -e  


echo "Building Docker images..."
docker build -t pmbackend:latest ./pmbackend
docker build -t pmfrontend:latest ./client


echo "Updating /etc/hosts..."
echo "127.0.0.1 pm.backend\n127.0.0.1 pm.grafana\n127.0.0.1 pm.prometheus\n127.0.0.1 pm.local\n127.0.0.1 pm.dev" | sudo tee -a /etc/hosts


echo "Starting Minikube..."
minikube start


echo "Loading Docker images into Minikube..."
minikube image load pmbackend:latest
minikube image load pmfrontend:latest

# might need to be redeployed 
echo "Deploying MySQL..."
kubectl apply -f ./k8s/db/mysql-deployment.yaml

echo "Deploying Backend..."
kubectl apply -f ./k8s/backend/backend-deployment.yaml

echo "Deploying Frontend..."
kubectl apply -f ./k8s/frontend/frontend-deployment.yaml

echo "Deploying Grafana..."
kubectl apply -f ./k8s/apmtools/grafana/grafana.yaml

echo "Deploying Prometheus..."
kubectl apply -f ./k8s/apmtools/prometheus/prometheus.yaml

echo "new nginx deployment"
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml

# this might not work first time since the nginx deployment takes longer to establish
echo "Deploying Ingress..."
kubectl apply -f ./k8s/ingress/ingress.yaml



echo "Describing deployments..."
kubectl get all -A

# run after deploying ingress manually 
echo "Starting Minikube Tunnel ..."
minikube tunnel