//required node library
const path = require('path');
const fs = require('fs');

const express = require('express');
//const formidable = require('formidable');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

//Middleware in express.js to read json body
app.use(express.json());

const appDir = '../app-data/library';
const appJson = 'picture-library.json';

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


app.listen(port, () =>
  console.log(`Node server listening at http://localhost:${port}`)
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


//DETTA ÄR TILLLAGT NUUUUU
//Post request
app.post('/api/upload/album', (req, res) => {

  //Creates a formidable object of the incoming data
  let form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {

      // fs.mkdirSync(path.resolve(`app-data/library/pictures/${fields.title}`));

      let newName = files.myImage.originalFilename.trim().replace(' ', '-').replace(/(\s|-|_|~)+/g, '-').toLowerCase();
      let oldPath = files.myImage.filepath;
      let title = fields.title.trim().replace(' ', '-').replace(/(\s|-|_|~)+/g, '-').toLowerCase();
      const dir = `./app-data/library/pictures/${title}`;

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

      let libraryJson = JSON.parse(fs.readFileSync(path.resolve('./app-data', 'library/' + 'picture-library.json'), 'utf8'));

      // libraryJson = JSON.parse(path.resolve(albumHeaderDir, libraryJsonPath));
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

      //fs skriv fil syncront, skriver över jasonfil och lägger på ny jason fil som skapas 
      fs.writeFileSync(libraryJsonPath, JSON.stringify(libraryJson), function(err) {
          // Todo: remove album header picture and directory in case of an error
          res.sendStatus(501); //501 = fel meddelande 
          return;
      });
      res.sendStatus(200); // 200 = OK
  });
});



//Writes image info to albumCache.json to later unpack and use
// writeJSON('albumCache.json', {err, fields, files});
// res.json({ fields, files });

//Converts file info to JSON


function uniqueId() {
  const dateString = Date.now().toString(36);
  const randomness = Math.random().toString(36).substring(2);
  return dateString + randomness;
};
function writeJSON(fname, obj) {
  const dir = path.join(applicationDir, `/${libraryDir}`);
  fs.writeFileSync(path.resolve(dir, fname), JSON.stringify(obj));
}

function readJSON(fname) {
  const dir2 = path.join(applicationDir, `/${libraryDir}`);

  const obj = JSON.parse(fs.readFileSync(path.resolve(dir2, fname), 'utf8'));
  return obj;
}
