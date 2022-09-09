//Just to ensure we force js into strict mode in HTML scrips - we don't want any sloppy code
'use strict';  // Try without strict mode

//import * as proto from './picture-album-prototypes.js';
import * as lib from '../model/picture-library-browser.js';

const libraryJSON ="picture-library.json";
let library;  //Global varibale, Loaded async from the current server in window.load event


//use the DOMContentLoaded, or window load event to read the library async and render the images
window.addEventListener('DOMContentLoaded', async () => {

library = await lib.pictureLibraryBrowser.fetchJSON(libraryJSON);  //reading library from JSON on local server 
//library = lib.pictureLibraryBrowser.createFromTemplate();  //generating a library template instead of reading JSON

//Manage query
const query = window.location.search.substring(1);
const searchParams = new URLSearchParams(query);
const albums = searchParams.getAll('album');
const ids = searchParams.getAll('id');

//Count rendered images
var counter = 0;

//Render stand-alone images found in query
if(albums.length > 0 && ids.length > 0) {
  for (const album of library.albums) {
    if(albums.includes(album.id)) {
      for (const picture of album.pictures) {
        if(ids.includes(picture.id)) {
          counter++;
          renderImage(
            `${album.path}/${picture.imgLoRes}`, 
            `${album.path}/${picture.imgHiRes}`, 
            picture.id, 
            picture.title,
            counter
          );
        }
      }
    }
  }
}//Render entire albums found in query
else if(albums.length > 0) {
  for (const album of library.albums) {
    if(albums.includes(album.id)) {
      for (const picture of album.pictures) {
        counter++;
        renderImage(
          `${album.path}/${picture.imgLoRes}`, 
          `${album.path}/${picture.imgHiRes}`, 
          picture.id, 
          picture.title,
          counter
        );
      }
    }
  }
}
})

//Render the images
function renderImage(loResSrc, hiResSrc, id, title, counter) {
  /*
  First image:
  <div class="carousel-item active">
    <img class="d-block w-100" src="..." srcset="..." loading="eager" alt="...">
  </div>

  Other images:
  <div class="carousel-item">
    <img class="d-block w-100" src="..." srcset="..." loading="lazy" alt="...">
  </div>
  */

  //<div class="carousel-item active">
  //or
  //<div class="carousel-item">
  const div = document.createElement('div');
  div.className = (counter === 1)? `carousel-item active` : `carousel-item`;

  //<img src="..." loading="lazy" class="d-block w-100" alt="...">
  const img = document.createElement('img');
  img.className = `d-block w-100`;
  img.src = hiResSrc;
  img.srcset = `${loResSrc}, ${hiResSrc} 2x`;    //Actual width is unknown
  img.loading = (counter === 1)? "eager" : "lazy";
  img.alt = title;
  div.appendChild(img);

  const carouselInner = document.querySelector('.carousel-inner');
  carouselInner.appendChild(div);
};




