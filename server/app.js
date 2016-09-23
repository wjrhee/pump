const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./routes');
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');


app.use(morgan('dev'));
// app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../browser')));
app.use(express.static(path.join(__dirname, '../node_modules')));
app.use('/api', routes);

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.listen(3000,function() {
  console.log('Now listening on port 3000!');
});

