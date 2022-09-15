//required node library
const path = require('path');
const fs = require('fs');

const express = require('express');
const formidable = require('formidable');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

const appDir = './app-data/library';
const appJson = 'picture-library.json';

app.get('/', (req, res) =>
  res.send('Example server for receiving JS POST requests')
);

app.post('/api/createdir', (req, res) => {
  const form = formidable();

  form.parse(req, (err, fields, files) => {
    if (err) {
      return;
    }
    console.log('POST body:', fields);

    let albumStruct = {};
    albumStruct.directoryPath = [];
    albumStruct.imagePath = [];


    if (fileExists(appJson))
      albumStruct = readJSON(appJson);

    //get the data sent over from browser
    const dirToCreate = fields['directory'];
    const fileXmit = fields['fileXmit'];

    if (dirToCreate != '') {
      //create the directory
      dirCreate(dirToCreate);

      //Store the images if the created directoru
      if (fileIsValidImage(files.fileXmit1)) {
        const fname = fileRelocate(files.fileXmit1, dirToCreate);
        albumStruct.imagePath.push(fname);
      }

      if (fileIsValidImage(files.fileXmit2)) {
        const fname = fileRelocate(files.fileXmit2, dirToCreate);
        albumStruct.imagePath.push(fname);
      }

      //update the json file
      albumStruct.directoryPath.push(dirToCreate)

      //Make sure to remove duplicates
      albumStruct.directoryPath = [...new Set(albumStruct.directoryPath)];  
      albumStruct.imagePath = [...new Set(albumStruct.imagePath)];  
      writeJSON(appJson, albumStruct);
    }

    //send success response
    res.sendStatus(200);
  });
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

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

function fileRelocate(file, imgPath) {
  const fileName = encodeURIComponent(file.originalFilename.replace(/\s/g, "-"));

  const albumPathRelative = path.join(appDir, imgPath, fileName);
  const albumPath = path.normalize(path.join(__dirname, appDir, imgPath, fileName));
  const downloadedPath = file.filepath;

  try {
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
