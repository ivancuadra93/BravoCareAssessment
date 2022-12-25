const express = require('express');
const app = express();

const postgres = require('./postgres');
const lib = require('./lib');

app.use(express.json('type'));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Access-Control-Allow-Headers',
  );
  next();
});

app.get('/getQuestionOneShifts', (req, res) => {
  postgres
    .getQuestionOneShifts()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

app.post('/getShiftOverlap', (req, res) => {
  postgres
    .getShiftOverlap(req.body)
    .then(response => {
      const result = lib.getOverlapResult(response);

      res.status(200).send(result);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

app.post('/getQuery', (req, res) => {
  postgres
    .getQuery(req.body)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

module.exports = app;

if (module.hot) {
  module.hot.accept();
}
