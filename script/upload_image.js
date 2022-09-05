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

const http = require("http");
const server = http.createServer(function(req,res) {
res.setHeader("Content-type", "application/json");
res.setHeader("Access-Control-Allow-Origin", "*");
res.writeHead(200); //status code HTTP 200 / OK

res.end(images1);
});
server.listen(3000, function(){
  console.log("Listenig on port 3000");
});

/*addImage.innerHTML = "Image" + title.value + myFile.value;*/



