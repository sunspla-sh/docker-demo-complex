const keys = require('./keys');

// express app setup

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();


app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//postgres client setup
const { Pool } = require('pg');
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});

pgClient.on('error', () => console.log('lost pg connection'));

pgClient.on('connect', (client) => {
  client.query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch(err => console.log(err));
});

//redis client setup
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

//express route handlers

app.get('/', (req, res, next) => {
  res.send('hi');
});

app.get('/values/all', async (req, res, next) => {
  try {
    const values = await pgClient.query('SELECT * FROM values');
    console.log('values all ', values.rows);
    res.send(values.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.get('/values/current', async (req, res, next) => {
  try {
    redisClient.hgetall('values', (err, values) => {
      console.log('values current ', values)
      if(!values){
        res.send({});
        return;
      }
      res.send(values);
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.post('/values', async (req, res, next) => {
  console.log(req.body);
  const index = req.body.index;

  if(parseInt(index) > 40){
    return res.status(422).send('Index too high')
  }

  redisClient.hset('values', index, 'Nothing yet!');
  redisPublisher.publish('insert', index);
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index])

  res.send({ working: true });

})

app.listen(5000, err => {
  console.log('listening')
})








