'use strict';  // Try without strict mode

import * as lib from '../model/picture-library-browser.js';
import * as proto from '../model/picture-album-prototypes.js';

const libraryJSON ='picture-library.json';
let library;  //Global varibale, Loaded async from the current server in window.load event


//use the DOMContentLoaded, or window load event to read the library async and render the images
window.addEventListener('DOMContentLoaded', async () => {
  
  library = await lib.pictureLibraryBrowser.fetchJSON(libraryJSON);  //reading library from JSON on local server 
  //library = lib.pictureLibraryBrowser.createFromTemplate();  //generating a library template instead of reading JSON

  getAlbumTitle(library.albums);
});

window.addEventListener('click',  () => {

  //just to confirm that the library is accessible as a global variable read async
  console.log (`library has ${library.albums.length} albums`);
});

let dropdown = document.getElementById('albumSelect');
dropdown.length = 0;

let defaultOption = document.createElement('option');
defaultOption.text = 'Choose Album';

dropdown.add(defaultOption);
dropdown.selectedIndex = 0;

function getAlbumTitle(data) {  
  let option;
  
  for (const element of data) {
    option = document.createElement('option');
    option.text = element.title;
    option.value = element.id;
    dropdown.add(option);
  } 
};

let titleInput;
let descriptionInput;
let fileName;
let albumInput;
let option;
let albumId;
let albumTitle;
let selectedAlbumPath;

/*Denna kod är för att få upp bild tillfäligt på browsern*/ 
const image_input = document.querySelector("#image-input");
image_input.addEventListener("change", function() {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const uploaded_image = reader.result;
    document.querySelector("#display-image").style.backgroundImage = `url(${uploaded_image})`;
  });
  reader.readAsDataURL(this.files[0]);
  
  titleInput = document.getElementById('title').value;
  descriptionInput = document.getElementById('description').value;
  fileName = image_input.value.split("\\").pop();
  albumInput = document.getElementById('albumSelect');
  option = albumInput.options[albumInput.selectedIndex];
  albumId = option.value;
  albumTitle = option.text;
  selectedAlbumPath = `./library/pictures/${albumTitle}`.replace(/\s+/g, '-').toLowerCase();

  for (const album in obj) {
    if (Object.hasOwnProperty.call(obj, album)) {
      const element = obj[album];
      for (const item of element) {
        if (item.id === albumId) {
          console.log(item.id);
          pic = item.pictures;
        }
      }
      console.log(element);
    }
  };
});

let obj = await lib.pictureLibraryBrowser.fetchJSON(libraryJSON);
let pic;
const imageUploadForm = document.getElementById('uploadImageForm');



imageUploadForm.addEventListener('submit', async event => {
  event.preventDefault();
  pic.push( { 
    id: proto.uniqueId(),
    title: `${titleInput}`,
    comment:`${descriptionInput}`,
    imgLoRes:`${fileName}`,
    imgHiRes: `${fileName}`
  });

//  lib.pictureLibraryBrowser.postJSON(obj, libraryJSON);

  try {
    const url = 'http://localhost:3000/api/upload';

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(obj)

      });
    if(response.ok) {
        console.log("Request successful");
        const responeText = await response.text();
        console.log(responeText);
    }
    else {
        //typcially you would log an error instead
        console.log(`Failed to recieved data from server: ${res.status}`);
        alert(`Failed to recieved data from server: ${res.status}`);
    }
  }
  catch(error) {
    console.log("Failed to receive data from server");
    //console.log(`Failed to recieve data from server: ${err.message}`);
    alert("Failed to recieve data from server");
    //alert(`Failed to recieve data from server: ${err.message}`);
  }
});





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