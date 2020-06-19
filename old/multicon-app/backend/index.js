const keys = require('./keys');

const express = require('express')
const bodyParser = require('body-parser');
const redis = require('redis');
const cors = require('cors');

const app = express()
app.use(cors());
app.use(bodyParser.json());

console.log(keys);

// postgres client setup
const {Pool} = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on('error', () => console.log('Lost PG connection'));

pgClient
    .query('CREATE TABLE IF NOT EXISTS nwd (first INT, second INT, result INT)')
    .catch(err => console.log(err));

app.listen(5000, err => {
    console.log('Backend Listening');
});

const client = redis.createClient({
    host: keys.redisHost,
    port: 6379
});

app.get('/', (req, res) => {
    res.send("Howdy stranger!");
});

app.get('/nwd/:l1&:l2', (req, res) => {
    client.get('nwd', (err, nwd) => {
        var result = NWD(req.params.l1, req.params.l2)
        saveNwd(req.params.l1, req.params.l2, result)
        if (!nwd) {
            res.send("NWD: " + result);
            client.set('nwd', result);
        }
        res.send("Cached NWD " + nwd);
    })
});

function NWD(a,b){
  var q;
  while (b != 0){
    q = a;
    a = b;
    b = q % b;
 }
 return a;
}

function saveNwd(first, second, result) {
    pgClient
        .query(`INSERT INTO nwd VALUES (${first}, ${second}, ${result})`)
        .catch(err => console.log(err));
}