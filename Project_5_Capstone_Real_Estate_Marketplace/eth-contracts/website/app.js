const express = require('express');
const url = require('url');
const path = require('path');



const app = express();


app.listen(8000, console.log(`App listening at http://localhost:8000`));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
})

