const express = require('express');
const redis = require('redis');
const process = require('process');

const app = express();

const client = redis.createClient({
    host: 'my-redis-server',
    port: 6379
});

client.set('nwd', 'n/a');

app.get('/', (req, res) => {
    client.get('counter', (err, counterValue) => {
        var currentValue = parseInt(counterValue) + 1;
        client.set('counter', currentValue);
        res.send("Hello " + currentValue + " time!");
    })
});

app.get('/nwd/:l1&:l2', (req, res) => {
    var result = NWD(req.params.l1, req.params.l2)
    res.send("Nwd " + result);
    client.set('nwd', result);
});

app.get('/nwd', (req, res) => {
    client.get('nwd', (err, nwd) => {
        res.send("Cached nwd " + nwd);
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

app.listen(8080, () => {
    console.log("Listening on port 8080");
});