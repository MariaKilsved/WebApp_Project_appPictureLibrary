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

//Obtain id from URL:
let pictureQuery = window.location.search.substring(1);

for (const album of library.albums) {
    for (const picture of album.pictures) {
        let pictureQuery = window.location.search.substring(1);
        if(picture.id === pictureQuery) {
            renderImage(
                `${album.path}/${picture.imgLoRes}`, 
                `${album.path}/${picture.imgHiRes}`, 
                picture.title
            );
            renderImageTitle(picture.title);
            renderEditButton();
        }
    }
  }
})

window.addEventListener('click',  () => {

  //just to confirm that the library is accessible as a global variable read async
  console.log (`library has ${library.albums.length} albums`);
});

//Render the image
function renderImage(loResSrc, hiResSrc, title) {
    /*
    <img class="main-image" src="app-data/library/pictures/galaxies/0700064~orig.jpg" alt="A nice picture with space stuff">
    */
    const img = document.createElement('img');
    img.className = `main-image`;
    img.srcset = `${loResSrc}, ${hiResSrc} 2x`;    //Actual width is unknown
    img.alt = title;

    const imageContainer = document.getElementById('imageContainer');
    imageContainer.appendChild(img);

};

function renderImageTitle(title) {
    const h2 = document.createElement('h2');
    h2.className = `image-title`;
    h2.textContent = title;

    const titleContainer = document.getElementById('titleContainer');
    titleContainer.appendChild(h2);
}

function renderEditButton() {
    const button = document.createElement('button');
    button.className = `material-symbols-outlined`;
    button.textContent = `edit`;
    button.href = `edit_image.html`;

    const titleContainer = document.getElementById('titleContainer');
    titleContainer.appendChild(button);
}





