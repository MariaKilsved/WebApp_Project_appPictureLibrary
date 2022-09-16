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

const libraryDir = "app-data";
const applicationDir = path.resolve('./');


//const app = express();

//To get past cors policy
//https://www.npmjs.com/package/cors
//https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
app.use(cors({
    origin: '*'
}));

app.listen(3000, () => {
    console.log('Server listening on http://localhost:3000 ...');
});


//Post request
app.post('/api/upload', (req, res) => {

    //Creates a formidable object of the incoming data
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {

        //Creates a directory with the name of the title that the user chose
        fs.mkdirSync(path.resolve(`app-data/library/pictures/${fields.album}`));

        //Files old path when uploaded with formidable
        let oldPath = files.image.filepath;

        //Puts the file in the new path
         let newPath = path.resolve('appdata/library/pictures/' + files.image.originalFilename);

        //This is what path.resolve fixes, you don't have to write the full dirname
        //let newPath = 'C:\\Users\\alexa\\OneDrive\\Dokument\\GitHub\\WebApp_Project_appPictureLibrary\\server\\app-data\\library\\pictures\\albumheaderimage\\' + files.image.originalFilename;

        fs.rename(oldPath, newPath, function (err) {
            if (err) throw err;
            res.write('File uploaded and moved!');
            res.end();

        });

        //Writes image info to albumCache.json to later unpack and use
        writeJSON('picture-library.json', {err, fields, files});
        res.json({ fields, files });
    });
});


//Converts file info to JSON
function writeJSON(fname, obj) {
    const dir = path.join(applicationDir, `/${libraryDir}`);
    fs.writeFileSync(path.resolve(dir, fname), JSON.stringify(obj));
}