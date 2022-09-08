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

//Obtain album from URL:
let albumQuery = window.location.search.substring(1);

let counter = 0;

for (const album of library.albums) {
    if(album.id == albumQuery) {
      for (const picture of album.pictures) {
        counter++;
        renderImage(
          `${album.path}/${picture.imgLoRes}`, 
          `${album.path}/${picture.imgHiRes}`, 
          picture.id, 
          picture.title, 
          picture.comment
        );
      }
    }
  }

  var root = document.querySelector(':root');

  //Calculate appropriate max-height
  let smallHeight = (((counter * 630) - ((counter * 630) % 2)) / 2) + 630;
  let mediumHeight = (((counter * 630) - ((counter * 630) % 3)) / 3) + 630;

  let largeHeight = (((counter * 800) - ((counter * 800) % 4)) / 4) + 800;

  let extraLargeHeight = (((counter * 800) - ((counter * 800) % 4)) / 4) + 800;
  //let largeHeight = ((counter * 615) / 4) + 615;

  root.style.setProperty('--smallHeight', `${smallHeight}px`);
  root.style.setProperty('--mediumHeight', `${mediumHeight}px`);
  root.style.setProperty('--largeHeight', `${largeHeight}px`);
  root.style.setProperty('--extraLargeHeight', `${extraLargeHeight}px`);
});

//Render the images
function renderImage(loResSrc, hiResSrc, tag, title, comment) {
/*<div class="card">
    <a href="..." target="_self>
      <img src="..." class="card-img-top" alt="...">
    </a>
    <ul class="list-group list-group-flush">
      <li class="list-group-item">....</li>
      <li class="list-group-item">....</li>
      <li class="list-group-item">
        <span>Add to slideshow</span>
          <label class="toggler-wrapper">
            <input type="checkbox" >
            <div class="toggler-slider">
              <div class="toggler-knob"></div>
            </div>
          </label>
      </li>
    </ul>
  </div>
*/

//<div class="card">
  const card = document.createElement('div');
  card.className = `card`;

  //<a href="..." target="_self>
  const aHref = document.createElement('a');
  aHref.href = `zoomed_image.html?${tag}`;
  aHref.target = "_self";
  aHref.className = `card-link`;

  //<img src="..." class="card-img-top" alt="...">
  const img = document.createElement('img');
  img.src = hiResSrc;
  img.srcset = `${loResSrc}, ${hiResSrc} 2x`;    //Actual width is unknown
  img.loading = `lazy`;
  img.className = `card-img-top`;
  img.alt = title;
  aHref.appendChild(img);
  card.appendChild(aHref);

  //<ul class="list-group list-group-flush">
  const ul = document.createElement('ul');
  ul.className = `list-group list-group-flush`;

  //<li class="list-group-item">....</li>
  const li1 = document.createElement('li');
  li1.className = `list-group-item`;
  const h6 = document.createElement('h6');
  h6.className = `mb-0`;
  const text1 = document.createTextNode(title);
  h6.appendChild(text1);
  li1.appendChild(h6);

  //<li class="list-group-item">....</li>
  const li2 = document.createElement('li');
  li2.className = `list-group-item`;
  const text2 = document.createTextNode(comment);
  li2.appendChild(text2);

  //<li class="list-group-item">
  const li3 = document.createElement('li');
  li3.className = `list-group-item`;

  //<span>Add to slideshow</span>
  const span = document.createElement('span');
  const text3 = document.createTextNode("Add to slideshow");
  span.appendChild(text3);
  li3.appendChild(span);

  //<label class="toggler-wrapper">
  const pill = document.createElement('label');
  pill.className = `toggler-wrapper`;
  pill.dataset.id = tag;

  //<input type="checkbox" id="12345" name="check">
  const check = document.createElement('input');
  check.setAttribute("type", "checkbox");
  check.dataset.id = tag;
  check.id = tag;
  check.name = "check";
  pill.appendChild(check);
  
  //<div class="toggler-slider">
  const toggler = document.createElement('div');
  toggler.className = `toggler-slider`;

  //<div class="toggler-knob"></div>
  const knob = document.createElement('div');
  knob.className = `toggler-knob`;
  toggler.appendChild(knob);
  pill.appendChild(toggler);

  //li
  li3.appendChild(pill);

  //</ul>
  ul.appendChild(li1);
  ul.appendChild(li2);
  ul.appendChild(li3);
  card.appendChild(ul);
  //</div>

  const imageGallery = document.querySelector('.imageGallery');
  imageGallery.appendChild(card);
};




