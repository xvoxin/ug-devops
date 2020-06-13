const express = require('express');
const app = express();
const keys = require('./keys');

const {v4: uuidv4} = require('uuid');

const appId = uuidv4();

const port = 5000;

const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on('error', () => console.log('Lost prostgres connection'));

pgClient
    .query('CREATE TABLE IF NOT EXISTS visits (date VARCHAR(30))')
    .catch(err => console.log(err));

app.get('/', (req, res) => {
   const key = "last-visit";
    redisClient.get(key, (err, lastVisitDate) => {

        if (!lastVisitDate) {
            lastVisitDate = "First visit just now!";
        }

        const currentDate = new Date().toLocaleString();
        redisClient.set(key, currentDate);
        saveVisitDate(currentDate);
        res.send(`Hello! Last visit: ${lastVisitDate}`);

    });
});

app.get('/history', (req, res) => {
    pgClient.query('SELECT * FROM visits;', (err, result) => {
        if (result.rows) {
            res.send(result.rows);
        } else {
            res.send([]);
        }
    });
});

function saveVisitDate(visitDate) {
    pgClient
        .query(`INSERT INTO visits VALUES ${visitDate}`)
        .catch(err => console.log(err));
}

app.listen(port, err => {
    console.log(`Listening on port ${port}`);
});