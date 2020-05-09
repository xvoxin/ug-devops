const express = require('express');
const redis = require('redis');
const process = require('process');

const app = express();

const client = redis.createClient({
    host: 'my-redis-server',
    port: 6379
});

app.get('/', (req, res) => {
    res.send("Howdy stranger!");
});

app.get('/nwd/:l1&:l2', (req, res) => {
    client.get('nwd', (err, nwd) => {
        if (!nwd) {
            var result = NWD(req.params.l1, req.params.l2)
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

app.listen(8080, () => {
    console.log("Listening on port 8080");
});