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

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
  console.log('servign notes ');
});

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

/*current



*/

/* DONE 
GET /notes should return the notes.html file.
GET * should return the index.html file.
GET /api/notes should read the db.json file and return all saved notes as JSON.
POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).
*/

/*


/* todo

Bonus
You haven’t learned how to handle DELETE requests, but this application offers that functionality on the front end. As a bonus, try to add the DELETE route to the application using the following guideline:

DELETE /api/notes/:id should receive a query parameter that contains the id of a note to delete. To delete a note, you'll need to read all notes from the db.json file, remove the note with the given id property, and then rewrite the notes to the db.json file.
*/
/*
GIVEN a note-taking application
WHEN I open the Note Taker
THEN I am presented with a landing page with a link to a notes page
----already done if you start the server


WHEN I click on the link to the notes page
THEN I am presented with a page with existing notes listed in the left-hand column, plus empty fields to enter a new note title and the note’s text in the right-hand column
---should be done as well once server is done


WHEN I enter a new note title and the note’s text
THEN a Save icon appears in the navigation at the top of the page
---should already be done


WHEN I click on the Save icon
THEN the new note I have entered is saved and appears in the left-hand column with the other existing notes
---should already be done (maybe using Post?
  )
WHEN I click on an existing note in the list in the left-hand column
THEN that note appears in the right-hand column
--- already done

WHEN I click on the Write icon in the navigation at the top of the page
THEN I am presented with empty fields to enter a new note title and the note’s text in the right-hand column
----should already be done
*/