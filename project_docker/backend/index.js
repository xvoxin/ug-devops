const keys = require('./keys');

const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express()
app.use(cors());
app.use(bodyParser.json());

console.log(keys);

// postgres client setup
const { Pool } = require('pg');
const pgClient = new Pool({
    host: keys.pgHost,
    port: keys.pgPort,
    user: keys.pgUser,
    password: keys.pgPassword,
    database: keys.pgDatabase
});

pgClient.on('error', () => console.log('Cannot connect to postgres database'));

pgClient.query('CREATE TABLE IF NOT EXIST values(number INT)')
    .catch(err => console.log(err));

const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

app.get('/', (req, res) => {
    res.send("Howdy stranger!");
});

const appPort = 5000;
app.listen(appPort, err => {
    console.log(`Backend app listening on port ${appPort}`);
})