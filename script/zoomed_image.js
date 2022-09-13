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
            renderImageDescription(picture.comment);
        }
    }
  }
})

// Event listener to close the pop-up window for edit image
document.querySelector('.close').addEventListener('click', () => {
    document.querySelector('.popup-bg').style.display = 'none';
});

// Event listener for the edit button pop-up
document.getElementById('editButton').addEventListener('click', () => {
    document.querySelector('.popup-bg').style.display = 'flex';
});

// Render the image
function renderImage(loResSrc, hiResSrc, title) {
    const img = document.createElement('img');
    img.className = `main-image`;
    img.srcset = `${loResSrc}, ${hiResSrc} 2x`;    //Actual width is unknown
    img.alt = title;

    const imageContainer = document.getElementById('imageContainer');
    imageContainer.appendChild(img);

};

// Render the image title
function renderImageTitle(title) {
    const h2 = document.createElement('h2');
    h2.className = `image-title`;
    h2.textContent = title;

    const titleContainer = document.getElementById('titleContainer');
    titleContainer.appendChild(h2);
}

// Render the image description
function renderImageDescription(description) {
    const p = document.createElement('p');
    p.className = `image-description`;
    p.textContent = description;

    const descriptionContainer = document.getElementById('descriptionContainer');
    descriptionContainer.appendChild(p);
}

// Rename the image
function renameImageTitle() {

}