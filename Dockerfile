FROM node:alpine

WORKDIR /app/webapp

COPY ./package.json .

RUN npm install 

COPY . .

CMD ["npm", "run", "start"]