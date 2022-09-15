//required node library
const path = require('path');
const fs = require('fs');

//from the downloaded npm
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

//initialize cors
app.use(cors({
  origin: '*'
}));

//send a simple Hello World in response to 
//http://localhost:3000
app.get('/', (req, res) => {
  res.send('Hello World!');
  console.log('hello again');
});

//sending a simple json string in response to 
//http://localhost:3000/ingredients
app.get('/ingredients', (req, res) => {

  response = readJSON(`ingedients.json`);
  res.send(response);
});


//Start listening
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
