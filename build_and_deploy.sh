#!/bin/bash

# Set variables for app directories and Docker image names
REACT_APP_DIR="./miniproject-frontend"
NODE_APP_DIR="./miniproject-backend"
REACT_IMAGE="my-react-app"
NODE_IMAGE="my-node-app"
DEPLOYMENT_FILE="deployment.yaml"

# Ensure Minikube's Docker daemon is used
echo "Configuring Minikube's Docker environment..."
eval $(minikube docker-env)

# Step 1: Build the React app Docker image
echo "Building the React app Docker image..."
docker build -t $REACT_IMAGE $REACT_APP_DIR
if [ $? -ne 0 ]; then
    echo "Failed to build React app Docker image"
    exit 1
fi

# Step 2: Build the Node.js app Docker image
echo "Building the Node.js app Docker image..."
docker build -t $NODE_IMAGE $NODE_APP_DIR
if [ $? -ne 0 ]; then
    echo "Failed to build Node.js app Docker image"
    exit 1
fi

# Step 3: Apply the Kubernetes deployment
echo "Deleting the apps from Minikube using Kubernetes..."
kubectl delete -f $DEPLOYMENT_FILE
echo "Deploying the apps to Minikube using Kubernetes..."
kubectl apply -f $DEPLOYMENT_FILE
if [ $? -ne 0 ]; then
    echo "Failed to apply the Kubernetes deployment"
    exit 1
fi

# Step 4: Wait for the pods to be ready
echo "Waiting for FE pods to be ready..."
kubectl wait --for=condition=ready pod -l app=react-app --timeout=90s
echo "Waiting for BE pods to be ready..."
kubectl wait --for=condition=ready pod -l app=node-app --timeout=90s


kubectl port-forward service/node-app-service 3001:80 & 

# Step 5: Access the services
echo "Fetching the URL for the React app..."
minikube service react-app-service --url

echo "Deployment completed successfully!"

