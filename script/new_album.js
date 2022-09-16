'use strict';  // Try without strict mode

const urlPost = 'http://localhost:3000/api/upload/album';
const urlJson = './app-data/library/picture-library.json';


const addDictoryServer = document.getElementById('addDictoryServer');
// const urlPost = 'http://localhost:3000/api/upload/album';
// const urlJson = './app-data/library/picture-library.json';
// ./ leta utanför map


addDictoryServer.addEventListener('submit', async event => {
    event.preventDefault();

    //Create the key/value pairs used in the form
    const formData = new FormData(addDictoryServer);
    try {
        //send the data using post and await the reply
        const response = await fetch(urlPost, {
            method: 'post',
            body: formData
        });
        const result = await response.text();

        if (response.ok) {

            const response = await fetch(urlJson);
            const data = await response.text();

            alert(`Submitting the information. It has been recieved:\n`+
                `${data}`);
        }
        else {
            alert(`Failed to recieved data from server: ${response.status}`);
        }
        console.log(result);
    }
    catch {
        alert("Transmission error");
    }
})
