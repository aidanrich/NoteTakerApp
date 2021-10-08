const express = require('express');
const PORT = process.env.PORT || 3001;
const util = require("util")
const fs = require('fs');
var uuidv1 = require('uuidv1')

const app = express();
const db = require('./db/db.json');
const path = require('path');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const readFromFile = util.promisify(fs.readFile);
// We need to make notes
// the notes should automatically populate the page

// The following HTML routes should be created:

// GET /notes should return the notes.html file.
app.get('/api/notes', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/api/notes', (req, res) => 
  fs.readFile("./db/db.json", function (err, data) {
    res.send(data);
  })
)


// GET * should return the index.html file.

// The following API routes should be created:

// GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {
  res.status(200).json(db);

});

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).

app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuidv1(),
    }

    // readfile
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err)
      }
      else {
        const someNotes = JSON.parse(data);
        someNotes.push(newNote);
        let writeFileAsync = util.promisify(fs.writeFile)
        writeFileAsync('db/db.json', JSON.stringify(someNotes), (err) => {
          err ? console.error(err) : console.log('Note added!')
          const response = {
            status: 'success',
            body: newNote,
          }
        })
      }
    })
    console.log(newNote);
    res.status(201).json(newNote);

  } else {
    res.status(500).json('Error in posting review');
  }
})

app.get('*', (req, res) => 
  res.sendFile(path.join(__dirname, '/public/index.html'))
);



app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
