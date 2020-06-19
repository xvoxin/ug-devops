#!/bin/sh
  
cd backend
docker build -t xvoxin/kube-backend .
docker push xvoxin/kube-backend
cd ..

cd frontend
docker build -t xvoxin/kube-frontend .
docker push xvoxin/kube-frontend
cd ..