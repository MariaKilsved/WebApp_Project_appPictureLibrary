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

for (const album of library.albums) {
    renderAlbum(album.headerImage, album.id);
  }
})

window.addEventListener('click',  () => {

  //just to confirm that the library is accessible as a global variable read async
  console.log (`library has ${library.albums.length} albums`);
});

//Render the albums
function renderAlbum(src, tag) {

  const a = document.createElement('a');
  a.href = "#"; //Fix this later
  a.className = `albumLink`;
  a.dataset.albumId = tag;

  const img = document.createElement('img');
  img.src = src;
  a.appendChild(img);

  const FlexWrap = document.querySelector('.FlexWrap');
  FlexWrap.appendChild(a);
};
