//required node library
const path = require('path');
const fs = require('fs');

const express = require('express');
const formidable = require('formidable');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

//Middleware in express.js to read json body
app.use(express.json());

const appDir = '../app-data/library';
const appJson = 'picture-library.json';

/*------------------------------------------------------ */

app.get('/api/upload', (req, res) => {
  response = readJSON(appJson);
  res.send(response);
});


app.post('/api/upload', (req, res) => {
  const b = req.body;
  writeJSON(appJson, b);

  //responds with the json file
  res.json(b);
});

app.post('/api/newalbum', (req, res) => {
  const form = formidable();

  form.parse(req, (err, fields, files) => {
    if (err) {
      return;
    }
    console.log('POST body:', fields);

    let jason = {};

    if (fileExists(appJson))
      jason = readJSON(appJson);

    //get the fiields sent over from browser
    const albumTitle = fields['albumTitle'];
    const albumComment = fields['albumComment'];

    if(albumTitle != '') {
      //create the directory
      dirCreate('pictures/' + albumTitle);

      //Store the image in the album-header
      if (fileIsValidImage(files.albumFile)) {
        const fname = fileRelocate(files.albumFile, 'pictures/album-header');
      }

      //update the json file
      jason.albums.push({
        id: uniqueId(),
        title: albumTitle,
        comment: albumComment,
        path: 'app-data/library/pictures/galaxies/' + albumTitle,
        headerImage: 'app-data/library/pictures/album-header/' + files.albumFile.name,
        pictures: []
      });

      writeJSON(appJson, jason);
    }

    //send success response
    res.sendStatus(200);
  });
});

app.listen(port, () =>
  console.log(`Node server listening at http://localhost:${port}`)
);

/*------------------------------------------------------ */

//helper functions to check for files and directories
function fileExists(fname) {
  const appDataDir = path.normalize(path.join(__dirname, appDir));
  return fs.existsSync(path.resolve(appDataDir, fname));
}

function dirCreate(fpath) {

  //All directories are create in appDir
  const fullPath = path.normalize(path.join(appDir, fpath));

  //loop over all directories in the path
  const dirs = fullPath.split(path.sep); // / on mac and Linux, \\ on windows
  let baseDir = path.join(__dirname);

  for (const appendDir of dirs) {

    baseDir = path.join(baseDir, appendDir);

    //create the directory if it does not exist
    if (!fs.existsSync(baseDir)) {
      console.log(`create dir ${baseDir}`)
      fs.mkdirSync(path.resolve(baseDir));
    }
  }
}

//helper functions to store an image
function fileIsValidImage(file) {
  //Is there a file
  if (file.originalFilename === '' || file.size === 0)
    return false;

  //check if the img format is correct
  const type = file.mimetype.split("/").pop();
  const validTypes = ["jpg", "jpeg", "png", "webp"];
  if (validTypes.indexOf(type) === -1) {
    return false;
  }

  return true;
};

//Parameters are the file itself and the path
function fileRelocate(file, imgPath) {
  /*The encodeURIComponent() function encodes a URI by replacing each instance of certain characters by one, 
  two, three, or four escape sequences representing the UTF-8 encoding of the character 
  (will only be four escape sequences for characters composed of two "surrogate" characters).*/
  const fileName = encodeURIComponent(file.originalFilename.replace(/\s/g, "-"));

  const albumPathRelative = path.join(appDir, imgPath, fileName);
  const albumPath = path.normalize(path.join(__dirname, appDir, imgPath, fileName));
  const downloadedPath = file.filepath;

  try {
    /*The fs.renameSync() method is used to synchronously rename a file at the given old path to the given new path. 
    It will overwrite the destination file if it already exists.
    fs.renameSync( oldPath, newPath )*/
    fs.renameSync(downloadedPath, albumPath);
  }
  catch (err) {
    console.log(err);
  }

  return albumPathRelative;
}

//helper functions to read and write JSON
function writeJSON(fname, obj) {
  const appDataDir = path.normalize(path.join(__dirname, appDir));

  if (!fs.existsSync(appDataDir))
    fs.mkdirSync(appDataDir);

  fs.writeFileSync(path.join(appDataDir, fname), JSON.stringify(obj));
}

function readJSON(fname) {
  const appDataDir = path.normalize(path.join(__dirname, appDir));
  obj = JSON.parse(fs.readFileSync(path.join(appDataDir, fname), 'utf8'));
  return obj;
}

function uniqueId() {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substring(2);
    return dateString + randomness;
};