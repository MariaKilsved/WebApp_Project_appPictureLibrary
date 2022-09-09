'use strict';  // Try without strict mode

/*Rad 3-41 är för att kunna spara bild senare med server denna kod är ej färdig*/ 
// const http = require("http");
// const server = http.createServer(function(req,res) {
// res.setHeader("Content-type", "application/json");
// res.setHeader("Access-Control-Allow-Origin", "*");
// res.writeHead(200); //status code HTTP 200 / OK

// res.end(images1);
// });
// server.listen(1234, function(){
//   console.log("Listenig on port 1234");
// });


// let images1 = [];
// // example {id:1592304983049, title: 'Deadpool', year: 2015}
// const addImage = (ev)=>{
//     ev.preventDefault();  //to stop the form submitting
//     let file = {
//         id: Date.now(),
//         title: document.getElementById('title').value,
//         file: document.getElementById('myFile').value
//     }
//     images1.push(file);
//     document.forms[0].reset(); // to clear the form for the next entries
//     //document.querySelector('form').reset();

//     //for display purposes only
//     console.warn('added' , {images1} );
//     let pre = document.querySelector('#msg pre');
//     pre.textContent = '\n' + JSON.stringify(images1, '\t', 2);

//     //saving to localStorage
//     localStorage.setItem('MyImageList', JSON.stringify(images1) );
// }
// document.addEventListener('DOMContentLoaded', ()=>{
//     document.getElementById('btn').addEventListener('click', addImage);

   
// });


/*addImage.innerHTML = "Image" + title.value + myFile.value;*/


/*Denna kod är för att få upp bild tillfäligt på browsern*/ 
const image_input = document.querySelector("#image-input");

image_input.addEventListener("change", function() {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const uploaded_image = reader.result;
    document.querySelector("#display-image").style.backgroundImage = `url(${uploaded_image})`;
  });
  reader.readAsDataURL(this.files[0]);
});








