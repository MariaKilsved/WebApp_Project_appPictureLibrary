'use strict';  // Try without strict mode

const a = document.querySelectorAll('input');

// store field values
function processField() {
  localStorage.setItem(window.location.href, 'true');
  localStorage.setItem(this.id, this.value);
}

const save= document.getElementById('input');

function Savepicture(image) {
    console.log("clickkk");
    console.log(image);
}