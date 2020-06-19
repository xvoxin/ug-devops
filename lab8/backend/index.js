const express = require('express');
const app = express();

const {v4: uuidv4} = require('uuid');

const appId = uuidv4();

const port = 5000;

const redis = require('redis');
const redisClient = redis.createClient({
  host: "redis-service",
  port: 6379
});


app.get('/', (req, res) => {
   const key = "last-visit";
    redisClient.get(key, (err, lastVisitDate) => {

        if (!lastVisitDate) {
            lastVisitDate = "First visit just now!";
        }

        const currentDate = new Date().toLocaleString();
        redisClient.set(key, currentDate);
        res.send(`Hello! Last visit: ${lastVisitDate}`);

    });
});

app.listen(port, err => {
    console.log(`Listening on port ${port}`);
});