#!/bin/sh

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/cloud/deploy.yaml
kubectl apply -f kube/myapp-configmap.yml
kubectl apply -f kube/redis-deployment.yml
kubectl apply -f kube/redis-service-clusterip.yml
kubectl apply -f kube/postgres-secret.yml
kubectl apply -f kube/postgres-pvc.yml
kubectl apply -f kube/postgres-deployment.yml
kubectl apply -f kube/postgres-service-clusterip.yml
kubectl apply -f kube/mybackend-deployment.yml
kubectl apply -f kube/mybackend-service-clusterip.yml
kubectl apply -f kube/myfrontend-deployment.yml
kubectl apply -f kube/myfrontend-service-clusterip.yml
kubectl apply -f kube/ingress-service.yml