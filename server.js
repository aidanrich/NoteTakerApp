const express = require('express');
const PORT = 3001;

const app = express();
const db = require('./db/db.json');
app.use(express.static('public'));




app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
