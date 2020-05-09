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

setTimeout(() => {
    pgClient
        .query('CREATE TABLE IF NOT EXISTS exchange(nok NUMERIC, pln NUMERIC)')
        .catch(err => console.log(err));
}, 3000);

const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

app.get('/', (req, res) => {
    res.send("Howdy stranger!");
});

app.get('/exchange/:nok', (req, res) => {
    const nokKey = req.params.nok
    const nok = parseFloat(nokKey)

    var result = 0

    redisClient.get(nokKey, (err, calculatedPln) => {
        if (!calculatedPln) {
            result = calculatePln(nok);
            saveResultInDb(nok, result);
            redisClient.set(nokKey, result.toString());
        } else {
            result = calculatedPln;
        }

        res.send(result.toString());
    });
});

app.get('/history', (req, res) => {
    pgClient.query('SELECT * FROM exchange;', (err, result) => {
        if (result.rows) {
            res.send(result.rows);
        } else {
            res.send([]);
        }
    });
});

const nokExchangeRate = 0.41;

function calculatePln(nok) {
    return (nok * nokExchangeRate).toFixed(2);
}

function saveResultInDb(nok, result) {
    pgClient
        .query(`INSERT INTO exchange (nok, pln) VALUES (${nok}, ${result})`)
        .catch(pgError => console.log(pgError));
}

const appPort = 5000;


app.listen(appPort, err => {
    console.log(`Backend app listening on port ${appPort}`);
})