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
  let answerImg = document.querySelector('#answerImg');
  answerImg.textContent= '\n' + JSON.stringify(saveFile, '\t',2);

  localStorage.setItem('MyImageList',JSON.stringify(saveFile) );
}
document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('btn').addEventListener('added', addImage);
});

/*myImage = document.querySelector('#answerImg').JSON.parse(localStorage.getItem('MyImageList'));*/

 
console.log(JSON.stringify(saveFile));





/*addImage.innerHTML = "Image" + title.value + myFile.value;*/



