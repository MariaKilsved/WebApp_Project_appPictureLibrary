'use strict';  // Try without strict mode

let saveFile=[];
const addImage=(ev)=>{
  ev.preventDefault();
  let imageTF = {
    id: Date.now(),
    title: document.getElementById('title').value,
    filename: document.getElementById('myFile').value 
  } 
  saveFile.push(imageTF);
 /* document.forms[0].reset();*/
  /*document.querySelector('form').reset();*/
  console.warn('added', {saveFile});
  let pre = document.querySelector('#msg pre');
  pre.textContent= '\n' + JSON.stringify(saveFile, '\t',2);

  localStorage.setItem('MyImageList',JSON.stringify(saveFile) );
}
document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('btn').addEventListener('added', addImage);
});

addImage.innerHTML = "Image" + title.value + myFile.value;



