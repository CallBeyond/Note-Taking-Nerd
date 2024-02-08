// Importing required modules
const express = require('express');
const path = require('path');
const fs = require('fs');
const uniqid = require('uniqid');

// Setting up the Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to serve static files from the public directory
app.use(express.static('public'));

// Middleware to parse JSON data in the request body
app.use(express.json());

// Route to serve the 'notes.html' page when the '/notes' endpoint is accessed
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// Route to serve the db.json file
app.get('/api/notes', (req, res) => {

    // Read the db.json file
    fs.readFile('./db/db.json', (error, data) => {

        if (error) {

            // If there's an error reading the file, send a 500 Internal Server Error response
            res.status(500).send('Internal Server Error');
            return;
        }

        // Send the contents of db.json as the response
        res.send(data);
    });
});

// Route to add a new note to db.json
app.post('/api/notes', (req, res) => {

    // Read the db.json file
    fs.readFile('./db/db.json', (error, data) => {
        if (error) {

            // If there's an error reading the file, send a 500 Internal Server Error response
            res.status(500).send('Internal Server Error');
            return;
        }

        // Parse the contents of db.json to an array of notes
        const notes = JSON.parse(data);

        // Create a new note object with a unique ID generated using uniqid
        const newNote = {

            // Spread operator to merge properties from the request body
            ...req.body,

            // Generate a unique ID for the new note using uniqid
            id: uniqid() 
        };

        // Push the new note object to the array of notes
        notes.push(newNote);

        // Write the updated array of notes back to db.json
        fs.writeFile('./db/db.json', JSON.stringify(notes), (error) => {
            if (error) {

                // If there's an error writing the file, send a 500 Internal Server Error response
                res.status(500).send('Internal Server Error');
                return;
            }
            // Send the newly created note object as the response
            res.json(newNote);
        });
    });
});

// Route to delete a note from db.json by ID
app.delete('/api/notes/:id', (req, res) => {

    // Read the db.json file
    fs.readFile('./db/db.json', (error, data) => {

        if (error) {

            // If there's an error reading the file, send a 500 Internal Server Error response
            res.status(500).send('Internal Server Error');
            return;
        }

        // Parse the contents of db.json to an array of notes
        const notes = JSON.parse(data);

        // Filter out the note with the specified ID
        const filterNotes = notes.filter(note => note.id !== req.params.id);

        // Write the filtered array of notes back to db.json
        fs.writeFile('./db/db.json', JSON.stringify(filterNotes), (error) => {

            if (error) {
                // If there's an error writing the file, send a 500 Internal Server Error response
                res.status(500).send('Internal Server Error');
                return;
            }

            // Send a success message as the response
            res.send('Note deleted');
            
        });
    });
});

// Route to serve the index.html file for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log('Server started on port', PORT);
});
