const express = require('express');
const path = require('path');
const notes = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const app = express();

// app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static('public'))

//GET /notes routh
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
  console.log('servign notes ');
});

//GET /api/notes routs. returns all notes in json
app.get('/api/notes', (req, res) => {
  console.log("api/nots served");
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    res.json(JSON.parse(data))
  });  
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
  console.log("serving index");
})

// POST request to add a note
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`)

  //destructure the note in the body
  const { title, text } = req.body;
  //const newNote;
  //if all required properties are present
  if (title && text) {
    //variable for the note that we will save
    const newNote = {
      title, 
      text,
      id: uuidv4()
    };
    
    // convert data to a string so we can save it
    const noteString = JSON.stringify(newNote);

    //obtain existing notes
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        //convert string into JSON obj
        const existingNotes = JSON.parse(data);
        //add a new note
        existingNotes.push(newNote);
        //write updated notes back to the file
        fs.writeFile('./db/db.json', 
          JSON.stringify(existingNotes, null, 4),
          (writeErr) => 
            writeErr ? console.error(writeErr) : console.info('Successfully updated notes')
        );
      }
    });
    const response = {
      status: 'success',
      newNote
    };
    res.status(201).json(response);
    console.log(req.body);
  } else {
    res.status(500).json('Error in posting review');
  }
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
