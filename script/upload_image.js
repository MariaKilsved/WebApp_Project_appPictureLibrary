'use strict';  // Try without strict mode

let images1 = [];
// example {id:1592304983049, title: 'Deadpool', year: 2015}
const addImage = (ev)=>{
    ev.preventDefault();  //to stop the form submitting
    let file = {
        id: Date.now(),
        title: document.getElementById('title').value,
        file: document.getElementById('myFile').value
    }
    images1.push(file);
    document.forms[0].reset(); // to clear the form for the next entries
    //document.querySelector('form').reset();

    //for display purposes only
    console.warn('added' , {images1} );
    let pre = document.querySelector('#msg pre');
    pre.textContent = '\n' + JSON.stringify(images1, '\t', 2);

    //saving to localStorage
    localStorage.setItem('MyImageList', JSON.stringify(images1) );
}
document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('btn').addEventListener('click', addImage);

   
});

// const http = require("http");
// const server = http.createServer(function(req,res) {
// res.setHeader("Content-type", "application/json");
// res.setHeader("Access-Control-Allow-Origin", "*");
// res.writeHead(200); //status code HTTP 200 / OK

// res.end(images1);
// });
// server.listen(3000, function(){
//   console.log("Listenig on port 3000");
// });

/*addImage.innerHTML = "Image" + title.value + myFile.value;*/

localStorage.setItem('star', 'theStarClickedID');
var star = localStorage.getItem('star');

// const path = require('path');
// const fs = require('fs');

// //from the downloaded npm
// const express = require('express');
// const cors = require('cors');
// const app = express();
// const port = 3000;

// //initialize cors
// app.use(cors({
//   origin: '*'
// }));

// //send a simple Hello World in response to 
// //http://localhost:3000
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// //sending a simple json string in response to 
// //http://localhost:3000/ingredients
// app.get('/ingredients', (req, res) => {

//   response = readJSON(`ingedients.json`);
//   res.send(response);
// });


// //Start listening
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// })



// //Initialize application data
// function initAppData() {

//   //Here we can create some initial application data
//    const ingredients = [
//     {
//       "id": "1",
//       "item": "Bacon"
//     },
//     {
//       "id": "2",
//       "item": "Eggs"
//     },
//     {
//       "id": "3",
//       "item": "Milk"
//     },
//     {
//       "id": "4",
//       "item": "Butter"
//     }
//   ];
 
//   writeJSON(`ingedients.json`, ingredients);
// }

// //helper functions to read and write JSON
// function writeJSON(fname, obj) {
//   const appDataDir = path.join(__dirname, `app_data`);
//   fs.writeFileSync(path.resolve(appDataDir, fname), JSON.stringify(obj));
// }

// function readJSON(fname) {
//   const appDataDir = path.join(__dirname, `app_data`);
//   obj = JSON.parse(fs.readFileSync(path.resolve(appDataDir, fname), 'utf8'));
//   return obj;
// }