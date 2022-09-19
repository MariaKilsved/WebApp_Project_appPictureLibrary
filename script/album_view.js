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
const albumQuery = window.location.search.substring(1);
const searchParams = new URLSearchParams(albumQuery);
var isRatingAlbum = false;
var isAlbum = false;
if(searchParams.has('album')) {
  isAlbum = true;
}
else if(searchParams.has('stars')) {
  isRatingAlbum = true;
}

let counter = 0;
let allPictureIds = [];

for (const album of library.albums) {
    if(isAlbum && album.id == searchParams.get('album')) {
      for (let picture of album.pictures) {
        counter++;
        allPictureIds.push(picture.id);
        renderImage(
          `${album.path}/${picture.imgLoRes}`, 
          `${album.path}/${picture.imgHiRes}`, 
          picture.id, 
          picture.title, 
          picture.comment,
          counter
        );
      }
    }
    else if(isRatingAlbum) {
      for(let picture of album.pictures) {
        if(picture.rating !== null && 
          picture.rating !== undefined && 
          picture.rating !== NaN && 
          picture.rating == searchParams.get('stars')) {
            counter++;
            allPictureIds.push(picture.id);
            renderImage(
              `${album.path}/${picture.imgLoRes}`, 
              `${album.path}/${picture.imgHiRes}`, 
              picture.id, 
              picture.title, 
              picture.comment,
              counter
          );
        }
      }
    }
  }

  //Event listeners for checkboxes
  let formSwitches = document.querySelectorAll(".form-switch");
  formSwitches.forEach(formSwitch => {
    formSwitch.addEventListener("click", linkCheckboxes);
  });

  //Event listeners for buttons
  document.getElementById('redirectAll').addEventListener("click", redirectAll);
  document.getElementById('redirectSelected').addEventListener("click", redirectSelection);

  //Event listener for checking if button should be enabled or not
  let allCheckboxes = document.querySelectorAll('.form-switch');
  allCheckboxes.forEach(x => addEventListener("click", enableRedirectSelection));


});

//Render the images
function renderImage(loResSrc, hiResSrc, tag, title, comment, iterator) {
  /*<div class="card">
      <a href="..." target="_self>
        <img src="..." srcset="..." class="card-img-top" alt="...">
      </a>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">....</li>
        <li class="list-group-item">....</li>
        <li class="list-group-item">
          <div class="form-check form-switch d-flex justify-content-between">
            <input class="form-check-input order-2" type="checkbox" id="..." name="check" role="switch" id="...">
            <label class="form-check-label order-1" for="...">Add to slideshow</label>
          </div>
        </li>
      </ul>
    </div>
  */
  
  /*---Small screens - 1 column---*/
  //<div class="card">
    const card = document.createElement('div');
    card.className = `card`;
  
    //<a href="..." target="_self class="card-link">
    const aHref = document.createElement('a');
    aHref.href = `zoomed_image.html?${tag}`;
    aHref.target = "_self";
    aHref.className = `card-link`;
  
    //<img src="..." srcset="..." class="card-img-top" alt="...">
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

    //<div class="form-check form-switch d-flex justify-content-between">
    const formSwitch = document.createElement('div');
    formSwitch.className = `form-check form-switch d-flex justify-content-between`;
    formSwitch.dataset.check = `1${tag}`;

    //<input class="form-check-input order-2" type="checkbox" id="..." name="check" role="switch" id="...">
    const check = document.createElement('input');
    check.className = `form-check-input order-2`;   //Reversing order to stay consistent with Bootstrap docs
    check.setAttribute("type", "checkbox");
    check.dataset.id = tag;
    check.id = `1${tag}`;
    check.name = "check";
    check.value = tag;
    formSwitch.appendChild(check);

    //<label class="foform-check-label order-1" for="...">Add to slideshow</label>
    const formLabel = document.createElement('label');
    formLabel.className = `form-check-label order-1`;   //Reversing order to stay consistent with Bootstrap docs
    formLabel.for = `1${tag}`;
    const labelText = document.createTextNode('Add to slideshow');
    formLabel.appendChild(labelText);
    formSwitch.appendChild(formLabel);

    //li
    li3.appendChild(formSwitch);
  
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
  
    //<a href="..." target="_self class="card-link">
    const aHref2 = document.createElement('a');
    aHref2.href = `zoomed_image.html?${tag}`;
    aHref2.target = "_self";
    aHref2.className = `card-link`;
  
    //<img src="..." srcset="..." class="card-img-top" alt="...">
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
    const h6_2 = document.createElement('h6');
    h6_2.className = `mb-0`;
    const text1_2 = document.createTextNode(title);
    h6_2.appendChild(text1_2);
    li1_2.appendChild(h6_2);
  
    //<li class="list-group-item">....</li>
    const li2_2 = document.createElement('li');
    li2_2.className = `list-group-item`;
    const text2_2 = document.createTextNode(comment);
    li2_2.appendChild(text2_2);
  
    //<li class="list-group-item">
    const li3_2 = document.createElement('li');
    li3_2.className = `list-group-item`;
  
    //<div class="form-check form-switch d-flex justify-content-between">
    const formSwitch2 = document.createElement('div');
    formSwitch2.className = `form-check form-switch d-flex justify-content-between`;
    formSwitch2.dataset.check = `2${tag}`;

    //<input class="form-check-input order-2" type="checkbox" id="..." name="check" role="switch" id="...">
    const check2 = document.createElement('input');
    check2.className = `form-check-input order-2`;   //Reversing order to stay consistent with Bootstrap docs
    check2.setAttribute("type", "checkbox");
    check2.dataset.id = tag;
    check2.id = `2${tag}`;
    check2.name = "check";
    check2.value = tag;
    formSwitch2.appendChild(check2);

    //<label class="form-check-label order-1" for="...">Add to slideshow</label>
    const formLabel2 = document.createElement('label');
    formLabel2.className = `form-check-label order-1`;   //Reversing order to stay consistent with Bootstrap docs
    formLabel2.for = `2${tag}`;
    const labelText2 = document.createTextNode('Add to slideshow');
    formLabel2.appendChild(labelText2);
    formSwitch2.appendChild(formLabel2);

    //li
    li3_2.appendChild(formSwitch2);
  
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
  
    //<a href="" target="_self" class="card-link">
    const aHref3 = document.createElement('a');
    aHref3.href = `zoomed_image.html?${tag}`;
    aHref3.target = "_self";
    aHref3.className = `card-link`;
  
    //<img src="..." srcset="..." class="card-img-top" alt="...">
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
    const h6_3 = document.createElement('h6');
    h6_3.className = `mb-0`;
    const text1_3 = document.createTextNode(title);
    h6_3.appendChild(text1_3);
    li1_3.appendChild(h6_3);
  
    //<li class="list-group-item">....</li>
    const li2_3 = document.createElement('li');
    li2_3.className = `list-group-item`;
    const text2_3 = document.createTextNode(comment);
    li2_3.appendChild(text2_3);
  
    //<li class="list-group-item">
    const li3_3 = document.createElement('li');
    li3_3.className = `list-group-item`;
  
    //<div class="form-check form-switch d-flex justify-content-between">
    const formSwitch3 = document.createElement('div');
    formSwitch3.className = `form-check form-switch d-flex justify-content-between`;
    formSwitch3.dataset.check = `3${tag}`;

    //<input class="form-check-input order-2" type="checkbox" id="..." name="check" role="switch" id="...">
    const check3 = document.createElement('input');
    check3.className = `form-check-input order-2`;   //Reversing order to stay consistent with Bootstrap docs
    check3.setAttribute("type", "checkbox");
    check3.dataset.id = tag;
    check3.id = `3${tag}`;
    check3.name = "check";
    check3.value = tag;
    formSwitch3.appendChild(check3);

    //<label class="form-check-label order-1" for="...">Add to slideshow</label>
    const formLabel3 = document.createElement('label');
    formLabel3.className = `form-check-label order-1`;   //Reversing order to stay consistent with Bootstrap docs
    formLabel3.for = `3${tag}`;
    const labelText3 = document.createTextNode('Add to slideshow');
    formLabel3.appendChild(labelText3);
    formSwitch3.appendChild(formLabel3);

    //li
    li3_3.appendChild(formSwitch3);
  
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
  
    //<a href="..." target="_self class="card-link">
    const aHref4 = document.createElement('a');
    aHref4.href = `zoomed_image.html?${tag}`;
    aHref4.target = "_self";
    aHref4.className = `card-link`;
  
    //<img src="..." srcset="..." class="card-img-top" alt="...">
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
    const h6_4 = document.createElement('h6');
    h6_4.className = `mb-0`;
    const text1_4 = document.createTextNode(title);
    h6_4.appendChild(text1_4);
    li1_4.appendChild(h6_4);
  
    //<li class="list-group-item">....</li>
    const li2_4 = document.createElement('li');
    li2_4.className = `list-group-item`;
    const text2_4 = document.createTextNode(comment);
    li2_4.appendChild(text2_4);
  
    //<li class="list-group-item">
    const li3_4 = document.createElement('li');
    li3_4.className = `list-group-item`;
  
    //<div class="form-check form-switch d-flex justify-content-between">
    const formSwitch4 = document.createElement('div');
    formSwitch4.className = `form-check form-switch d-flex justify-content-between`;
    formSwitch4.dataset.check = `4${tag}`;

    //<input class="form-check-input order-2" type="checkbox" id="..." name="check" role="switch" id="...">
    const check4 = document.createElement('input');
    check4.className = `form-check-input order-2`;   //Reversing order to stay consistent with Bootstrap docs
    check4.setAttribute("type", "checkbox");
    check4.dataset.id = tag;
    check4.id = `4${tag}`;
    check4.name = "check";
    check4.value = tag;
    formSwitch4.appendChild(check4);

    //<label class="form-check-label order-1" for="...">Add to slideshow</label>
    const formLabel4 = document.createElement('label');
    formLabel4.className = `form-check-label order-1`;   //Reversing order to stay consistent with Bootstrap docs
    formLabel4.for = `4${tag}`;
    const labelText4 = document.createTextNode('Add to slideshow');
    formLabel4.appendChild(labelText4);
    formSwitch4.appendChild(formLabel4);

    //li
    li3_4.appendChild(formSwitch4);
  
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

//Only enable the button to redirect selected when something is actually selected
function enableRedirectSelection() {
  let btn = document.getElementById('redirectSelected');
  let checkboxes = document.querySelectorAll('input[name=check]:checked');

  if(checkboxes.length > 0) {
    btn.disabled = false;
  }
  else {
    btn.disabled = true;
  }
}

//Link checkboxes together when clicked
function linkCheckboxes(e) {
  let outerDiv = e.target;
  let checkId = outerDiv.id;    // This should have been outerDiv.dataset.id, but not according to debugging. 
  let check = document.getElementById(checkId);

  if(!check) return;

  let isChecked = check.checked;
  let idGroup = check.dataset.id;
  let queryString = `[data-id="${idGroup}"]`;
  let checkboxGroup = document.querySelectorAll(queryString);
  let checkboxGroupArray = [...checkboxGroup];
  let otherCheckboxes = checkboxGroupArray.filter(box => box.id != checkId);
  otherCheckboxes.forEach(checkbox => {
    checkbox.checked = isChecked;
  });
}

//onclick to redirect to slideshow
function redirectAll() {
  //Just re-use the same query as on the album_view page
  const albumQuery = window.location.search.substring(1);
  const searchParams = new URLSearchParams(albumQuery);

  if(searchParams.has('album')) {
    window.location.href = `slideshow.html?album=${searchParams.get('album')}`;
  }
  else if(searchParams.has('stars')) {
    window.location.href = `slideshow.html?stars=${searchParams.get('stars')}`;
  }  
}

//onclick to redirect to slideshow, but only with selected images
function redirectSelection() {
  //Get checkboxes then turn it ino an array to use .map
  let checkboxes = [...document.querySelectorAll('input[name=check]:checked')];
  //.map with only the values
  let checkboxValues = checkboxes.map(box => box.value);
  //Remove duplicate values
  let uniqueValues = [...new Set(checkboxValues)]
  //New URLSearchParams
  let newSearchParams = new URLSearchParams('');

  //Add all unique values as search paramters
  for(let i = 0; i < uniqueValues.length; i++) {
    newSearchParams.append('id', uniqueValues[i]);
  }

  //Redirect to slideshow with the search paramters
  window.location.href = `slideshow.html?${newSearchParams.toString()}`;

}


