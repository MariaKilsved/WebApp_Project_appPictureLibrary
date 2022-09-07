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

let iterator = 0;

for (const album of library.albums) {
    if(album.id == albumQuery) {
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
    }
  }
});

window.addEventListener('click',  () => {

  //just to confirm that the library is accessible as a global variable read async
  console.log (`library has ${library.albums.length} albums`);
});

//Render the images
function renderImage(loResSrc, hiResSrc, tag, title, comment, iterator) {
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

/*---Small screens - 1 column---*/
//<div class="card">
  const card = document.createElement('div');
  card.className = `card`;
  card.dataset.albumId = tag;

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
  const text1 = document.createTextNode(title);
  li1.appendChild(text1);

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
  
  //<input type="checkbox" id="12345" name="check">
  const check = document.createElement('input');
  check.setAttribute("type", "checkbox");
  check.id = `1${tag}`;
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

  const col1 = document.getElementById('c1');
  col1.appendChild(card);

/*----------------------------------------------------------------------*/
/*---Semi-small screens - 2 columns---*/

  //<div class="card">
  const card2 = document.createElement('div');
  card2.className = `card`;
  card2.dataset.albumId = tag;

  //<a href="" target="_self" class="card-link">
  const aHref2 = document.createElement('a');
  aHref2.href = `zoomed_image.html?${tag}`;
  aHref2.target = "_self";
  aHref2.className = `card-link`;

  //<img src="..." class="card-img-top" alt="...">
  const img2 = document.createElement('img');
  img2.src = hiResSrc;
  img2.srcset = `${loResSrc}, ${hiResSrc} 2x`;    //Actual width is unknown
  img2.loading = `lazy`;
  img2.className = `card-img-top`;
  img2.alt = title;
  aHref2.appendChild(img2);
  card2.appendChild(aHref2);

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

  //<li class="list-group-item">
  const li3_2 = document.createElement('li');
  li3_2.className = `list-group-item`;

  //<span>Add to slideshow</span>
  const span2 = document.createElement('span');
  const text3_2 = document.createTextNode("Add to slideshow");
  span2.appendChild(text3_2);
  li3_2.appendChild(span2);

  //<label class="toggler-wrapper">
  const pill2 = document.createElement('label');
  pill2.className = `toggler-wrapper`;
  
  //<input type="checkbox" id="12345" name="check">
  const check2 = document.createElement('input');
  check2.setAttribute("type", "checkbox");
  check2.id = `2${tag}`;
  check2.name = "check";
  pill2.appendChild(check2);
  
  //<div class="toggler-slider">
  const toggler2 = document.createElement('div');
  toggler2.className = `toggler-slider`;

  //<div class="toggler-knob"></div>
  const knob2 = document.createElement('div');
  knob2.className = `toggler-knob`;
  toggler2.appendChild(knob2);
  pill2.appendChild(toggler2);

  //li
  li3_2.appendChild(pill2);

  //</ul>
  ul2.appendChild(li1_2);
  ul2.appendChild(li2_2);
  ul2.appendChild(li3_2);
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
  const card3 = document.createElement('div');
  card3.className = `card`;
  card3.dataset.albumId = tag;

  //<a href="" target="_self" class="card-link">
  const aHref3 = document.createElement('a');
  aHref3.href = `zoomed_image.html?${tag}`;
  aHref3.target = "_self";
  aHref3.className = `card-link`;

  //<img src="..." class="card-img-top" alt="...">
  const img3 = document.createElement('img');
  img3.src = hiResSrc;
  img3.srcset = `${loResSrc}, ${hiResSrc} 2x`;    //Actual width is unknown
  img3.loading = `lazy`;
  img3.className = `card-img-top`;
  img3.alt = title;
  aHref3.appendChild(img3);
  card3.appendChild(aHref3);

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

  //<li class="list-group-item">
  const li3_3 = document.createElement('li');
  li3_3.className = `list-group-item`;

  //<span>Add to slideshow</span>
  const span3 = document.createElement('span');
  const text3_3 = document.createTextNode("Add to slideshow");
  span3.appendChild(text3_3);
  li3_3.appendChild(span3);

  //<label class="toggler-wrapper">
  const pill3 = document.createElement('label');
  pill3.className = `toggler-wrapper`;
  
  //<input type="checkbox" id="12345" name="check">
  const check3 = document.createElement('input');
  check3.setAttribute("type", "checkbox");
  check3.id = `3${tag}`;
  check3.name = "check";
  pill3.appendChild(check3);
  
  //<div class="toggler-slider">
  const toggler3 = document.createElement('div');
  toggler3.className = `toggler-slider`;

  //<div class="toggler-knob"></div>
  const knob3 = document.createElement('div');
  knob3.className = `toggler-knob`;
  toggler3.appendChild(knob3);
  pill3.appendChild(toggler3);

  //li
  li3_3.appendChild(pill3);

  //</ul>
  ul3.appendChild(li1_3);
  ul3.appendChild(li2_3);
  ul3.appendChild(li3_3);
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
  const card4 = document.createElement('div');
  card4.className = `card`;
  card4.dataset.albumId = tag;

  //<a href="" target="_self" class="card-link">
  const aHref4 = document.createElement('a');
  aHref4.href = `zoomed_image.html?${tag}`;
  aHref4.target = "_self";
  aHref4.className = `card-link`;

  //<img src="..." class="card-img-top" alt="...">
  const img4 = document.createElement('img');
  img4.src = hiResSrc;
  img4.srcset = `${loResSrc}, ${hiResSrc} 2x`;    //Actual width is unknown
  img4.loading = `lazy`;
  img4.className = `card-img-top`;
  img4.alt = title;
  aHref4.appendChild(img4);
  card4.appendChild(aHref4);

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

  //<li class="list-group-item">
  const li3_4 = document.createElement('li');
  li3_4.className = `list-group-item`;

  //<span>Add to slideshow</span>
  const span4 = document.createElement('span');
  const text3_4 = document.createTextNode("Add to slideshow");
  span4.appendChild(text3_4);
  li3_4.appendChild(span4);

  //<label class="toggler-wrapper">
  const pill4 = document.createElement('label');
  pill4.className = `toggler-wrapper`;
  
  //<input type="checkbox" id="12345" name="check">
  const check4 = document.createElement('input');
  check4.setAttribute("type", "checkbox");
  check4.id = `4${tag}`;
  check4.name = "check";
  pill4.appendChild(check4);
  
  //<div class="toggler-slider">
  const toggler4 = document.createElement('div');
  toggler4.className = `toggler-slider`;

  //<div class="toggler-knob"></div>
  const knob4 = document.createElement('div');
  knob4.className = `toggler-knob`;
  toggler4.appendChild(knob4);
  pill4.appendChild(toggler4);

  //li
  li3_4.appendChild(pill4);

  //</ul>
  ul4.appendChild(li1_4);
  ul4.appendChild(li2_4);
  ul4.appendChild(li3_4);
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




