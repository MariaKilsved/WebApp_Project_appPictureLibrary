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
//let albumQuery = window.location.search.substring(1);

let iterator = 0;

for (const album of library.albums) {
    /*if(album.id == albumQuery) {*/
      for (const picture of album.pictures) {
        iterator++;
        renderImage(
          `${album.path}/${picture.imgLoRes}`, 
          `${album.path}/${picture.imgHiRes}`, 
          picture.id, 
          picture.title, 
          picture.comment,
          iterator
        );
      }
    /*}*/
  }
});

window.addEventListener('click',  () => {

  //just to confirm that the library is accessible as a global variable read async
  console.log (`library has ${library.albums.length} albums`);
});

//Render the images
function renderImage(loResSrc, hiResSrc, tag, title, comment, iterator) {
/*<div class="card">
  <img src="..." class="card-img-top" alt="...">
  <ul class="list-group list-group-flush">
    <li class="list-group-item">....</li>
    <li class="list-group-item">....</li>
  </ul>
</div>*/

/*---Small screens - 1 column---*/

  //<div class="card">
  var card = document.createElement('div');
  card.className = `card`;
  card.dataset.albumId = tag;

  //<img src="..." class="card-img-top" alt="...">
  const img = document.createElement('img');
  img.src = hiResSrc;
  img.srcset = `${loResSrc}, ${hiResSrc} 2x`;    //Actual width is unknown
  img.loading = `lazy`;
  img.className = `card-img-top`;
  img.alt = title;
  card.appendChild(img);

  //<ul class="list-group list-group-flush">
  const ul = document.createElement('ul');
  ul.className = `list-group list-group-flush`;

  //<li class="list-group-item">....</li>
  const li1 = document.createElement('li');
  li1.className = `list-group-item`;
  const text1 = document.createTextNode(title);
  li1.appendChild(text1);

  //<li class="list-group-item">....</li>
  const li2 = document.createElement('li');
  li2.className = `list-group-item`;
  const text2 = document.createTextNode(comment);
  li2.appendChild(text2);

  //</ul>
  ul.appendChild(li1);
  ul.appendChild(li2);
  card.appendChild(ul);
  //</div>

  const col1 = document.getElementById('c1');
  col1.appendChild(card);

/*----------------------------------------------------------------------*/
/*---Semi-small screens - 2 columns---*/

  //<div class="card">
  var card2 = document.createElement('div');
  card2.className = `card`;
  card2.dataset.albumId = tag;

  //<img src="..." class="card-img-top" alt="...">
  const img2 = document.createElement('img');
  img2.src = hiResSrc;
  img2.srcset = `${loResSrc}, ${hiResSrc} 2x`;    //Actual width is unknown
  img2.loading = `lazy`;
  img2.className = `card-img-top`;
  img2.alt = title;
  card2.appendChild(img2);

  //<ul class="list-group list-group-flush">
  const ul2 = document.createElement('ul');
  ul2.className = `list-group list-group-flush`;

  //<li class="list-group-item">....</li>
  const li1_2 = document.createElement('li');
  li1_2.className = `list-group-item`;
  const text1_2 = document.createTextNode(title);
  li1_2.appendChild(text1_2);

  //<li class="list-group-item">....</li>
  const li2_2 = document.createElement('li');
  li2_2.className = `list-group-item`;
  const text2_2 = document.createTextNode(comment);
  li2_2.appendChild(text2_2);

  //</ul>
  ul2.appendChild(li1_2);
  ul2.appendChild(li2_2);
  card2.appendChild(ul2);
  //</div>

  if(iterator % 2 === 1) {
    const col2 = document.getElementById('c2');
    col2.appendChild(card2);
  }
  else {
    const col3 = document.getElementById('c3');
    col3.appendChild(card2);
  }

/*----------------------------------------------------------------------*/
/*---Semi-large screens - 3 columns---*/

  //<div class="card">
  var card3 = document.createElement('div');
  card3.className = `card`;
  card3.dataset.albumId = tag;

  //<img src="..." class="card-img-top" alt="...">
  const img3 = document.createElement('img');
  img3.src = hiResSrc;
  img3.srcset = `${loResSrc}, ${hiResSrc} 2x`;    //Actual width is unknown
  img3.loading = `lazy`;
  img3.className = `card-img-top`;
  img3.alt = title;
  card3.appendChild(img3);

  //<ul class="list-group list-group-flush">
  const ul3 = document.createElement('ul');
  ul3.className = `list-group list-group-flush`;

  //<li class="list-group-item">....</li>
  const li1_3 = document.createElement('li');
  li1_3.className = `list-group-item`;
  const text1_3 = document.createTextNode(title);
  li1_3.appendChild(text1_3);

  //<li class="list-group-item">....</li>
  const li2_3 = document.createElement('li');
  li2_3.className = `list-group-item`;
  const text2_3 = document.createTextNode(comment);
  li2_3.appendChild(text2_3);

  //</ul>
  ul3.appendChild(li1_3);
  ul3.appendChild(li2_3);
  card3.appendChild(ul3);
  //</div>

  if(iterator % 3 === 1) {
    const col4 = document.getElementById('c4');
    col4.appendChild(card3);
  }
  else if (iterator % 3 === 2){
    const col5 = document.getElementById('c5');
    col5.appendChild(card3);
  }
  else {
    const col6 = document.getElementById('c6');
    col6.appendChild(card3);
  }

/*----------------------------------------------------------------------*/
/*---Large screens - 4 columns---*/


  //<div class="card">
  var card4 = document.createElement('div');
  card4.className = `card`;
  card4.dataset.albumId = tag;

  //<img src="..." class="card-img-top" alt="...">
  const img4 = document.createElement('img');
  img4.src = hiResSrc;
  img4.srcset = `${loResSrc}, ${hiResSrc} 2x`;    //Actual width is unknown
  img4.loading = `lazy`;
  img4.className = `card-img-top`;
  img4.alt = title;
  card4.appendChild(img4);

  //<ul class="list-group list-group-flush">
  const ul4 = document.createElement('ul');
  ul4.className = `list-group list-group-flush`;

  //<li class="list-group-item">....</li>
  const li1_4 = document.createElement('li');
  li1_4.className = `list-group-item`;
  const text1_4 = document.createTextNode(title);
  li1_4.appendChild(text1_4);

  //<li class="list-group-item">....</li>
  const li2_4 = document.createElement('li');
  li2_4.className = `list-group-item`;
  const text2_4 = document.createTextNode(comment);
  li2_4.appendChild(text2_4);

  //</ul>
  ul4.appendChild(li1_4);
  ul4.appendChild(li2_4);
  card4.appendChild(ul4);
  //</div>

  if(iterator % 4 === 1) {
    const col7 = document.getElementById('c7');
    col7.appendChild(card4);
  }
  else if (iterator % 4 === 2){
    const col8 = document.getElementById('c8');
    col8.appendChild(card4);
  }
  else if (iterator % 4 === 3) {
    const col9 = document.getElementById('c9');
    col9.appendChild(card4);
  }
  else {
    const col10 = document.getElementById('c10');
    col10.appendChild(card4);
  }
};




