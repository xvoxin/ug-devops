#!/bin/sh

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/cloud/deploy.yaml
kubectl apply -f myapp-configmap.yml
kubectl apply -f redis-deployment.yml
kubectl apply -f redis-service-clusterip.yml
kubectl apply -f postgres-secret.yml
kubectl apply -f postgres-pvc.yml
kubectl apply -f postgres-deployment.yml
kubectl apply -f postgres-service-clusterip.yml
kubectl apply -f mybackend-deployment.yml
kubectl apply -f mybackend-service-clusterip.yml
kubectl apply -f myfrontend-deployment.yml
kubectl apply -f myfrontend-service-clusterip.yml
kubectl apply -f ingress-service.yml