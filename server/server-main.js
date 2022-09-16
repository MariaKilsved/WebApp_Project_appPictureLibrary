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
const libraryJsonPath = '../app-data/library/picture-library.json';

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


//Post request
/*
app.post('/api/newalbum', (req, res) => {

  //Creates a formidable object of the incoming data
  let form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {

      // fs.mkdirSync(path.resolve(`app-data/library/pictures/${fields.title}`));

      let newName = files.myImage.originalFilename.trim().replace(' ', '-').replace(/(\s|-|_|~)+/g, '-').toLowerCase();
      let oldPath = files.myImage.filepath;
      let title = fields.title.trim().replace(' ', '-').replace(/(\s|-|_|~)+/g, '-').toLowerCase();
      const dir = `app-data/library/pictures/${title}`;

      let newPath = './app-data/library/pictures/album-header/' +  newName;

      console.log(newPath)

      fs.mkdirSync(dir, { recursive: true }, (err) => {
          if (err) {
              throw err;
          }
      });

      const data = fs.readFileSync(oldPath)

      fs.writeFileSync(newPath, data, function(err){
          res.status(501).send('Couldnt create album');
          return;
      })

      //    const obj = JSON.parse(fs.readFileSync(path.resolve(dir2, fname), 'utf8'));

      let libraryJson = readJSON(picture-library.json);

      //let libraryJson = JSON.parse(fs.readFileSync(path.resolve('app-data', 'library/' + appJson), 'utf8'));

      // console.log(libraryJson.albums);

      let albumObj = {
          id:  uniqueId(),
          title: title,
          comment: fields.albumComment.trim().replace(' ', '-').replace(/(\s|-|_|~)+/g, '-').toLowerCase(),
          path: dir,
          headerImage: newPath,
          pictures: [],
      };

      libraryJson.albums.push(albumObj);

      fs.writeFileSync(libraryJsonPath, JSON.stringify(libraryJson), function(err) {
          // Todo: remove album header picture and directory in case of an error
          res.sendStatus(501);
          return;
      });
      res.sendStatus(200);
  });
});
*/

app.post('/api/newalbum', (req, res) => {
  const form = formidable();

  form.parse(req, (err, fields, files) => {
    if (err) {
      return;
    }
    console.log('POST body:', fields);

    let albumStruct = {};
    directoryPath = [];
    imagePath = [];

    if (fileExists(appJson))
      albumStruct = readJSON(appJson);

    //get the data sent over from browser
    const albumTitle = fields['albumTitle'];
    const albumFile = fields['albumFile'];
    const headerPath = path.join(appDir, 'pictures', 'album-header');
    var title = "";

    //Test to check that albumTitle is a string
    if(typeof(albumTitle) === "string") {
      title = albumTitle;
    }
    else if(typeof(albumTitle) === "object"){
      title = albumTitle[0];
    }
    else {
      res.sendStatus(501);
      return;
    }

    if (albumFile != '' || albumFile != []) {
      //create the directory
      const fullPath = albumDirCreate(albumFile);

      var fname;

      //Store the images if the created directory
      if (fileIsValidImage(files.albumFile)) {
        fname = fileRelocate(files.albumFile, headerPath);
      }

      let jason = readJSON(appJson);
      jason.albums.push({
        id: uniqueId(),
        title: albumTitle,
        path: fullPath,
        headerImage: fname,
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

//helper functions to check for files and directories
function fileExists(fname) {
  const appDataDir = path.normalize(path.join(__dirname, appDir));
  return fs.existsSync(path.resolve(appDataDir, fname));
}

function albumDirCreate(title) {
    const fullPath = path.normalize(path.join(appDir, 'pictures', title));

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
    return fullPath;
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
function writeJSON(fname, obj) {
    const dir = path.join(applicationDir, `/${libraryDir}`);
    fs.writeFileSync(path.resolve(dir, fname), JSON.stringify(obj));
}